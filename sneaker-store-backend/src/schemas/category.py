# src/schemas/category.py
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class CategoryBase(BaseModel):
    name: str
    slug: str = Field(..., pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    cover_image: str
    description: Optional[str] = None
class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = Field(None, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    cover_image: Optional[str] = None
    description: Optional[str] = None

class Category(CategoryBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True