// src/components/NavigationMenuDemo.tsx
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import ShoppingCartComponent from '@/components/ShoppingCart';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, User, LogOut, Package, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/hooks/useAuth";

interface NavigationMenuDemoProps {
  className?: string;
  defaultWhite?: boolean;
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string, search?: object, isBlackText?: boolean }
>(({ className, title, children, to, search, isBlackText, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            // Ajustamos el hover según el tema del navbar
            isBlackText
              ? "hover:bg-black/5 hover:text-black"
              : "hover:bg-white/10 hover:text-white",
            className
          )}
          to={to}
          search={search}
          {...props}
        >
          {/* Color del título dinámico */}
          <div className={cn("text-sm font-medium leading-none", isBlackText ? "text-black" : "text-white")}>
            {title}
          </div>
          <p className={cn(
            "line-clamp-2 text-sm leading-snug",
            isBlackText ? "text-black/60" : "text-white/60"
          )}>
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
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

  const toggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      {/* CONTENEDOR PRINCIPAL CON FLEXBOX */}
      <div className={cn(
        "mx-auto max-w-7xl pt-5 transition-colors duration-300",
        textColorClass,
        className
      )}>
        <div className="w-full flex items-center justify-between px-4">

          {/* LEFT: Mobile Menu Trigger - SOLO VISIBLE EN MÓVIL */}
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className={cn("p-2 rounded-md transition-colors", hoverBgClass)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetTitle className="text-left mb-4 font-bold">Menu</SheetTitle>
                <nav className="flex flex-col gap-4">
                  <Link to="/" className="text-lg font-semibold border-b pb-2 hover:text-primary transition-colors">
                    Home
                  </Link>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Shop</p>
                    <Link to="/all-products" className="pl-4 py-2 hover:bg-accent rounded-md transition-colors">
                      All Sneakers
                    </Link>
                    <Link to="/" search={{ scrollTo: 'trending' }} className="pl-4 py-2 hover:bg-accent rounded-md transition-colors">
                      Trending
                    </Link>
                    <Link to="/" search={{ scrollTo: 'categories' }} className="pl-4 py-2 hover:bg-accent rounded-md transition-colors">
                      Categories
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Account</p>
                    {isLoggedIn ? (
                      <>
                        <Link to="/my-orders" className="flex items-center pl-4 py-2 hover:bg-accent rounded-md transition-colors">
                          <Package className="h-4 w-4 mr-2" /> My Orders
                        </Link>
                        <Link to="/user-config" className="flex items-center pl-4 py-2 hover:bg-accent rounded-md transition-colors">
                          <User className="h-4 w-4 mr-2" /> Settings
                        </Link>
                        {user?.is_admin && (
                          <Link to="/admin/dashboard" className="flex items-center pl-4 py-2 hover:bg-accent rounded-md transition-colors text-primary font-semibold">
                            <LayoutDashboard className="h-4 w-4 mr-2" /> Admin Panel
                          </Link>
                        )}
                        <button onClick={logout} className="flex items-center pl-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors text-left">
                          <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/auth"
                          search={{ mode: 'signin' }}
                          className="pl-4 py-2 hover:bg-accent rounded-md flex items-center transition-colors"
                        >
                          Registrazione
                        </Link>
                        <Link
                          to="/auth"
                          search={{ mode: 'signup' }}
                          className="pl-4 py-2 hover:bg-accent rounded-md flex items-center text-primary font-semibold transition-colors"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* LEFT SPACER - Para mantener el centro en desktop cuando no hay menú móvil */}
          <div className="hidden lg:block w-[48px]"></div>

          {/* CENTER: Desktop Navigation - VISIBLE DESDE TABLET/DESKTOP */}
          <NavigationMenu viewport={false} className="hidden lg:flex flex-1 justify-center">
            <NavigationMenuList className="flex items-center space-x-4">
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

              <NavigationMenuItem>

                <NavigationMenuTrigger
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}
                >
                  Shop
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className={cn(
                    "grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] rounded-xl transition-all duration-300",
                    "backdrop-blur-md border",
                    isBlackText
                      ? "bg-white/80 border-black/10 shadow-xl text-black"
                      : "bg-black/20 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white"
                  )}>
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/all-products"
                          style={{ backgroundImage: "url('https://i.pinimg.com/736x/d2/28/57/d2285773cfa7ee6efc966782fc88a782.jpg')" }}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-cover bg-center bg-no-repeat p-6 no-underline outline-none focus:shadow-md"
                        >
                          <p className="text-m leading-tight text-white text-center font-semibold">All Sneakers</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem to="/" search={{ scrollTo: 'trending' }} title="Trending" isBlackText={isBlackText}>
                      Scopri le sneaker più amate
                    </ListItem>
                    <ListItem to="/" search={{ scrollTo: 'categories' }} title="Categories" isBlackText={isBlackText}>
                      Sfoglia per stile
                    </ListItem>
                    <ListItem to="/" search={{ scrollTo: 'jordan' }} title="Jordan Specials" isBlackText={isBlackText}>
                      Collezione esclusiva Jordan
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Desktop Auth */}
              {isLoggedIn ? (
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}>
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden xl:inline">{user?.name || user?.email}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[200px] p-2 bg-popover text-popover-foreground">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/my-orders" className="flex items-center p-3 rounded-md hover:bg-accent transition-colors">
                            <Package className="h-4 w-4 mr-2" /> My Orders
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/user-config" className="flex items-center p-3 rounded-md hover:bg-accent transition-colors">
                            <User className="h-4 w-4 mr-2" /> Settings
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {user?.is_admin && (
                        <li className="border-t my-1 pt-2">
                          <NavigationMenuLink asChild>
                            <Link to="/admin/dashboard" className="flex items-center p-3 rounded-md hover:bg-accent font-bold text-primary">
                              <LayoutDashboard className="h-4 w-4 mr-2" /> Admin Panel
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )}
                      <li className="border-t mt-2 pt-2">
                        <button onClick={logout} className="flex items-center w-full p-3 rounded-md hover:bg-accent text-left text-red-500">
                          <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/auth" search={{ mode: 'signin' }} className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}>
                      Registrazione
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* RIGHT: Cart & Favorites - SIEMPRE VISIBLE */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/favorites"
              className={cn(
                "p-2 rounded-md relative transition-colors inline-flex items-center justify-center",
                hoverBgClass,
                textColorClass
              )}
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>

            <button
              onClick={toggleCart}
              className={cn(
                "p-2 rounded-md relative transition-colors inline-flex items-center justify-center",
                hoverBgClass,
                textColorClass
              )}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#c91616] rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      <ShoppingCartComponent open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}