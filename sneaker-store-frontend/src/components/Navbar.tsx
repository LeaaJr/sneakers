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

// Importes para el menú móvil (asegúrate de tener este componente de shadcn instalado)
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
          
          {/* LEFT: Mobile Menu Trigger */}
          <div className="flex justify-start items-center">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className={cn("p-2 rounded-md", hoverBgClass)}>
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="text-left mb-4">Menu</SheetTitle>
                  <nav className="flex flex-col gap-4">
                    <Link to="/" className="text-lg font-semibold border-b pb-2">Home</Link>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Shop</p>
                      <Link to="/all-products" className="pl-4 py-2 hover:bg-accent rounded-md">All Sneakers</Link>
                      <Link to="/" search={{ scrollTo: 'trending' }} className="pl-4 py-2 hover:bg-accent rounded-md">Trending</Link>
                      <Link to="/" search={{ scrollTo: 'categories' }} className="pl-4 py-2 hover:bg-accent rounded-md">Categories</Link>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Account</p>
                      {isLoggedIn ? (
                        <>
                          <Link to="/my-orders" className="flex items-center pl-4 py-2 hover:bg-accent rounded-md">
                            <Package className="h-4 w-4 mr-2" /> My Orders
                          </Link>
                          <Link to="/user-config" className="flex items-center pl-4 py-2 hover:bg-accent rounded-md">
                            <User className="h-4 w-4 mr-2" /> Settings
                          </Link>
                          <button onClick={logout} className="flex items-center pl-4 py-2 text-red-500 hover:bg-red-50 rounded-md">
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out
                          </button>
                          <Link 
                                to="/auth" 
                                search={{ mode: 'signin' }} 
                                className="pl-4 py-2 hover:bg-accent rounded-md flex items-center"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/auth" 
                                search={{ mode: 'signup' }} 
                                className="pl-4 py-2 hover:bg-accent rounded-md flex items-center text-primary font-semibold"
                            >
                                Create Account (Sign Up)
                            </Link>
                        </>
                      ) : (
                        <Link to="/auth" search={{ mode: 'signin' }} className="pl-4 py-2 hover:bg-accent rounded-md">Sign In / Sign Up</Link>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* CENTER: Desktop Navigation (Hidden on mobile) */}
          <div className="hidden md:flex justify-center items-center space-x-4">
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
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover text-popover-foreground">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/all-products"
                        style={{ backgroundImage: "url('https://i.pinimg.com/736x/d2/28/57/d2285773cfa7ee6efc966782fc88a782.jpg')" }}
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-cover bg-center bg-no-repeat p-6 no-underline outline-none"
                      >
                        <p className="text-m leading-tight text-white text-center">All Sneakers</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem to="/" search={{ scrollTo: 'trending' }} title="Trending">Discover the popular sneakers.</ListItem>
                  <ListItem to="/" search={{ scrollTo: 'categories' }} title="Categories">Browse by style.</ListItem>
                  <ListItem to="/" search={{ scrollTo: 'jordan' }} title="Jordan Specials">Exclusive Jordan collection.</ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Desktop Auth */}
            {isLoggedIn ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-colors", hoverBgClass, textColorClass)}>
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || user?.email}
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
                    {user?.is_admin && (
                      <li className="border-t my-1 pt-2">
                        <NavigationMenuLink asChild>
                          <Link to="/admin/dashboard" className="flex items-center p-3 rounded-md hover:bg-accent font-bold text-primary">
                            <LayoutDashboard className="h-4 w-4 mr-2" /> Interface
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    )}
                    <li className="border-t mt-2 pt-2">
                      <button onClick={logout} className="flex items-center w-full p-3 rounded-md hover:bg-accent text-left">
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
                    Sign In
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </div>

          {/* RIGHT: Cart & Favorites (Always visible) */}
          <div className="flex justify-end items-center space-x-1 sm:space-x-3">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/favorites" className={cn(navigationMenuTriggerStyle(), "bg-transparent p-2 relative", hoverBgClass, textColorClass)}>
                  <Heart className="h-5 w-5" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <button
                onClick={toggleCart}
                className={cn(navigationMenuTriggerStyle(), "bg-transparent p-2 relative cursor-pointer", hoverBgClass, textColorClass)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full translate-x-1/2 -translate-y-1/2">
                    {totalItems}
                  </span>
                )}
              </button>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <ShoppingCartComponent open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}