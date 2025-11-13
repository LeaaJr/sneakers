# src/auth/auth.py
import os
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError

# Importa tus modelos, esquemas y la dependencia de DB
from ..database.database import get_db
from ..database import models
from ..schemas.auth import User, UserCreate, UserLogin, Token



# --- CONFIGURACIÓN DE SEGURIDAD ---
# Usa una clave secreta segura del sistema operativo
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'tu_clave_secreta_de_32_caracteres_o_mas')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 horas

# Contexto para hashing de contraseñas (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Router de FastAPI para Auth
auth_router = APIRouter(prefix="/api/auth", tags=["Auth"])

# Funciones de seguridad
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ----------------------------------------------------
# 1. ENDPOINT: REGISTRO (SIGN UP)
# ----------------------------------------------------
@auth_router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Buscar si el email ya existe
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya está registrado."
        )

    # Hashear la contraseña
    hashed_password = get_password_hash(user_in.password)

    # Crear la instancia del modelo de usuario
    db_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password
    )

    # Guardar en la base de datos
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

# ----------------------------------------------------
# 2. ENDPOINT: INICIO DE SESIÓN (SIGN IN)
# ----------------------------------------------------
@auth_router.post("/login", response_model=Token)
def login_for_access_token(user_in: UserLogin, db: Session = Depends(get_db)):
    # 1. Buscar el usuario por email
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()

    if not db_user or not verify_password(user_in.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Generar el token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email}, # 'sub' es la convención para el sujeto (ID)
        expires_delta=access_token_expires
    )
    
    # 3. Devolver el token y los datos del usuario
    return schemas.Token(
        access_token=access_token, 
        token_type="bearer",
        user=db_user # Pydantic mapeará automáticamente los campos del modelo
    )