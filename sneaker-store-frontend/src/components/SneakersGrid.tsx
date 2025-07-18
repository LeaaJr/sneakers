// src/components/SneakersGrid.tsx
import React from 'react';
import { Card } from './Cards'; // Asegúrate de que la ruta sea correcta
import { type Sneaker } from '@/services/sneakerService';

interface SneakersGridProps {
  sneakers: Sneaker[];
}

export function SneakersGrid({ sneakers }: SneakersGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sneakers.map((sneaker) => (
          <Card
            key={sneaker.id}
            id={sneaker.id}
            title={sneaker.title}
            description={sneaker.description}
            imageUrl={sneaker.main_image_url} // Usa main_image_url del backend
            price={sneaker.price}
            brand={sneaker.brand.name} // Accede al nombre de la marca anidada
            // size={sneaker.sizes[0]?.us_size ? `US ${sneaker.sizes[0].us_size}` : undefined} // Ejemplo: toma la primera talla disponible
            isNew={sneaker.is_new} // Usa is_new del backend
          />
        ))}
      </div>
    </div>
  );
}
