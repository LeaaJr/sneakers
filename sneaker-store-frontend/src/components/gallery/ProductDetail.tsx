// src/components/gallery/ProductDetail.tsx
import React, { useState, useCallback } from 'react';
import { ProductGallery } from './ProductGallery';
import { SizeSelector } from './SizeSelector';
import { Button } from '../ui/button';
import { StarIcon, HeartIcon, RulerIcon } from 'lucide-react';
import { type Sneaker } from '@/services/sneakerService';
import { useCart } from '@/context/CartContext';
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from '@/context/FavoritesContext';
import { RelatedProducts } from './RelatedProducts';



interface ProductDetailProps {
  sneaker: Sneaker;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ sneaker }) => {
  const { addToCart } = useCart();
  const { toast } = useToast(); 
  const { isFavorite, toggleFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(sneaker.id);

  const allImageUrls = [
    sneaker.main_image_url,
    ...sneaker.images.sort((a, b) => (a.order || 0) - (b.order || 0)).map((img) => img.image_url),
  ];

  const initialSelectedSizeId = sneaker.sizes.length > 0 ? sneaker.sizes[0].id : null;
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(initialSelectedSizeId);

  const displayRating = "Valutazione alta";
  
  const galleryImages = sneaker.images;
  const mainImageForGallery = sneaker.main_image_url;

  const selectedSize = sneaker.sizes.find(s => s.id === selectedSizeId);
  const displaySelectedSize = selectedSize ? `EU ${selectedSize.eu_size}` : 'Seleziona una taglia';

  // NUEVA FUNCIÓN: Manejar la adición al carrito
  const handleAddToCart = useCallback(() => {
    if (!selectedSizeId || !selectedSize) {
      toast({
        title: "Selezione mancante",
        description: "Per favore, seleziona una taglia prima di aggiungere al carrello.",
        variant: "destructive",
      });
      return;
    }

    // Prepara el objeto producto para el carrito
    const itemToAdd = {
      id: sneaker.id,
      name: sneaker.title,
      price: sneaker.price,
      quantity: 1, 
      size: selectedSize.eu_size.toString(), 
      imageSrc: sneaker.main_image_url,
      imageAlt: sneaker.title,
    };

    console.log("🛒 Producto enviado a addToCart:", itemToAdd);
    
    addToCart(itemToAdd);

    toast({
        title: "Aggiunto al carrello!",
        description: `${itemToAdd.name} (Taglia ${itemToAdd.size}) è stato aggiunto al carrello.`,
    });

  }, [sneaker, selectedSizeId, selectedSize, addToCart, toast]);

const handleToggleFavorite = useCallback(() => {
toggleFavorite(sneaker); 
const action = isCurrentlyFavorite ? 'Rimosso' : 'Aggiunto'; 
toast({
  title: `${action} dai Preferiti!`,
   description: `${sneaker.title} è stato ${action.toLowerCase()} alla tua lista.`,
});
}, [sneaker, toggleFavorite, toast]);


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Product Gallery (No cambia) */}
        <div>
          <ProductGallery
            images={galleryImages}
            mainImageUrl={mainImageForGallery}
          />
        </div>
        
        {/* Right side - Product Info */}
        <div className="space-y-6">
          {/* Product Title and Rating (No cambia) */}
          <div>
            <h1 className="text-3xl font-bold">{sneaker.title}</h1>
            <p className="text-gray-600 mt-1">{sneaker.description}</p>
            <div className="flex items-center mt-2">
              <StarIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{displayRating}</span>
            </div>
          </div>
          
          {/* Price (No cambia) */}
          <div>
            <span className="text-2xl font-bold">${sneaker.price.toFixed(2)}</span>
          </div>
          
          {/* Size Selection (No cambia) */}
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
            <Button 
              className="w-full bg-black hover:bg-gray-800 text-white py-6"
              disabled={!selectedSizeId || (selectedSize && selectedSize.quantity === 0)}
              onClick={handleAddToCart} // ¡AQUÍ ESTÁ EL CAMBIO CLAVE!
            >
              Aggiungi al carrello
            </Button>
            <Button
              onClick={handleToggleFavorite} 
              variant="outline"
              className="w-full py-6 flex items-center justify-center"
            >
              Aggiungi ai preferiti 
              <HeartIcon 
                  className={`ml-2 h-5 w-5 transition-colors ${isCurrentlyFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
              />
            </Button>
          </div>
        </div>
      </div>
              {/* 👟 SECCIÓN DE PRODUCTOS RELACIONADOS AÑADIDA AQUÍ */}
    <div className="mt-16 border-t border-gray-200 pt-10">
      <RelatedProducts
        categorySlug={sneaker.sport || ''}
        currentProductId={sneaker.id}
        limit={6}
      />
    </div>
    </div>
  );
};