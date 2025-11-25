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
//ESTA ES LA SECCION DE JORDAN
export type RunningSectionDetail = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  sneaker_id: string;
};

//ESTA ES LA SECCION DE TRENDING
export interface TrendingProduct {
    id: number;
    image: string;
    label: string;
    title: string;
    subtitle: string;
}

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
 * * @param sport The sport type to filter by.
 * @returns
 */
export const fetchSneakersBySport = async (categorySlug: string) => {
    try {
        // Usar apiClient.get con la ruta relativa. apiClient ya añade la base URL.
        const response = await apiClient.get(`/categories/slug/${categorySlug}/sneakers`);

        // Si el backend responde con datos, devolverlos.
        return response.data;
    } catch (error) {
        // El interceptor de Axios (apiClient) ya maneja los errores y los reintentos.
        // Aquí solo necesitas decidir qué hacer si hay un 404/500 final.

        // Si el error es de Axios y el estado es 404 (Not Found), devolvemos un array vacío
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
        }

        // Para cualquier otro error (red, timeout, 500), lanzar el error original.
        throw error; 
    }
};


//Para manejarlo por ID

export const getSneakerById = async (id: string): Promise<Sneaker> => {
  try {
    // CAMBIAR: Usar apiClient en lugar de axios.get con URL absoluta
    const response = await apiClient.get(`/sneakers/${id}`); 
    return response.data;
  } catch (error) {
    console.error(`Error fetching sneaker with ID ${id}:`, error);
    throw error; // Dejar que el error sea manejado por el interceptor o el llamador
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

//Trending

export const fetchTrendingProducts = async (): Promise<TrendingProduct[]> => {
    try {
        const response = await apiClient.get<TrendingProduct[]>('/trending/products/');
        return response.data;
    } catch (error) {
        console.error('Error fetching trending products:', error);
        // Si no se encuentran (ej. 404/500), devolvemos un array vacío para no romper la UI.
        return []; 
    }
};


/**
 * Obtiene productos relacionados basándose en el 'categorySlug' y excluyendo el producto actual.
 * @param categorySlug El SLUG de la categoría (ej: 'air-max') del producto actual.
 * @param currentSneakerId El ID del producto que se está viendo (para excluirlo).
 * @param limit Máximo de zapatillas a devolver.
 * @returns Una promesa que resuelve con un array de zapatillas.
 */
export const getRelatedProducts = async (
  categorySlug: string, // <-- CAMBIO DE brandId A categorySlug
  currentSneakerId: string, 
  limit: number = 6
): Promise<Sneaker[]> => {
  try {

    const response = await apiClient.get<Sneaker[]>(`/categories/slug/${categorySlug}/sneakers`, {
      params: {
        limit: limit + 1, // Pedimos un poco más por si el backend no excluye bien
        exclude_id: currentSneakerId,
      },
    });

    const filteredProducts = response.data
      .filter(sneaker => sneaker.id !== currentSneakerId)
      .slice(0, limit); 

    return filteredProducts;

  } catch (error) {
    // Si la llamada falla (ej. 404, 500)
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []; // Devolvemos array vacío en 404
    }

    console.error(`Error fetching related products for slug ${categorySlug}:`, error);
    // Si no es 404, lanzamos el error
    throw new Error('Error al obtener productos relacionados.');
  }
};