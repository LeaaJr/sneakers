import React from 'react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Category } from '@/../../sneaker-store-backend/src/types/admin';

// Define la ruta en /admin/categories
export const Route = createLazyFileRoute('/admin/categories/')({
    // ⚠️ TODO: Implementar loader para obtener datos de la API
    // loader: async () => await fetchCategories(),
    component: CategoryListPage,
});

// Mock Data basado en tu JSON de Postman
const mockCategories: Category[] = [
    {
        "name": "Running",
        "slug": "running",
        "cover_image": "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_300,c_limit/e2faf9c2-3b85-4523-a305-5049b59acf83/zapatillas-ropa-y-accesorios-para-mujer.jpg",
        "description": "Scarpe da corsa ad alte prestazioni.",
        "id": "1ce7189d-bba1-4a3d-b0f0-f6010a0176bd",
        "created_at": "2025-11-05T11:36:39.912752",
        "updated_at": "2025-11-05T11:47:25.131307"
    },
    {
        "name": "Jordan",
        "slug": "jordan",
        "cover_image": "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_300,c_limit/c6a11f7e-a97d-4c8d-9af3-a8432ed405c7/zapatillas-ropa-y-accesorios-para-mujer.jpg",
        "description": "Le Jordan sono scarpe sportive iconiche nate dalla collaborazione tra Michael Jordan e Nike.",
        "id": "5fc7cf7d-36f3-4762-b907-0d1ddce5de8f",
        "created_at": "2025-11-05T11:53:21.399812",
        "updated_at": "2025-11-05T11:54:00.229426"
    },
    {
        "name": "Shox",
        "slug": "shox",
        "cover_image": "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_300,c_limit/b1c20ebe-0080-4e6d-aca8-a663a6d5cd8d/zapatillas-ropa-y-accesorios-para-mujer.jpg",
        "description": "Oggi sono considerate un’icona dell’estetica anni 2000, tornata di moda",
        "id": "38eb2359-4b98-44d3-aabb-450da4b3f187",
        "created_at": "2025-11-05T11:56:23.378960",
        "updated_at": null
    },
    {
        "name": "Air-Force",
        "slug": "air-force",
        "cover_image": "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_300,c_limit/b34fe9e3-ee65-4c26-8eca-8bd223e4e552/zapatillas-ropa-y-accesorios-para-mujer.jpg",
        "description": "Le Nike Air Force 1 sono una vera leggenda delle sneaker, introdotte nel 1982.",
        "id": "0686aec8-8f45-4c82-84d2-2adf0e850697",
        "created_at": "2025-11-05T11:59:24.283416",
        "updated_at": null
    },
    {
        "name": "P-6000",
        "slug": "p-6000",
        "cover_image": "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_300,c_limit/b75d7f09-63f6-44f6-a6ee-eef58f3a597e/zapatillas-ropa-y-accesorios-para-mujer.jpg",
        "description": "Le Nike P-6000 si ispirano alle classiche scarpe da running dei primi anni 2000.",
        "id": "bc2fb2dc-4c74-4cae-95fe-b2288f90fcba",
        "created_at": "2025-11-05T12:00:37.743393",
        "updated_at": null
    },
    {
        "name": "Air-max",
        "slug": "air-max",
        "cover_image": "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_300,c_limit/53fce069-7bb1-4c66-9bba-0fc7154b66d7/zapatillas-ropa-y-accesorios-para-mujer.jpg",
        "description": "Le Nike Air Max sono tra le sneaker più iconiche di sempre, celebri per la loro unità Air visibile",
        "id": "79ee1afb-89ba-4a57-b35c-e4484cb3578c",
        "created_at": "2025-11-05T12:02:02.575065",
        "updated_at": null
    }


];

function CategoryListPage() {
    const categories = mockCategories; 

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete the category: "${name}"?`)) {
            // ⚠️ TODO: Aquí implementar la mutación (useMutation de TanStack Query)
            alert(`Deleting category ${name} (simulated DELETE /api/v1/categories/${id})...`);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Category Management ({categories.length})</h1>
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
                        {categories.map((category) => (
                            <tr key={category.id}>
                                {/* Imagen de la categoría */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {category.cover_image ? (
                                        <img src={category.cover_image} alt={category.name} className="w-12 h-12 object-cover rounded-md" />
                                    ) : (
                                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                                            <Image className="w-6 h-6" />
                                        </div>
                                    )}
                                </td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{category.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(category.created_at).toLocaleDateString()}
                                </td>
                                
                                {/* Acciones */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link 
                                        to="/admin/categories/$categoryId/edit" 
                                        params={{ categoryId: category.id }}
                                        className="inline-flex items-center text-amber-600 hover:text-amber-900 p-1"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="text-red-600 hover:text-red-900"
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