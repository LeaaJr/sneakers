// src/sections/trending/TrendingSection.tsx
import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ProductCard } from './CardTrending';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingProducts, type TrendingProduct } from '@/services/sneakerService';

export function TrendingSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // 1. Usar useQuery para cargar los datos del backend
    const { 
        data: products, 
        isLoading, 
        error 
    } = useQuery<TrendingProduct[], Error>({
        queryKey: ['trendingProducts'],
        queryFn: fetchTrendingProducts,
    });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (isLoading) return <div className="text-center py-8">Cargando tendencias...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error al cargar tendencias: {error.message}</div>;
    if (!products || products.length === 0) return null; // No mostrar la sección si no hay datos


  return (
        <div className="w-full px-6 py-12 md:px-12 lg:px-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    I trend del momento
                </h2>
                {/* Botones de navegación, solo si hay más de 1 producto (opcional) */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Previous"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Next"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {/* 2. Mapear los datos reales */}
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}