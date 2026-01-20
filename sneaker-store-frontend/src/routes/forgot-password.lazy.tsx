// src/routes/forgot-password.tsx
import { createLazyFileRoute } from '@tanstack/react-router';
import ForgotPasswordForm from '@/components/features/ForgotPasswordForm';

export const Route = createLazyFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    /* Contenedor para centrar el formulario. 
       Usamos min-h-screen menos el padding de tu Navbar (pt-16) 
    */
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#f6f5f7]">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-[450px] min-h-[500px]">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}