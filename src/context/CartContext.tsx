'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
}

interface CartItem extends CartProduct { quantity: number; }
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartProduct) => {
    setCart(current => {
      const existing = current.find(item => item.id === product.id);
      return existing
        ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => setCart(current => current.filter(item => item.id !== productId));

  const clearCart = () => setCart([]);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(current => current.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const getProductQuantity = (productId: string) => cart.find(item => item.id === productId)?.quantity ?? 0;
  const cartTotal = cart.reduce((total, item) => total + (Number(item.price.replace(/[^0-9.]/g, "")) || 0) * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, getProductQuantity, cartTotal, cartItemCount }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
