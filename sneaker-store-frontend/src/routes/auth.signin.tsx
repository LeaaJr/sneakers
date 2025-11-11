// src/routes/auth.signin.tsx
import { createFileRoute } from '@tanstack/react-router';
import AuthContainer from '@/components/features/AuthContainer';

export const Route = createFileRoute('/auth/signin')({
    component: SigninPage,
});

function SigninPage() {
    // Renderiza el contenedor, inicializando en modo Sign In
    return <AuthContainer initialMode="signin" />;
}