// src/routes/admin.lazy.tsx

import React from 'react';
import { createLazyFileRoute, Outlet, Link } from '@tanstack/react-router';
import { LayoutDashboard, ShoppingBag, Box, Tag, Users, Package } from 'lucide-react';
// Asegúrate de tener un hook de autenticación/autorización
// import { useAuth } from '@/components/hooks/useAuth'; 

// Componente Sidebar para la navegación dentro del admin
const AdminSidebar: React.FC = () => {
    const adminLinks = [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/admin/sneakers", label: "Sneakers", icon: ShoppingBag },
        { to: "/admin/categories", label: "Categories", icon: Box },
        { to: "/admin/brands", label: "Brands", icon: Tag },
        { to: "/admin/orders", label: "Orders", icon: Package },
        // { to: "/admin/users", label: "Users", icon: Users }, // Si manejas usuarios
    ];

    return (
        <nav className="w-64 bg-gray-900 h-full text-white fixed top-0 left-0 pt-16">
            <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold uppercase text-gray-400 mb-4">Management</h3>
                {adminLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        // 'end: true' asegura que solo se active en la ruta exacta /admin
                        {...(link.end && { activeOptions: { exact: true } })} 
                        className="flex items-center p-3 rounded-lg transition-colors 
                                   hover:bg-amber-600 hover:text-white
                                   data-[status=active]:bg-amber-500 data-[status=active]:text-white"
                    >
                        <link.icon className="h-4 w-4 mr-3" />
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

// Componente principal del Layout
const AdminLayout: React.FC = () => {
    // const { user } = useAuth();

    // if (!user || !user.is_admin) {
    //     // Redirigir o mostrar un mensaje de acceso denegado
    //     return <p className="p-20 text-center text-red-500">Access Denied.</p>;
    // }

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            
            {/* Contenido principal: El padding izquierdo coincide con el ancho del sidebar */}
            <main className="flex-1 ml-64 p-8 pt-20 overflow-y-auto">
                <Outlet /> {/* Aquí se renderizarán las rutas hijas (/admin/sneakers, etc.) */}
            </main>
        </div>
    );
};

export const Route = createLazyFileRoute('/admin')({
    component: AdminLayout,
});