'use client';

import { useState } from 'react';
import { ChevronRight, Sun, Moon, ShoppingCart, X, Minus, Plus, Heart, Share2, Star, Truck, RotateCcw, Lock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
}

// Product database
const allProducts: Product[] = [
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
    name: 'MacBook Pro max',
    category: 'Book',
    price: '$1,999',
    image: '💻',
    description: 'Incredible performance. Stunning display.',
    badge: 'New',
  },
];

interface DetailedProduct extends Product {
  specifications: { label: string; value: string }[];
  features: string[];
  reviews: { rating: number; author: string; comment: string; date: string }[];
  inStock: boolean;
  warranty: string;
}

const getProductDetails = (id: number): DetailedProduct => {
  const baseProduct = allProducts.find((p) => p.id === id) || allProducts[0];
  
  return {
    ...baseProduct,
    specifications: [
      { label: 'Brand', value: 'Premium Store' },
      { label: 'Color', value: 'Midnight Black' },
      { label: 'Storage', value: '256GB' },
      { label: 'RAM', value: '8GB' },
      { label: 'Display', value: '6.7 inches AMOLED' },
      { label: 'Battery', value: '4500mAh' },
      { label: 'Processor', value: 'Latest Gen' },
      { label: 'Camera', value: '48MP + 12MP' },
    ],
    features: [
      '5G Connectivity',
      'IP68 Water Resistance',
      'Advanced AI Features',
      'All-day Battery Life',
      'Wireless Charging',
      'Face & Fingerprint Unlock',
      'Premium Build Quality',
      'Extended Warranty Available',
    ],
    reviews: [
      {
        rating: 5,
        author: 'Sarah Johnson',
        comment: 'Absolutely fantastic product! The quality is incredible and delivery was fast. Highly recommend!',
        date: '2 days ago',
      },
      {
        rating: 5,
        author: 'Mike Chen',
        comment: 'Best purchase I made this year. Exceeded all my expectations.',
        date: '1 week ago',
      },
      {
        rating: 4,
        author: 'Emma Wilson',
        comment: 'Great product overall. Minor issues but excellent customer service.',
        date: '2 weeks ago',
      },
      {
        rating: 5,
        author: 'David Brown',
        comment: 'Premium quality at a fair price. Will definitely buy again!',
        date: '3 weeks ago',
      },
    ],
    inStock: true,
    warranty: '2 Year International Warranty',
  };
};

export default function ProductDetail() {
  const params = useParams();
  const [isDark, setIsDark] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');

  const productId = parseInt(params.id as string) || 1;
  const product = getProductDetails(productId);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== productId)
    .slice(0, 4);

  const averageRating = (
    product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
  ).toFixed(1);

  return (
    <div className={isDark ? 'min-h-screen bg-black' : 'min-h-screen bg-white'}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/stationery" className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-black'} tracking-tight hover:opacity-80 transition`}>
              Stationery Store
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/stationery" className={`px-4 py-2 text-sm transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}>
                Back to Shop
              </Link>
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Detail Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className={`rounded-2xl p-12 flex items-center justify-center relative ${
            isDark ? 'bg-linear-to-br from-gray-900 to-black border border-gray-800' : 'bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200'
          }`}>
            {product.badge && (
              <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                {product.badge}
              </div>
            )}
            <div className="text-9xl">{product.image}</div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {product.category}
                </span>
              </div>
              <h1 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-4`}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(parseFloat(averageRating)) ? 'fill-yellow-400 text-yellow-400' : isDark ? 'text-gray-700' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                  {averageRating}
                </span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {product.price}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 text-lg font-semibold ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Description */}
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {product.description}
            </p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Quantity:</span>
                <div className={`flex items-center border rounded-lg ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-50'}`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`px-4 py-2 transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  >
                    −
                  </button>
                  <span className={`px-6 py-2 font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`px-4 py-2 transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={24} />
                Add to Cart
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isWishlisted
                      ? isDark
                        ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                        : 'bg-red-50 text-red-600 border border-red-200'
                      : isDark
                      ? 'bg-gray-900 text-white border border-gray-800 hover:bg-gray-800'
                      : 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  Wishlist
                </button>
                <button className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isDark ? 'bg-gray-900 text-white border border-gray-800 hover:bg-gray-800' : 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200'
                }`}>
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className={`p-6 rounded-lg space-y-4 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-start gap-4">
                <Truck size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Free Shipping</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On orders above $100</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <RotateCcw size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Easy Returns</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Lock size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Secure Payment</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex gap-8">
            {(['details', 'reviews', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold text-lg transition-colors border-b-2 ${
                  activeTab === tab
                    ? isDark
                      ? 'text-white border-white'
                      : 'text-black border-black'
                    : isDark
                    ? 'text-gray-400 border-transparent hover:text-white'
                    : 'text-gray-600 border-transparent hover:text-black'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                  Specifications
                </h3>
                <div className="space-y-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {spec.label}
                      </span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                  Features
                </h3>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                Customer Reviews
              </h3>
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg ${
                      isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                          {review.author}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : isDark ? 'text-gray-700' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {review.date}
                      </span>
                    </div>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className={`p-8 rounded-lg ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                Shipping & Delivery
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                    Delivery Options
                  </h4>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Standard Delivery: 5-7 business days (Free on orders above $100)</li>
                    <li>• Express Delivery: 2-3 business days ($15)</li>
                    <li>• Overnight Delivery: Next business day ($35)</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                    {product.warranty}
                  </h4>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    This product comes with a comprehensive warranty covering manufacturing defects and hardware failures.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-black'}`}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relProduct) => (
              <Link
                key={relProduct.id}
                href={`/stationery/${relProduct.id}`}
                className={`rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isDark ? 'bg-gray-900 border border-gray-800 hover:border-gray-700' : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-6xl mb-4 text-center">{relProduct.image}</div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  {relProduct.name}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {relProduct.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-black'}`}>
                    {relProduct.price}
                  </span>
                  <ChevronRight size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-12 transition-colors duration-300 ${
        isDark ? 'bg-gray-950 text-white border-gray-800' : 'bg-gray-50 text-gray-900 border-gray-200'
      } border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          } border-b`}>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Products</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Categories</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Help</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>About</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Privacy</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Terms</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; 2024 Stationery Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}