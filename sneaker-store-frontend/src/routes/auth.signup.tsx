// src/routes/auth.signup.tsx
import { createFileRoute } from '@tanstack/react-router';
import AuthContainer from '@/components/features/AuthContainer'; // Ajusta la ruta

export const Route = createFileRoute('/auth/signup')({
    component: SignupComponent,
});

function SignupComponent() {
    // La ruta actual es /auth/signup
    return <AuthContainer initialMode="signup" />;
}