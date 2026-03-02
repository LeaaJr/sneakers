// src/routes/sneakers.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';


export const Route = createFileRoute('/sneakers')({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});