# src/api/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload # Importar joinedload para cargar relaciones
from typing import List, Optional
import os

from src.database import models
from src.schemas import sneaker as schemas
from src.database.database import engine, get_db

models.Base.metadata.create_all(bind=engine)

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

@app.on_event("startup")
async def startup_event():
    print(f"DEBUG: Render's PORT env var: {os.environ.get('PORT')}")
    print(f"DEBUG: Render's HOST env var: {os.environ.get('HOST')}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sneaker Store API! Visit /docs for OpenAPI documentation."}

@app.get("/api/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        first_brand = db.query(models.Brand).first()
        if not first_brand:
            new_brand = models.Brand(name="Test Brand", logo_url="http://example.com/logo.png")
            db.add(new_brand)
            db.commit()
            db.refresh(new_brand)
            return {"message": "Database connected and a test brand was created!", "brand_id": new_brand.id}
        return {"message": "Database connected and a brand already exists!", "brand_name": first_brand.name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

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
    """
    Retrieve a list of all brands.
    """
    brands = db.query(models.Brand).offset(skip).limit(limit).all()
    return brands

# --- NUEVO ENDPOINT PARA OBTENER ZAPATILLAS (GET) ---
@app.get("/api/sneakers/", response_model=List[schemas.Sneaker])
def read_sneakers(
    sport: Optional[str] = None, 
    gender: Optional[str] = None, 
    is_new: Optional[bool] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of sneakers, optionally filtered by sport, gender, or new status.
    Includes brand, sizes, and additional images using eager loading.
    """
    query = db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand),
        joinedload(models.Sneaker.sizes),
        joinedload(models.Sneaker.images)
    )

    if sport:
        query = query.filter(models.Sneaker.sport == sport)
    if gender:
        query = query.filter(models.Sneaker.gender == gender)
    if is_new is not None: # Check explicitly for True/False
        query = query.filter(models.Sneaker.is_new == is_new)

    sneakers = query.offset(skip).limit(limit).all()
    return sneakers

# --- TU ENDPOINT EXISTENTE PARA CREAR ZAPATILLAS (POST) ---
@app.post("/api/sneakers/", response_model=schemas.Sneaker, status_code=status.HTTP_201_CREATED)
def create_sneaker(sneaker: schemas.SneakerCreate, db: Session = Depends(get_db)):
    """
    Create a new sneaker with optional sizes and images.
    """
    sneaker_data = sneaker.model_dump()

    if "main_image_url" in sneaker_data:
        sneaker_data["main_image_url"] = str(sneaker_data["main_image_url"])

    sizes_data = sneaker_data.pop("sizes", [])
    images_data = sneaker_data.pop("images", [])

    db_sneaker = models.Sneaker(**sneaker_data)
    db.add(db_sneaker)
    db.flush() 

    for size_item in sizes_data:
        db_size = models.Size(**size_item, sneaker_id=db_sneaker.id)
        db.add(db_size)

    for image_item in images_data:
        if "image_url" in image_item:
            image_item["image_url"] = str(image_item["image_url"])
        db_image = models.SneakerImage(**image_item, sneaker_id=db_sneaker.id)
        db.add(db_image)

    db.commit()
    db.refresh(db_sneaker) 
    
    return db_sneaker

# Para obtener una sneaker por ID:
@app.get("/api/sneakers/{sneaker_id}", response_model=schemas.Sneaker)
def read_sneaker(sneaker_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a single sneaker by its ID.
    """
    # Usar joinedload para cargar también las relaciones anidadas
    sneaker = db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand),
        joinedload(models.Sneaker.sizes),
        joinedload(models.Sneaker.images)
    ).filter(models.Sneaker.id == sneaker_id).first()
    
    if sneaker is None:
        raise HTTPException(status_code=404, detail="Sneaker not found")
    return sneaker