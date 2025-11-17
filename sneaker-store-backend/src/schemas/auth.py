# src/schemas/auth.py
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

# --- Esquemas de Usuario (Respuesta) ---
class UserBase(BaseModel):
    email: EmailStr
    name: str
    is_admin: bool = False

class User(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Esquemas de Entrada (Request) ---
class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- Esquemas de Respuesta de Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User # Incluye los detalles del usuario