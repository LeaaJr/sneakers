# src/api/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

# Importar modelos y esquemas
from src.database import models
from src.schemas import sneaker as schemas
from src.database.database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sneaker Store API",
    description="API for managing sneakers, brands, sizes, and user interactions.",
    version="0.1.0",
)

# Configurar CORS
origins = [
    "http://localhost:5173",  # ACA TENGO QUE COLOCAR DESPUES EL SV DE DESARROLLO
    # "https://your-sneaker-store.vercel.app", # Cuando desplegue tengo que agregar el dominio de Vercel aca
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    """
    Root endpoint for the API.
    """
    return {"message": "Welcome to the Sneaker Store API! Visit /docs for OpenAPI documentation."}

@app.get("/api/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    """
    Tests the database connection and tries to fetch a brand.
    """
    try:
        # Intenta obtener la primera marca o crear una si no existe
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

# --- Aquí es donde agregarás tus rutas CRUD para Sneakers, Brands, etc. ---
# Por ejemplo, para crear una marca:
@app.post("/api/brands/", response_model=schemas.Brand, status_code=status.HTTP_201_CREATED)
def create_brand(brand: schemas.BrandCreate, db: Session = Depends(get_db)):
    """
    Create a new brand.
    """
    db_brand = db.query(models.Brand).filter(models.Brand.name == brand.name).first()
    if db_brand:
        raise HTTPException(status_code=400, detail="Brand with this name already exists")
    
    db_brand = models.Brand(**brand.model_dump()) # Use model_dump() for Pydantic v2
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

# Para obtener todas las marcas:
@app.get("/api/brands/", response_model=List[schemas.Brand])
def read_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of all brands.
    """
    brands = db.query(models.Brand).offset(skip).limit(limit).all()
    return brands

# Para crear una sneaker:
@app.post("/api/sneakers/", response_model=schemas.Sneaker, status_code=status.HTTP_201_CREATED)
def create_sneaker(sneaker: schemas.SneakerCreate, db: Session = Depends(get_db)):
    """
    Create a new sneaker with associated sizes and images.
    """
    # Check if brand_id exists
    brand = db.query(models.Brand).filter(models.Brand.id == sneaker.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    db_sneaker = models.Sneaker(
        title=sneaker.title,
        description=sneaker.description,
        price=sneaker.price,
        main_image_url=sneaker.main_image_url,
        brand_id=sneaker.brand_id,
        sport=sneaker.sport,
        gender=sneaker.gender,
        release_date=sneaker.release_date,
        is_new=sneaker.is_new
    )
    db.add(db_sneaker)
    db.commit()
    db.refresh(db_sneaker)

    # Add sizes
    for size_data in sneaker.sizes:
        db_size = models.Size(**size_data.model_dump(), sneaker_id=db_sneaker.id)
        db.add(db_size)
    
    # Add additional images
    for image_data in sneaker.images:
        db_image = models.SneakerImage(**image_data.model_dump(), sneaker_id=db_sneaker.id)
        db.add(db_image)
    
    db.commit()
    db.refresh(db_sneaker) # Refresh again to load relationships

    return db_sneaker

# Para obtener todas las sneakers:
@app.get("/api/sneakers/", response_model=List[schemas.Sneaker])
def read_sneakers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of all sneakers.
    Includes brand, sizes, and additional images.
    """
    sneakers = db.query(models.Sneaker).offset(skip).limit(limit).all()
    return sneakers

# Para obtener una sneaker por ID:
@app.get("/api/sneakers/{sneaker_id}", response_model=schemas.Sneaker)
def read_sneaker(sneaker_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a single sneaker by its ID.
    """
    sneaker = db.query(models.Sneaker).filter(models.Sneaker.id == sneaker_id).first()
    if sneaker is None:
        raise HTTPException(status_code=404, detail="Sneaker not found")
    return sneaker

# Puedes añadir más endpoints para actualizar, eliminar, y para tallas/imágenes individualmente.
