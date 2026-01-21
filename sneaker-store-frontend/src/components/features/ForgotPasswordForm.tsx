// components/featured/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { requestPasswordReset } from '@/services/sneakerService';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setStatus({ 
        type: 'success', 
        text: 'Instrucciones enviadas. Revisa tu bandeja de entrada.' 
      });
      setEmail('');
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        text: err.message || 'Error al procesar la solicitud.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
      <h1 className="p-4 font-bold text-2xl mb-0 text-gray-800">Recupera l'accesso</h1>
      <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Inserisci il tuo indirizzo email registrato</p>

      <input 
        type="email" 
        placeholder="Email" 
        className="bg-gray-200 p-3 my-2 w-full focus:outline-none focus:ring-1 focus:ring-[#8b95b6]" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />

      {status && (
        <p className={`text-xs mt-2 font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {status.text}
        </p>
      )}

      <button 
        type="submit" 
        disabled={isLoading}
        className="rounded-full border border-[#d3d7e3] bg-[#8b95b6] text-white text-xs font-bold px-10 py-3 uppercase mt-4 transition-all hover:bg-[#7a84a5] disabled:opacity-50"
      >
        {isLoading ? 'Procesando...' : 'Invia collegamento'}
      </button>

      <Link to="/auth"
            search={{ mode: 'signin' }}
            className="text-xs mt-8 text-gray-400 hover:text-gray-600 transition-colors">
        ← Torna al login
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;