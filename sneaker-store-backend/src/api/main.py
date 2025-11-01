# src/api/main.py
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List, Optional
from uuid import UUID
from src import schemas
import os

from src.crud import trending as trending_crud
from src.database import models
# Importar funciones desde el archivo de la base de datos, no redefinirlas
from src.database.database import get_db, create_db_tables 

from src.schemas.sneaker import SneakerFeaturedDetailCreate 
from src.schemas.category import Category, CategoryCreate
from src.routers import categories


# --- INICIALIZACIÓN ---
# Ejecutar la creación de tablas (Asegura que TrendingProduct exista)
create_db_tables() 

app = FastAPI(
    title="Sneaker Store API",
    description="API for managing sneakers, brands, sizes, and user interactions.",
    version="0.1.0",
)

# Configuración CORS
origins = [
     "http://localhost:5173",
     "http://localhost:3000",
     "http://127.0.0.1:3000"
]
app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- DEFINICIÓN DE ROUTERS ---

# Las rutas dentro serán /, /sneakers/, /brands/, etc.
general_router = APIRouter(
    prefix="/api",
    tags=["General Endpoints (Sneakers, Brands, Test)"],
)


# Lo definimos con solo /trending, y la inclusión le dará el /api.
trending_router = APIRouter(
    prefix="/trending",
    tags=["Trending Products"],
)


# --- INCLUSIÓN DE ROUTERS UNIFICADA ---

app.include_router(categories.router) 

# --------------------------------------------------------------------------
# Endpoint: GET /api/trending/products/ 
# --------------------------------------------------------------------------
@trending_router.get(
    "/products/", 
    response_model=List[schemas.TrendingProductSchema], 
    summary="Get a list of currently trending products."
)
def read_trending_products(db: Session = Depends(get_db)):
    """ Recupera una lista de productos marcados como tendencia. """
    try:
        trending_products = trending_crud.get_trending_products(db=db)
        return trending_products
    except Exception as e:
        print(f"Error al obtener productos de tendencia: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Error interno del servidor al acceder a los datos de tendencia."
        )
    
@trending_router.post(
    "/products/",
    response_model=schemas.TrendingProduct,
    status_code=201,
    summary="Crear un producto en tendencia"
)
def create_trending_product_endpoint(
    product: schemas.TrendingProductCreate,
    db: Session = Depends(get_db)
):
    return trending_crud.create_trending_product(db, product.dict())


# Esto hace que las rutas de abajo sean /api/sneakers, /api/brands, /api/test-db
app.include_router(trending_router, prefix="/api")



@app.get("/")
def read_root():
    return {"message": "Welcome to the Sneaker Store API! Visit /docs for OpenAPI documentation."}

# Endpoint de PRUEBA (Ahora la ruta es /api/test-db)
@general_router.get("/test-db") 
def test_db_connection(db: Session = Depends(get_db)):
    try:
        first_brand = db.query(models.Brand).first()
        return {"message": "Database connected successfully!"}
    except Exception as e:
        # El error 500
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
    # Usar `selectinload` o `subqueryload` es a menudo más eficiente 
    # que `joinedload` para colecciones (to-many relationships)
    query = db.query(models.Sneaker).options(
        joinedload(models.Sneaker.brand),
        # Usar selectinload para las relaciones uno-a-muchos (sizes, images, details)
        selectinload(models.Sneaker.sizes),
        selectinload(models.Sneaker.images),
        selectinload(models.Sneaker.featured_details) # ¡AGREGAR ESTO!
    )
    # ... [tu código de filtros] ...
    
    # Reducir el límite por defecto, 100 es mucho para cargar todas las subrelaciones.
    # Considera limit: int = 20 o 50
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


# 1. ENDPOINT PARA OBTENER TODAS las cards (GET)
@app.get("/api/running_section/featured_details/", response_model=List[schemas.SneakerFeaturedDetail])
def get_running_section_details(db: Session = Depends(get_db)):
    """
    Obtiene todos los detalles destacados para la sección de running (fetch).
    """
    return db.query(models.SneakerFeaturedDetail).order_by(models.SneakerFeaturedDetail.display_order).all()


# 2. ENDPOINT PARA REEMPLAZAR TODAS las cards (POST - el que borra todo)
@app.post("/api/running_section/featured_details/", status_code=status.HTTP_201_CREATED)
def create_running_section_details(details: List[schemas.SneakerFeaturedDetailCreate], db: Session = Depends(get_db)):
    """
    Crea los detalles destacados para la sección de running. ESTO REEMPLAZA CUALQUIER DETALLE EXISTENTE.
    """
    # ⬅️ Borramos todos los registros anteriores
    db.query(models.SneakerFeaturedDetail).delete()
    db.commit()

    # ⬅️ Aquí empieza el bloque de inserción
    for detail_item in details:
        detail_data = detail_item.model_dump()

        image_url = detail_data.get("image_url")
        if image_url is not None:
            detail_data["image_url"] = str(image_url)

        db.add(models.SneakerFeaturedDetail(**detail_data))

    db.commit()
    return {"message": "Detalles destacados de running creados exitosamente."}

# 3. ENDPOINT PARA AGREGAR UNA SOLA card (POST - el que no borra)
# URL: /api/running_section/featured_detail/ (Ruta SINGULAR)
@app.post("/api/running_section/featured_detail/", response_model=schemas.SneakerFeaturedDetail, status_code=status.HTTP_201_CREATED)
def add_running_section_detail(detail_item: schemas.SneakerFeaturedDetailCreate, db: Session = Depends(get_db)):
    """
    Agrega un nuevo detalle destacado a la sección de running sin borrar los existentes.
    """
    # 1. Convertir HttpUrl a string si es necesario
    detail_data = detail_item.model_dump()
    if "image_url" in detail_data and detail_data["image_url"] is not None:
        detail_data["image_url"] = str(detail_data["image_url"])
            
    # 2. Crear y agregar el nuevo modelo
    db_detail = models.SneakerFeaturedDetail(**detail_data)
    db.add(db_detail)
    
    # 3. Guardar y devolver
    db.commit()
    db.refresh(db_detail)
    
    return db_detail


# --- ENDPOINTS PARA LA SECCIÓN TRENDING ---



def create_db_tables():
    """
    Crea las tablas de la base de datos si no existen. 
    Es seguro llamarla varias veces.
    """
    # Base.metadata contiene las definiciones de TODAS las clases de modelos
    # que heredan de Base (p. ej., Sneaker, TrendingProduct, etc.)
    Base.metadata.create_all(bind=engine)

def get_db():

    db = SessionLocal()
    try:
            yield db
    finally:
         db.close()



@app.get("/status")
def check_status():
    return {"status": "ok", "app_running": True}


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