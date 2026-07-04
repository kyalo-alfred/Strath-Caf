import React, { createContext, useContext, useState } from 'react';
import { MenuItem, OrderItem } from '../types';

interface CartContextType {
  cart: OrderItem[];
  addToCart: (menu_item: MenuItem, quantity?: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = (menu_item: MenuItem, quantity = 1) => {
    setCart(current => {
      const existing = current.find(item => item.menu_item.id === menu_item.id);
      if (existing) {
        return current.map(item =>
          item.menu_item.id === menu_item.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { menu_item, quantity }];
    });
  };

  const removeFromCart = (mealId: string) => {
    setCart(current => current.filter(item => item.menu_item.id !== mealId));
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    setCart(current =>
      current.map(item =>
        item.menu_item.id === mealId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.menu_item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
