// src/routes/__root.tsx
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
// Asegúrate de que este import apunte a tu componente modificado
import { NavigationMenuDemo } from '@/components/Navbar'; 


export const Route = createRootRoute({
  
  component: () => {
    const routerState = useRouterState();
    
    const isHomePage = routerState.location.pathname === '/'; 

    return (
        <>
            
            <NavigationMenuDemo 
                className="fixed top-0 left-0 right-0 z-50" 
                defaultWhite={isHomePage}
            />
            
            <main className="flex-grow pt-16"> 
                <Outlet />
            </main>
            <TanStackRouterDevtools initialIsOpen={false} />
        </>
    );
  },
});