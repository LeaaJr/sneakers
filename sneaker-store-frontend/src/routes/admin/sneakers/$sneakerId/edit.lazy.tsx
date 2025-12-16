// src/routes/admin/sneakers/$sneakerId/edit.lazy.tsx (ACTUALIZADO)

import { createLazyFileRoute, type RouteApi } from '@tanstack/react-router';
import { SneakerForm } from '@/routes/admin/sneakers/SneakerForm';
import { fetchSneakerById, fetchAllBrands, fetchAllCategories, type Sneaker, type Brand, type Category } from '@/services/sneakerService'; 

// ----------------------------------------------------
// 1. DEFINICIÓN DEL TIPO DE DATOS DEL LOADER
// ----------------------------------------------------
interface EditLoaderData {
    sneakerData: Sneaker;
    brandOptions: Brand[];
    categoryOptions: Category[];
}

// ----------------------------------------------------
// 2. CONFIGURACIÓN DE LA RUTA Y LOADER
// ----------------------------------------------------
export const Route = createLazyFileRoute('/admin/sneakers/$sneakerId/edit')({
    // Tipamos explícitamente el valor de retorno del loader
    loader: async ({ params }): Promise<EditLoaderData> => {
        // Carga en paralelo: Zapatilla, Marcas, Categorías
        const [sneakerData, brandOptions, categoryOptions] = await Promise.all([
            fetchSneakerById(params.sneakerId), 
            fetchAllBrands(),
            fetchAllCategories(),
        ]);
        
        // Retornamos el objeto tipado
        return { sneakerData, brandOptions, categoryOptions };
    },
    
    // 3. ESTADOS Y COMPONENTES REQUERIDOS
    component: SneakerFormEditPage, 

    errorComponent: ({ error }) => (
        <div className="text-red-600 p-6 bg-red-50 rounded-lg max-w-xl mx-auto mt-10 shadow-md">
            <h2 className="font-bold text-xl">❌ Error al cargar la zapatilla</h2>
            <p className="mt-2">Detalles: {error.message || 'Error de conexión o ID desconocido.'}</p>
            <p className="mt-4 text-sm text-red-500">Verifica si el ID es correcto o si el servicio de API está caído.</p>
        </div>
    ),
    
    pendingComponent: () => (
        <div className="p-12 text-center text-amber-700 font-medium">
            ⏳ Cargando datos de la zapatilla y opciones de formulario...
        </div>
    )
});

// ----------------------------------------------------
// 4. COMPONENTE PRINCIPAL (DONDE OCURRE EL ERROR)
// ----------------------------------------------------

function SneakerFormEditPage() {

    const { sneakerData, brandOptions, categoryOptions } = Route.useLoaderData();

    return (
        <SneakerForm
            isEdit={true}
            initialData={sneakerData}
            brandOptions={brandOptions}
            categoryOptions={categoryOptions}
        />
    );
}