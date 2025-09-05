// src/components/sections/AllCategoriesSection.tsx
import React, { useEffect, useState } from 'react';
import CategoryCard from '../sections/grid/CategoryCard';
import { Link } from '@tanstack/react-router';

interface Category {
  id: string;
  name: string;
  slug: string;
  cover_image: string;
  description: string;
}

const AllCategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/categories/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Failed to fetch categories. Please check your backend API.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Caricamento categorie...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">Error: {error}</div>;
  }
  
  if (categories.length === 0) {
    return <div className="text-center py-16 text-gray-600">Non ci sono categorie disponibili.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-10 text-center">Esplora le categorie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          // Usamos el componente CategoryCard modificado
          <CategoryCard 
            key={category.id} 
            id={category.id} 
            name={category.name} 
            slug={category.slug} 
            cover_image={category.cover_image} 
            description={category.description} 
          />
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesSection;