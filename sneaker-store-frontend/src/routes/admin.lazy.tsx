import React from 'react';
import { createLazyFileRoute, Outlet, Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, ShoppingBag, Box, Tag, Package, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingProducts } from '@/services/sneakerService'; // Ajusta la ruta según tu proyecto

// --- COMPONENTE DE TENDENCIAS ---
const TrendingGrid = () => {
    const { data: trending, isLoading, isError } = useQuery({
        queryKey: ['trendingProducts'], 
        queryFn: fetchTrendingProducts,
    });

    if (isLoading) return <div className="p-4 text-gray-500 animate-pulse">Cargando tendencias...</div>;
    if (isError) return <div className="p-4 text-red-500">Error al cargar tendencias.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {trending?.map((item) => (
                <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-3">
                        <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            {item.label}
                        </span>
                        <h4 className="font-semibold text-gray-800 mt-2 truncate">{item.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- SIDEBAR ---
const AdminSidebar: React.FC = () => {
    const adminLinks = [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/admin/sneakers", label: "Sneakers", icon: ShoppingBag },
        { to: "/admin/categories", label: "Categories", icon: Box },
        { to: "/admin/brands", label: "Brands", icon: Tag },
        { to: "/admin/orders", label: "Orders", icon: Package },
    ];

    return (
        <nav className="w-64 bg-gray-900 h-full text-white fixed top-0 left-0 pt-16 z-10">
            <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold uppercase text-gray-400 mb-4 px-3">Management</h3>
                {adminLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        {...(link.end && { activeOptions: { exact: true } })} 
                        className="flex items-center p-3 rounded-lg transition-all 
                                   hover:bg-gray-800 hover:text-amber-400
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

// --- LAYOUT PRINCIPAL ---
const AdminLayout: React.FC = () => {
    const location = useLocation();
    
    // Verificamos si estamos exactamente en "/admin" para mostrar el resumen
    const isDashboardHome = location.pathname === '/admin';

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            
            <main className="flex-1 ml-64 p-8 pt-20">
                {isDashboardHome && (
                    <>
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Bienvenido al Panel de Control</h1>
                            <p className="text-gray-500">Aquí tienes un resumen de lo que está pasando en tu tienda.</p>
                        </header>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-semibold text-gray-800">Tendencias Actuales</h2>
                        </div>
                        
                        <TrendingGrid />

                        <hr className="my-8 border-gray-200" />
                    </>
                )}

                <Outlet /> 
            </main>
        </div>
    );
};

export const Route = createLazyFileRoute('/admin')({
    component: AdminLayout,
});