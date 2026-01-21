// components/featured/SignInForm.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@/components/hooks/useAuth';



const BASE_URL = 'http://127.0.0.1:8000';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("El email y la contraseña son obligatorios.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
    let errorData;
    try {
        errorData = await response.json();
    } catch (e) {
        errorData = { detail: response.statusText || 'Error desconocido' };
    }
    
    // Lanza el error con el detalle del backend
    throw new Error(errorData.detail || 'Error al iniciar sesión. Verifica tus credenciales.');
}

      // 1. Almacenar el token JWT
      login(data.token, data.user);
      
      // 2. Redirigir al usuario (ej. a la raíz o a un dashboard)
      navigate({ to: '/' }); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
      <h1 className="font-bold text-2xl mb-2">Sign in</h1>
      {/* ... Íconos de redes sociales ... */}
      <span className="text-xs">or use your account</span>
      
      {/* Inputs controlados */}
      <input type="email" placeholder="Email" className="bg-gray-200 p-3 my-2 w-full" 
             value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="bg-gray-200 p-3 my-2 w-full" 
             value={password} onChange={(e) => setPassword(e.target.value)} required />
      
            <Link 
        to="/forgot-password" 
        className="text-sm my-2 text-gray-600 hover:text-[#8b95b6]"
      >
        Hai dimenticato la password?
          </Link>
      
      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <button type="submit" 
              className="rounded-full border border-[#d3d7e3] bg-[#8b95b6] text-white text-xs font-bold px-10 py-3 uppercase mt-4 disabled:opacity-50"
              disabled={isLoading}
      >
        {isLoading ? 'Logging In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm;