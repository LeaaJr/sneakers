# src/database/seed.py
import sys
import os
from datetime import datetime

# Añadir el directorio raíz del proyecto al path para importaciones
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from src.database.database import SessionLocal, engine
from src.database import models
import uuid

# Asegúrate de que las tablas estén creadas antes de intentar sembrar datos
models.Base.metadata.create_all(bind=engine)

def seed_data():
    """
    Seeds initial data (Brands, Sneakers, Sizes, Images) into the database.
    """
    db = SessionLocal()
    try:
        # --- Seed Brands ---
        nike_brand = db.query(models.Brand).filter_by(name="Nike").first()
        if not nike_brand:
            nike_brand = models.Brand(id=str(uuid.uuid4()), name="Nike", logo_url="https://example.com/nike_logo.png")
            db.add(nike_brand)
            db.commit()
            db.refresh(nike_brand)
            print(f"Brand '{nike_brand.name}' created.")
        else:
            print(f"Brand '{nike_brand.name}' already exists.")

        adidas_brand = db.query(models.Brand).filter_by(name="Adidas").first()
        if not adidas_brand:
            adidas_brand = models.Brand(id=str(uuid.uuid4()), name="Adidas", logo_url="https://example.com/adidas_logo.png")
            db.add(adidas_brand)
            db.commit()
            db.refresh(adidas_brand)
            print(f"Brand '{adidas_brand.name}' created.")
        else:
            print(f"Brand '{adidas_brand.name}' already exists.")
        
        jordan_brand = db.query(models.Brand).filter_by(name="Jordan").first()
        if not jordan_brand:
            jordan_brand = models.Brand(id=str(uuid.uuid4()), name="Jordan", logo_url="https://example.com/jordan_logo.png")
            db.add(jordan_brand)
            db.commit()
            db.refresh(jordan_brand)
            print(f"Brand '{jordan_brand.name}' created.")
        else:
            print(f"Brand '{jordan_brand.name}' already exists.")

        # --- Seed Sneakers ---
        # Nike Air Max 90
        air_max_90 = db.query(models.Sneaker).filter_by(title="Nike Air Max 90").first()
        if not air_max_90:
            air_max_90 = models.Sneaker(
                id=str(uuid.uuid4()),
                title="Nike Air Max 90",
                description="Classic silhouette with modern comfort and iconic design.",
                price=135.00,
                main_image_url="https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png",
                brand_id=nike_brand.id,
                sport="Lifestyle",
                gender="Unisex",
                release_date=datetime(1990, 11, 1),
                is_new=True
            )
            db.add(air_max_90)
            db.commit()
            db.refresh(air_max_90)
            print(f"Sneaker '{air_max_90.title}' created.")

            # Add sizes for Air Max 90
            db.add_all([
                models.Size(sneaker_id=air_max_90.id, us_size=8.0, eu_size=41.0, quantity=5),
                models.Size(sneaker_id=air_max_90.id, us_size=9.0, eu_size=42.5, quantity=10),
                models.Size(sneaker_id=air_max_90.id, us_size=10.0, eu_size=44.0, quantity=8)
            ])
            # Add additional images for Air Max 90
            db.add_all([
                models.SneakerImage(sneaker_id=air_max_90.id, image_url="https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png", order=1),
                models.SneakerImage(sneaker_id=air_max_90.id, image_url="https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png", order=2)
            ])
            db.commit()
        else:
            print(f"Sneaker '{air_max_90.title}' already exists.")

        # Adidas Ultraboost
        ultraboost = db.query(models.Sneaker).filter_by(title="Adidas Ultraboost").first()
        if not ultraboost:
            ultraboost = models.Sneaker(
                id=str(uuid.uuid4()),
                title="Adidas Ultraboost",
                description="Responsive boost cushioning for ultimate comfort and energy return.",
                price=180.00,
                main_image_url="https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png",
                brand_id=adidas_brand.id,
                sport="Running",
                gender="Unisex",
                release_date=datetime(2022, 3, 15),
                is_new=False
            )
            db.add(ultraboost)
            db.commit()
            db.refresh(ultraboost)
            print(f"Sneaker '{ultraboost.title}' created.")

            # Add sizes for Ultraboost
            db.add_all([
                models.Size(sneaker_id=ultraboost.id, us_size=9.0, eu_size=42.5, quantity=7),
                models.Size(sneaker_id=ultraboost.id, us_size=10.0, eu_size=44.0, quantity=12)
            ])
            db.commit()
        else:
            print(f"Sneaker '{ultraboost.title}' already exists.")

        # Jordan 1 Retro High
        jordan_1 = db.query(models.Sneaker).filter_by(title="Jordan 1 Retro High").first()
        if not jordan_1:
            jordan_1 = models.Sneaker(
                id=str(uuid.uuid4()),
                title="Jordan 1 Retro High",
                description="The iconic basketball silhouette, a timeless classic.",
                price=170.00,
                main_image_url="https://uploadthingy.s3.us-west-1.amazonaws.com/vQUHrQS4Gx4DndHjABigi7/image.png",
                brand_id=jordan_brand.id,
                sport="Basketball",
                gender="Unisex",
                release_date=datetime(1985, 4, 1),
                is_new=True
            )
            db.add(jordan_1)
            db.commit()
            db.refresh(jordan_1)
            print(f"Sneaker '{jordan_1.title}' created.")

            # Add sizes for Jordan 1
            db.add_all([
                models.Size(sneaker_id=jordan_1.id, us_size=8.5, eu_size=42.0, quantity=3),
                models.Size(sneaker_id=jordan_1.id, us_size=9.5, eu_size=43.0, quantity=6)
            ])
            db.commit()
        else:
            print(f"Sneaker '{jordan_1.title}' already exists.")

        print("\nDatabase seeding complete!")

    except Exception as e:
        db.rollback()
        print(f"An error occurred during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
