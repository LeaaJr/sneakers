// src/routes/auth.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import * as React from 'react';

// Esta ruta no renderiza nada directamente, solo define el layout o redirige
export const Route = createFileRoute('/auth')({
    component: AuthLayout,
    // Redirige /auth a /auth/signin por defecto
    beforeLoad: ({ location }) => {
        if (location.pathname === '/auth') {
            throw redirect({ to: '/auth/signin' });
        }
    }
});

function AuthLayout() {
    // Aquí podrías añadir un layout general si fuera necesario,
    // pero para este caso, solo necesitamos el Outlet.
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Outlet />
        </div>
    );
}