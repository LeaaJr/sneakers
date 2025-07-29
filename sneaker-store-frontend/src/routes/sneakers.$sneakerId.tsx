// src/routes/sneakers.$sneakerId.tsx
import { createFileRoute, notFound } from '@tanstack/react-router';
import { getSneakerById, type Sneaker } from '@/services/sneakerService';
import { ProductDetail } from '@/components/gallery/ProductDetail';
import * as React from 'react'; // Necesario si usas useState o useEffect dentro del componente.

// Define la ruta dinámica. El `$sneakerId` le dice a TanStack Router
// que esta parte de la URL es un parámetro.
export const Route = createFileRoute('/sneakers/$sneakerId')({
  // El `loader` es donde obtienes los datos para esta ruta.
  // Se ejecuta antes de renderizar el componente.
  loader: async ({ params }) => {
    // `params.sneakerId` contendrá el UUID de la URL.
    const sneaker = await getSneakerById(params.sneakerId);

    // Si la zapatilla no se encuentra (getSneakerById devuelve null),
    // lanzamos una excepción `notFound()` para que TanStack Router
    // muestre su página 404 configurada (o la genérica por defecto).
    if (!sneaker) {
      throw notFound();
    }
    return sneaker; // Devuelve la zapatilla encontrada
  },
  // El `component` es lo que se renderizará cuando esta ruta esté activa.
  component: SneakerDetailPage,
  // Opcional: `pendingComponent` se muestra mientras el loader está cargando.
  pendingComponent: () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <p className="text-lg text-gray-600">Cargando detalles de la zapatilla...</p>
    </div>
  ),
  // Opcional: `errorComponent` se muestra si el loader falla (ej. error de red, API).
  errorComponent: (error) => {
    // Si el error es específicamente un `notFound()` del loader,
    // puedes renderizar un mensaje diferente.
    if (error.error instanceof Error && error.error.message === 'Not Found') {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-lg text-red-600">¡Zapatilla no encontrada!</p>
            </div>
        );
    }
    // Para otros errores
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-600">Error al cargar la zapatilla: {error.error.message}</p>
      </div>
    );
  },
});

// El componente funcional que recibe los datos cargados por el loader.
function SneakerDetailPage() {
  // `useLoaderData()` te da acceso a los datos devueltos por el loader de esta ruta.
  const sneaker = Route.useLoaderData();

  // Renderiza tu componente ProductDetail con los datos de la zapatilla.
  return (
    <ProductDetail sneaker={sneaker} />
  );
}