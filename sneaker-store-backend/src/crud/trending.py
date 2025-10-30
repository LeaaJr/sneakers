from sqlalchemy.orm import Session
from src.database import models

# 🧩 FUNCIONES CRUD
def get_trending_products(db: Session):
    """Obtener todos los productos en tendencia"""
    return db.query(models.TrendingProduct).all()


def get_trending_product_by_id(db: Session, trending_id: int):
    """Obtener un producto en tendencia por su ID"""
    return db.query(models.TrendingProduct).filter(models.TrendingProduct.id == trending_id).first()


def create_trending_product(db: Session, data: dict):
    """Crear un nuevo producto en tendencia"""
    new_trending = models.TrendingProduct(
        image=data.get("image"),
        label=data.get("label"),
        title=data.get("title"),
        subtitle=data.get("subtitle")
    )
    db.add(new_trending)
    db.commit()
    db.refresh(new_trending)
    return new_trending


def delete_trending_product(db: Session, trending_id: int):
    """Eliminar un producto de tendencia"""
    trending = get_trending_product_by_id(db, trending_id)
    if trending:
        db.delete(trending)
        db.commit()
        return True
    return False
