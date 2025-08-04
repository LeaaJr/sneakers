# src/database/models.py
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func # Keep this import for func
from sqlalchemy.dialects.postgresql import UUID
from src.database.database import Base 
import uuid 


Base = declarative_base()

class Brand(Base):
    """
    SQLAlchemy model for sneaker brands.
    """
    __tablename__ = "brands"

    # CHANGE THIS LINE: from func.uuid_generate_v4() to func.gen_random_uuid()
    id = Column(UUID(as_uuid=True), primary_key=True, default=func.gen_random_uuid())
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

    id = Column(UUID(as_uuid=True), primary_key=True, default=func.gen_random_uuid())
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    main_image_url = Column(String, nullable=False)
    brand_id = Column(UUID(as_uuid=True), ForeignKey("brands.id"), nullable=False) 
    
    sport = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    release_date = Column(DateTime, nullable=True)
    is_new = Column(Boolean, default=False)
    
    brand = relationship("Brand", back_populates="sneakers")
    sizes = relationship("Size", back_populates="sneaker", cascade="all, delete-orphan")
    images = relationship("SneakerImage", back_populates="sneaker", cascade="all, delete-orphan")
    featured_details = relationship("SneakerFeaturedDetail", back_populates="sneaker", cascade="all, delete-orphan")

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False)

    brand = relationship("Brand", back_populates="sneakers")
    # CORRECTED TYPO HERE: back_popates changed to back_populates
    sizes = relationship("Size", back_populates="sneaker", cascade="all, delete-orphan") 
    images = relationship("SneakerImage", back_populates="sneaker", cascade="all, delete-orphan")
    running_details = relationship("RunningSectionDetail", back_populates="sneaker", cascade="all, delete-orphan")
    category = relationship("Category", back_populates="sneakers")

    
    

    def __repr__(self):
        return f"<Sneaker(title='{self.title}', brand='{self.brand.name if self.brand else 'N/A'}')>"

class Size(Base):
    """
    SQLAlchemy model for sneaker sizes and available quantity.
    """
    __tablename__ = "sizes"

    # CHANGE THIS LINE
    id = Column(UUID(as_uuid=True), primary_key=True, default=func.gen_random_uuid())
    sneaker_id = Column(UUID(as_uuid=True), ForeignKey("sneakers.id"), nullable=False)
    us_size = Column(Float, nullable=False)
    eu_size = Column(Float, nullable=True)
    uk_size = Column(Float, nullable=True)
    quantity = Column(Integer, default=0, nullable=False)

    sneaker = relationship("Sneaker", back_populates="sizes")

    def __repr__(self):
        return f"<Size(sneaker_id='{self.sneaker_id}', us_size={self.us_size}, quantity={self.quantity})>"

class SneakerImage(Base):
    """
    SQLAlchemy model for additional sneaker images.
    """
    __tablename__ = "sneaker_images"

    # CHANGE THIS LINE
    id = Column(UUID(as_uuid=True), primary_key=True, default=func.gen_random_uuid())
    sneaker_id = Column(UUID(as_uuid=True), ForeignKey("sneakers.id"), nullable=False)
    image_url = Column(String, nullable=False)
    order = Column(Integer, default=0)

    sneaker = relationship("Sneaker", back_populates="images")

    def __repr__(self):
        return f"<SneakerImage(sneaker_id='{self.sneaker_id}', url='{self.image_url}')>"


#Nueva seccion de endopint Running

class SneakerFeaturedDetail(Base):
    """
    SQLAlchemy model for featured details of a sneaker.
    """
    __tablename__ = "sneaker_featured_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=func.gen_random_uuid())
    sneaker_id = Column(UUID(as_uuid=True), ForeignKey("sneakers.id"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sneaker = relationship("Sneaker", back_populates="featured_details")

    def __repr__(self):
        return f"<SneakerFeaturedDetail(title='{self.title}')>"

# --- NUEVO MODELO PARA LOS DETALLES DE LA SECCIÓN DE RUNNING ---
class RunningSectionDetail(Base):
    __tablename__ = "running_section_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sneaker_id = Column(UUID(as_uuid=True), ForeignKey("sneakers.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(String)
    image_url = Column(String)
    display_order = Column(Integer, default=0)

    # Relación a la zapatilla, con el back_populates
    sneaker = relationship("Sneaker", back_populates="running_details")

    # Clase de categorias
class Category(Base):
    """
    SQLAlchemy model for product categories.
    """
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=func.gen_random_uuid())
    name = Column(String, unique=True, index=True, nullable=False)  # "Jordan"
    slug = Column(String, unique=True, index=True, nullable=False)  # "jordan"
    cover_image = Column(String, nullable=False)  # URL de imagen representativa
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    sneakers = relationship("Sneaker", back_populates="category")

    def __repr__(self):
        return f"<Category(name='{self.name}')>"