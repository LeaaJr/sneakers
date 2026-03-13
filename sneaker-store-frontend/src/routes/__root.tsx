// src/routes/__root.tsx
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { NavigationMenuDemo } from '@/components/Navbar'; 
import { AuthProvider } from '@/components/hooks/useAuth';
import CartProvider from '@/context/CartContext';
import { ToastProvider } from '@/components/ui/use-toast';
import { FavoritesProvider } from '@/context/FavoritesContext';
import OrdersProvider from '@/context/OrdersContext';

export const Route = createRootRoute({
  
  component: () => {
    const routerState = useRouterState();
    const isHomePage = routerState.location.pathname === '/'; 

   return (
      <AuthProvider> 
        <ToastProvider> 
          <CartProvider>
            <OrdersProvider>
              <FavoritesProvider> 
                {/* Navbar fijo y transparente por defecto */}
                <NavigationMenuDemo 
                  className="fixed top-0 left-0 right-0 z-50" 
                  defaultWhite={isHomePage}
                />
                
                {/* QUITAMOS el pt-16 para que el contenido empiece desde el borde superior */}
                <main className="flex-grow"> 
                  <Outlet />
                </main>
              </FavoritesProvider>
            </OrdersProvider>
          </CartProvider>
        </ToastProvider>
        <TanStackRouterDevtools initialIsOpen={false} />
      </AuthProvider>
    );
  },
});