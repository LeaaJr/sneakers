// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { HeaderFuturista } from '@/components/Header'; // Importa el Header (sección hero)

// Define el componente que se renderizará para la ruta raíz (/)
function HomePageContent() {
  return (
    <>
      {/* El HeaderFuturista (sección hero) se renderiza SOLO en la página de inicio */}
      <HeaderFuturista />
    </>
  );
}

// Asigna el componente a la ruta
export const Route = createFileRoute('/')({
  component: HomePageContent,
});
