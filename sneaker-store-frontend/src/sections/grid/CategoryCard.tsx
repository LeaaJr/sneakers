// src/components/cards/CategoryCard.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  cover_image: string;
  description?: string;
  isActive: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, slug, cover_image, description, isActive }) => {
    // Definimos una URL segura, usando cover_image si existe, o undefined si está vacía.
    const imageUrl = cover_image && cover_image.length > 0 ? cover_image : undefined; 
    
    return (
        <Link
            to="/category/$sport"
            params={{ sport: slug }}
            className="block h-full"
        >
            <div className={`rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col bg-white ${isActive ? '' : 'filter blur-sm'}`}>
                <div className="flex-grow overflow-hidden relative">
                    {/* SOLO renderizamos la imagen si tenemos una URL válida */}
                    {imageUrl ? (
                        <img
                            src={imageUrl} // Usamos la URL validada
                            alt={name}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                                // Fallback en caso de que la URL falle
                                e.currentTarget.src = 'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error';
                            }}
                        />
                    ) : (
                        // Renderizamos un placeholder si no hay imagen (o si es "")
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
                
        <div className="p-4 sm:p-6 text-center">
          <h3 className="text-xl font-bold mb-1 text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;