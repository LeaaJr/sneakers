// components/features/AuthContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthContainerProps {
  initialMode: 'signin' | 'signup';
}

const AuthContainer: React.FC<AuthContainerProps> = ({ initialMode }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');
  const navigate = useNavigate();

  
  const transitionClasses = 'transition-transform duration-700 ease-in-out';

useEffect(() => {
  setIsSignUp(initialMode === 'signup');
}, [initialMode]);

const switchToSignIn = () => {
  setIsSignUp(false); // dispara animación
  setTimeout(() => {
    navigate({ to: '/auth', search: { mode: 'signin' } });
  }, 700); // espera la duración de la transición
};

const switchToSignUp = () => {
  setIsSignUp(true); // dispara animación
  setTimeout(() => {
    navigate({ to: '/auth', search: { mode: 'signup' } });
  }, 700);
};

  return (
    <div className="w-[768px] max-w-full min-h-[480px] bg-white rounded-lg shadow-lg relative overflow-hidden font-sans">
      {/* A. Contenedores de Formulario */}
      <div
        className={`absolute top-0 left-0 h-full w-1/2 ${transitionClasses}
                    ${isSignUp ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
                    
      >
        <SignInForm />
      </div>

      <div
        className={`absolute top-0 right-0 h-full w-1/2 ${transitionClasses}
                    ${isSignUp ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                    
      >
        <SignUpForm />
      </div>

      {/* B. Overlay */}
      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-20 ${transitionClasses}
                    ${isSignUp ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div
          className={`h-full w-[200%] flex bg-gradient-to-r from-[#8b95b6] to-[#d3d7e3] text-white ${transitionClasses}
                      ${isSignUp ? '-translate-x-1/2' : 'translate-x-0'}`}
        >
          {/* Overlay Left */}
          <div className="w-1/2 flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-sm my-4">
              To keep connected with us please login with your personal info
            </p>
            <button onClick={switchToSignUp} >
              Sign In
            </button>
          </div>

          {/* Overlay Right */}
          <div className="w-1/2 flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-2xl font-bold">Hello, Friend!</h1>
            <p className="text-sm my-4">
              Enter your personal details and start your journey with us
            </p>
            <button onClick={switchToSignIn}>
            Sign Up
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;