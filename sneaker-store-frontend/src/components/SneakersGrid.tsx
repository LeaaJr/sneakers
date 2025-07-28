// src/components/SneakersGrid.tsx
import { Card } from './Cards';
import { type Sneaker } from '@/services/sneakerService'; // Asegúrate de que esta importación sea correcta

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
            // ¡CAMBIO AQUÍ! Pasa la prop con el nombre correcto `main_image_url`
            main_image_url={sneaker.main_image_url}
            price={sneaker.price}
            brand={sneaker.brand} // Pasa el objeto brand completo, no solo el nombre
            sizes={sneaker.sizes} // Pasa el array de sizes
            is_new={sneaker.is_new} // La prop en Card.tsx es `is_new`, no `isNew` (camelCase vs snake_case)
          />
        ))}
      </div>
    </div>
  );
}