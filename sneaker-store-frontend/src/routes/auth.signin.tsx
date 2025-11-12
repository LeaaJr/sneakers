// src/routes/auth.signin.tsx
import { createFileRoute } from '@tanstack/react-router';
import AuthContainer from '@/components/features/AuthContainer';

export const Route = createFileRoute('/auth/signin')({
    component: SigninComponent,
});

function SigninComponent() {
    return <AuthContainer initialMode="signin" />;
}