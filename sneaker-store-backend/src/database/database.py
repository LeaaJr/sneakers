#/src/database/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic_settings import BaseSettings, SettingsConfigDict

# Define settings using pydantic-settings to load from .env
class Settings(BaseSettings):

    DATABASE_URL: str = "postgresql://db_store_sneaker_user:UaY5RON8db44b3NMiEqHEP2P6Pg79WPV@dpg-d4risgali9vc73a3be0g-a.oregon-postgres.render.com/db_store_sneaker"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# --- ADDED FOR DEBUGGING ---
print(f"Attempting to connect to DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")
# --- END DEBUGGING ---

# Create the SQLAlchemy engine
# 'pool_pre_ping=True' helps with connection stability, especially in cloud environments
engine = create_engine(
 SQLALCHEMY_DATABASE_URL, pool_pre_ping=True
)

# Create a SessionLocal class to get a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()

# ----------------------------------------------------------------------
# FUNCIÓN CRÍTICA: Creación de tablas (FIX)
# ----------------------------------------------------------------------
def create_db_tables():
    """
    Crea las tablas de la base de datos si no existen. 
    Es seguro llamarla varias veces.
    """
    # Base.metadata contiene las definiciones de TODAS las clases de modelos
    # que heredan de Base (p. ej., Sneaker, TrendingProduct, etc.)
    Base.metadata.create_all(bind=engine)

def get_db():
    """
    Dependency to get a database session.
    Yields a session and ensures it's closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Import models here to ensure they are registered with Base before creating tables
from . import models
