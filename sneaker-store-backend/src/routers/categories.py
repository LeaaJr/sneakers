# src/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID

from src.database.database import get_db
from src.schemas.category import Category, CategoryCreate, CategoryUpdate
from src.database import models
from src.schemas import sneaker as schemas

# Create a FastAPI router with a prefix and tags
router = APIRouter(prefix="/api/categories", tags=["Categories"])

# --- Endpoint para crear una categoría ---
@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Crea una nueva categoría en la base de datos."""
    db_category = db.query(models.Category).filter(
        (models.Category.name == category.name) | 
        (models.Category.slug == category.slug)
    ).first()
    
    if db_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name or slug already exists"
        )

    # Use model_dump to convert Pydantic model to a dictionary
    category_data = category.model_dump()
    db_category = models.Category(**category_data)
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- Endpoint para obtener todas las categorías ---
@router.get("/", response_model=List[Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtiene una lista de todas las categorías."""
    return db.query(models.Category).offset(skip).limit(limit).all()

# --- Endpoint para obtener una categoría por su ID ---
@router.get("/{category_id}", response_model=Category)
def read_category(category_id: UUID, db: Session = Depends(get_db)):
    """Obtiene una categoría específica por su ID."""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return db_category

# --- Endpoint para actualizar una categoría ---
@router.put("/{category_id}", response_model=Category)
def update_category(
    category_id: UUID, 
    category_update: CategoryUpdate, 
    db: Session = Depends(get_db)
):
    """Actualiza los detalles de una categoría existente."""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    update_data = category_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)
    return db_category

# --- Endpoint para eliminar una categoría ---
@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: UUID, db: Session = Depends(get_db)):
    """Elimina una categoría de la base de datos."""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    # Verificar si hay productos asociados
    sneakers_count = db.query(models.Sneaker).filter(
        models.Sneaker.category_id == category_id
    ).count()
    
    if sneakers_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with associated sneakers"
        )

    db.delete(db_category)
    db.commit()
    return

# --- Endpoint para obtener zapatillas por categoría ---
@router.get("/{category_id}/sneakers", response_model=List[schemas.Sneaker])
def get_sneakers_by_category(
    category_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Obtiene todas las zapatillas de una categoría específica."""
    sneakers = db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand),
        joinedload(models.Sneaker.sizes),
        joinedload(models.Sneaker.images)
    ).filter(
        models.Sneaker.category_id == category_id
    ).offset(skip).limit(limit).all()
    
    if not sneakers:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No sneakers found for this category"
        )

    return sneakers