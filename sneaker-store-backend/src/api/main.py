from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List, Optional
from uuid import UUID
from contextlib import asynccontextmanager

# Importaciones locales
from src import schemas
from src.crud import trending as trending_crud
from src.database import models
from src.database.database import get_db, create_db_tables 
from src.routers import categories
from src.auth.auth import auth_router

# 1. GESTIÓN DE ARRANQUE (LIFESPAN)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crea las tablas solo una vez al arrancar
    create_db_tables()
    yield

app = FastAPI(
    title="Sneaker Store API",
    description="API for managing sneakers, brands, sizes, and user interactions.",
    version="0.1.0",
    lifespan=lifespan
)

# 2. CONFIGURACIÓN CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000","https://sneakers-coral-mu.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. DEFINICIÓN DE ROUTERS
# Nota: trending_router usará el prefijo /api/trending al incluirlo abajo
trending_router = APIRouter(prefix="/trending", tags=["Trending Products"])
general_router = APIRouter(prefix="/api", tags=["General Endpoints"])

# --- 4. ENDPOINTS DE SNEAKERS (Optimización de velocidad) ---

@app.get("/api/sneakers/", response_model=List[schemas.SneakerMinimal])
def read_all_sneakers(
    skip: int = 0, 
    limit: int = 20, 
    db: Session = Depends(get_db)
):
    """ Obtiene lista ligera para catálogo (Alta velocidad). """
    return db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand)
    ).offset(skip).limit(limit).all()

@app.get("/api/sneakers/{sneaker_id}", response_model=schemas.Sneaker)
def read_sneaker(sneaker_id: UUID, db: Session = Depends(get_db)):
    """ Obtiene detalle completo de una zapatilla. """
    db_sneaker = db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand),
        selectinload(models.Sneaker.sizes),
        selectinload(models.Sneaker.images),
        selectinload(models.Sneaker.featured_details)
    ).filter(models.Sneaker.id == sneaker_id).first()

    if not db_sneaker:
        raise HTTPException(status_code=404, detail="Sneaker not found")
    return db_sneaker

@app.post("/api/sneakers/", response_model=schemas.Sneaker, status_code=status.HTTP_201_CREATED)
def create_sneaker(sneaker: schemas.SneakerCreate, db: Session = Depends(get_db)):
    if not db.query(models.Category).filter(models.Category.id == sneaker.category_id).first():
        raise HTTPException(status_code=400, detail="Invalid category ID")

    sneaker_data = sneaker.model_dump()
    sneaker_data["main_image_url"] = str(sneaker_data["main_image_url"])

    sizes_data = sneaker_data.pop("sizes", [])
    images_data = sneaker_data.pop("images", [])
    featured_details_data = sneaker_data.pop("featured_details", [])

    db_sneaker = models.Sneaker(**sneaker_data)
    db.add(db_sneaker)
    db.flush() 

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

@app.delete("/api/sneakers/{sneaker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sneaker(sneaker_id: UUID, db: Session = Depends(get_db)):
    sneaker = db.query(models.Sneaker).filter(models.Sneaker.id == sneaker_id).first()
    if not sneaker:
        raise HTTPException(status_code=404, detail="Sneaker not found")
    db.delete(sneaker)
    db.commit()
    return

# --- 5. ENDPOINTS DE TRENDING (Unificados) ---

@trending_router.get("/products/", response_model=List[schemas.TrendingProductSchema])
def read_trending_products(db: Session = Depends(get_db)):
    return trending_crud.get_trending_products(db=db)

@trending_router.post("/products/", response_model=schemas.TrendingProduct, status_code=201)
def create_trending_product_endpoint(product: schemas.TrendingProductCreate, db: Session = Depends(get_db)):
    return trending_crud.create_trending_product(db, product.dict())

@trending_router.put("/products/{trending_id}", response_model=schemas.TrendingProduct)
def update_trending_product_endpoint(trending_id: int, update: schemas.TrendingProductUpdate, db: Session = Depends(get_db)):
    updated = trending_crud.update_trending_product(db, trending_id, update.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Producto en tendencia no encontrado")
    return updated

# --- 6. SECCIÓN RUNNING / FEATURED DETAILS ---

@app.get("/api/running_section/featured_details/", response_model=List[schemas.SneakerFeaturedDetail])
def get_running_section_details(db: Session = Depends(get_db)):
    return db.query(models.SneakerFeaturedDetail).order_by(models.SneakerFeaturedDetail.display_order).all()

@app.post("/api/running_section/featured_detail/", response_model=schemas.SneakerFeaturedDetail, status_code=201)
def add_running_section_detail(detail_item: schemas.SneakerFeaturedDetailCreate, db: Session = Depends(get_db)):
    detail_data = detail_item.model_dump()
    if "image_url" in detail_data and detail_data["image_url"] is not None:
        detail_data["image_url"] = str(detail_data["image_url"])
    db_detail = models.SneakerFeaturedDetail(**detail_data)
    db.add(db_detail)
    db.commit()
    db.refresh(db_detail)
    return db_detail

# --- 7. ENDPOINTS DE BRANDS ---

@app.get("/api/brands/", response_model=List[schemas.Brand])
def read_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Brand).offset(skip).limit(limit).all()

@app.post("/api/brands/", response_model=schemas.Brand, status_code=201)
def create_brand(brand: schemas.BrandCreate, db: Session = Depends(get_db)):
    if db.query(models.Brand).filter(models.Brand.name == brand.name).first():
        raise HTTPException(status_code=400, detail="Brand already exists")
    brand_data = brand.model_dump()
    if brand_data.get("logo_url"):
        brand_data["logo_url"] = str(brand_data["logo_url"])
    db_brand = models.Brand(**brand_data)
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

# ✅ NUEVOS ENDPOINTS
@app.get("/api/brands/{brand_id}", response_model=schemas.Brand)
def read_brand(brand_id: str, db: Session = Depends(get_db)):
    db_brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if not db_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return db_brand

@app.put("/api/brands/{brand_id}", response_model=schemas.Brand)
def update_brand(brand_id: str, brand: schemas.BrandCreate, db: Session = Depends(get_db)):
    db_brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if not db_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    for key, value in brand.model_dump().items():
        setattr(db_brand, key, str(value) if key == "logo_url" and value else value)
    db.commit()
    db.refresh(db_brand)
    return db_brand

@app.delete("/api/brands/{brand_id}", status_code=204)
def delete_brand(brand_id: str, db: Session = Depends(get_db)):
    db_brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if not db_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    db.delete(db_brand)
    db.commit()

# --- 8. STATUS Y MANTENIMIENTO ---

@app.get("/status")
def check_status():
    return {"status": "ok", "app_running": True}

@general_router.get("/test-db") 
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.query(models.Brand).first()
        return {"message": "Database connected successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sneaker Store API! Visit /docs"}

# --- 9. INCLUSIÓN FINAL DE TODOS LOS ROUTERS ---
app.include_router(categories.router) 
app.include_router(auth_router)
app.include_router(trending_router, prefix="/api") # Resulta en /api/trending/...
app.include_router(general_router)