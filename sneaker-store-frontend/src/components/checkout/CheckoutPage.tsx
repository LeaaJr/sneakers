// src/components/CheckoutPage.tsx

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/config/stripe'; // Importación segura
import { useCart } from '@/context/CartContext';
import { type CartItem } from '@/context/CartContext';
import { User, MapPin, Mail, Smartphone, ChevronLeft, ChevronRight, CreditCard, Lock, HelpCircle } from 'lucide-react';
import StripePaymentForm from './StripePaymentForm';


// --- Subcomponente para la Vista del Carrusel del Producto ---
interface ProductViewProps {
    cartItems: CartItem[];
    currentItemIndex: number;
    onNext: () => void;
    onPrev: () => void;
}

const ProductCarouselView: React.FC<ProductViewProps> = ({ cartItems, currentItemIndex, onNext, onPrev }) => {
    if (cartItems.length === 0) return null;

    const item = cartItems[currentItemIndex];
    const isSingleItem = cartItems.length === 1;

    // Función para formatear el precio
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
    };

    return (
        <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-8">
            <div className="max-w-xs mx-auto relative">
                
                {/* Imagen del Producto Actual */}
                <div className="product-slideshow relative">
                    <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="w-full h-auto object-contain rounded-lg shadow-xl"
                    />

                    {/* Controles de Navegación (Solo si hay más de 1 producto) */}
                    {!isSingleItem && (
                        <>
                            <button 
                                type="button" 
                                onClick={onPrev}
                                className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-white/50 rounded-full shadow-md hover:bg-white/80 transition z-30"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                            <button 
                                type="button" 
                                onClick={onNext}
                                className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-white/50 rounded-full shadow-md hover:bg-white/80 transition z-30"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                        </>
                    )}
                </div>

                {/* Indicadores de Punto (dots - Los "°" solicitados) */}
                {!isSingleItem && (
                    <div className="text-center mt-3 flex justify-center space-x-2">
                        {cartItems.map((_, index) => (
                            <span
                                key={index}
                                // Aquí puedes añadir lógica para ir directamente al slide si lo deseas
                                className={`
                                    w-2 h-2 rounded-full cursor-pointer transition-colors 
                                    ${index === currentItemIndex ? 'bg-white shadow-md' : 'bg-white/50'}
                                `}
                                style={{ boxShadow: index === currentItemIndex ? '0 0 7px rgba(0,0,0,.6)' : '0 0 5px rgba(0,0,0,.3)' }}
                                title={item.name}
                            ></span>
                        ))}
                    </div>
                )}
            </div>

            {/* Detalles del Producto Actual */}
            <h1 className="text-2xl font-light leading-snug text-center text-gray-900 mt-4">
                {item.name}
            </h1>
            <p className="text-sm font-light text-center mt-2 text-white">
                Quantità: {item.quantity} {item.size && `| Taglia: ${item.size}`}
            </p>
            <p className="text-xl font-m tracking-widest text-center mt-3 text-white">
                {formatPrice(item.price * item.quantity)}
            </p>
        </div>
    );
};


// --- Componente Principal CheckoutPage ---

const CheckoutPage: React.FC = () => {
    const { cartItems, getTotal } = useCart();
    const subtotal = getTotal();

    // Estado para controlar el índice del carrusel
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    // Navegación del Carrusel
    const handleNext = () => {
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % cartItems.length);
    };
    const handlePrev = () => {
        setCurrentItemIndex((prevIndex) => (prevIndex - 1 + cartItems.length) % cartItems.length);
    };

    // Formateo del precio (usando "EUR" para coincidir con el idioma italiano del formulario)
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
    };
    
    // Evitar renderizado si está vacío
    if (cartItems.length === 0) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold">Il tuo carrello è vuoto.</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-5xl h-[650px] bg-white rounded-lg overflow-hidden shadow-2xl flex">
                
                {/* Columna Izquierda: Vista del Producto (Carrusel) */}
                <div className="w-2/5 h-full relative float-left">
                    <div className="w-[125%] h-[150%] absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b95b6] opacity-80 shadow-xl z-10"></div>
                    
                    <ProductCarouselView 
                        cartItems={cartItems} 
                        currentItemIndex={currentItemIndex} 
                        onNext={handleNext} 
                        onPrev={handlePrev}
                    />
                </div>

                {/* Columna Derecha: Formulario de Envío y Pago */}
                <div className="w-3/5 h-full relative float-right overflow-y-auto">
                    {/* Elements de Stripe envuelve toda la sección de pago */}
                    <Elements stripe={stripePromise}> 
                        <div className="w-[90%] absolute top-0 left-[5%] p-6">
                            <h2 className="text-4xl font-normal ml-4 mb-8 pt-4">Dettagli Checkout</h2>
                            
                            {/* Formulario 1: Información de Envío (Datos no sensibles) */}
                            {/* NOTA: Usamos un <form> para que los datos puedan ser manejados por un useState/hook */}
                            <form className="ml-8 mt-6">
                                
                                {/* --- SECCIÓN 1: INFORMACIÓN DE ENVÍO --- */}
                                <h3 className="text-xl font-medium mb-4 text-gray-800">1. Indirizzo di spedizione</h3>
                                <ul className="space-y-4">
                                    {/* Nome e Cognome */}
                                    <li className="form-list-row flex space-x-4">
                                        <div className="w-1/2">
                                            <label htmlFor="firstName" className="text-sm text-gray-700 block mb-1">Nome</label>
                                            <div className="relative">
                                                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input id="firstName" type="text" required placeholder="Nome" className="w-full text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <label htmlFor="lastName" className="text-sm text-gray-700 block mb-1">Cognome</label>
                                            <input id="lastName" type="text" required placeholder="Cognome" className="w-full text-base py-1 pl-2 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                        </div>
                                    </li>
                                    
                                    {/* Via e Città */}
                                    <li className="form-list-row">
                                        <label htmlFor="street" className="text-sm text-gray-700 block mb-1">Indirizzo</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input id="street" type="text" required placeholder="Via e numero civico" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                        </div>
                                    </li>
                                    <li className="form-list-row flex space-x-4">
                                        <div className="w-1/2">
                                            <label htmlFor="city" className="text-sm text-gray-700 block mb-1">Città</label>
                                            <input id="city" type="text" required placeholder="Città" className="w-full text-base py-1 pl-2 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                        </div>
                                        <div className="w-1/2">
                                            <label htmlFor="zip" className="text-sm text-gray-700 block mb-1">CAP (Codice Postale)</label>
                                            <input id="zip" type="text" required placeholder="00000" className="w-full text-base py-1 pl-2 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                        </div>
                                    </li>

                                    {/* Email y Telefono */}
                                    <li className="form-list-row">
                                        <label htmlFor="email" className="text-sm text-gray-700 block mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input id="email" type="email" required placeholder="tua@email.com" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                        </div>
                                    </li>
                                    <li className="form-list-row">
                                        <label htmlFor="phone" className="text-sm text-gray-700 block mb-1">Numero di Telefono</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input id="phone" type="tel" required placeholder="+39 555 123 4567" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-[#a94dc1] focus:outline-none" />
                                        </div>
                                    </li>
                                </ul>
                            </form>
                            
                            {/* --- SECCIÓN 2: INFORMACIÓN DE PAGO (Stripe) --- */}
                            <div className="ml-8 mt-8">
                                <h3 className="text-xl font-medium mb-4 text-gray-800">2. Metodo di pagamento</h3>
                                <StripePaymentForm 
                                    subtotal={subtotal} 
                                    formatPrice={formatPrice} 
                                />
                            </div>
                            
                            {/* Espacio final para el scroll */}
                            <div className="h-10"></div>
                        </div>
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;