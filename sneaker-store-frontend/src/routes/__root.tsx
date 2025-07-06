// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NavigationMenuDemo } from '@/components/Navbar'; // Tu Navbar global

export const Route = createRootRoute({
  component: () => (
    <>
      {/* El Navbar se renderiza aquí para ser global en todas las páginas */}
      {/* Se le da 'fixed' para que flote sobre el contenido y 'z-50' para asegurar que esté encima */}
      <NavigationMenuDemo className="fixed top-0 left-0 right-0 z-50" />
      
      {/* El 'main' contendrá el contenido de la página. Le damos un 'padding-top'
          para que el contenido no quede oculto debajo del Navbar fijo.
          Asumimos que el Navbar tiene una altura de h-16 (64px). */}
      <main className="flex-grow pt-16"> 
        {/* El Outlet es donde se renderizará el contenido de la ruta hija actual */}
        <Outlet />
      </main>

      {/* Opcional: Un pie de página que se renderiza en todas las páginas */}
      {/* import { Footer } from '@/components/Footer'; */}
      {/* <Footer /> */}

      {/* Herramientas de desarrollo de TanStack Router (solo para desarrollo) */}
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  ),
});
