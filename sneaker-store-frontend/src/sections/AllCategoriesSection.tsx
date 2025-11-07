import React, { useEffect, useState } from 'react';
import CategoryCard from '../sections/grid/CategoryCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import '@/styles/swiper-custom.css';

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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

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
    return <div className="text-center py-16">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">Error: {error}</div>;
  }

  if (categories.length === 0) {
    return <div className="text-center py-16 text-gray-600">No hay categorías disponibles.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-500">Esplora le categorie</h2>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={false}
        slidesPerView={'auto'}
        slideToClickedSlide={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 80,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
       
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.id}>
           
            <CategoryCard
              id={category.id}
              name={category.name}
              slug={category.slug}
              cover_image={category.cover_image}
              description={category.description}
              isActive={index === activeSlideIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AllCategoriesSection;