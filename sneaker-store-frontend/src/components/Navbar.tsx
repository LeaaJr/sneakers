// src/components/NavigationMenuDemo.tsx
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";

import ShoppingCartComponent from '@/components/ShoppingCart';
import { useCart } from '@/context/CartContext';

// Iconos (Lucide)
import { ShoppingCart, Heart, User, LogOut, Package, LayoutDashboard } from "lucide-react"; // Importamos LayoutDashboard
import { useAuth } from "@/components/hooks/useAuth";

interface NavigationMenuDemoProps {
  className?: string;
  defaultWhite?: boolean;
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string, search?: object }
>(({ className, title, children, to, search, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          to={to}
          search={search}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function NavigationMenuDemo({ className, defaultWhite = false }: NavigationMenuDemoProps) {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  // NUEVO ESTADO: Controla la apertura/cierre del modal del carrito
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart(); // Obtiene los ítems del carrito
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isProductPage = location.pathname.startsWith("/sneakers/");
  const isBlackText = isProductPage || (defaultWhite ? scrolled : true);
  const textColorClass = isBlackText ? "text-black" : "text-white";
  const hoverBgClass = isBlackText ? "hover:bg-black/10" : "hover:bg-white/10";

  // Función para abrir/cerrar el carrito
  const toggleCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita la navegación si el Link está activo
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
    <NavigationMenu
      viewport={false}
      className={cn(
        "mx-auto max-w-7xl pt-5 transition-colors duration-300",
        "bg-transparent",
        textColorClass,
        className
      )}
    >
      <NavigationMenuList className="w-full grid grid-cols-3 items-center px-4">

        {/* LEFT: Empty (optional logo or placeholder) */}
        <div className="flex justify-start items-center" />

        {/* CENTER: Navigation + Auth */}
        <div className="flex justify-center items-center space-x-4">
          {/* Home */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/"
                className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Shop */}
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}
            >
              Shop
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover text-popover-foreground">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                    to="/all-products"
                    style={{ backgroundImage: "url('https://i.pinimg.com/736x/d2/28/57/d2285773cfa7ee6efc966782fc88a782.jpg')" }}
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-cover bg-center bg-no-repeat from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    >
                    {/* <div className="mb-2 mt-4 text-lg font-medium">All Sneakers</div> */}
                    <p className="text-m leading-tight text-white text-center">
                        All Sneakers
                    </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem to="/" search={{ scrollTo: 'trending' }} title="Trending">
                  Discover the most popular sneakers.
                </ListItem>
                <ListItem to="/" search={{ scrollTo: 'categories' }} title="Categories">
                  Browse by sport, style, and more.
                </ListItem>
                <ListItem to="/" search={{ scrollTo: 'jordan' }} title="Jordan Specials">
                  The exclusive Jordan collection.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Auth */}
          {isLoggedIn ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}
              >
                <User className="h-4 w-4 mr-2" />
                {user?.name || user?.email}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[200px] p-2 bg-popover text-popover-foreground">
                  {/* 1. Mis Pedidos/Compras */}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/my-orders"
                        className="flex items-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        My Orders
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  {/* 2. Configuración de Usuario */}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/user-config" // Nueva ruta para la configuración
                        className="flex items-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Configure User
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  {/* 3. Panel de Administración (CONDICIONAL) 🚀 */}
                  {user?.is_admin && (
                    <li className="border-t my-1 pt-2">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/dashboard" // Asume esta ruta para la interfaz de admin
                          className="flex items-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left cursor-pointer font-bold text-primary" // Se ve más destacado
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Interface
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  )}

                  {/* 4. Cerrar Sesión (Ahora es el último elemento) */}
                  <li className={cn({"border-t mt-2 pt-2": !user?.is_admin})}> 
                    <NavigationMenuLink asChild>
                      <button
                        onClick={logout}
                        className="flex items-center w-full p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/auth"
                    search={{ mode: 'signin' }}
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors flex items-center", hoverBgClass, textColorClass)}
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden lg:block">
                <NavigationMenuLink asChild>
                  <Link
                    to="/auth"
                    search={{ mode: 'signup' }}
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}
                  >
                    Sign Up
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
        </div>

        {/* RIGHT: Cart & Favorites */}
          <div className="flex justify-end items-center space-x-3">
            {/* Favorites (No cambia) */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/favorites"
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent p-2 relative", hoverBgClass, textColorClass)}
                >
                  <Heart className="h-5 w-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Shopping Cart Icon */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button
                  onClick={toggleCart} // Usa el handler para abrir/cerrar
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent p-2 relative cursor-pointer", hoverBgClass, textColorClass)}
                  aria-label="View shopping cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {/* Badge de contador de ítems */}
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* COMPONENTE ShoppingCart (Modal) */}
      <ShoppingCartComponent 
        open={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
  </>
  )
};