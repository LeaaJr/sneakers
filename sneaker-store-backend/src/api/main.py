    # src/api/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload 
from typing import List, Optional
from uuid import UUID
import os

from src.database import models
from src.schemas import sneaker as schemas
from src.database.database import engine, get_db

from src.schemas.sneaker import SneakerFeaturedDetailCreate

from src.routers import categories
from src.schemas import Category, CategoryCreate

    
""" models.Base.metadata.create_all(bind=engine) """

app = FastAPI(
        title="Sneaker Store API",
        description="API for managing sneakers, brands, sizes, and user interactions.",
        version="0.1.0",
    )

origins = [
     "http://localhost:5173",
        "http://localhost:3000",
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(categories.router)

@app.get("/")
def read_root():
        return {"message": "Welcome to the Sneaker Store API! Visit /docs for OpenAPI documentation."}

@app.get("/api/test-db")
def test_db_connection(db: Session = Depends(get_db)):
        try:
            first_brand = db.query(models.Brand).first()
            return {"message": "Database connected successfully!"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

    # Endpoint para OBTENER TODAS las zapatillas
@app.get("/api/sneakers/", response_model=List[schemas.Sneaker])
def read_all_sneakers(
        sport: Optional[str] = None, 
        gender: Optional[str] = None, 
        is_new: Optional[bool] = None,
        skip: int = 0, 
        limit: int = 100, 
        db: Session = Depends(get_db)
    ):
        query = db.query(models.Sneaker).options(
            joinedload(models.Sneaker.brand),
            joinedload(models.Sneaker.sizes),
            joinedload(models.Sneaker.images)
        )

        if sport:
            query = query.filter(models.Sneaker.sport == sport)
        if gender:
            query = query.filter(models.Sneaker.gender == gender)
        if is_new is not None:
            query = query.filter(models.Sneaker.is_new == is_new)

        sneakers = query.offset(skip).limit(limit).all()
        return sneakers

    # Endpoint para CREAR una zapatilla
@app.post("/api/sneakers/", response_model=schemas.Sneaker, status_code=status.HTTP_201_CREATED)
def create_sneaker(sneaker: schemas.SneakerCreate, db: Session = Depends(get_db)):
        # Verificar que la categoría exista
        if not db.query(models.Category).filter(models.Category.id == sneaker.category_id).first():
            raise HTTPException(status_code=400, detail="Invalid category ID")

        sneaker_data = sneaker.model_dump()
        sneaker_data["main_image_url"] = str(sneaker_data["main_image_url"])

        sizes_data = sneaker_data.pop("sizes", [])
        images_data = sneaker_data.pop("images", [])
        featured_details_data = sneaker_data.pop("featured_details", [])

        db_sneaker = models.Sneaker(**sneaker_data)
        db.add(db_sneaker)
        db.flush() # Guarda el objeto para obtener el id

        for size_item in sizes_data:
            db.add(models.Size(**size_item, sneaker_id=db_sneaker.id))

        for image_item in images_data:
            if "image_url" in image_item:
                image_item["image_url"] = str(image_item["image_url"])
            db.add(models.SneakerImage(**image_item, sneaker_id=db_sneaker.id))

        for detail_item in featured_details_data:
            if "image_url" in detail_item:
                detail_item["image_url"] = str(detail_item["image_url"])
            db.add(models.SneakerFeaturedDetail(**detail_item, sneaker_id=db_sneaker.id))

        db.commit()
        db.refresh(db_sneaker)
        
        return db_sneaker

    # Endpoint para OBTENER solo los detalles destacados de una zapatilla
@app.get("/api/sneakers/{sneaker_id}", response_model=schemas.Sneaker)
def read_sneaker(sneaker_id: UUID, db: Session = Depends(get_db)):
    db_sneaker = db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand),
        joinedload(models.Sneaker.sizes),
        joinedload(models.Sneaker.images),
        joinedload(models.Sneaker.featured_details) # Aquí ya estaba bien, pero revisa por si acaso
    ).filter(models.Sneaker.id == sneaker_id).first()

    if db_sneaker is None:
            raise HTTPException(status_code=404, detail="Sneaker not found")
        
    return db_sneaker

    # Endpoint para ACTUALIZAR una zapatilla
@app.put("/api/sneakers/{sneaker_id}", response_model=schemas.Sneaker)
def update_sneaker(sneaker_id: UUID, sneaker_update: schemas.SneakerCreate, db: Session = Depends(get_db)):
        db_sneaker = db.query(models.Sneaker).filter(models.Sneaker.id == sneaker_id).first()

        if not db_sneaker:
            raise HTTPException(status_code=404, detail="Sneaker not found")

        update_data = sneaker_update.model_dump()
        
        # Manejar conversiones de HttpUrl a string
        if "main_image_url" in update_data:
            update_data["main_image_url"] = str(update_data["main_image_url"])

        # Eliminar relaciones anteriores
        db.query(models.Size).filter(models.Size.sneaker_id == sneaker_id).delete()
        db.query(models.SneakerImage).filter(models.SneakerImage.sneaker_id == sneaker_id).delete()
        db.query(models.SneakerFeaturedDetail).filter(models.SneakerFeaturedDetail.sneaker_id == sneaker_id).delete()

        sizes_data = update_data.pop("sizes", [])
        images_data = update_data.pop("images", [])
        featured_details_data = update_data.pop("featured_details", [])

        for key, value in update_data.items():
            setattr(db_sneaker, key, value)

        # Agregar relaciones nuevas
        for size_item in sizes_data:
            db.add(models.Size(**size_item, sneaker_id=sneaker_id))
        for image_item in images_data:
            if "image_url" in image_item:
                image_item["image_url"] = str(image_item["image_url"])
            db.add(models.SneakerImage(**image_item, sneaker_id=sneaker_id))
        for detail_item in featured_details_data:
            if "image_url" in detail_item:
                detail_item["image_url"] = str(detail_item["image_url"])
            db.add(models.SneakerFeaturedDetail(**detail_item, sneaker_id=sneaker_id))

        db.commit()
        db.refresh(db_sneaker)
        return db_sneaker

    # Endpoint para ELIMINAR una zapatilla
@app.delete("/api/sneakers/{sneaker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sneaker(sneaker_id: UUID, db: Session = Depends(get_db)):
        sneaker = db.query(models.Sneaker).filter(models.Sneaker.id == sneaker_id).first()
        
        if not sneaker:
            raise HTTPException(status_code=404, detail="Sneaker not found")

        db.delete(sneaker)
        db.commit()
        return

    # Endpoints de marcas
@app.post("/api/brands/", response_model=schemas.Brand, status_code=status.HTTP_201_CREATED)
def create_brand(brand: schemas.BrandCreate, db: Session = Depends(get_db)):
        db_brand = db.query(models.Brand).filter(models.Brand.name == brand.name).first()
        if db_brand:
            raise HTTPException(status_code=400, detail="Brand with this name already exists")

        brand_data = brand.model_dump()
        if brand_data.get("logo_url"):
            brand_data["logo_url"] = str(brand_data["logo_url"])

        db_brand = models.Brand(**brand_data)
        db.add(db_brand)
        db.commit()
        db.refresh(db_brand)
        return db_brand

@app.get("/api/brands/", response_model=List[schemas.Brand])
def read_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        brands = db.query(models.Brand).offset(skip).limit(limit).all()
        return brands

    # --- NUEVOS ENDPOINTS PARA LA SECCIÓN DE RUNNING ---

@app.post("/api/running_section/featured_details/", status_code=status.HTTP_201_CREATED)
def create_running_section_details(details: List[schemas.SneakerFeaturedDetailCreate], db: Session = Depends(get_db)):
    """
    Crea los detalles destacados para la sección de running.
    Esto reemplaza cualquier detalle existente.
    """
    db.query(models.SneakerFeaturedDetail).delete()
    db.commit()
    
    for detail_item in details:
        # Convertir HttpUrl a string antes de pasar los datos
        detail_data = detail_item.model_dump()
        if "image_url" in detail_data and detail_data["image_url"] is not None:
            detail_data["image_url"] = str(detail_data["image_url"])
            
        db.add(models.SneakerFeaturedDetail(**detail_data))
    
    db.commit()
    return {"message": "Detalles destacados de running creados exitosamente."}


@app.get("/api/running_section/featured_details/", response_model=List[schemas.SneakerFeaturedDetail])
def get_running_section_details(db: Session = Depends(get_db)):
    """
    Obtiene los detalles destacados para la sección de running.
    """
    # El `response_model` debe ser `List[schemas.SneakerFeaturedDetail]`
    return db.query(models.SneakerFeaturedDetail).order_by(models.SneakerFeaturedDetail.display_order).all()

# FUNCION TEMPORAL

#def recreate_tables():
    #"""
    #Function to drop all tables and then recreate them.
    #USE WITH CAUTION: This will delete all data.
    #"""
    #print("Dropping all existing tables...")
    #models.Base.metadata.drop_all(bind=engine)
    #print("Tables dropped successfully.")
    
    #print("Creating all new tables...")
    #models.Base.metadata.create_all(bind=engine)
    #print("Tables created successfully.")


#recreate_tables()