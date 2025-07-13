// src/services/sneakerService.ts
import axios from 'axios';

// Define la URL base de tu API de FastAPI
// Asegúrate de que coincida con la URL donde tu backend está corriendo (localmente o en Render)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Define la interfaz Sneaker que coincide con el esquema de tu backend
// Es importante que esta interfaz sea consistente con src/schemas/sneaker.py
export interface Sneaker { // <-- 'export' está presente aquí y es crucial
  id: string;
  title: string;
  description?: string;
  price: number;
  main_image_url: string; // Coincide con main_image_url del backend
  brand_id: string; // ID de la marca
  sport?: string;
  gender?: string;
  release_date?: string; // O Date si lo parseas
  is_new?: boolean;
  
  brand: { // Objeto anidado para la marca
    id: string;
    name: string;
    logo_url?: string;
  };
  sizes: Array<{ // Array de objetos de talla
    id: string;
    us_size: number;
    eu_size?: number;
    uk_size?: number;
    quantity: number;
  }>;
  images: Array<{ // Array de objetos de imagen
    id: string;
    image_url: string;
    order: number;
  }>;
}

/**
 * Fetches a list of sneakers from the backend API.
 * @returns A promise that resolves to an array of Sneaker objects.
 */
export const fetchSneakers = async (): Promise<Sneaker[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sneakers/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sneakers:', error);
    // Puedes lanzar el error o devolver un array vacío
    throw error; 
  }
};
