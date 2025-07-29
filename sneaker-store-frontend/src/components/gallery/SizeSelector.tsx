// src/components/SizeSelector.tsx
import React from 'react';
import { Button } from '../ui/button';
import { type Size } from '@/services/sneakerService'; // Importa la interfaz Size de tu servicio

interface SizeSelectorProps {
  sizes: Size[]; // Ahora espera un array de objetos Size
  selectedSizeId: string | null; // Usaremos el ID de la talla para la selección
  onSelectSize: (sizeId: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSizeId,
  onSelectSize,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {sizes.map((size) => (
        <Button
          key={size.id} // Usa el ID de la talla como key
          variant={selectedSizeId === size.id ? 'default' : 'outline'}
          className={`py-6 ${selectedSizeId === size.id ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => onSelectSize(size.id)}
          disabled={size.quantity === 0} // Deshabilita el botón si la cantidad es 0
        >
          {`EU ${size.eu_size}`} {/* Muestra la talla EU, o US/UK si prefieres */}
          {size.quantity === 0 && ' (Agotado)'} {/* Indicador de agotado */}
        </Button>
      ))}
    </div>
  );
};