// src/routes/admin/categories/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { fetchAllCategories } from '@/services/sneakerService'

export const Route = createFileRoute('/admin/categories/')({
  loader: () => fetchAllCategories(),
})