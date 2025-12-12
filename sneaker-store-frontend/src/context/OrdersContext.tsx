import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { type CartItem } from './CartContext';
import { useCart } from './CartContext';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
    id: string;
    date: string; // Formato YYYY-MM-DD
    total: number;
    status: OrderStatus;
    items: CartItem[]; // Reutilizamos el tipo de ítem de tu carrito
}

interface OrdersContextType {
    orders: Order[];
    placeOrder: (total: number) => string; // Retorna el ID de la nueva orden
}

// --- Valor por defecto ---
const defaultContextValue: OrdersContextType = {
    orders: [],
    placeOrder: () => { throw new Error('placeOrder must be used within an OrdersProvider'); }
};

const OrdersContext = createContext<OrdersContextType>(defaultContextValue);

// --- Componente Provider ---
const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
    // Aquí podrías usar useEffect para cargar órdenes desde localStorage o un API real
    const [orders, setOrders] = useState<Order[]>([]);
    const { cartItems, getTotal, setCartItems } = useCart(); // OJO: necesitas exponer setCartItems en CartContext para limpiar.

    // ********* NOTA IMPORTANTE *********
    // Para que esto funcione, DEBES exportar `setCartItems` desde tu `CartProvider` 
    // o modificar `CartContext.tsx` para incluir una función `clearCart`.
    
    // Suponiendo que agregaste clearCart() a CartContext:
    // const { cartItems, getTotal, clearCart } = useCart(); 

    const placeOrder = useCallback((total: number): string => {
        // En un escenario real, esto enviaría datos al servidor y recibiría un ID y fecha reales.
        const newOrderId = 'ORD-' + Math.floor(Math.random() * 100000);
        const newOrderDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        if (cartItems.length === 0) {
            console.warn("Attempted to place an order with an empty cart.");
            return '';
        }

        const newOrder: Order = {
            id: newOrderId,
            date: newOrderDate,
            total: total, // Usamos el total calculado y pasado desde CheckoutPage
            status: 'Processing',
            items: cartItems, // Guardamos los ítems actuales del carrito
        };

        setOrders(prevOrders => [newOrder, ...prevOrders]);

        // Simulamos la limpieza del carrito después de la compra exitosa.
        // Si no tienes clearCart en CartContext, reemplaza la línea de abajo con la lógica de limpieza.
        // clearCart(); 
        setCartItems([]); // Asumiendo que puedes acceder a setCartItems o que CartContext tiene clearCart()

        return newOrderId;
    }, [cartItems, setCartItems]); // Dependencia del carrito y la función de limpieza

    const contextValue = useMemo(() => ({
        orders,
        placeOrder,
    }), [orders, placeOrder]);

    return (
        <OrdersContext.Provider value={contextValue}>
            {children}
        </OrdersContext.Provider>
    );
};

// Hook personalizado
const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders debe usarse dentro de un OrdersProvider');
    }
    return context;
};

export default OrdersProvider;
export { useOrders, type Order, type OrderStatus }