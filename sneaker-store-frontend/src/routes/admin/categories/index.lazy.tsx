// src/routes/admin/categories/index.lazy.tsx

import { createLazyFileRoute, Link, useRouter } from '@tanstack/react-router';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteCategory } from '@/services/sneakerService';

export const Route = createLazyFileRoute('/admin/categories/')({
  component: CategoryListPage,
});

function CategoryListPage() {
    // Aquí el tipo ya debería ser reconocido automáticamente gracias al index.tsx
    const categories = Route.useLoaderData(); 
    const router = useRouter();

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar "${name}"?`)) {
            try {
                await deleteCategory(id);
                // Invalida la ruta para refrescar la lista sin recargar la página
                await router.invalidate(); 
            } catch (error) {
                alert("Error al eliminar la categoría");
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Category Management ({categories?.length ?? 0})
                </h1>
                <Link
                    to="/admin/categories/create"
                    className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories?.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {category.cover_image ? (
                                        <img 
                                            src={category.cover_image} 
                                            alt={category.name} 
                                            className="w-18 h-18 object-cover rounded-md border border-gray-200" 
                                        />
                                    ) : (
                                        <div className="w-18 h-18 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                                            <Image className="w-6 h-6" />
                                        </div>
                                    )}
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                    {category.description && (
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {category.description}
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{category.slug}</span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link 
                                        to="/admin/categories/$categoryId/edit" 
                                        params={{ categoryId: category.id }}
                                        className="inline-flex items-center text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded-full transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}