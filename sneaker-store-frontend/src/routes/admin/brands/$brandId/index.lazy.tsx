import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchAllBrands, type Brand } from '@/services/sneakerService'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createLazyFileRoute('/admin/brands/$brandId/')({
  component: BrandsList,
})

function BrandsList() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllBrands()
      .then(setBrands)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-10 text-center">Cargando marcas...</div>

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
              <img src={brand.logo_url} alt={brand.name} className="w-12 h-12 object-contain" />
              <span className="font-medium">{brand.name}</span>
            </div>
            <div className="flex space-x-2">
              <Link to="/admin/brands/$brandId/edit" params={{ brandId: brand.id }}>
                <Button variant="outline" size="icon"><Edit className="w-4 h-4" /></Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}