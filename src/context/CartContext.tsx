'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  category: string;
  /** Display-only price, refreshed from the catalogue when available. */
  price: string;
  /** Numeric snapshot for cart display totals; checkout must re-read the database price. */
  unitPrice: number;
  stock: number;
  image: string;
  description: string;
  badge?: string;
}

interface CartItem extends CartProduct { quantity: number; }
interface CartContextType {
  cart: CartItem[];
  hydrated: boolean;
  addToCart: (product: CartProduct) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'sk-stationary-cart-v1';

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return typeof item.id === 'string' && typeof item.name === 'string' &&
    typeof item.category === 'string' && typeof item.price === 'string' &&
    typeof item.unitPrice === 'number' && Number.isFinite(item.unitPrice) && item.unitPrice >= 0 &&
    typeof item.stock === 'number' && Number.isInteger(item.stock) && item.stock >= 0 &&
    typeof item.image === 'string' && typeof item.description === 'string' &&
    typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate only on the client. The flag prevents the initial empty SSR state
  // from overwriting a cart already saved in localStorage.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed.filter(isCartItem).map(item => ({
            ...item,
            quantity: Math.min(item.quantity, item.stock),
          })).filter(item => item.quantity > 0));
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // Cart remains usable for this session if browser storage is unavailable.
      console.warn('[cart] Unable to persist cart in browser storage.', error);
    }
  }, [cart, hydrated]);

  // Refresh persisted snapshots against the current public catalogue so renamed,
  // repriced, inactive, deleted or restocked products do not stay stale in the UI.
  useEffect(() => {
    if (!hydrated || cart.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.ok || !Array.isArray(data.products) || cancelled) return;
        const current = new Map<string, Record<string, unknown>>(
          data.products.map((product: Record<string, unknown>) => [String(product._id), product])
        );
        setCart(previous => previous.flatMap(item => {
          const product = current.get(item.id);
          if (!product) return [];
          const stock = Math.max(0, Math.floor(Number(product.stock) || 0));
          const unitPrice = Number(product.price);
          if (!Number.isFinite(unitPrice) || unitPrice < 0 || stock < 1) return [];
          return [{
            ...item,
            name: String(product.name || item.name),
            category: String(product.category || item.category),
            unitPrice,
            price: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(unitPrice),
            stock,
            image: typeof product.image === 'string' ? product.image : '',
            description: typeof product.description === 'string' ? product.description : '',
            quantity: Math.min(item.quantity, stock),
          }];
        }));
      } catch {
        // Preserve the saved cart during temporary network/database outages.
      }
    })();
    return () => { cancelled = true; };
  }, [hydrated, cart.length]); // Refresh when hydration or cart membership changes.

  const addToCart = (product: CartProduct) => {
    if (!Number.isInteger(product.stock) || product.stock < 1 ||
        !Number.isFinite(product.unitPrice) || product.unitPrice < 0) return false;
    const existing = cart.find(item => item.id === product.id);
    if (existing && existing.quantity >= product.stock) return false;
    setCart(existing
      ? cart.map(item => item.id === product.id
        ? { ...product, quantity: Math.min(item.quantity + 1, product.stock) }
        : item)
      : [...cart, { ...product, quantity: 1 }]);
    return true;
  };

  const removeFromCart = (productId: string) => setCart(current => current.filter(item => item.id !== productId));
  const clearCart = () => setCart([]);

  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(current => current.map(item => item.id === productId
      ? { ...item, quantity: Math.min(Math.floor(quantity), item.stock) }
      : item).filter(item => item.quantity > 0));
  };

  const getProductQuantity = (productId: string) => cart.find(item => item.id === productId)?.quantity ?? 0;
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  return <CartContext.Provider value={{ cart, hydrated, addToCart, removeFromCart, clearCart, updateQuantity, getProductQuantity, cartTotal, cartItemCount }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
