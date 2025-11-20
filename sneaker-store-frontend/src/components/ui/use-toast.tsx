// src/components/ui/use-toast.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastComponent, Toaster as ToasterContainer } from './toast';
import type { Toast } from './toast';

interface ToastContextType {
  toast: (props: Omit<Toast, 'id'>) => { id: number };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let count = 0; // Contador para IDs únicos
const generateId = () => count++;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant }: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { id, title, description, variant };
    
    setToasts((prev) => [newToast, ...prev]);

    // Elimina el toast después de 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);

    return { id };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* El contenedor Toaster */}
      <div 
        className="fixed top-5 right-5 z-[1000] w-full max-w-xs pointer-events-none"
      >
        {toasts.map((t) => (
          // Usamos la key para la lista, pero el componente Toast se encarga de la UI
          <ToastComponent key={t.id} toast={t} /> 
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};