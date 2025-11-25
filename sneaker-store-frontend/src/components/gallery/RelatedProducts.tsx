// RelatedProducts.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { type Sneaker, getRelatedProducts } from '@/services/sneakerService';
import { useNavigate } from '@tanstack/react-router';



interface ProductCardProps {
  product: Sneaker;
}
const ProductCardWithNavigation: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: '/sneakers/$sneakerId', params: { sneakerId: product.id } });
  };

  return (
    // 🚨 CAMBIO: Usamos un div con onClick en lugar de <a>
    <div 
      onClick={handleCardClick} 
      className="group block cursor-pointer text-center overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.main_image_url}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-opacity duration-300 group-hover:opacity-75"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm text-gray-700 font-medium truncate">{product.title}</h3>
        <p className="mt-1 text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};


interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string; 
  limit?: number; 
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  categorySlug, 
  currentProductId,
  limit = 6 
}) => {
  
const { data: relatedProducts, isLoading, isError } = useQuery<Sneaker[], Error>({
    queryKey: ['relatedProducts', categorySlug, currentProductId, limit], 
    queryFn: () => getRelatedProducts(categorySlug, currentProductId, limit),
    staleTime: 1000 * 60 * 5, 
    enabled: !!categorySlug, 
  });

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !relatedProducts || relatedProducts.length === 0) {
    return null; 
  }

return (
    <section className="py-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Altri modelli {relatedProducts[0]?.sport || "simili"}
      </h2>
      
      {/* Reducimos columnas a 4 para agrandar la card */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8">
        {relatedProducts.map((product) => (
          <ProductCardWithNavigation key={product.id} product={product} /> 
        ))}
      </div>
    </section>
  );
};