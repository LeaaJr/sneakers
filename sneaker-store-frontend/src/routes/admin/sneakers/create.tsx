// src/routes/admin/sneakers/create.tsx
import { createFileRoute } from '@tanstack/react-router';
import { fetchAllBrands, fetchAllCategories, type Brand, type Category } from '@/services/sneakerService';
import { type FormSize } from '../../../../../sneaker-store-backend/src/types/admin'; 

export interface CreateLoaderData {
  brandOptions: Brand[];
  categoryOptions: Category[];
}

// Exportamos esto para que el .lazy lo use
export const defaultSize: FormSize = { us_size: 7.0, eu_size: null, uk_size: null, quantity: 10 };

export const Route = createFileRoute('/admin/sneakers/create')({
  loader: async (): Promise<CreateLoaderData> => {
    const [brandOptions, categoryOptions] = await Promise.all([
      fetchAllBrands(),
      fetchAllCategories(),
    ]);
    return { brandOptions, categoryOptions };
  },
});