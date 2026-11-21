'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useCart, type CartProduct } from '@/context/CartContext';
import { ArrowLeft, Package, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

type StoreProduct = CartProduct & { stock: number; compareAt: number; imageUrl: string };
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
});

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const { addToCart, getProductQuantity } = useCart();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || 'Unable to load product.');
        if (!cancelled) setProducts((data.products || []).map(mapProduct));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const product = products.find(item => item.id === params.id);
  const related = useMemo(() => product ? products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4) : [], [products, product]);
  const quantity = product ? getProductQuantity(product.id) : 0;

  const handleAdd = () => {
    if (!product || product.stock < 1) return;
    addToCart({ id: product.id, name: product.name, category: product.category, price: product.price, image: product.image, description: product.description });
    setToast('Added to cart');
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className={isDark ? 'min-h-screen bg-black text-white' : 'min-h-screen bg-white text-gray-950'}>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/stationery" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mb-8"><ArrowLeft size={17}/> Back to products</Link>
        {loading ? <div className="py-32 text-center text-gray-500">Loading product…</div> : error ? <div className="py-32 text-center text-red-500">{error}</div> : !product ? <div className="py-32 text-center"><Package size={48} className="mx-auto mb-4 text-gray-400"/><h1 className="text-2xl font-bold">Product not found</h1><p className="mt-2 text-gray-500">This product may have been removed or is no longer available.</p><Link href="/stationery" className="inline-block mt-6 rounded-full bg-blue-600 text-white px-6 py-3 font-semibold">Browse products</Link></div> : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className={`rounded-3xl min-h-[360px] md:min-h-[520px] flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full max-h-[560px] object-contain p-8"/> : <Package size={100} className="text-gray-300"/>}
              </div>
              <div className="space-y-6">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
                <div className="flex items-baseline gap-3"><strong className="text-3xl">{product.price}</strong>{product.compareAt > 0 && product.compareAt > Number(product.price.replace(/[^0-9.]/g, '')) && <span className="text-lg text-gray-400 line-through">{money(product.compareAt)}</span>}</div>
                <p className={`text-lg leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{product.description || 'Quality stationery for everyday use.'}</p>
                <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.stock > 0 ? `In stock · ${product.stock} available` : 'Currently out of stock'}</p>
                <button onClick={handleAdd} disabled={product.stock < 1} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 font-bold text-lg flex items-center justify-center gap-3"><ShoppingCart size={22}/>{quantity > 0 ? `Add another · ${quantity} in cart` : 'Add to cart'}</button>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl p-5 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3"><Truck className="text-blue-600"/><div><b className="block">Delivery</b><span className="text-sm text-gray-500">Delivery options at checkout</span></div></div>
                  <div className="flex items-center gap-3"><ShieldCheck className="text-blue-600"/><div><b className="block">Secure shopping</b><span className="text-sm text-gray-500">Your order details stay protected</span></div></div>
                </div>
              </div>
            </section>
            {related.length > 0 && <section className="mt-20"><h2 className="text-2xl font-bold mb-6">More in {product.category}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-5">{related.map(item => <Link key={item.id} href={`/stationery/${item.id}`} className={`rounded-2xl border p-4 hover:shadow-lg transition-shadow ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'}`}><div className="h-36 flex items-center justify-center">{item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain"/> : <Package className="text-gray-300" size={42}/>}</div><h3 className="font-bold mt-3 line-clamp-2">{item.name}</h3><p className="font-semibold mt-2">{item.price}</p></Link>)}</div></section>}
          </>
        )}
      </main>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-green-600 text-white px-6 py-3 shadow-xl font-semibold">{toast}</div>}
    </div>
  );
}
