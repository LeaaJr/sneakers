import { createLazyFileRoute } from '@tanstack/react-router';
import CategoryForm from '../CategoryForm';

const mockCategoryData = {
    id: '4a1c5d9e-7e0f-4b0a-8c3b-7f5e2d1a9b2c', 
    name: 'Lifestyle', 
    slug: 'lifestyle', 
    cover_image: 'https://...',
    description: 'Shoes for daily wear.'
};

export const Route = createLazyFileRoute('/admin/categories/$categoryId/edit')({
    // Se usa loader para cargar los datos antes de renderizar
    loader: async ({ params }) => {
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