// src/components/ui/toast.tsx
import React from 'react';

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const getClasses = (variant: 'default' | 'destructive' = 'default') => {
    if (variant === 'destructive') {
        return "bg-red-500 text-white border-red-600";
    }
    return "bg-white text-gray-800 border-gray-200";
};

export const ToastComponent: React.FC<{ toast: Toast }> = ({ toast }) => {
  const classes = getClasses(toast.variant);

  return (
    <div className={`p-4 rounded-lg shadow-lg border-l-4 mb-2 ${classes} transition-all duration-300 ease-out transform translate-x-0`}>
      <h4 className="font-semibold">{toast.title}</h4>
      {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
    </div>
  );
};

// Contenedor donde se muestran todos los toasts
export const Toaster: React.FC = () => {
    // Nota: La lógica real de Toaster se conecta al Context (ver abajo)
    // Pero por ahora, creamos un placeholder
    return (
        <div 
            id="toaster-container"
            className="fixed top-5 right-5 z-[1000] w-full max-w-xs"
        >
            {/* Aquí se renderizarán los toasts */}
        </div>
    );
};