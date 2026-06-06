from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from uuid import UUID
from app.models.db.models import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    fayda_id: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole = UserRole.PATIENT

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v and not v.startswith("+"):
            raise ValueError("Phone must include country code e.g. +251")
        return v


class LoginRequest(BaseModel):
    identifier: str   # email or fayda_id or phone
    password: str


class ProfileRead(BaseModel):
    id: UUID
    fayda_id: Optional[str]
    phone: Optional[str]
    full_name: str
    role: UserRole
    is_active: bool

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    profile: ProfileRead
