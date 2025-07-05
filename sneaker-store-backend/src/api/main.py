# sneaker-store-backend/src/api/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# This is your main FastAPI application instance
app = FastAPI(
    title="Sneaker Store API",
    description="API for managing sneakers, brands, sizes, and user interactions.",
    version="0.1.0",
)

# Configure CORS (important for frontend communication)
origins = [
    "http://localhost:5173",  # Your Vite development server
    # "https://your-sneaker-store.vercel.app", # Add your Vercel domain here when deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sneaker Store API! Visit /docs for OpenAPI documentation."}

# You will add your API routes here
# For example:
# @app.get("/api/sneakers")
# def get_sneakers():
#     return [{"id": "1", "name": "Test Sneaker"}]

# Run this file with: uvicorn src.api.main:app --reload