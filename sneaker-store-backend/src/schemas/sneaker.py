# src/schemas/sneaker.py
# IMPORTANT: Import UUID4
from pydantic import BaseModel, Field, HttpUrl, UUID4 
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from .category import Category


# Esta es para sectionRunning
class SneakerFeaturedDetailCreate(BaseModel):
    sneaker_id: UUID
    title: str
    description: Optional[str] = None
    image_url: HttpUrl
    display_order: int = Field(default=0, ge=0)

# Base schemas for related entities
class BrandBase(BaseModel):
    """Base schema for Brand."""
    name: str
    logo_url: Optional[HttpUrl] = None

class BrandCreate(BrandBase):
    """Schema for creating a Brand."""
    pass

class Brand(BrandBase):
    """Schema for returning a Brand."""
    # CHANGED: id type to UUID4
    id: UUID4 
    class Config:
        from_attributes = True 

class SizeBase(BaseModel):
    """Base schema for Size."""
    us_size: float
    eu_size: Optional[float] = None
    uk_size: Optional[float] = None
    quantity: int = Field(default=0, ge=0) 

class SizeCreate(SizeBase):
    """Schema for creating a Size."""
    pass

class Size(SizeBase):
    """Schema for returning a Size."""
    # CHANGED: id type to UUID4, sneaker_id type to UUID4
    id: UUID4
    sneaker_id: UUID4
    class Config:
        from_attributes = True

class SneakerImageBase(BaseModel):
    """Base schema for SneakerImage."""
    image_url: HttpUrl 
    order: int = Field(default=0, ge=0)

class SneakerImageCreate(SneakerImageBase):
    """Schema for creating a SneakerImage."""
    pass

class SneakerImage(SneakerImageBase):
    """Schema for returning a SneakerImage."""
    # CHANGED: id type to UUID4, sneaker_id type to UUID4
    id: UUID4
    sneaker_id: UUID4
    class Config:
        from_attributes = True

# Main Sneaker schemas
class SneakerBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    main_image_url: HttpUrl
    brand_id: UUID
    category_id: UUID  # Nuevo campo para reemplazar sport
    sport: Optional[str] = None  # Lo mantenemos como opcional por compatibilidad
    gender: Optional[str] = None
    release_date: Optional[datetime] = None
    is_new: bool = True

class SneakerCreate(SneakerBase):
    """Schema for creating a Sneaker, including nested relations."""
    sizes: List[SizeCreate] = []
    images: List[SneakerImageCreate] = []
    featured_details: List[SneakerFeaturedDetailCreate] = []

class SneakerUpdate(BaseModel):
    """Schema for updating a Sneaker."""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    main_image_url: Optional[HttpUrl] = None
    brand_id: Optional[UUID] = None 
    category_id: Optional[UUID] = None  # Nuevo campo opcional
    sport: Optional[str] = None
    gender: Optional[str] = None
    release_date: Optional[datetime] = None
    is_new: Optional[bool] = None

    #agregamos el squema de running para la nueva seccion

class SneakerFeaturedDetailBase(BaseModel):
    """Base schema for a SneakerFeaturedDetail."""
    title: str
    description: Optional[str] = None
    image_url: HttpUrl
    display_order: int = Field(default=0, ge=0)
    
class SneakerFeaturedDetail(SneakerFeaturedDetailBase):
    """Schema for returning a SneakerFeaturedDetail."""
    id: UUID4
    sneaker_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class Sneaker(SneakerBase):
    id: UUID
    brand_id: UUID
    category: Category
    sizes: List[Size] = []
    images: List[SneakerImage] = []
    featured_details: List[SneakerFeaturedDetail] = []

    class Config:
        from_attributes = True

Sneaker.model_rebuild()

# Schema base para Trending Product
class TrendingProductBase(BaseModel):
    image: str
    label: str
    title: str
    subtitle: str

# Schema para la creación (POST)
class TrendingProductCreate(TrendingProductBase):
    pass

# Schema para la respuesta (GET)
class TrendingProduct(TrendingProductBase):
    id: int # El ID generado por la base de datos
    
    class Config:
        from_attributes = True

class TrendingProductSchema(BaseModel):
    id: int
    image: str
    label: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None

    class Config:
        from_attributes = True



