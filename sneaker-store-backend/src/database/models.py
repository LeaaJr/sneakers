# src/database/models.py
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class Brand(Base):
    """
    SQLAlchemy model for sneaker brands.
    """
    __tablename__ = "brands"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True, nullable=False)
    logo_url = Column(String, nullable=True)

    sneakers = relationship("Sneaker", back_populates="brand")

    def __repr__(self):
        return f"<Brand(name='{self.name}')>"

class Sneaker(Base):
    """
    SQLAlchemy model for sneakers.
    """
    __tablename__ = "sneakers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    # Main image URL for the sneaker
    main_image_url = Column(String, nullable=False)
    brand_id = Column(String, ForeignKey("brands.id"), nullable=False)
    
    # Optional fields
    sport = Column(String, nullable=True) # e.g., "Basketball", "Running"
    gender = Column(String, nullable=True) # e.g., "Men's", "Women's", "Unisex"
    release_date = Column(DateTime, nullable=True)
    is_new = Column(Boolean, default=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    brand = relationship("Brand", back_populates="sneakers")
    sizes = relationship("Size", back_populates="sneaker", cascade="all, delete-orphan")
    images = relationship("SneakerImage", back_populates="sneaker", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Sneaker(title='{self.title}', brand='{self.brand.name if self.brand else 'N/A'}')>"

class Size(Base):
    """
    SQLAlchemy model for sneaker sizes and available quantity.
    """
    __tablename__ = "sizes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sneaker_id = Column(String, ForeignKey("sneakers.id"), nullable=False)
    us_size = Column(Float, nullable=False) # e.g., 8.5, 10.0
    eu_size = Column(Float, nullable=True) # e.g., 42, 44
    uk_size = Column(Float, nullable=True) # e.g., 7.5, 9.5
    quantity = Column(Integer, default=0, nullable=False)

    sneaker = relationship("Sneaker", back_populates="sizes")

    def __repr__(self):
        return f"<Size(sneaker_id='{self.sneaker_id}', us_size={self.us_size}, quantity={self.quantity})>"

class SneakerImage(Base):
    """
    SQLAlchemy model for additional sneaker images.
    """
    __tablename__ = "sneaker_images"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sneaker_id = Column(String, ForeignKey("sneakers.id"), nullable=False)
    image_url = Column(String, nullable=False)
    # Optional: order for displaying images
    order = Column(Integer, default=0)

    sneaker = relationship("Sneaker", back_populates="images")

    def __repr__(self):
        return f"<SneakerImage(sneaker_id='{self.sneaker_id}', url='{self.image_url}')>"
