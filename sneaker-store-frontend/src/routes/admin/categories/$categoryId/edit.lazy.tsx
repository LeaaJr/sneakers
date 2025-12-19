import { createLazyFileRoute } from '@tanstack/react-router';
import CategoryForm from '../CategoryForm';

export const Route = createLazyFileRoute('/admin/categories/$categoryId/edit')({
    component: EditCategoryPage,
});

function EditCategoryPage() {
    const { categoryId } = Route.useParams();
    const categoryData = Route.useLoaderData();

    return (
        <CategoryForm 
            isEdit={true} 
            categoryId={categoryId} 
            initialData={{
                name: categoryData.name,
                slug: categoryData.slug,
                cover_image: categoryData.cover_image || '',
                description: categoryData.description || ''
            }} 
        />
    );
}