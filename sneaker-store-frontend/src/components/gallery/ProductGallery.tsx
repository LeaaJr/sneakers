// ProductGallery.tsx
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../ui/button';
import type { SneakerImage } from '@/services/sneakerService';

interface ProductGalleryProps {
  images: SneakerImage[];
  mainImageUrl: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, mainImageUrl }) => {
   
  const allImageUrls = [
    mainImageUrl, // Agrega la URL de la imagen principal
    ...images
      .sort((a, b) => (a.order || 0) - (b.order || 0)) // Si tus SneakerImage tienen un 'order'
      .map((img) => img.image_url), // Extrae la URL de cada objeto SneakerImage
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImageUrls.length - 1 ? 0 : prev + 1));
  };

return (
  <div className="grid grid-cols-[80px_1fr] gap-4">
    {/* Thumbnails */}
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
      {allImageUrls.map((imageUrl, index) => (
        <div
          key={imageUrl}
          className={`relative w-[80px] h-[80px] border rounded cursor-pointer ${
            index === currentImageIndex ? 'border-black' : 'border-gray-200'
          }`}
          onClick={() => setCurrentImageIndex(index)}
        >
          <img
            src={imageUrl}
            alt={`Product thumbnail ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
    </div>

    {/* Main Image */}
    <div className="relative bg-gray-100 rounded-md overflow-hidden">
      {/* Imagen que ocupa todo el contenedor */}
      <img
        src={allImageUrls[currentImageIndex]}
        alt="Product main view"
        className="w-full h-full object-cover object-center"
      />

      {/* Botón anterior */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full h-8 w-8 z-10"
        onClick={handlePrevImage}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {/* Botón siguiente */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full h-8 w-8 z-10"
        onClick={handleNextImage}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
};