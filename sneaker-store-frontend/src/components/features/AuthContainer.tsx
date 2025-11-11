// components/featured/AuthContainer.tsx
import React, { useState, useEffect } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthContainerProps {
    initialMode: 'signin' | 'signup';
}

const AuthContainer: React.FC<AuthContainerProps> = ({ initialMode }) => {
    // Inicializa el estado basado en la prop
    const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');

    // Efecto para actualizar el modo si la prop externa cambia (útil si usas una sola ruta con parámetros)
    useEffect(() => {
        setIsSignUp(initialMode === 'signup');
    }, [initialMode]);

  return (
    <div className="w-[768px] max-w-full min-h-[480px] bg-white rounded-lg shadow-lg relative overflow-hidden font-sans">
            <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out ${isSignUp ? 'translate-x-1/2' : ''} w-1/2 z-20`}>
                {isSignUp ? <SignUpForm /> : <SignInForm />} 
            </div>

      <div className="absolute top-0 left-1/2 w-1/2 h-full z-10 transition-transform duration-500 ease-in-out">
        <div className={`h-full w-[200%] flex ${isSignUp ? 'translate-x-[-50%]' : 'translate-x-0'} transition-transform duration-500`}>
          <div className="w-1/2 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-sm my-4">To keep connected with us please login with your personal info</p>
            <button onClick={() => setIsSignUp(false)} className="mt-4 border border-white px-8 py-2 rounded-full text-sm uppercase">
              Sign In
            </button>
          </div>
          <div className="w-1/2 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-2xl font-bold">Hello, Friend!</h1>
            <p className="text-sm my-4">Enter your personal details and start your journey with us</p>
            <button onClick={() => setIsSignUp(true)} className="mt-4 border border-white px-8 py-2 rounded-full text-sm uppercase">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;