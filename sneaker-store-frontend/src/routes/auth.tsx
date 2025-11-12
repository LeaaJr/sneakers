// src/routes/auth.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import AuthContainer from '@/components/features/AuthContainer';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  // Leemos el parámetro de búsqueda "mode"
  const { mode } = Route.useSearch<{ mode?: 'signin' | 'signup' }>();

  // Si no hay parámetro, arrancamos en "signin"
  const initialMode = mode ?? 'signin';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <AuthContainer initialMode={initialMode} />
    </div>
  );
}