//src/sections/trending/CardTrending.tsx
import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { Route as SneakerDetailRoute } from '@/routes/sneakers.$sneakerId';

interface ProductCardProps {
  product: {
    id: number;
    image: string;
    label: string;
    title: string;
    subtitle: string;
    sneaker_id: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter(); // ✅ Hook debe estar dentro del componente

  const imageUrl = product.image && product.image.length > 0 ? product.image : null;

  const handleClick = () => {
    if (product.sneaker_id) {
      router.navigate({
        to: SneakerDetailRoute.to,
        params: { sneakerId: product.sneaker_id },
      });
    }
  };

  
    return (
        <div className="flex-shrink-0 w-[340px] md:w-[450px] group cursor-pointer"
        onClick={handleClick}
        >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                {imageUrl ? (
                    <img
                        src={imageUrl} // Usar la URL validada
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/450x600/CCCCCC/333333?text=Image+Missing'; }}
                    />
                ) : (
                    <div className="w-full h-full object-cover bg-gray-300 flex items-center justify-center text-gray-700">
                        No Image
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                    <span className="text-white text-sm font-medium">
                        {product.label}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-semibold mb-3">
                        {product.title}
                    </h3>
                    <button className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors"
                      onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                                  }}
                                >
                        {product.subtitle}
                    </button>
                </div>
            </div>
        </div>
    )
}