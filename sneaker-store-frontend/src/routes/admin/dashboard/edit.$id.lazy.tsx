import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrendingProducts, updateTrendingProduct } from '@/services/sneakerService';

export const Route = createLazyFileRoute('/admin/dashboard/edit/$id' as any)({
  component: EditTrendingPage,
});

function EditTrendingPage() {
  const { id } = useParams({ from: '/admin/dashboard/edit/$id' as any });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    image: '',
    label: '',
    title: '',
    subtitle: '',
    sneaker_id: ''
  });

  // 1. Obtener los datos actuales para llenar el formulario
  const { data: trendingList, isLoading: isFetching } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: fetchTrendingProducts,
  });

  useEffect(() => {
    if (trendingList) {
      const itemToEdit = trendingList.find((item: any) => item.id.toString() === id);
      if (itemToEdit) {
        setFormData({
          image: itemToEdit.image,
          label: itemToEdit.label,
          title: itemToEdit.title,
          subtitle: itemToEdit.subtitle,
          sneaker_id: itemToEdit.sneaker_id || '' // Asegúrate que tu API devuelva esto
        });
      }
    }
  }, [trendingList, id]);

  // 2. Mutación para actualizar
  const mutation = useMutation({
    mutationFn: (data: any) => updateTrendingProduct(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      alert('¡Card actualizada!');
      navigate({ to: '/admin/dashboard' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isFetching) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-amber-500" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate({ to: '/admin/dashboard' })} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-medium">
        <ArrowLeft className="h-4 w-4 mr-2" /> Volver
      </button>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold mb-6">Editar Tendencia #{id}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Imagen URL</label>
            <input 
              type="text" className="w-full p-3 bg-gray-50 border rounded-xl"
              value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Label</label>
              <input 
                type="text" className="w-full p-3 bg-gray-50 border rounded-xl"
                value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Sneaker ID</label>
              <input 
                type="text" className="w-full p-3 bg-gray-50 border rounded-xl"
                value={formData.sneaker_id} onChange={(e) => setFormData({...formData, sneaker_id: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Título</label>
            <input 
              type="text" className="w-full p-3 bg-gray-50 border rounded-xl"
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Subtítulo</label>
            <input 
              type="text" className="w-full p-3 bg-gray-50 border rounded-xl"
              value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={mutation.isPending}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center shadow-lg shadow-amber-100"
          >
            <Save className="h-5 w-5 mr-2" />
            {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}