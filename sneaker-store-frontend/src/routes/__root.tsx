// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NavigationMenuDemo } from '@/components/Navbar'; // Tu Navbar global

export const Route = createRootRoute({
  component: () => (
    <>

      <NavigationMenuDemo className="fixed top-0 left-0 right-0 z-50" />
      
      <main className="flex-grow pt-16"> 
        <Outlet />
      </main>
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  ),
});