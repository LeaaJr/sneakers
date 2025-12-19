import React from 'react';
import { createLazyFileRoute, Link, redirect } from '@tanstack/react-router';
import { Plus, Pencil, Trash2, Tag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchSneakers, type Sneaker, deleteSneaker } from '@/services/sneakerService';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';

// Define la ruta en /admin/sneakers
export const Route = createLazyFileRoute('/admin/sneakers/')({
    loader: () => {
        return fetchSneakers();
    },
    component: SneakerListPage,
    errorComponent: () => <div className="text-red-500 p-8">Error loading sneaker list. Check API connection.</div>,
});

function SneakerListPage() {
    const sneakers = Route.useLoaderData();
    const router = useRouter(); // Inicializa el router

    // Función para manejar la eliminación
    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Delete ${title}?`)) {
            try {
                await deleteSneaker(id);
                // 🔥 EN LUGAR DE RELOAD:
                await router.invalidate(); 
                alert("Deleted!");
            } catch (error) {
                alert("Error deleting");
            }
        }
    };


    if (!sneakers || sneakers.length === 0) {
        return (
            <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold">No Sneakers Found</h2>
                <p className="text-gray-500 mt-2">Start by creating a new sneaker using the button above.</p>
            </div>
        );
    }


    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Sneaker Management ({sneakers.length})
                </h1>
                <Link
                    to="/admin/sneakers/create"
                    className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Sneaker
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand / Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sneakers.map((sneaker) => (
                            <tr key={sneaker.id}>
                                
                                {/* Columna Producto (Imagen y Título) */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img 
                                                className="h-10 w-10 rounded-full object-cover" 
                                                src={sneaker.main_image_url || 'https://via.placeholder.com/60'} 
                                                alt={sneaker.title} 
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {sneaker.title}
                                            </div>
                                            <div className="text-xs text-gray-500">ID: {sneaker.id.substring(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Columna Precio */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                                    ${sneaker.price.toFixed(2)}
                                </td>

                                {/* Columna Marca / Categoría */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        {/* Usamos sneaker.brand.name que está disponible en tu interfaz Sneaker */}
                                        <span className="text-gray-900 flex items-center"><Tag className="w-3 h-3 mr-1"/> {sneaker.brand?.name || 'N/A'}</span>
                                        {/* La interfaz Sneaker no incluye category_name, pero asumimos que sí incluye category_id para fines prácticos. 
                                            Si tu API no devuelve el objeto Category, esto es un placeholder: */}
                                        <span className="text-xs text-gray-500 ml-4">Category: {sneaker.category_id.substring(0, 8)}...</span>
                                    </div>
                                </td>

                                {/* Columna Estado */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {sneaker.is_new ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <Zap className="w-3 h-3 mr-1"/> New
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Standard
                                        </span>
                                    )}
                                </td>
                                
                                {/* Columna Acciones */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link 
                                        to="/admin/sneakers/$sneakerId/edit" 
                                        params={{ sneakerId: sneaker.id }}
                                        className="inline-flex items-center text-amber-600 hover:text-amber-900 p-1"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    
                                    <Button 
                                        type="button"
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(sneaker.id, sneaker.title)}
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