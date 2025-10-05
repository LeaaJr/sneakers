# src/database/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic_settings import BaseSettings, SettingsConfigDict

# Define settings using pydantic-settings to load from .env
class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    DATABASE_URL: str = "postgresql://sneaker_store_db_dyx8_user:8GxLppRWbPk48OJsjXvaH8KUDcuKaguP@dpg-d3h9p2r3fgac739kjk50-a.oregon-postgres.render.com/sneaker_store_db_dyx8"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

# SQLAlchemy Database URL
# For PostgreSQL, it looks like: "postgresql://user:password@host:port/database"
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