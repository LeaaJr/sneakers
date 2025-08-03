import { createFileRoute, useLoaderData, notFound } from '@tanstack/react-router';
import { fetchSneakersBySport } from '../services/sneakerService';
import { SneakersGrid } from '../components/SneakersGrid';

export const Route = createFileRoute('/category/$sport')({
  loader: async ({ params }) => {
    try {
      const sneakers = await fetchSneakersBySport(params.sport);
      if (!sneakers || sneakers.length === 0) {
        throw notFound();
      }
      return sneakers;
    } catch (error) {
      console.error('Error loading sneakers:', error);
      throw notFound();
    }
  },
  errorComponent: ({ error }) => (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-2xl font-bold text-red-600">
        {error instanceof Error ? error.message : 'Error al cargar las zapatillas'}
      </h1>
    </div>
  ),
  pendingComponent: () => (
    <div className="container mx-auto py-16 text-center">
      <p>Cargando zapatillas...</p>
    </div>
  ),
  component: SneakersPage,
});

function SneakersPage() {
  const sneakers = useLoaderData({ from: Route.to }); // Cambio clave aquí
  const { sport } = Route.useParams();

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8 text-center capitalize">
        Zapatillas de {sport}
      </h1>
      <SneakersGrid sneakers={sneakers} />
    </div>
  );
}