'use client';

import { useState } from 'react';
import { ChevronRight, Sun, Moon, ShoppingCart, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/stationery" className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-black'} tracking-tight hover:opacity-80 transition-opacity`}>
              Stationery Store
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/stationery"
                className={`px-4 py-2 text-sm transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Shop
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`relative p-2.5 rounded-full transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </div>
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div
          className={`fixed right-0 top-16 bottom-0 w-96 max-w-full ${
            isDark ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'
          } shadow-2xl z-40 flex flex-col`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} shrink-0`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                Shopping Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={isDark ? 'text-white' : 'text-black'} />
              </button>
            </div>
          </div>

          {/* Scrollable Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <ShoppingCart
                  size={48}
                  className={`mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                      >
                        <X
                          size={16}
                          className={isDark ? 'text-gray-400' : 'text-gray-600'}
                        />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className={`p-1 rounded transition-colors ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <Minus
                          size={14}
                          className={isDark ? 'text-white' : 'text-black'}
                        />
                      </button>
                      <span
                        className={`flex-1 text-center font-semibold ${
                          isDark ? 'text-white' : 'text-black'
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className={`p-1 rounded transition-colors ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <Plus
                          size={14}
                          className={isDark ? 'text-white' : 'text-black'}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {cart.length > 0 && (
            <div
              className={`px-6 py-4 border-t ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              } shrink-0`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Subtotal:
                </span>
                <span
                  className={`font-bold text-lg ${
                    isDark ? 'text-white' : 'text-black'
                  }`}
                >
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 top-16"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
}
