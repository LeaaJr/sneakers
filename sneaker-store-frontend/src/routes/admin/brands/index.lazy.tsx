import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllBrands, deleteBrand } from '@/services/sneakerService'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createLazyFileRoute('/admin/brands/')({
  component: BrandsList,
})

function BrandsList() {
  const queryClient = useQueryClient()

  // 1. Fetch de datos con TanStack Query
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchAllBrands,
  })

  // 2. Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      alert('Marca eliminada correctamente')
    },
    onError: () => alert('Error al eliminar. Verifique si hay zapatillas asociadas.')
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar ${name}?`)) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <div className="p-10 text-center">Cargando marcas...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Marcas</h1>
        <Link to="/admin/brands/create">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" /> Nueva Marca
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between border">
            <div className="flex items-center space-x-4">
              <img src={brand.logo_url} alt={brand.name} className="w-12 h-12 object-contain bg-gray-50 p-1 rounded" />
              <span className="font-medium text-gray-700">{brand.name}</span>
            </div>
            <div className="flex space-x-2">
              <Link to="/admin/brands/$brandId/edit" params={{ brandId: brand.id }}>
                <Button variant="outline" size="icon"><Edit className="w-4 h-4" /></Button>
              </Link>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => handleDelete(brand.id, brand.name)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}