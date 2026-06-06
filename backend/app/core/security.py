"""
security.py — Supabase JWT verification.

Supabase issues JWTs signed with HS256 using the project's JWT secret.
We verify them locally (no network call) using PyJWT.
"""
import jwt
from fastapi import HTTPException, status
from .config import settings

CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def decode_supabase_token(token: str) -> dict:
    """Verify and decode a Supabase-issued JWT. Returns the full payload."""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.PyJWTError:
        raise CREDENTIALS_EXCEPTION
