// src/components/FavoritesComponent.tsx
import React from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { Card } from '@/components/Cards';

export function FavoritesComponent() {
  const { favoriteItems } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-[calc(100vh-10rem)]">
      <h1 className="text-2xl font-m tracking-tight mb-8">
        Prodotti Preferiti
      </h1>
      
      {favoriteItems.length === 0 ? (
        <div className="text-center p-20 bg-white rounded-lg">
          <p className="text-xl text-gray-500">Non hai ancora aggiunto nessun prodotto ai preferiti.</p>
          <p className="text-md text-gray-400 mt-2">Cerca le tue sneakers preferite e clicca sull'icona del cuore.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favoriteItems.map((sneaker) => (
            <Card key={sneaker.id} sneaker={sneaker} /> 
          ))}
        </div>
      )}
    </div>
  );
}