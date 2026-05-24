'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Sun, Moon, ShoppingCart, X, Minus, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
}

interface Category {
  id: string;
  label: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Pro Max',
    category: 'copy',
    price: '$1,199',
    image: '🍎',
    description: 'Stunning display. Lightning-fast performance.',
    badge: 'New',
  },
  {
    id: 2,
    name: 'Pro',
    category: 'copy',
    price: '$999',
    image: '📱',
    description: 'Powerful. Advanced camera. All-day battery.',
  },
  {
    id: 3,
    name: 'Standard',
    category: 'copy',
    price: '$799',
    image: '📲',
    description: 'The latest in technology.',
  },
  {
    id: 4,
    name: 'Ultra',
    category: 'Pen',
    price: '$799',
    image: '⌚',
    description: 'Titanium. Action button. Rugged design.',
    badge: 'New',
  },
  {
    id: 5,
    name: 'Pro',
    category: 'Pen',
    price: '$399',
    image: '⏱️',
    description: 'Advanced health tracking.',
  },
  {
    id: 6,
    name: 'SE',
    category: 'Pen',
    price: '$249',
    image: '⌛',
    description: 'Essential features. Essential price.',
  },
  {
    id: 7,
    name: 'MacBook Pro',
    category: 'Book',
    price: '$1,999',
    image: '💻',
    description: 'Incredible performance. Stunning display.',
    badge: 'New',
  },
  {
    id: 8,
    name: 'MacBook Air',
    category: 'Book',
    price: '$1,199',
    image: '🖥️',
    description: 'Powerful. Ultraportable.',
  },
  {
    id: 9,
    name: 'iMac',
    category: 'Book',
    price: '$1,499',
    image: '🖨️',
    description: '24-inch. All-in-one. Colorful.',
  },
  {
    id: 10,
    name: 'Air',
    category: 'Sketch',
    price: '$599',
    image: '📔',
    description: 'Thin. Powerful. Colorful.',
  },
  {
    id: 11,
    name: 'Pro',
    category: 'Sketch',
    price: '$1,099',
    image: '📱',
    description: 'The ultimate iPad experience.',
    badge: 'New',
  },
  {
    id: 12,
    name: 'Mini',
    category: 'Pencil',
    price: '$499',
    image: '📲',
    description: 'Powerful. Portable. Intelligent.',
  },
];

const categories: Category[] = [
  { id: 'all', label: 'All Products' },
  { id: 'copy', label: 'Copies' },
  { id: 'Pen', label: 'Pens' },
  { id: 'Book', label: 'Books' },
  { id: 'Sketch', label: 'Sketches' },
  { id: 'Cardboard', label: 'Cardboards' },
  { id: 'Diary', label: 'Diaries' },
  { id: 'Pencil', label: 'Penciles' },
];

export default function ProductPage(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; productName?: string }>({ 
    show: false, 
    message: '',
    productName: ''
  });

  const filteredProducts: Product[] =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  const showToast = (productName: string): void => {
    setToast({ show: true, message: 'Product added to cart.', productName });
    setTimeout(() => {
      setToast({ show: false, message: '', productName: '' });
    }, 3000);
  };

  const addToCart = (product: Product): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        showToast(product.name);
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showToast(product.name);
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number): void => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getProductQuantity = (productId: number): number => {
    const cartItem = cart.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return total + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className={isDark ? 'min-h-screen bg-black' : 'min-h-screen bg-white'}>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-toast-in ${
          isDark ? 'bg-green-600' : 'bg-green-500'
        } text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-green-400/30`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">{toast.message}</span>
            <span className="text-sm opacity-90">{toast.productName}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-black'} tracking-tight`}>
              Stationery Store
            </h1>
            <div className="flex items-center gap-6">
              <button className={`px-4 py-2 text-sm transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}>
                Shop
              </button>

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
        <div className={`fixed right-0 top-16 bottom-0 w-96 max-w-full ${
          isDark ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'
        } shadow-2xl z-40 flex flex-col`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} shrink-0`}>
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
                <ShoppingCart size={48} className={`mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
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
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
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
                        <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <Minus size={14} className={isDark ? 'text-white' : 'text-black'} />
                      </button>
                      <span className={`flex-1 text-center font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <Plus size={14} className={isDark ? 'text-white' : 'text-black'} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {cart.length > 0 && (
            <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} shrink-0`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subtotal:
                </span>
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6 animate-fade-in">
          <h2 className={`text-6xl md:text-7xl font-bold ${
            isDark ? 'text-white' : 'text-black'
          } leading-tight tracking-tight`}>
            Explore Our Collection
          </h2>
          <p className={`text-xl ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          } max-w-2xl mx-auto leading-relaxed`}>
            Discover the latest innovations. Beautifully designed. Brilliantly
            powerful.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? isDark
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-black text-white shadow-lg'
                  : isDark
                  ? 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => {
            const quantity = getProductQuantity(product.id);
            return (
              <div
                key={product.id}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Product Card */}
                <div className={`relative rounded-3xl p-12 overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-linear-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700' 
                    : 'bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300'
                }`}>
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark 
                      ? 'bg-linear-to-br from-gray-800/30 to-transparent' 
                      : 'bg-linear-to-br from-white/50 to-transparent'
                  }`} />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </div>
                  )}

                  {/* Quantity Badge on Product Card */}
                  {quantity > 0 && (
                    <div className="absolute top-6 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce">
                      <ShoppingCart size={12} />
                      {quantity}
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative h-64 flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500">
                    <span className="text-8xl">{product.image}</span>
                  </div>

                  {/* Product Info */}
                  <div className="relative space-y-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'} leading-tight`}>
                      {product.name}
                    </h3>
                    <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-6">
                      <span className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                        {product.price}
                      </span>
                      <div className="flex gap-3">
                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(product)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-300 ${
                            isDark 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          title="Add to cart"
                        >
                          <ShoppingCart size={20} />
                        </button>

                        {/* Learn More Button */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300 ${
                          isDark ? 'bg-white text-black' : 'bg-black text-white'
                        }`}>
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learn More Link */}
                <button className={`mt-4 text-sm font-semibold flex items-center gap-1 group/link transition-colors ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}>
                  Learn more
                  <ChevronRight
                    size={16}
                    className="transform group-hover/link:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
              No products found
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={`py-12 transition-colors duration-300 ${
        isDark ? 'bg-gray-950 text-white border-gray-800' : 'bg-gray-50 text-gray-900 border-gray-200'
      } border-t`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          } border-b`}>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Stationery
                  </a>
                </li>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Books
                  </a>
                </li>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Supplies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; 2024 Stationery Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-toast-in {
          animation: toast-in 0.4s ease-out;
        }

        .group {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}