// src/context/CartContext
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Define el tipo de un ítem en el carrito
interface CartItem {
  id: string; // O number, basado en tu API
  name: string;
  price: number;
  quantity: number;
  size: string | null; // O el tipo de tu talla
  imageSrc?: string;
  imageAlt?: string;
  [key: string]: any; // Permite otras propiedades de producto
}

interface CartContextType {
  cartItems: CartItem[];
  // ✅ 1. Definimos addToCart para que espere 'price' como string o number
  addToCart: (product: Omit<CartItem, 'quantity' | 'price'> & { quantity?: number; price: number | string; }) => void;
  removeFromCart: (id: string, size?: string | null) => void;
  getTotal: () => number;
  clearCart: () => void;
}

// Valor por defecto (idealmente con funciones que lanzan error)
const defaultContextValue: CartContextType = {
  cartItems: [],
  addToCart: () => { throw new Error('addToCart must be used within a CartProvider'); },
  removeFromCart: () => { throw new Error('removeFromCart must be used within a CartProvider'); },
  getTotal: () => { throw new Error('getTotal must be used within a CartProvider'); },
  clearCart: () => { throw new Error('clearCart must be used within a CartProvider'); }
};

// Crear el contexto con el tipo definido
const CartContext = createContext<CartContextType>(defaultContextValue);

// Función de utilidad para parsear precios (MEJORADA y con tipado)
const parsePrice = (price: number | string | undefined): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // Reemplaza comas por puntos y elimina cualquier caracter no numérico o de puntuación
    const cleaned = price.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Componente Provider
const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Función para agregar un producto al carrito
  const addToCart = useCallback((product: Omit<CartItem, 'quantity' | 'price'> & { quantity?: number; price: number | string; }) => {
    setCartItems(prevItems => {
      // Normaliza el precio: usa 'precio' o 'price' (si es string/number) y lo convierte a number
      const normalizedPrice = parsePrice(product.price);
      const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;
      const productSize = product.size ?? null;

// Busca el ítem existente por ID y TALLA (Lógica de unificación, OK)
      const existingItem = prevItems.find(item =>
        item.id === product.id && item.size === productSize
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.size === productSize
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }


      // Añade el nuevo ítem al carrito
      const newItem: CartItem = {
        ...product as CartItem,
        price: normalizedPrice, // Precio como número
        quantity: quantityToAdd,
        size: productSize,
        id: product.id,
        name: product.name || 'Producto sin nombre',
      };

      return [...prevItems, newItem];
    });
  }, []);

  // Función para eliminar un producto del carrito
  const removeFromCart = useCallback((id: string, size: string | null = null) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.id === id && (size ? item.size === size : true))
      )
    );
  }, []);

  // Calcular el total del carrito
  const getTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = parsePrice(item.price); // El precio ya debería ser number, pero se parsea por seguridad
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

      const clearCart = useCallback(() => {
            setCartItems([]);
        }, []);

  // Memoizar el valor del contexto para optimización
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    getTotal,
    clearCart
  }), [cartItems, addToCart, removeFromCart, getTotal]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

// Exportaciones
export default CartProvider;
export { useCart, type CartItem };