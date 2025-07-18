// src/services/sneakerService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface Sneaker {
  id: string;
  title: string;
  description?: string;
  price: number;
  main_image_url: string; 
  brand_id: string; 
  sport?: string;
  gender?: string;
  release_date?: string; 
  is_new?: boolean;
  
  brand: {
    id: string;
    name: string;
    logo_url?: string;
  };
  sizes: Array<{ 
    id: string;
    us_size: number;
    eu_size?: number;
    uk_size?: number;
    quantity: number;
  }>;
  images: Array<{
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
