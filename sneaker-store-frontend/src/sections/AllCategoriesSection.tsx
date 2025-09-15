import React, { useEffect, useState } from 'react';
import CategoryCard from '../sections/grid/CategoryCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

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
<div className="w-full max-w-7xl mx-auto px-4 py-16">
  <h2 className="text-4xl font-bold mb-10 text-center text-gray">Esplora le categorie</h2>

  <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing">
    {categories.map((category) => (
      <div key={category.id} className="snap-center shrink-0 w-[300px]">
        <CategoryCard
          id={category.id}
          name={category.name}
          slug={category.slug}
          cover_image={category.cover_image}
        />
      </div>
    ))}
  </div>
</div>
  );
};

export default AllCategoriesSection;
