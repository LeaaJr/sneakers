import { createFileRoute } from '@tanstack/react-router';
import { fetchCategoryById } from '@/services/sneakerService';

export const Route = createFileRoute('/admin/categories/$categoryId/edit')({
  // El loader hace que la data esté disponible antes de renderizar el componente
  loader: ({ params }) => fetchCategoryById(params.categoryId),
});