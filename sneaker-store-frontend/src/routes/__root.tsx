// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NavigationMenuDemo } from '@/components/Navbar'; // Importa tu componente de navegación

export const Route = createRootRoute({
  component: () => (
    <>
      {/* Tu barra de navegación se renderiza aquí */}
      <NavigationMenuDemo />
      <hr className="my-4" /> {/* Una línea separadora simple, puedes estilizarla con Tailwind */}
      {/* El Outlet es donde se renderizarán los componentes de las rutas hijas */}
      <Outlet />
      {/* Herramientas de desarrollo de TanStack Router (opcional, solo para desarrollo) */}
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  ),
});
