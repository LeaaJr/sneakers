// src/services/sneakerService.ts
import axios from 'axios';

// Configuración base de Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout: La solicitud tardó demasiado');
    }
    return Promise.reject(error);
  }
);

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

export type RunningSectionDetail = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  sneaker_id: string;
};

/**
 * Fetches a list of sneakers from the backend API.
 * @returns A promise that resolves to an array of Sneaker objects.
 */
export const fetchSneakers = async (): Promise<Sneaker[]> => {
  try {
    const response = await apiClient.get('/sneakers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching sneakers:', error);
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
  }
};

/**
 * Fetches the featured details for a specific sneaker.
 * @param sneakerId The ID of the sneaker.
 * @returns A promise that resolves to an array of SneakerFeaturedDetail objects.
 */
export const fetchSneakerFeaturedDetails = async (sneakerId: string): Promise<SneakerFeaturedDetail[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sneakers/${sneakerId}/featured_details`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching featured details for sneaker ${sneakerId}:`, error);
        throw error;
    }
};



export const fetchSneakerById = async (id: string): Promise<Sneaker> => {
  try {
    const response = await apiClient.get(`/sneakers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sneaker with ID ${id}:`, error);
    throw new Error(`No se pudo obtener la zapatilla con ID ${id}`);
  }
};


export const fetchHighlightedSneakers = async (): Promise<RunningSectionDetail[]> => {
  try {
    const response = await apiClient.get('/running_section/featured_details/');
    return response.data;
  } catch (error) {
    console.error('Error fetching highlighted sneakers:', error);
    throw new Error('Error al obtener destacados');
  }
};


//Funcion para categorias

/**
 * Fetches sneakers filtered by a specific sport.
 * @param sport The sport type to filter by.
 * @returns A promise that resolves to an array of Sneaker objects.
 */
export const fetchSneakersBySport = async (sport: string): Promise<Sneaker[]> => {
  try {
    const response = await apiClient.get('/sneakers/', {
      params: { sport }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching sneakers for sport ${sport}:`, error);
    throw new Error(`Error al obtener zapatillas para ${sport}`);
  }
};


//Para manejarlo por ID

export const getSneakerById = async (id: string): Promise<Sneaker> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sneakers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sneaker with ID ${id}:`, error);
    throw error;
  }
};