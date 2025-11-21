import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { type Sneaker } from '@/services/sneakerService';


interface FavoritesContextType {
  favoriteItems: Sneaker[];
  isFavorite: (sneakerId: string) => boolean;
  toggleFavorite: (sneaker: Sneaker) => void;
  removeFromFavorites: (sneakerId: string) => void;
  favoritesCount: number;
}


const defaultContextValue: FavoritesContextType = {
  favoriteItems: [],
  isFavorite: () => false,
  toggleFavorite: () => { /* no-op */ },
  removeFromFavorites: () => { /* no-op */ },
  favoritesCount: 0,
};


const FavoritesContext = createContext<FavoritesContextType>(defaultContextValue);

// Componente Provider
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [favoriteItems, setFavoriteItems] = useState<Sneaker[]>([]);


  const isFavorite = useCallback((sneakerId: string) => {
    return favoriteItems.some(item => item.id === sneakerId);
  }, [favoriteItems]);

  const toggleFavorite = useCallback((sneaker: Sneaker) => {
    setFavoriteItems(prevItems => {
      const exists = prevItems.some(item => item.id === sneaker.id);
      
      console.log(`[FAV DEBUG] Procesando ID: ${sneaker.id} - Title: ${sneaker.title}`);
      console.log(`[FAV DEBUG] Existe previamente en el carrito: ${exists}`);

      if (exists) {

        const newItems = prevItems.filter(item => item.id !== sneaker.id);
        console.log(`[FAV DEBUG] Acción: REMOVIDO. Nuevo total: ${newItems.length}`);
        return newItems;
      } else {

        const newItems = [...prevItems, sneaker];
        console.log(`[FAV DEBUG] Acción: AÑADIDO. Nuevo total: ${newItems.length}`);

        console.log(`[FAV DEBUG] Objeto 'sneaker' guardado:`, sneaker); 
        return newItems;
      }
    });
  }, []);


  const removeFromFavorites = useCallback((sneakerId: string) => {
    setFavoriteItems(prevItems => prevItems.filter(item => item.id !== sneakerId));
  }, []);
  
  const favoritesCount = favoriteItems.length;

  const contextValue = useMemo(() => ({
    favoriteItems,
    isFavorite,
    toggleFavorite,
    removeFromFavorites,
    favoritesCount,
  }), [favoriteItems, isFavorite, toggleFavorite, removeFromFavorites, favoritesCount]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};