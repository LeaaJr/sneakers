// src/sections/running/RunningSection.tsx
import React from 'react';
import CardJordan from './CardJordan';
import { ArrowRightIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHighlightedSneakers, } from '@/services/sneakerService'; 
import type { RunningSectionDetail } from '@/services/sneakerService';
import { Link } from '@tanstack/react-router';

const RunningSection: React.FC = () => {
  // El tipo de los datos ahora es una lista de los detalles, no una lista de zapatillas
  const { 
    data: featuredDetails, // Cambiamos el nombre de la variable para que sea más claro
    isLoading, 
    error 
  } = useQuery<RunningSectionDetail[], Error>({ // El tipo del genérico también cambia
    queryKey: ['highlightedSneakers'],
    queryFn: fetchHighlightedSneakers, // Llamará a la función modificada
  });

  if (isLoading) return <div className="text-center py-8">Loading featured products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
  if (!featuredDetails || featuredDetails.length === 0) return <div className="text-center py-8">No featured products available</div>;

  // Ya no hay un `highlightedSneaker` que tenga `title` o `id`.
  // Si quieres un título general, lo puedes poner aquí, o usar el título del primer detalle.
  // Pero el título "Learn more..." y el `href` ya no tienen un sneakerId al que apuntar.
  // Por ahora, eliminémos esa parte o hagámosla estática.
  const mainTitle = "Air Jordan 1"; 
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {mainTitle} 
        </h2>
        {/* Este enlace ya no tiene a dónde ir sin un ID de zapatilla */}
        <Link to="/category/jordan" >                      
        <span className="inline-flex items-center text-[#8b95b6] hover:text-blue-800 font-medium cursor-pointer">
          Vedere più prodotti
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </span>
        </Link>
      </div>
      
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                {featuredDetails.map((feature) => (
                    <CardJordan
                        key={feature.id}
                        sneakerId={feature.sneaker_id} 
                        title={feature.title}
                        description={feature.description}
                        image={feature.image_url}
                    />
                ))}
            </div>
          </div>
  );
};

export default RunningSection;