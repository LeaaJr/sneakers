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
        
        
        const currentRetry = originalRequest.retryCount || 0;
        if (error.code === 'ECONNABORTED' && currentRetry < MAX_RETRIES) {
            originalRequest.retryCount = currentRetry + 1;
            
            console.warn(`Timeout: reintentando solicitud (intento ${originalRequest.retryCount})`);
            
            
            return new Promise(resolve => setTimeout(resolve, RETRY_DELAY)).then(() => apiClient(originalRequest));
        }

        console.error('Error fetching sneakers:', error);
        return Promise.reject(new Error('No se pudo conectar con el servidor. Verifica tu conexión.'));
    }
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

console.log('🔧 API Base URL:', API_BASE_URL);

// ----------------------------------------------------------------------
// 💡 INTERFACES EXISTENTES Y AGREGADAS PARA EL FORMULARIO
// ----------------------------------------------------------------------

export interface Brand {
    id: string;
    name: string;
    logo_url: string;
}

// Interfaz de Categoría (Definida por ti)
export interface Category {
    id: string; // Corresponde al UUID
    name: string;
    slug: string;
    cover_image: string;
    description: string | null;
    created_at: string; // String en el frontend para el timestamp
    updated_at: string | null;
}

// Tipos base que corresponden a tu esquema SneakerCreate (AGREGADOS)
export interface FormSize {
    us_size: number;
    eu_size: number | null;
    uk_size: number | null;
    quantity: number;
}

export interface FormImage {
    image_url: string;
    order: number;
}

export interface FormFeaturedDetail {
    title: string;
    description: string | null;
    image_url: string;
    display_order: number;
}

// Payload de datos que el formulario maneja (AGREGADO)
export interface SneakerFormData {
    title: string;
    description: string;
    price: number;
    main_image_url: string;
    brand_id: string; // Se usará string para el Select
    category_id: string; // Se usará string para el Select
    sport: string | null;
    gender: 'men' | 'women' | 'unisex' | null;
    release_date: string; // Usaremos string para el input de fecha
    is_new: boolean;
    sizes: FormSize[];
    images: FormImage[];
    featured_details: FormFeaturedDetail[];
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

// Sneaker de la API (Detalle/Listado)
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
    // Si la API devuelve el category_id para el detalle:
    category_id: string; 
    // Si la API devuelve featured_details:
    featured_details: FormFeaturedDetail[]; 
}

// ESTA ES LA SECCION DE JORDAN
export type RunningSectionDetail = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    display_order: number;
    sneaker_id: string;
};

// ESTA ES LA SECCION DE TRENDING
export interface TrendingProduct {
    id: number;
    image: string;
    label: string;
    title: string;
    subtitle: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

// ----------------------------------------------------------------------
// 💡 FUNCIONES AGREGADAS PARA EL FORMULARIO (REALES)
// ----------------------------------------------------------------------

/**
 * Obtiene todas las marcas disponibles (REAL).
 * @returns Una promesa que resuelve con un array de Brand.
 */
export const fetchAllBrands = async (): Promise<Brand[]> => {
    try {
        // Asume que el endpoint es /brands/
        const response = await apiClient.get('/brands/'); 
        return response.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw new Error('Error al obtener la lista de marcas.');
    }
};

/**
 * Obtiene todas las categorías disponibles (REAL).
 * @returns Una promesa que resuelve con un array de Category.
 */
export const fetchAllCategories = async (): Promise<Category[]> => {
    try {
        // Asume que el endpoint es /categories/
        const response = await apiClient.get('/categories/'); 
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Error al obtener la lista de categorías.');
    }
};

// ----------------------------------------------------------------------
// 📝 TUS FUNCIONES EXISTENTES (SIN MODIFICACIONES)
// ----------------------------------------------------------------------

/**
 * Obtiene las sneakers, opcionalmente filtradas.
 * @param filters Objeto con filtros (brand, minPrice, maxPrice, etc.)
 * @returns Promesa con el array de Sneakers
 */
export const fetchSneakers = async (filters?: Record<string, any>): Promise<Sneaker[]> => {
    try {
        console.log('🔍 Fetching sneakers with filters:', filters);
        console.log('📡 URL:', '/sneakers/', 'Params:', filters);
        
        const response = await apiClient.get('/sneakers/', { 
            params: filters 
        });
        
        console.log('✅ Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching sneakers:', error);
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
};

/**
 * * @param sneakerId The ID of the sneaker.
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

/**
 * Elimina una zapatilla por su ID.
 * @param id El ID de la zapatilla a eliminar.
 */
export const deleteSneaker = async (id: string): Promise<void> => {
    try {
        // Usa el apiClient que ya tiene la baseURL configurada
        await apiClient.delete(`/sneakers/${id}`);
    } catch (error) {
        console.error(`Error deleting sneaker with ID ${id}:`, error);
        // Dejar que el error sea manejado por el interceptor o el llamador
        throw error; 
    }
};


/**
 * Crea una nueva zapatilla (POST).
 * @param data Los datos del formulario (payload) de la nueva zapatilla.
 * @returns Una promesa que resuelve con la Sneaker creada.
 */
export const createSneaker = async (data: SneakerFormData): Promise<Sneaker> => {
    try {
        const response = await apiClient.post('/sneakers/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating sneaker:', error);
        throw error;
    }
};

/**
 * Actualiza una zapatilla existente (PUT).
 * @param id El ID de la zapatilla a actualizar.
 * @param data Los datos del formulario para actualizar.
 * @returns Una promesa que resuelve con la Sneaker actualizada.
 */
export const updateSneaker = async (id: string, data: SneakerFormData): Promise<Sneaker> => {
    try {
        const response = await apiClient.put(`/sneakers/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating sneaker with ID ${id}:`, error);
        throw error;
    }
};


/**
 * Obtiene el perfil del usuario actual (basado en el token de la sesión)
 */
export const fetchCurrentUser = async (): Promise<UserProfile> => {
    try {
        const response = await apiClient.get('/users/me'); // Ajusta el endpoint según tu API
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

//Dashboard Categories

/**
 * Obtiene una categoría por su ID (REAL).
 */
export const fetchCategoryById = async (id: string): Promise<Category> => {
    try {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category ${id}:`, error);
        throw error;
    }
};

/**
 * Crea una nueva categoría (POST).
 */
export const createCategory = async (data: Partial<Category>): Promise<Category> => {
    try {
        const response = await apiClient.post('/categories/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

/**
 * Actualiza una categoría existente (PUT).
 */
export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    try {
        const response = await apiClient.put(`/categories/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

/**
 * Elimina una categoría por ID.
 */
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/categories/${id}`);
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
    }
};

/**
 * Obtiene una marca por su ID.
 */
export const fetchBrandById = async (id: string): Promise<Brand> => {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data;
};

/**
 * Crea una nueva marca (POST).
 */
export const createBrand = async (data: { name: string; logo_url: string }): Promise<Brand> => {
    const response = await apiClient.post('/brands/', data);
    return response.data;
};

/**
 * Actualiza una marca existente (PUT).
 */
export const updateBrand = async (id: string, data: { name: string; logo_url: string }): Promise<Brand> => {
    const response = await apiClient.put(`/brands/${id}`, data);
    return response.data;
};

//Estas ineas de codigo son para el manejo de las cards de tendencias dentro del admin (trending/dashboard)

/**
 * Crea una nueva card de tendencia (POST).
 */
export const createTrendingProduct = async (data: Omit<TrendingProduct, 'id'> & { sneaker_id: string }): Promise<TrendingProduct> => {
    try {
        const response = await apiClient.post('/trending/products/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating trending product:', error);
        throw error;
    }
};

/** Elimina una card de tendencia */
export const deleteTrendingProduct = async (id: number): Promise<void> => {
    await apiClient.delete(`/trending/products/${id}/`);
};

/** Actualiza una card existente (PUT/PATCH) */
export const updateTrendingProduct = async (id: number, data: Partial<TrendingProduct>): Promise<TrendingProduct> => {
    const response = await apiClient.put(`/trending/products/${id}/`, data);
    return response.data;
};

/**
 * Envía una solicitud para recuperar la contraseña.
 * @param email El correo del usuario.
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
    try {
        // Usamos el apiClient que ya tiene el baseURL y los interceptores
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        // El interceptor ya loguea el error, aquí solo personalizamos el mensaje para la UI
        console.error('Error en requestPasswordReset:', error);
        throw new Error('No se pudo enviar el correo de recuperación. Inténtalo más tarde.');
    }
};