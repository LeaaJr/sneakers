// src/components/StripePaymentForm.tsx

import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, HelpCircle } from 'lucide-react';
import { useOrders } from '@/context/OrdersContext';

interface StripePaymentFormProps {
    subtotal: number;
    formatPrice: (price: number) => string;
}

// Estilos de inyección de Stripe (para que coincida con el tema visual)
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#333',
            '::placeholder': {
                color: '#999',
            },
            padding: '10px 0',
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
    // Es mejor ocultar los iconos nativos de Stripe si ya usamos Lucide en otros inputs
    hideIcon: true, 
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ subtotal, formatPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { placeOrder } = useOrders(); // <--- Usamos el hook
    
    const [stripeError, setStripeError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false); // Para deshabilitar el botón

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStripeError(null);
        
        if (!stripe || !elements || isLoading) {
            return;
        }

        setIsLoading(true);

        const cardElement = elements.getElement(CardElement);

        if (cardElement) {
            // 1. Crear el PaymentMethod (Simulación de éxito de pago)
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            setIsLoading(false);

            if (error) {
                console.error('[Stripe Error]', error);
                setStripeError(error.message || "Un error desconocido ocurrió con Stripe.");
            } else {
                console.log('[PaymentMethod Success]', paymentMethod);
                
                // **2. GUARDAR LA ORDEN Y LIMPIAR CARRITO**
                // En un proyecto real, el BE usa paymentMethod.id para hacer el cobro.
                // Aquí, simulamos el éxito del cobro:
                
                const newOrderId = placeOrder(subtotal); // <--- ¡Llamada a tu lógica de contexto!
                
                // 3. Redirigir o mostrar éxito
                alert(`¡Pago exitoso! Orden ID: ${newOrderId}. Tu carrito ha sido vaciado.`);
                // router.navigate({ to: '/my-orders' }); // Aquí iría la redirección
            }
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- Campo de Tarjeta de Crédito (Gestionado por Stripe) --- */}
            <div className="form-list-row">
                <label className="text-sm text-gray-700 block mb-1">Numero della carta</label>
                <div className="relative w-[85%] border-b-2 border-gray-400 focus-within:border-amber-400 transition-colors py-1 pl-2 pr-2">
                    {/* El CardElement captura de forma segura todos los datos */}
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                {/* Indicador CVC/Fecha (solo visual, Stripe lo maneja internamente) */}
                 {/* <div className="cvc mt-4">
                    <label className="text-sm text-gray-700 block mb-1 relative">
                        CVC Hint 
                        <HelpCircle className="inline-block w-4 h-4 text-blue-500 ml-2 cursor-pointer" />
                    </label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="123" disabled className="w-20 text-center text-base py-1 pl-8 border-b-2 border-gray-400 bg-transparent" />
                    </div>
                </div> */}
            </div>
            
            {/* Mensaje de Error de Stripe */}
            {stripeError && (
                <div className="text-red-500 text-sm mt-2">{stripeError}</div>
            )}

            {/* Checkbox y Botón de Pago */}
            <div className="pt-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <input id="remember" type="checkbox" className="w-4 h-4 text-amber-400 border-gray-300 rounded focus:ring-amber-500" />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                        Ricorda le mie informazioni
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={!stripe}
                    className="text-white text-lg px-8 py-3 rounded-md bg-[#96a0bd] shadow-lg shadow-gray-400/50 transition-colors hover:bg-[#a94dc1] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:opacity-50"
                >
                    Pay {formatPrice(subtotal)} Now
                </button>
            </div>
        </form>
    );
};

export default StripePaymentForm;