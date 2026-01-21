// Tipos base que corresponden a tu esquema SneakerCreate
export interface FormSize {
    // Note: Usamos string/number para inputs, convertiremos a float/int en el submit
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

export interface SneakerFormData {
    title: string;
    description: string;
    price: number;
    main_image_url: string;
    brand_id: string; // Se usará string para el Select, luego UUID
    category_id: string; // Se usará string para el Select, luego UUID
    sport: string | null;
    gender: 'men' | 'women' | 'unisex' | null;
    release_date: string; // Usaremos string para el input de fecha
    is_new: boolean;
    sizes: FormSize[];
    images: FormImage[];
    featured_details: FormFeaturedDetail[];
}

export interface Sneaker {
    id: string;
    title: string;
    price: number;
    main_image_url: string;
    brand_name: string;
    category_name: string; 
    is_new: boolean;
}

//#Category

export interface Category {
    id: string; // Corresponde al UUID
    name: string;
    slug: string;
    cover_image: string;
    description: string | null;
    created_at: string; // String en el frontend para el timestamp
    updated_at: string | null;
}