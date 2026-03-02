// src/routes/admin/brands/$brandId/edit.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import BrandForm from '../BrandForm'
import { fetchBrandById } from '@/services/sneakerService'

export const Route = createLazyFileRoute('/admin/brands/$brandId/edit')({
  component: EditRouteComponent,
})

function EditRouteComponent() {
  const { brandId } = Route.useParams() 

  const { data: brand, isLoading, error } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => {
        if (!brandId) throw new Error("ID no proporcionado");
        return fetchBrandById(brandId);
    },
    // Esto evita que intente pedir datos si el ID es nulo
    enabled: !!brandId, 
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