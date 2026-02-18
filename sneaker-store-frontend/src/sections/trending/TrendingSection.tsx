// src/sections/trending/TrendingSection.tsx
import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ProductCard } from './CardTrending';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingProducts, type TrendingProduct } from '@/services/sneakerService';
import { motion, useAnimationControls } from 'framer-motion';

export function TrendingSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();
    const [scrollPosition, setScrollPosition] = React.useState(0);
    
    // 1. Usar useQuery para cargar los datos del backend
    const { 
        data: products, 
        isLoading, 
        error 
    } = useQuery<TrendingProduct[], Error>({
        queryKey: ['trendingProducts'],
        queryFn: fetchTrendingProducts,
    });

  

const scroll = async (direction: 'left' | 'right') => {
        if (scrollContainerRef.current && products) {
            const container = scrollContainerRef.current;
            const cardWidth = container.firstElementChild?.clientWidth || 0;
            const gap = 16;
            const scrollAmount = cardWidth + gap;
            
            // Calcular los límites
            const maxScroll = (products.length * (cardWidth + gap)) - container.parentElement!.clientWidth;
            const minScroll = 0;
            
            // Calcular nueva posición
            let newPosition = direction === 'left' 
                ? scrollPosition - scrollAmount 
                : scrollPosition + scrollAmount;
            
            // Limitar la posición dentro de los límites
            newPosition = Math.max(minScroll, Math.min(newPosition, maxScroll));
            
            
            // Solo animar si la posición cambió
            if (newPosition !== scrollPosition) {
                setScrollPosition(newPosition);
                
                await controls.start({
                    x: -newPosition,
                    transition: { 
                        duration: 0.6, 
                        ease: [0.25, 0.1, 0.25, 1]
                    }
                });
            }
        }
    };

  if (isLoading) return <div className="text-center py-8">Caricamento tendenze in corso...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Errore durante il caricamento delle tendenze: {error.message}</div>;
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
            <div className="overflow-hidden">
      <motion.div
        ref={scrollContainerRef}
        animate={controls}
        className="flex gap-4"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
        </div>
    );
}