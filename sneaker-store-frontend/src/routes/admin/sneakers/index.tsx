// src/routes/admin/sneakers/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { fetchSneakers } from '@/services/sneakerService'

export const Route = createFileRoute('/admin/sneakers/')({
  loader: () => fetchSneakers(),
  // Esto le dice al router que el componente visual se cargará de forma perezosa
})