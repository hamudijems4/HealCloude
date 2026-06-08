from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.core.security import decode_supabase_token
from app.core.database import get_db
from app.models.db.models import Profile, UserRole

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Profile:
    payload = decode_supabase_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    result = await db.execute(select(Profile).where(Profile.id == UUID(user_id)))
    profile = result.scalar_one_or_none()
    if not profile or not profile.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not found or inactive")
    return profile


def require_roles(*roles: UserRole):
    async def _check(current_user: Profile = Depends(get_current_user)) -> Profile:
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return _check


require_moh = require_roles(UserRole.MOH_ANALYST, UserRole.SUPER_ADMIN)
require_clinician = require_roles(UserRole.CLINICIAN, UserRole.FACILITY_ADMIN, UserRole.SUPER_ADMIN)
require_ngo = require_roles(UserRole.NGO_ANALYST, UserRole.MOH_ANALYST, UserRole.SUPER_ADMIN)
require_admin = require_roles(UserRole.SUPER_ADMIN)
