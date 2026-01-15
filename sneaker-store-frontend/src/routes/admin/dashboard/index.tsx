// src/routes/admin/dashboard/index.tsx

import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { TrendingUp, Package, Tag, ShoppingBag, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingProducts } from '@/services/sneakerService';

// Registramos la ruta hija index
export const Route = createFileRoute('/admin/dashboard/')({
  component: AdminDashboardIndex,
});

// Reutilizamos tu componente StatCard
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

function AdminDashboardIndex() {
  // Consumimos los datos de tendencia desde tu service
  const { data: trending, isLoading, isError } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: fetchTrendingProducts,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      {/* SECCIÓN DE TENDENCIAS */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg shadow-md shadow-amber-200">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Trending Products Cards</h2>
              <p className="text-sm text-gray-500">Gestiona los productos destacados en la Home</p>
            </div>
          </div>

          {/* BOTÓN PARA CREAR NUEVA CARD */}
          <Link
            to="/admin/dashboard/create"
            className="flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-gray-200 text-sm font-bold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Trending Card
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-100 h-56 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
            <div className="p-10 text-center border-2 border-dashed rounded-2xl">
                <p className="text-red-500 font-medium">Error al conectar con la API de tendencias.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending?.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur shadow-sm px-2.5 py-1 rounded-lg text-[10px] font-black text-amber-600 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h4 className="font-bold text-gray-900 text-lg truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Card vacía decorativa para incitar a crear más */}
            {trending?.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed">
                    <p className="text-gray-400">No hay tendencias activas actualmente.</p>
                </div>
            )}
          </div>
        )}
      </section>

      {/* Actividad Reciente */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <p className="text-sm text-gray-600 font-medium">Sistema de tendencias sincronizado con éxito.</p>
          </div>
        </div>
      </div>
    </div>
  );
}