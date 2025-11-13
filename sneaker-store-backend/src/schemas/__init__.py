# src/schemas/__init__.py
from .sneaker import *
from .category import *
from .auth import *

# Resuelve las referencias adelantadas después de que ambos están definidos
from pydantic import model_validator

if 'Sneaker' in globals():
    Sneaker.model_rebuild()

if 'Category' in globals():
    Category.model_rebuild()