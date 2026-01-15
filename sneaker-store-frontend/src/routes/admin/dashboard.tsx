// src/routes/admin/dashboard.tsx

import React from 'react';
import { createFileRoute, Link, Outlet, useChildMatches } from '@tanstack/react-router'; // Añadimos Outlet y useChildMatches
import { TrendingUp, Package, Tag, ShoppingBag, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingProducts } from '@/services/sneakerService';

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardWrapper, // Cambiamos el componente principal
});

// Este componente decide qué mostrar
function DashboardWrapper() {
  const childMatches = useChildMatches();

  // Si hay hijos (ej. /create), renderiza el Outlet. 
  // Si no hay hijos (lenght === 0), renderiza tu Dashboard original.
  if (childMatches.length > 0) {
    return <Outlet />;
  }

  return <AdminDashboardPage />;
}

// Reutilizamos tu StatCard
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className="text-amber-500 bg-amber-50 p-3 rounded-full">
      {icon}
    </div>
  </div>
);

function AdminDashboardPage() {
  // Consumimos los datos de tendencia
  const { data: trending, isLoading } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: fetchTrendingProducts,
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231.89" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="New Orders" value="124" icon={<Package className="h-5 w-5" />} />
        <StatCard title="Products" value="350" icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Brands" value="15" icon={<Tag className="h-5 w-5" />} />
      </div>

      {/* SECCIÓN DE TENDENCIAS (Lo nuevo) */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Trending Products Cards</h2>
          </div>

          {/* EL BOTÓN QUE QUERÍAS */}
          <Link
            to="/admin/dashboard/create"
            className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all shadow-sm text-sm font-semibold"
            >
            <Plus className="h-4 w-4 mr-2" />
            New Trending Card
            </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="bg-gray-200 h-48 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending?.map((item) => (
              <div key={item.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
                <div className="relative h-40">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-amber-600 uppercase">
                      {item.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actividad Reciente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <p className="text-gray-600 text-sm">No hay acciones recientes para mostrar.</p>
      </div>
    </div>
  );
}