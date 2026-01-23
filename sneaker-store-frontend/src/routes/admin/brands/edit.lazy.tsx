import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import BrandForm from './BrandForm' // Verifica esta ruta de importación
import { fetchBrandById } from '@/services/sneakerService'

export const Route = createLazyFileRoute('/admin/brands/edit')({
  component: EditRouteComponent,
})

function EditRouteComponent() {
  // Obtenemos el ID desde la URL
  const { brandId } = Route.useParams()

  const { data: brand, isLoading, error } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => fetchBrandById(brandId),
  })

  if (isLoading) return <div className="p-10 text-center text-amber-600">Obteniendo información de la marca...</div>
  
  if (error || !brand) {
    return <div className="p-10 text-center text-red-500">No se pudo cargar la marca.</div>
  }

  return (
    <BrandForm 
      isEdit={true} 
      brandId={brandId} 
      initialData={{ 
        name: brand.name, 
        logo_url: brand.logo_url 
      }} 
    />
  )
}