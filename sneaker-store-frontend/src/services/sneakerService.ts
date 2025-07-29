// src/services/sneakerService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
}

export interface Size {
  id: string;
  us_size: number;
  eu_size: number;
  uk_size: number;
  quantity: number;
}

export interface SneakerImage {
  id: string;
  image_url: string;
  order?: number;
}

export interface Sneaker {
  id: string;
  title: string;
  description?: string;
  price: number;
  main_image_url: string;
  brand_id: string;
  brand: Brand;
  sport?: string;
  gender?: string;
  release_date?: string;
  is_new?: boolean;
  sizes: Size[];
  images: SneakerImage[];
  created_at: string;
  updated_at: string;
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
    // It's often good to rethrow errors so calling components can handle them
    throw error;
  }
};

/**
 * Fetches a single sneaker by its ID from the backend API.
 * @param id The ID of the sneaker to fetch.
 * @returns A promise that resolves to a Sneaker object or null if not found.
 */
export async function getSneakerById(id: string): Promise<Sneaker | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/sneakers/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`Sneaker with ID ${id} not found.`);
      return null; // Sneaker not found
    }
    console.error(`Error fetching sneaker with ID ${id}:`, error);
    throw error; // Re-throw other errors for handling higher up
  }
}