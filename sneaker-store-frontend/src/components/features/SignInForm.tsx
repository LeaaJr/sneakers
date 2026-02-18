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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al iniciar sesión.');
      }

      login(data.token, data.user);
      navigate({ to: '/' }); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // CAMBIO: px-6 en móvil, px-12 en desktop para evitar que el form se vea muy angosto
    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-6 md:px-12 h-full text-center w-full">
      <h1 className="font-bold text-xl md:text-2xl mb-2">Sign in</h1>
      
      <span className="text-xs mb-2">or use your account</span>
      
      <input 
        type="email" 
        placeholder="Email" 
        className="bg-gray-200 p-3 my-1.5 w-full rounded-sm text-sm" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="bg-gray-200 p-3 my-1.5 w-full rounded-sm text-sm" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      
      <Link 
        to="/forgot-password" 
        className="text-xs md:text-sm my-2 text-gray-600 hover:text-[#8b95b6]"
      >
        Hai dimenticato la password?
      </Link>
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      
      <button 
        type="submit" 
        className="rounded-full border border-[#d3d7e3] bg-[#8b95b6] text-white text-[10px] md:text-xs font-bold px-8 md:px-10 py-3 uppercase mt-4 disabled:opacity-50 w-full md:w-auto"
        disabled={isLoading}
      >
        {isLoading ? 'Logging In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm;