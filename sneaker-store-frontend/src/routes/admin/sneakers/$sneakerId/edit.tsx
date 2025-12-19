import { createFileRoute } from '@tanstack/react-router'
import { fetchSneakerById, fetchAllBrands, fetchAllCategories } from '@/services/sneakerService'

export const Route = createFileRoute('/admin/sneakers/$sneakerId/edit')({
  loader: async ({ params }) => {
    // El router NO mostrará la página hasta que esto termine
    const [sneakerData, brandOptions, categoryOptions] = await Promise.all([
      fetchSneakerById(params.sneakerId),
      fetchAllBrands(),
      fetchAllCategories(),
    ]);
    return { sneakerData, brandOptions, categoryOptions };
  },
})