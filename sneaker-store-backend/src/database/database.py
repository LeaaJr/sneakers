import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str 
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding='utf-8',
        extra="ignore"
    )

try:
    settings = Settings()
    # Aseguramos que la URL sea compatible con SQLAlchemy 2.0+ 
    # (Cambia postgres:// por postgresql:// si Render te da la vieja)
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = db_url
except Exception as e:
    print(f"Error cargando la configuración: {e}")
    raise

# OPTIMIZACIÓN DEL MOTOR (ENGINE)
# Estos parámetros evitan que la conexión se cierre y deba renegociar con Oregon
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True,   # Verifica si la conexión sigue viva antes de usarla
    pool_size=10,         # Mantiene 10 conexiones abiertas permanentemente
    max_overflow=20,      # Permite hasta 20 conexiones extra si hay mucho tráfico
    pool_recycle=300,     # Refresca las conexiones cada 5 minutos
    pool_timeout=30       # Espera máximo 30 segundos para obtener una conexión del pool
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def create_db_tables():
    from . import models 
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()