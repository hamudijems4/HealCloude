from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.core.database import get_db, supabase_anon, supabase_admin
from app.models.db.models import Profile, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, ProfileRead
from app.api.v1.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # 1. Create user in Supabase Auth
    res = supabase_anon.auth.sign_up({
        "email": payload.email,
        "password": payload.password,
        "options": {"data": {"full_name": payload.full_name}},
    })
    if not res.user:
        raise HTTPException(status_code=400, detail="Registration failed — email may already exist")

    user_id = UUID(res.user.id)

    # 2. Create matching profile row in Postgres
    profile = Profile(
        id=user_id,
        fayda_id=payload.fayda_id,
        phone=payload.phone,
        full_name=payload.full_name,
        role=payload.role,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)

    return TokenResponse(
        access_token=res.session.access_token,
        refresh_token=res.session.refresh_token,
        profile=ProfileRead.model_validate(profile),
    )


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Resolve identifier to email for Supabase (which only natively supports email login)
    email = payload.identifier
    if not "@" in payload.identifier:
        # Look up email by fayda_id or phone in our profiles table
        if payload.identifier.startswith("ET"):
            result = await db.execute(select(Profile).where(Profile.fayda_id == payload.identifier))
        else:
            result = await db.execute(select(Profile).where(Profile.phone == payload.identifier))
        profile = result.scalar_one_or_none()
        if not profile:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        # Fetch email from Supabase auth.users via admin client
        sb_user = supabase_admin.auth.admin.get_user_by_id(str(profile.id))
        if not sb_user.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Auth user not found")
        email = sb_user.user.email

    # Authenticate with Supabase
    res = supabase_anon.auth.sign_in_with_password({"email": email, "password": payload.password})
    if not res.user or not res.session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Load profile
    result = await db.execute(select(Profile).where(Profile.id == UUID(res.user.id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found — contact support")

    return TokenResponse(
        access_token=res.session.access_token,
        refresh_token=res.session.refresh_token,
        profile=ProfileRead.model_validate(profile),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str, db: AsyncSession = Depends(get_db)):
    res = supabase_anon.auth.refresh_session(refresh_token)
    if not res.session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    result = await db.execute(select(Profile).where(Profile.id == UUID(res.user.id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return TokenResponse(
        access_token=res.session.access_token,
        refresh_token=res.session.refresh_token,
        profile=ProfileRead.model_validate(profile),
    )


@router.get("/me", response_model=ProfileRead)
async def me(current_user: Profile = Depends(get_current_user)):
    return current_user
