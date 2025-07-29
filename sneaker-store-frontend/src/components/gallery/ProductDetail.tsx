// src/components/gallery/ProductDetail.tsx
import React, { useState } from 'react';
import { ProductGallery } from './ProductGallery'; // ¡Este import es clave y es lo único que debe quedar!
import { SizeSelector } from './SizeSelector';
import { Button } from '../ui/button';
import { StarIcon, HeartIcon, RulerIcon } from 'lucide-react';
import { type Sneaker, type Size } from '@/services/sneakerService';

interface ProductDetailProps {
  sneaker: Sneaker; // Recibe el objeto Sneaker completo
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ sneaker }) => {
  // Estos console.log estaban aquí por tu propia cuenta, déjalos si quieres
  console.log('ProductGallery: mainImageUrl recibida:', sneaker.main_image_url);
  console.log('ProductGallery: images (array de objetos) recibidas:', sneaker.images);

  // ESTA PARTE DE `allImageUrls` ES REDUNDANTE AQUÍ.
  // Ya la estás calculando DENTRO de ProductGallery.tsx.
  // **Puedes ELIMINAR las siguientes 4 líneas también para limpiar:**
  const allImageUrls = [
    sneaker.main_image_url,
    ...sneaker.images.sort((a, b) => (a.order || 0) - (b.order || 0)).map((img) => img.image_url),
  ];
  console.log('ProductGallery: allImageUrls (array final de URLs) para renderizar:', allImageUrls);
  // **FIN DE LA SECCIÓN REDUNDANTE A ELIMINAR**


  // Encontrar la primera talla disponible o null si no hay
  const initialSelectedSizeId = sneaker.sizes.length > 0 ? sneaker.sizes[0].id : null;
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(initialSelectedSizeId);

  // Puedes calcular el rating en base a tus datos, o mantener un placeholder
  const displayRating = "Valutazione alta"; // Placeholder por ahora

  // Prepara las URLs de las imágenes para la galería
  // Asegúrate de que sneaker.images y sneaker.main_image_url sean válidos
  const galleryImages = sneaker.images; // Pasamos el array de objetos directamente a ProductGallery
  const mainImageForGallery = sneaker.main_image_url;

  // Busca la talla seleccionada para mostrar su info si es necesario (ej. US, UK)
  const selectedSize = sneaker.sizes.find(s => s.id === selectedSizeId);
  const displaySelectedSize = selectedSize ? `EU ${selectedSize.eu_size}` : 'Seleziona una taglia';


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Product Gallery */}
        <div>
          <ProductGallery
            images={galleryImages}
            mainImageUrl={mainImageForGallery}
          />
        </div>
        {/* Right side - Product Info */}
        <div className="space-y-6">
          {/* Product Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold">{sneaker.title}</h1>
            <p className="text-gray-600 mt-1">{sneaker.description}</p>
            <div className="flex items-center mt-2">
              <StarIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{displayRating}</span>
            </div>
          </div>
          {/* Price */}
          <div>
            <span className="text-2xl font-bold">${sneaker.price.toFixed(2)}</span>
          </div>
          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">
                Seleziona la taglia/misura
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs flex items-center"
              >
                <RulerIcon className="h-3 w-3 mr-1" />
                Guida alle taglie e alle misure
              </Button>
            </div>
            {sneaker.sport && (
                <p className="text-sm text-gray-600 mb-3">
                  Calzata {sneaker.sport === "Urbano" ? "normal" : "aderente"}: se preferisci un po' più di comodità, ti consigliamo di ordinare mezza misura in più
                </p>
            )}
            <SizeSelector
              sizes={sneaker.sizes}
              selectedSizeId={selectedSizeId}
              onSelectSize={setSelectedSizeId}
            />
          </div>
          {/* Add to Cart and Wishlist */}
          <div className="space-y-3 pt-4">
            <Button className="w-full bg-black hover:bg-gray-800 text-white py-6"
              disabled={!selectedSizeId || (selectedSize && selectedSize.quantity === 0)}
            >
              Aggiungi al carrello
            </Button>
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center"
            >
              Aggiungi ai preferiti <HeartIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};