// src/components/Cards.tsx
import React from 'react';
import { Card as ShadcnCard, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import type { Sneaker } from '@/services/sneakerService';
import { useNavigate } from '@tanstack/react-router';

interface CardProps {
  sneaker: Sneaker;
}

export function Card({ sneaker }: CardProps) {
  const {
    id,
    title,
    description,
    main_image_url,
    price,
    brand,
    sizes,
    is_new,
  } = sneaker;

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: '/sneakers/$sneakerId', params: { sneakerId: id } });
  };

  const brandName = brand?.name;
  const displaySize = sizes && sizes.length > 0 ? `US ${sizes[0].us_size}` : undefined;
  const imageUrl = main_image_url || 'https://placehold.co/400x300/E0E0E0/000000?text=No+Image';

  return (
    <ShadcnCard
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col" // Añadimos flex flex-col para el layout
      onClick={handleCardClick}
    >
      <CardHeader className="p-4 flex-shrink-0"> {/* flex-shrink-0 asegura que el header no se encoja */}
        <div className="flex justify-between items-start">
          <div className="flex-grow"> {/* Permite que el div de texto crezca */}
            <h3 className="font-semibold text-lg mb-1">{title}</h3> {/* Agregamos un poco de margen inferior al título */}
            {description && (
              // Usamos `line-clamp-3` para limitar a 3 líneas y `h-16` para una altura fija
              // Se puede ajustar `line-clamp-` a 2 o 4 si Quiero. `h-16` (64px)
              // es solo una estimación, se puede ajustar si las líneas son más grandes/pequeñas.
              <p className="text-sm text-muted-foreground overflow-hidden line-clamp-3 h-16">
                {description}
              </p>
            )}
            {!description && <div className="h-16"></div>} {/* Manténer el espacio si no hay descripción */}
          </div>
          {is_new && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-2">
              New
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* La imagen tiene una altura fija, esto es bueno */}
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/E0E0E0/000000?text=No+Image'; }}
        />
      </div>

      <CardContent className="p-0 mt-auto flex-shrink-0">
        <div className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                <path d="M12 11.5C13.1046 11.5 14 10.6046 14 9.5C14 8.39543 13.1046 7.5 12 7.5C10.8954 7.5 10 8.39543 10 9.5C10 10.6046 10.8954 11.5 12 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9.5C3 15.0228 7.47715 19.5 13 19.5C18.5228 19.5 23 15.0228 23 9.5C23 3.97715 18.5228 -0.5 13 -0.5C7.47715 -0.5 3 3.97715 3 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm">{brandName}</span>
            </div>
            {displaySize && (
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-500">
                  <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm">{displaySize}</span>
              </div>
            )}
          </div>
          <span className="text-xl font-bold">${price}</span>
        </div>
      </CardContent>
    </ShadcnCard>
  );
}