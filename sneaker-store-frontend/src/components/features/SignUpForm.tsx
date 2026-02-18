// components/featured/SignUpForm.tsx
import React, { useState } from 'react';

const BASE_URL = 'http://127.0.0.1:8000';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrarse.');
      }

      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.');
      setName(''); setEmail(''); setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // CAMBIO: px-6 en móvil para maximizar espacio de escritura
    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-6 md:px-12 h-full text-center w-full">
      <h1 className="font-bold text-xl md:text-2xl mb-2">Creare un account</h1>
      
      <span className="text-[10px] md:text-xs mb-2">oppure usa il tuo indirizzo email per registrarti</span>
      
      <input 
        type="text" 
        placeholder="Nome" 
        className="bg-gray-200 p-3 my-1.5 w-full rounded-sm text-sm" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
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
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      {success && <p className="text-green-500 text-xs mt-2">{success}</p>}

      <button 
        type="submit" 
        className="rounded-full border border-[#d3d7e3] bg-[#8b95b6] text-white text-[10px] md:text-xs font-bold px-8 md:px-10 py-3 uppercase mt-4 disabled:opacity-50 w-full md:w-auto"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;