// src/routes/admin/brands/$brandId/edit.lazy.tsx

import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import BrandForm from '../BrandForm'
import { fetchBrandById, type Brand } from '@/services/sneakerService'

export const Route = createLazyFileRoute('/admin/brands/$brandId/edit')({
  component: EditRouteComponent,
})

function EditRouteComponent() {
  const { brandId } = Route.useParams()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrandById(brandId)
      .then(data => {
        setBrand(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [brandId])

  if (loading) return <div className="p-10 text-center">Cargando datos de la marca...</div>
  if (!brand) return <div className="p-10 text-center text-red-500">No se encontró la marca.</div>

  return (
    <BrandForm 
      isEdit={true} 
      brandId={brandId} 
      initialData={{ name: brand.name, logo_url: brand.logo_url }} 
    />
  )
}