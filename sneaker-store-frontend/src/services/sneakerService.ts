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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    
    if (error.code === 'ECONNABORTED' && originalRequest.retryCount < MAX_RETRIES) {
      originalRequest.retryCount = originalRequest.retryCount || 0;
      originalRequest.retryCount += 1;
      
      console.warn(`Timeout: reintentando solicitud (intento ${originalRequest.retryCount})`);
      
      
      return new Promise(resolve => setTimeout(resolve, RETRY_DELAY)).then(() => apiClient(originalRequest));
    }

    console.error('Error fetching sneakers:', error);
    return Promise.reject(new Error('No se pudo conectar con el servidor. Verifica tu conexión.'));
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
 *
 * @returns
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
 * 
 * @param sneakerId The ID of the sneaker.
 * @returns
 */
export const fetchSneakerFeaturedDetails = async (sneakerId: string): Promise<SneakerFeaturedDetail[]> => {
    const response = await apiClient.get(`/sneakers/${sneakerId}/featured_details`);
    return response.data;
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
 * 
 * @param sport The sport type to filter by.
 * @returns
 */
export const fetchSneakersBySport = async (categorySlug: string) => {
    // LLAMA AL NUEVO ENDPOINT DEL BACKEND
    const response = await fetch(`http://localhost:8000/api/categories/slug/${categorySlug}/sneakers`);
    
    
    if (response.status === 404) {
         return []; 
    }
    
    if (!response.ok) {
        // Manejar otros errores HTTP (500, etc.)
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
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

export const fetchSneakersByCategorySlug = async (categorySlug: string): Promise<Sneaker[]> => {
  try {
    // CAMBIAR: Usamos el nuevo endpoint /api/categories/slug/{slug}/sneakers
    const response = await apiClient.get(`/categories/slug/${categorySlug}/sneakers`); 
    return response.data;
  } catch (error) {
    console.error(`Error fetching sneakers for slug ${categorySlug}:`, error);
    // Asegúrate de rechazar con un error que el frontend pueda manejar
    throw new Error(`Error al obtener zapatillas para la categoría ${categorySlug}.`);
  }
};
