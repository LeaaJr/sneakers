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
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
// Importaciones de iconos (Lucide)
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";


export function NavigationMenuDemo({ className }: { className?: string }) {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50); // Cambia a partir de 50px de scroll
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isProductPage = location.pathname.startsWith("/sneakers/")

    return (

        <NavigationMenu
            viewport={false}
            className={cn(
                "mx-auto max-w-7xl pt-5 transition-colors duration-300",
                isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white",
                className
            )}
        >
            <NavigationMenuList className="bg-transparent">
                {/* Home Link */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link
                            to="/"
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "bg-transparent hover:bg-black/10 transition-colors",
                                isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white"
                            )}
                        >
                            Home
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Shop Link (AJUSTADO PARA SCROLL) */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-black/10 transition-colors",
                        isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white"
                    )}
                    >Shop</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover text-popover-foreground">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    {/* Enlace: All Sneakers' */}
                                    <Link
                                        to="/all-products"
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">All Sneakers</div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Esplora l'intera collezione di sneaker
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            
                            {/* Enlace: Trend -> Scroll a 'trending' */}
                            <ListItem to="/" search={{ scrollTo: 'trending' }} title="Trend"> 
                                Scopri le sneakers alla moda.
                            </ListItem>
                            
                            {/* Enlace: Categories -> Scroll a 'categories' */}
                            <ListItem to="/" search={{ scrollTo: 'categories' }} title="Categories">
                                Cerca sport, stile e altro ancora.
                            </ListItem>
                            
                            {/* Enlace: On Sale (Asumimos que va a una página separada, si no, usaría 'cards' o 'jordan') */}
                            {/* <ListItem to="/shop/sale" title="On Sale">
                                Approfitta delle nostre offerte.
                            </ListItem> */}
                            
                            {/* Podrías añadir Jordan de esta manera: */}
                            <ListItem to="/" search={{ scrollTo: 'jordan' }} title="Jordan Specials">
                                L'esclusiva collezione Jordan.
                            </ListItem>

                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About Link (sin cambios) */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/about" className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-black/10 transition-colors",
                            isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white"
                        )}
                        >
                            About Us
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Contact Link (sin cambios) */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/contact" className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-black/10 transition-colors",
                            isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white"
                        )}
                        >
                            Contact
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Sign In Link (sin cambios) */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/signin" className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-black/10 transition-colors",
                            isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white"
                        )}
                        >
                            Sign In
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Sign Up Link (sin cambios) */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/signup" className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-black/10 transition-colors",
                            isProductPage || scrolled ? "bg-transparent text-black" : "bg-transparent text-white"
                        )}
                        >
                            Sign Up
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    );
}

// --- Componente ListItem Corregido ---
// Se ha añadido la propiedad 'search' al tipo y se ha desestructurado para pasarla al Link
const ListItem = React.forwardRef<
    React.ElementRef<typeof Link>,
    React.ComponentPropsWithoutRef<typeof Link> & { title: string, search?: object } // <-- AÑADIDO: 'search?: object'
>(({ className, title, children, to, search, ...props }, ref) => { // <-- AÑADIDO: 'search'
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
                    search={search} // <-- PASAMOS el objeto 'search' a TanStack Router
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