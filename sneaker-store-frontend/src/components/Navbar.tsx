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

// Si usas iconos, asegúrate de tener lucide-react instalado: npm install lucide-react
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

const components: { title: string; to: string; description: string }[] = [
  {
    title: "Alert Dialog",
    to: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    to: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    to: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    to: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    to: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    to: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
  
];


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


  return (
    // Navbar con fondo transparente y texto blanco para que se "sumerja" en el Header
    // cuando esté presente, y se vea bien sobre otros fondos.
    <NavigationMenu
      viewport={false}
      className={cn(
        "mx-auto max-w-7xl pt-5 transition-colors duration-300",
        scrolled ? "bg-transparent text-black" : "bg-transparent text-black",
        className
      )}
    >
      <NavigationMenuList className="bg-transparent"> {/* Asegura que la lista también sea transparente */}
        {/* Home Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-black/10 transition-colors",
                scrolled ? "text-black hover:text-black" : "text-white hover:text-white"
              )}
            >
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Shop Link (con dropdown si es necesario) */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-black/10 transition-colors",
                scrolled ? "text-black hover:text-black" : "text-white hover:text-white"
              )}
            >Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover text-popover-foreground"> {/* El contenido del dropdown mantiene su fondo predeterminado */}
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/shop"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Sneaker Store
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Explora nuestra vasta colección de sneakers.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem to="/shop/brands" title="Brands">
                Descubre sneakers por tus marcas favoritas.
              </ListItem>
              <ListItem to="/shop/categories" title="Categories">
                Navega por deporte, estilo y más.
              </ListItem>
              <ListItem to="/shop/sale" title="On Sale">
                Aprovecha nuestras ofertas.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* About Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/about" className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-black/10 transition-colors",
                scrolled ? "text-black hover:text-black" : "text-white hover:text-white"
              )}
            >
              About Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Contact Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/contact" className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-black/10 transition-colors",
                scrolled ? "text-black hover:text-black" : "text-white hover:text-white"
              )}
            >
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Sign In Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/signin" className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-black/10 transition-colors",
                scrolled ? "text-black hover:text-black" : "text-white hover:text-white"
              )}
            >
              Sign In
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Sign Up Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/signup" className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-black/10 transition-colors",
                scrolled ? "text-black hover:text-black" : "text-white hover:text-white"
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

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, to, ...props }, ref) => {
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