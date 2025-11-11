// src/routes/auth.signup.tsx
import { createFileRoute } from '@tanstack/react-router';
import AuthContainer from '@/components/features/AuthContainer'; // Ajusta la ruta

export const Route = createFileRoute('/auth/signup')({
    component: SignupPage,
});

function SignupPage() {
    // Renderiza el contenedor, inicializando en modo Sign Up
    return <AuthContainer initialMode="signup" />;
}