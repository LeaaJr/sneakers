// components/featured/SignUpForm.tsx
import React, { useState } from 'react';
// import { useNavigate } from '@tanstack/react-router'; 

const BASE_URL = 'http://127.0.0.1:8000';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate(); // Descomentar si vas a usarlo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validación básica en el cliente
    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }
    
    // Llamada al backend
    try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, { // 🔑 CORREGIDO
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

      const data = await response.json();

      if (!response.ok) {
    // 🔑 MEJORA DE MANEJO DE ERRORES: Intenta leer el JSON de error
    let errorData;
    try {
        errorData = await response.json();
    } catch (e) {
        // Si no es JSON (ej. si el body está vacío), usa el texto plano
        errorData = { detail: response.statusText || 'Error desconocido' };
    }
    
    // Lanza el error con el detalle del backend
    throw new Error(errorData.detail || 'Error al iniciar sesión. Verifica tus credenciales.');
}

      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.');
      setName(''); setEmail(''); setPassword('');
      // navigate({ to: '/auth', search: { mode: 'signin' } }); // Opcional: Redirigir al login
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
      <h1 className="font-bold text-2xl mb-2">Create Account</h1>
      {/* ... Íconos de redes sociales ... */}
      <span className="text-xs">or use your email for registration</span>
      
      {/* Inputs controlados */}
      <input type="text" placeholder="Name" className="bg-gray-200 p-3 my-2 w-full" 
             value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" className="bg-gray-200 p-3 my-2 w-full" 
             value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="bg-gray-200 p-3 my-2 w-full" 
             value={password} onChange={(e) => setPassword(e.target.value)} required />
      
      {/* Mensajes de feedback */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

      <button type="submit" 
              className="rounded-full border border-[#d3d7e3] bg-[#8b95b6] text-white text-xs font-bold px-10 py-3 uppercase mt-4 disabled:opacity-50"
              disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;