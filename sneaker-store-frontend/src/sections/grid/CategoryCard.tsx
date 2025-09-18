// src/components/cards/CategoryCard.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  cover_image: string;
  description?: string;
  isActive: boolean; // Agrega la nueva prop isActive
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, slug, cover_image, description, isActive }) => {
  return (
    <Link
      to="/category/$sport"
      params={{ sport: slug }}
      className="block h-full"
    >
      <div className={`rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col bg-white ${isActive ? '' : 'filter blur-sm'}`}>
        <div className="flex-grow overflow-hidden relative">
          <img
            src={cover_image}
            alt={name}
            className="w-full h-full object-cover absolute inset-0"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error';
            }}
          />
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