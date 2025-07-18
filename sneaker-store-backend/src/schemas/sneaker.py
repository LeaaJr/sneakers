# src/schemas/sneaker.py
from pydantic import BaseModel, Field, HttpUrl
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
    id: str
    class Config:
        from_attributes = True # OrmMode is deprecated, use from_attributes

class SizeBase(BaseModel):
    """Base schema for Size."""
    us_size: float
    eu_size: Optional[float] = None
    uk_size: Optional[float] = None
    quantity: int = Field(default=0, ge=0) # Quantity must be non-negative

class SizeCreate(SizeBase):
    """Schema for creating a Size."""
    pass

class Size(SizeBase):
    """Schema for returning a Size."""
    id: str
    sneaker_id: str
    class Config:
        from_attributes = True

class SneakerImageBase(BaseModel):
    """Base schema for SneakerImage."""
    image_url: HttpUrl # Use HttpUrl for URL validation
    order: int = Field(default=0, ge=0)

class SneakerImageCreate(SneakerImageBase):
    """Schema for creating a SneakerImage."""
    pass

class SneakerImage(SneakerImageBase):
    """Schema for returning a SneakerImage."""
    id: str
    sneaker_id: str
    class Config:
        from_attributes = True

# Main Sneaker schemas
class SneakerBase(BaseModel):
    """Base schema for Sneaker."""
    title: str
    description: Optional[str] = None
    price: float = Field(gt=0) # Price must be positive
    main_image_url: HttpUrl
    brand_id: str # Will be UUID string

    # Optional fields
    sport: Optional[str] = None
    gender: Optional[str] = None
    release_date: Optional[datetime] = None
    is_new: bool = False

class SneakerCreate(SneakerBase):
    """Schema for creating a Sneaker."""
    # When creating, can also include nested sizes and images
    sizes: List[SizeCreate] = []
    images: List[SneakerImageCreate] = []

class SneakerUpdate(SneakerBase):
    """Schema for updating a Sneaker."""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    main_image_url: Optional[HttpUrl] = None
    brand_id: Optional[str] = None
    sport: Optional[str] = None
    gender: Optional[str] = None
    release_date: Optional[datetime] = None
    is_new: Optional[bool] = None
    # For updates, sizes and images might be handled via separate endpoints
    # or require more complex logic for partial updates.
    # For simplicity here, we won't allow direct nested updates for sizes/images via this schema.

class Sneaker(SneakerBase):
    """Schema for returning a Sneaker, including relationships."""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Relationships
    brand: Brand # Nested Brand schema
    sizes: List[Size] = [] # List of nested Size schemas
    images: List[SneakerImage] = [] # List of nested SneakerImage schemas

    class Config:
        from_attributes = True
