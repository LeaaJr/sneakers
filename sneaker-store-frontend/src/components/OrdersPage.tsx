// src/components/OrdersPage.tsx

import React from 'react';
// Asegúrate de que este hook existe, si no, déjalo comentado.
// import { useAuth } from '@/components/hooks/useAuth'; 
import { useOrders, type Order, type OrderStatus } from '@/context/OrdersContext';
import { Truck, Package, CheckCircle, XCircle } from 'lucide-react';

// --- Componentes Auxiliares (Mismos que antes) ---
const getStatusStyles = (status: OrderStatus) => {
    // ... (Tu lógica de iconos y colores se mantiene) ...
    switch (status) {
        case 'Processing':
            return { icon: Package, text: 'In Elaborazione', color: 'text-amber-500', bg: 'bg-amber-100' };
        case 'Shipped':
            return { icon: Truck, text: 'Spedito', color: 'text-blue-500', bg: 'bg-blue-100' };
        case 'Delivered':
            return { icon: CheckCircle, text: 'Consegnato', color: 'text-green-600', bg: 'bg-green-100' };
        case 'Cancelled':
            return { icon: XCircle, text: 'Annullato', color: 'text-red-500', bg: 'bg-red-100' };
        default:
            return { icon: Package, text: 'Sconosciuto', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
};

// --- Componente Principal ---

const OrdersPage: React.FC = () => {
    // const { isAuthenticated } = useAuth(); // Usa tu hook de autenticación real
    const isAuthenticated = true; // SIMULACIÓN: Asumimos que está logueado para ver la página
    
    const { orders } = useOrders(); 

    // 1. MANEJO DE AUTENTICACIÓN (CORREGIDO)
    if (!isAuthenticated) {
        return (
            <div className="p-8 text-center mt-20">
                <h1 className="text-2xl font-bold">Accesso Negato</h1>
                <p className="text-gray-600 mt-2">Per favore, accedi per vedere i tuoi ordini.</p>
            </div>
        );
    }

    // 2. MANEJO DE CARRITO VACÍO (Esta es la línea 40 que viste en tu error)
    if (orders.length === 0) {
        return (
            <div className="p-8 text-left mt-20">
                <h1 className="text-2xl font-bold">Non hai ancora ordini.</h1>
                <p className="text-gray-600 mt-2">Inizia a fare acquisti ora!</p>
            </div>
        );
    }
    
    // Formato de moneda
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-light text-gray-900 mb-8 border-b pb-4">I Miei Ordini ({orders.length})</h1>
            
            <div className="space-y-6">
                {orders.map((order) => {
                    const { icon: StatusIcon, text: statusText, color, bg } = getStatusStyles(order.status);

                    return (
                        // ... (El resto del JSX para renderizar la orden se mantiene) ...
                        <div key={order.id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                            {/* Encabezado de la Orden */}
                            <div className="p-5 flex justify-between items-center border-b bg-gray-50">
                                {/* ... Detalles ... */}
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">ID Ordine</p>
                                    <p className="font-semibold text-gray-800">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Data</p>
                                    <p className="font-semibold text-gray-800">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Totale</p>
                                    <p className="font-bold text-lg text-gray-900">{formatCurrency(order.total)}</p>
                                </div>
                                
                                {/* Estado */}
                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${color} ${bg}`}>
                                    <StatusIcon className="w-4 h-4 mr-1" />
                                    {statusText}
                                </div>
                            </div>
                            
                            {/* Cuerpo de la Orden: Artículos */}
                            <div className="p-4 space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id + (item.size || '')} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                                        <img 
                                            src={item.imageSrc || 'https://via.placeholder.com/64'}
                                            alt={item.name} 
                                            className="w-16 h-16 object-cover rounded-md" 
                                        />
                                        
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Qtà: {item.quantity} 
                                                {item.size && ` | Taglia: ${item.size}`}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-700">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersPage;