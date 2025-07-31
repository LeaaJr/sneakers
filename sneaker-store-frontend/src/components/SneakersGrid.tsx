// src/components/SneakersGrid.tsx
import { Card } from './Cards'; // Asegúrate que 'Cards' sea el nombre correcto del archivo
import type { Sneaker } from '@/services/sneakerService'; // Importa el tipo Sneaker

interface SneakersGridProps {
  sneakers: Sneaker[]; // Espera un array de zapatillas
}

export function SneakersGrid({ sneakers }: SneakersGridProps) {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sneakers.map((sneaker) => (
          <Card key={sneaker.id} sneaker={sneaker} />
        ))}
      </div>
    </div>
  );
}