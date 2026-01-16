// sneaker-store-frontend/src/routes/admin/dashboard/index.tsx

import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { TrendingUp, Package, Tag, ShoppingBag, Plus, Trash2, Edit3 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrendingProducts, deleteTrendingProduct } from '@/services/sneakerService';

export const Route = createFileRoute('/admin/dashboard/')({
  component: AdminDashboardIndex,
});

// Componente StatCard (se mantiene igual)
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className="text-amber-500 bg-amber-50 p-3 rounded-full">{icon}</div>
  </div>
);

function AdminDashboardIndex() {
  const queryClient = useQueryClient();
  
  // 1. Obtener datos
  const { data: trending, isLoading } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: fetchTrendingProducts,
  });

  // 2. Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteTrendingProduct,
    onSuccess: () => {
      // Refresca la lista automáticamente
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      alert('Card eliminada correctamente');
    },
    onError: () => alert('Error al eliminar la card')
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tendencia?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231.89" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="New Orders" value="124" icon={<Package className="h-5 w-5" />} />
        <StatCard title="Products" value="350" icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Brands" value="15" icon={<Tag className="h-5 w-5" />} />
      </div>

      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg shadow-md shadow-amber-200">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Trending Products Cards</h2>
          </div>

          <Link
            to="/admin/dashboard/create"
            className="flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-all text-sm font-bold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Trending Card
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="bg-gray-100 h-56 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending?.map((item) => (
              <div key={item.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                
                {/* BOTONES DE ACCIÓN (Overlay) */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* CAMBIO: Botón Editar ahora es un Link con parámetro $id */}
                <Link 
                  to="/admin/dashboard/edit/$id"
                  params={{ id: item.id.toString() }}
                  className="p-2 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>

                {/* Botón Eliminar se mantiene igual con su handleDelete */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white text-red-600 rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

                <div className="h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black text-amber-600 uppercase">
                      {item.label}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h4 className="font-bold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}