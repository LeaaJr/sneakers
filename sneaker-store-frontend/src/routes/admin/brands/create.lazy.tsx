import { createLazyFileRoute } from '@tanstack/react-router'
import BrandForm from './BrandForm'

export const Route = createLazyFileRoute('/admin/brands/create')({
  component: CreateBrandPage,
})

function CreateBrandPage() {
  return (
    <BrandForm 
      isEdit={false} 
    />
  )
}