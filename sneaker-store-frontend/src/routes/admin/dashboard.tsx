import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return <Outlet />;
}