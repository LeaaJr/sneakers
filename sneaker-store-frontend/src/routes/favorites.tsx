// src/routes/favorites.tsx
import { createFileRoute } from '@tanstack/react-router';
import { FavoritesComponent } from '@/components/FavoritesComponent';

// Esta ruta corresponde a la URL: /favorites
export const Route = createFileRoute('/favorites')({
  component: FavoritesComponent,
});