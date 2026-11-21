'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ChevronRight, ShoppingCart, Search, Package } from 'lucide-react';
import Link from 'next/link';
import { useCart, type CartProduct } from '@/context/CartContext';

type StoreProduct = CartProduct & {
  stock: number;
  compareAt: number;
  featured: boolean;
  imageUrl: string;
};

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
const mapProduct = (item: Record<string, unknown>): StoreProduct => ({
  id: String(item._id),
  name: String(item.name || ''),
  category: String(item.category || 'Other'),
  price: money(Number(item.price) || 0),
  image: typeof item.image === 'string' ? item.image : '',
  imageUrl: typeof item.image === 'string' ? item.image : '',
  description: String(item.description || ''),
  stock: Number(item.stock) || 0,
  compareAt: Number(item.compareAt) || 0,
  featured: item.featured === true,
});

export default function ProductPage() {
  const { isDark } = useTheme();
  const { addToCart, getProductQuantity } = useCart();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || 'Unable to load products.');
        if (!cancelled) setProducts((data.products || []).map(mapProduct));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load products.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(product => product.category)))], [products]);
  const filtered = useMemo(() => products.filter(product =>
    (activeCategory === 'All' || product.category === activeCategory) &&
    [product.name, product.category, product.description].join(' ').toLowerCase().includes(search.toLowerCase())
  ), [products, activeCategory, search]);

  const add = (product: StoreProduct) => {
    if (product.stock < 1) return;
    addToCart({ id: product.id, name: product.name, category: product.category, price: product.price, image: product.image, description: product.description });
    setToast(product.name + ' added to cart');
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className={isDark ? 'min-h-screen bg-black text-white' : 'min-h-screen bg-white text-gray-950'}>
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 mb-4">S K Stationery & Janseva Kendr</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Stationery essentials, all in one place</h1>
        <p className={`text-lg mt-5 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Browse our available stationery, school and office supplies.</p>
        <div className="max-w-xl mx-auto mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19}/>
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products..." className={`w-full rounded-full border py-3 pl-12 pr-5 outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}/>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {categories.length > 1 && <div className="flex gap-2 overflow-x-auto pb-5 mb-8">{categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${activeCategory === category ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-900 text-gray-300 border border-gray-800' : 'bg-gray-100 text-gray-700'}`}>{category}</button>)}</div>}
        {loading ? <div className="py-24 text-center text-gray-500">Loading products…</div> : error ? <div className="py-24 text-center"><p className="text-red-500 font-semibold">{error}</p><button onClick={() => window.location.reload()} className="mt-4 text-blue-600 font-semibold">Try again</button></div> : filtered.length === 0 ? <div className="py-24 text-center"><Package size={42} className="mx-auto mb-4 text-gray-400"/><p className="text-xl font-semibold">No products available</p><p className="text-gray-500 mt-2">Please check back soon or try another search.</p></div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => {
              const quantity = getProductQuantity(product.id);
              return <article key={product.id} className={`group rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                <Link href={`/stationery/${product.id}`} className={`relative h-64 flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"/> : <Package size={64} className="text-gray-300"/>}
                  {product.featured && <span className="absolute top-4 left-4 rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-bold">Featured</span>}
                  {quantity > 0 && <span className="absolute top-4 right-4 rounded-full bg-gray-950 text-white px-3 py-1 text-xs font-bold"><ShoppingCart size={12} className="inline mr-1"/>{quantity}</span>}
                </Link>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{product.category}</p>
                  <Link href={`/stationery/${product.id}`}><h2 className="mt-2 text-xl font-bold line-clamp-2">{product.name}</h2></Link>
                  <p className={`mt-2 text-sm line-clamp-2 min-h-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.description || 'Quality stationery for everyday use.'}</p>
                  <div className="flex items-center justify-between mt-5 gap-3">
                    <div><strong className="text-xl">{product.price}</strong>{product.compareAt > 0 && product.compareAt > Number(product.price.replace(/[^0-9.]/g, '')) && <p className="text-xs text-gray-400 line-through">{money(product.compareAt)}</p>}</div>
                    <button disabled={product.stock < 1} onClick={() => add(product)} className="rounded-full bg-blue-600 text-white p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed" aria-label="Add to cart"><ShoppingCart size={18}/></button>
                    <Link href={`/stationery/${product.id}`} className={`rounded-full p-3 ${isDark ? 'bg-white text-black' : 'bg-gray-950 text-white'}`} aria-label="View product"><ChevronRight size={18}/></Link>
                  </div>
                  <p className={`mt-3 text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-green-600 text-white px-6 py-3 shadow-xl font-semibold">{toast}</div>}
    </div>
  );
}
