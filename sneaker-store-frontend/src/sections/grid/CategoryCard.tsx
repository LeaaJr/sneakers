// src/components/cards/CategoryCard.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

// La interfaz debe coincidir con los datos que vienen del backend
interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  cover_image: string; 
  description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, slug, cover_image, description }) => {
  return (
    <Link 
      to="/category/$sport" 
      params={{ sport: slug }}
      className="block"
    >
      <div className="rounded-lg overflow-hidden transition-transform hover:shadow-xl cursor-pointer">
        <div className="h-96 overflow-hidden">
          <img
            src={cover_image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error';
            }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">{name}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;