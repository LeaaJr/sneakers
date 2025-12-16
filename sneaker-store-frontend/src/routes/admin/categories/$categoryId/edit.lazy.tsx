import { createLazyFileRoute } from '@tanstack/react-router';
import CategoryForm from '../CategoryForm';

// ⚠️ TODO: Loader para obtener datos
const mockCategoryData = {
    id: '4a1c5d9e-7e0f-4b0a-8c3b-7f5e2d1a9b2c', 
    name: 'Lifestyle', 
    slug: 'lifestyle', 
    cover_image: 'https://...',
    description: 'Shoes for daily wear.'
};

export const Route = createLazyFileRoute('/admin/categories/$categoryId/edit')({
    // Usamos loader para cargar los datos antes de renderizar
    loader: async ({ params }) => {
        // ⚠️ TODO: Reemplazar por la llamada a la API: 
        // return await fetchCategory(params.categoryId);
        return mockCategoryData;
    },
    component: () => {
        const { categoryId } = Route.useParams();
        const initialData = Route.useLoaderData();
        
        return (
            <CategoryForm 
                isEdit={true} 
                categoryId={categoryId} 
                initialData={initialData} 
            />
        );
    },
});