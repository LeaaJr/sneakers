// src/components/admin/SizeGridPicker.tsx
import { Button } from '@/components/ui/button';
import { memo } from 'react';

const COMMON_SIZES = [
  4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13
];

interface SizeGridPickerProps {
  currentSizes: { us_size: number }[];
  onAdd: (size: number) => void;
  onRemove: (size: number) => void;
}

export const SizeGridPicker = memo(({ currentSizes, onAdd, onRemove }: SizeGridPickerProps) => {
  const selectedSizes = currentSizes.map(s => s.us_size);

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
      <h4 className="text-sm font-medium text-slate-600">Añadir tallas rápidamente (US):</h4>
      <div className="flex flex-wrap gap-2">
        {COMMON_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);
          return (
            <Button
              key={size}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`w-12 h-10 ${isSelected ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
              onClick={() => isSelected ? onRemove(size) : onAdd(size)}
            >
              {size}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 italic">
        Toca una talla para añadirla o quitarla de la lista de abajo.
      </p>
    </div>
  );
});

SizeGridPicker.displayName = 'SizeGridPicker';