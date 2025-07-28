# src/schemas/sneaker.py
# IMPORTANT: Import UUID4
from pydantic import BaseModel, Field, HttpUrl, UUID4 
from typing import List, Optional
from datetime import datetime

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
    """Base schema for Sneaker."""
    title: str
    description: Optional[str] = None
    price: float = Field(gt=0) 
    main_image_url: HttpUrl
    # CHANGED: brand_id type to UUID4
    brand_id: UUID4 

    # Optional fields
    sport: Optional[str] = None
    gender: Optional[str] = None
    release_date: Optional[datetime] = None
    is_new: bool = False

class SneakerCreate(SneakerBase):
    """Schema for creating a Sneaker."""
    sizes: List[SizeCreate] = []
    images: List[SneakerImageCreate] = []

class SneakerUpdate(SneakerBase):
    """Schema for updating a Sneaker."""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    main_image_url: Optional[HttpUrl] = None
    # CHANGED: brand_id type to Optional[UUID4]
    brand_id: Optional[UUID4] = None 
    sport: Optional[str] = None
    gender: Optional[str] = None
    release_date: Optional[datetime] = None
    is_new: Optional[bool] = None

class Sneaker(SneakerBase):
    """Schema for returning a Sneaker, including relationships."""
    # CHANGED: id type to UUID4
    id: UUID4
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Relationships
    brand: Brand 
    sizes: List[Size] = [] 
    images: List[SneakerImage] = [] 

    class Config:
        from_attributes = True