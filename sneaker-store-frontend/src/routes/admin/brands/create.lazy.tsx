import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/brands/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/brands/create"!</div>
}
