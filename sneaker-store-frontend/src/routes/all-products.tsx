// src/routes/all-products.tsx

import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchSneakers, type Sneaker } from '@/services/sneakerService'; 
// 1. 🔑 Importar el componente Card (asegúrate que la ruta sea correcta)
import { Card } from '@/components/Cards'; 


// --- Componente de Contenido de la Página ---
const AllProductsPageComponent: React.FC = () => {
    // Lógica de TanStack Query para obtener TODAS las sneakers
    const { 
        data: sneakers = [], 
        isLoading, 
        error 
    } = useQuery<Sneaker[], Error>({
        queryKey: ['allProductsSneakers'], 
        queryFn: fetchSneakers, 
    });

    if (isLoading) {
        return <div className="text-center py-20 text-xl">Caricamento di tutte le Sneakers.</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600">Error al cargar: {(error as Error).message}</div>;
    }

    if (sneakers.length === 0) {
        return <div className="text-center py-20 text-gray-500">No se encontraron zapatillas.</div>;
    }

    // 2. Renderizar la cuadrícula de zapatillas
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-800">All Sneakers</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {sneakers.map((sneaker) => (
                    // 2. 🚀 Usamos el componente Card e inyectamos el objeto sneaker
                    <Card key={sneaker.id} sneaker={sneaker} />
                ))}
            </div>
        </div>
    );
};


// --- Definición de la Ruta para TanStack Router ---
export const Route = createFileRoute('/all-products')({ 
    component: AllProductsPageComponent,
});