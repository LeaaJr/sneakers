// components/features/AuthContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { cn } from '@/lib/utils';

interface AuthContainerProps {
  initialMode: 'signin' | 'signup';
}

const AuthContainer: React.FC<AuthContainerProps> = ({ initialMode }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');
  const navigate = useNavigate();

  const transitionClasses = 'transition-all duration-700 ease-in-out';

  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
  }, [initialMode]);

  const switchToSignIn = () => {
    setIsSignUp(false);
    setTimeout(() => {
      navigate({ to: '/auth', search: { mode: 'signin' } });
    }, 700);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setTimeout(() => {
      navigate({ to: '/auth', search: { mode: 'signup' } });
    }, 700);
  };

  return (
<div className="w-[95%] md:w-[768px] max-w-full min-h-[500px] md:min-h-[480px] bg-white rounded-lg shadow-lg relative overflow-hidden">
    
    {/* Formulario de SIGN IN */}
    <div className={cn(
      `absolute top-0 left-0 h-full w-full md:w-1/2 ${transitionClasses} z-[5] flex flex-col`,
      isSignUp ? 'md:-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
    )}>
      <SignInForm />
      {/* LINK PARA MÓVIL: Aparece solo en pantallas pequeñas */}
      <div className="md:hidden pb-8 text-center bg-white">
        <p className="text-sm text-gray-600">
          Non hai un account?{' '}
          <button 
            onClick={() => setIsSignUp(true)} 
            className="text-[#8b95b6] font-bold underline"
          >
            Registrati qui
          </button>
        </p>
      </div>
    </div>

    {/* Formulario de SIGN UP */}
    <div className={cn(
      `absolute top-0 left-0 md:left-auto md:right-0 h-full w-full md:w-1/2 ${transitionClasses} z-[5] flex flex-col`,
      isSignUp ? 'translate-x-0 opacity-100' : 'md:translate-x-full opacity-0 pointer-events-none'
    )}>
        <SignInForm />
        {/* Link rápido solo para móvil para alternar */}
        <div className="md:hidden pb-6 text-center">
            <button onClick={switchToSignUp} className="text-xs text-muted-foreground underline">
                Non hai un account? Registrati
            </button>
        </div>
      </div>

      <div
        className={cn(
          `absolute top-0 left-0 md:left-auto md:right-0 h-full w-full md:w-1/2 ${transitionClasses} z-[5]`,
          isSignUp 
            ? 'translate-x-0 opacity-100' 
            : 'md:translate-x-full opacity-0 pointer-events-none'
        )}
      >
        <SignUpForm />
        {/* Link rápido solo para móvil para alternar */}
        <div className="md:hidden pb-6 text-center">
            <button onClick={switchToSignIn} className="text-xs text-muted-foreground underline">
                Hai già un account? Accedi
            </button>
        </div>
      </div>

      {/* B. Overlay (OCULTO EN MÓVIL) */}
      <div
        className={cn(
          `hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-20 ${transitionClasses}`,
          isSignUp ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <div
          className={cn(
            `h-full w-[200%] flex bg-gradient-to-r from-[#8b95b6] to-[#d3d7e3] text-white ${transitionClasses}`,
            isSignUp ? '-translate-x-1/2' : 'translate-x-0'
          )}
        >
          {/* Overlay Left */}
          <div className="w-1/2 flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-2xl font-bold">Bentornati!</h1>
            <p className="text-sm my-4">Per rimanere in contatto, è necessario registrarsi.</p>
            <button 
              onClick={switchToSignUp}
              className="px-8 py-2 border border-white rounded-full hover:bg-white hover:text-[#8b95b6] transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Overlay Right */}
          <div className="w-1/2 flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-2xl font-bold">Bentornati!</h1>
            <p className="text-sm my-4">Se hai un account, puoi effettuare l'accesso cliccando qui</p>
            <button 
              onClick={switchToSignIn}
              className="px-8 py-2 border border-white rounded-full hover:bg-white hover:text-[#8b95b6] transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;