from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    # Optional local profile data
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    # External identity (UUID string from Java Auth)
    external_user_id: str


class UserCreate(UserBase):
    # No password stored here; authentication handled by Java backend
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True