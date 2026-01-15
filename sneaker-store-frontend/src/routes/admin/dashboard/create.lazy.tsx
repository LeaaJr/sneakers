import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Type } from 'lucide-react';
import { createTrendingProduct } from '@/services/sneakerService';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createLazyFileRoute('/admin/dashboard/create' as any)({
  component: CreateTrendingPage,
});

function CreateTrendingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    image: '',
    label: '',
    title: '',
    subtitle: '',
    sneaker_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTrendingProduct(formData);
      // 🔥 IMPORTANTE: Invalidamos la caché para que el dashboard se actualice solo
      await queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      
      alert('¡Card de tendencia creada correctamente!');
      navigate({ to: '/admin/dashboard' });
    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear la card. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate({ to: '/admin/dashboard' })}
        className="flex items-center text-gray-500 hover:text-amber-600 mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-amber-500 p-6">
          <h2 className="text-xl font-bold text-white">Configurar Nueva Tendencia</h2>
          <p className="text-amber-100 text-sm">Esta card aparecerá en la sección principal de la App.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* URL de Imagen */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <ImageIcon className="h-4 w-4 mr-2 text-amber-500" /> URL de la Imagen
            </label>
            <input
              type="url" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="https://static.nike.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Label */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Type className="h-4 w-4 mr-2 text-amber-500" /> Etiqueta (Label)
              </label>
              <input
                type="text" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Ej: Novità o New"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

            {/* Sneaker ID */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <LinkIcon className="h-4 w-4 mr-2 text-amber-500" /> ID del Producto
              </label>
              <input
                type="text" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="UUID de la sneaker"
                value={formData.sneaker_id}
                onChange={(e) => setFormData({ ...formData, sneaker_id: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Título</label>
              <input
                type="text" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Ej: Nike Shox Z"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subtítulo (Acción)</label>
              <input
                type="text" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Ej: Acquista o Ver más"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center disabled:bg-gray-400 shadow-lg shadow-gray-200"
          >
            {loading ? (
              <span className="animate-pulse">Guardando cambios...</span>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" /> Guardar Tendencia
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}