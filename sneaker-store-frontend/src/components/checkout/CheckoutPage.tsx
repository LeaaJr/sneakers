import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { type CartItem } from '@/context/CartContext';
import { User, CreditCard, Lock, HelpCircle, MapPin, Mail, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Subcomponente para la Vista del Carrusel del Producto ---
interface ProductViewProps {
    cartItems: CartItem[];
    currentItemIndex: number;
    onNext: () => void;
    onPrev: () => void;
}

const ProductCarouselView: React.FC<ProductViewProps> = ({ cartItems, currentItemIndex, onNext, onPrev }) => {
    // Si el carrito está vacío, no renderizamos nada (aunque el padre ya maneja este caso)
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
                                className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-white/50 rounded-full shadow-md hover:bg-white/80 transition"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                            <button 
                                type="button" 
                                onClick={onNext}
                                className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-white/50 rounded-full shadow-md hover:bg-white/80 transition"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                        </>
                    )}
                </div>

                {/* Indicadores de Punto (dots - Los "°" que solicitaste) */}
                {!isSingleItem && (
                    <div className="text-center mt-3 flex justify-center space-x-2">
                        {cartItems.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => {}} // Puedes implementar la navegación directa si lo deseas
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
                Quantity: {item.quantity} {item.size && `| Size: ${item.size}`}
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

    // Formateo del precio para el botón
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
    };
    
    // Evitar renderizado si está vacío
    if (cartItems.length === 0) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
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
                    <div className="w-[90%] absolute top-0 left-[5%] p-6">
                        <h2 className="text-4xl font-normal ml-4 mb-8 pt-4">Dettagli del pagamento</h2>
                        
                        <form onSubmit={(e) => e.preventDefault()} className="ml-8 mt-6">
                            
                            {/* --- SECCIÓN 1: INFORMACIÓN DE ENVÍO --- */}
                            <h3 className="text-xl font-medium mb-4 text-gray-800">1. Indirizzo di spedizione</h3>
                            <ul className="space-y-4">
                                {/* Nombre y Apellido */}
                                <li className="form-list-row flex space-x-4">
                                    <div className="w-1/2">
                                        <label htmlFor="firstName" className="text-sm text-gray-700 block mb-1">Nome</label>
                                        <div className="relative">
                                            <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input id="firstName" type="text" required placeholder="Name" className="w-full text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="lastName" className="text-sm text-gray-700 block mb-1">cognome</label>
                                        <input id="lastName" type="text" required placeholder="Surname" className="w-full text-base py-1 pl-2 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                </li>
                                
                                {/* Calle y Ciudad */}
                                <li className="form-list-row">
                                    <label htmlFor="street" className="text-sm text-gray-700 block mb-1">Indirizzo stradale</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input id="street" type="text" required placeholder="Street and House Number" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                </li>
                                <li className="form-list-row flex space-x-4">
                                    <div className="w-1/2">
                                        <label htmlFor="city" className="text-sm text-gray-700 block mb-1">Città</label>
                                        <input id="city" type="text" required placeholder="City" className="w-full text-base py-1 pl-2 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                     <div className="w-1/2">
                                        <label htmlFor="zip" className="text-sm text-gray-700 block mb-1">Zip / Codice postale</label>
                                        <input id="zip" type="text" required placeholder="00000" className="w-full text-base py-1 pl-2 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                </li>

                                {/* Email y Teléfono */}
                                <li className="form-list-row">
                                    <label htmlFor="email" className="text-sm text-gray-700 block mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input id="email" type="email" required placeholder="your@email.com" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                </li>
                                <li className="form-list-row">
                                    <label htmlFor="phone" className="text-sm text-gray-700 block mb-1">Numero di telefono</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input id="phone" type="tel" required placeholder="+1 555 123 4567" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                </li>
                            </ul>


                            {/* --- SECCIÓN 2: INFORMACIÓN DE PAGO --- */}
                            <h3 className="text-xl font-medium mb-4 mt-8 text-gray-800">2. Metodo di pagamento</h3>
                            <ul className="space-y-4">
                                {/* Número de Tarjeta */}
                                <li className="form-list-row">
                                    <label htmlFor="cardNumber" className="text-sm text-gray-700 block mb-1">Numero della carta</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input id="cardNumber" type="text" required placeholder="XXXX XXXX XXXX XXXX" className="w-[85%] text-base py-1 pl-8 pr-2 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                    </div>
                                </li>

                                {/* Fecha y CVC */}
                                <li className="form-list-row flex items-start space-x-16">
                                    <div className="date">
                                        <label className="text-sm text-gray-700 block mb-1">Data di scadenza</label>
                                        <div className="flex space-x-4 mt-1">
                                            <input type="text" required placeholder="MM" maxLength={2} className="w-16 text-center text-base py-1 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                            <input type="text" required placeholder="YY" maxLength={2} className="w-16 text-center text-base py-1 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="cvc">
                                        <label className="text-sm text-gray-700 block mb-1 relative">
                                            CVC 
                                            <HelpCircle className="inline-block w-4 h-4 text-blue-500 ml-2 cursor-pointer" />
                                        </label>
                                        <div className="relative mt-1">
                                            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="text" required placeholder="123" maxLength={4} className="w-20 text-center text-base py-1 pl-8 border-b-2 border-gray-400 bg-transparent transition-colors focus:border-amber-400 focus:outline-none" />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            
                            {/* Checkbox y Botón de Pago */}
                            <div className="mt-8 flex justify-between items-center mb-10">
                                <div className="flex items-center space-x-2">
                                    <input id="remember" type="checkbox" className="w-4 h-4 text-amber-400 border-gray-300 rounded focus:ring-amber-500" />
                                    <label htmlFor="remember" className="text-sm text-gray-600">
                                        Ricorda le mie informazioni
                                    </label>
                                </div>
                                <button 
                                    type="submit" 
                                    className="text-white text-lg px-8 py-3 rounded-md bg-[#8b95b6] shadow-lg shadow-gray-400/50 transition-colors hover:bg-[#d3d7e3] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                                >
                                    Pay {formatPrice(subtotal)} Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;