import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/brands/$brandId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/brands/$brandId/edit"!</div>
}
