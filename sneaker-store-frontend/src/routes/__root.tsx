// src/routes/__root.tsx
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NavigationMenuDemo } from '@/components/Navbar'; 
import { AuthProvider } from '@/components/hooks/useAuth';

export const Route = createRootRoute({
  
  component: () => {
    const routerState = useRouterState();
    const isHomePage = routerState.location.pathname === '/'; 

    return (
        // 🔑 Envuelve todo en el AuthProvider
        <AuthProvider> 
            
            <NavigationMenuDemo 
                className="fixed top-0 left-0 right-0 z-50" 
                defaultWhite={isHomePage}
            />
            
            <main className="flex-grow pt-16"> 
                {/* El Outlet renderiza el componente de la ruta actual */}
                <Outlet />
            </main>
            <TanStackRouterDevtools initialIsOpen={false} />

        </AuthProvider>
    );
  },
});