'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart, type CartProduct } from '@/context/CartContext';
import { ArrowLeft, Package, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

type StoreProduct = CartProduct & { stock: number; compareAt: number; imageUrl: string };
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
const mapProduct = (item: Record<string, unknown>): StoreProduct => ({
  id: String(item._id), name: String(item.name || ''), category: String(item.category || 'Other'),
  price: money(Number(item.price) || 0), unitPrice: Number(item.price) || 0, image: typeof item.image === 'string' ? item.image : '',
  imageUrl: typeof item.image === 'string' ? item.image : '', description: String(item.description || ''),
  stock: Number(item.stock) || 0, compareAt: Number(item.compareAt) || 0,
});

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
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
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const product = products.find(item => item.id === params.id);
  const related = useMemo(() => product ? products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4) : [], [products, product]);
  const quantity = product ? getProductQuantity(product.id) : 0;

  const handleAdd = () => {
    if (!product || product.stock < 1) return;
    const added = addToCart({ id: product.id, name: product.name, category: product.category, price: product.price, unitPrice: product.unitPrice, stock: product.stock, image: product.image, description: product.description });
    setToast(added ? 'Added to cart' : `Only ${product.stock} available; your cart has reached the stock limit.`);
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#20191a]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/stationery" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#760314] hover:text-[#5f020f]"><ArrowLeft size={17}/> Back to products</Link>
        {loading ? <div className="py-32 text-center text-[#71686a]">Loading product…</div> : error ? <div className="py-32 text-center text-red-700">{error}</div> : !product ? <div className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] py-24 text-center"><Package size={48} className="mx-auto mb-4 text-[#b8a9a0]"/><h1 className="text-2xl font-bold text-[#5f020f]">Product not found</h1><p className="mt-2 text-[#71686a]">This product may have been removed or is no longer available.</p><Link href="/stationery" className="mt-6 inline-block rounded-full bg-[#760314] px-6 py-3 font-semibold text-white">Browse products</Link></div> : (
          <>
            <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-[#e9e0d5] bg-[#f1e9df] md:min-h-[500px]">
                {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-8"/> : <Package size={100} className="text-[#b8a9a0]"/>}
              </div>
              <div className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-[#760314]">{product.category}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#5f020f] sm:text-4xl">{product.name}</h1>
                <div className="mt-5 flex items-baseline gap-3"><strong className="text-3xl text-[#760314]">{product.price}</strong>{product.compareAt > 0 && product.compareAt > product.unitPrice && <span className="text-lg text-[#91898a] line-through">{money(product.compareAt)}</span>}</div>
                <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-[#71686a]">{product.description || 'Quality stationery for everyday use.'}</p>
                <p className={`mt-5 font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>{product.stock > 0 ? `In stock · ${product.stock} available` : 'Currently out of stock'}</p>
                <button onClick={handleAdd} disabled={product.stock < 1} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#760314] py-4 text-lg font-bold text-white transition hover:bg-[#5f020f] disabled:cursor-not-allowed disabled:bg-[#b8a9a0]"><ShoppingCart size={22}/>{quantity > 0 ? `Add another · ${quantity} in cart` : 'Add to cart'}</button>
                <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#e9e0d5] bg-[#f7f3ea] p-5 sm:grid-cols-2">
                  <div className="flex items-center gap-3"><Truck className="shrink-0 text-[#760314]"/><div><b className="block text-[#5f020f]">Delivery</b><span className="text-sm text-[#71686a]">Delivery options at checkout</span></div></div>
                  <div className="flex items-center gap-3"><ShieldCheck className="shrink-0 text-[#760314]"/><div><b className="block text-[#5f020f]">Secure shopping</b><span className="text-sm text-[#71686a]">Your order details stay protected</span></div></div>
                </div>
              </div>
            </section>
            {related.length > 0 && <section className="mt-16"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold text-[#5f020f]">More in {product.category}</h2><Link href="/stationery" className="text-sm font-semibold text-[#760314]">View all</Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map(item => <Link key={item.id} href={`/stationery/${item.id}`} className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-4 transition hover:-translate-y-1 hover:shadow-md"><div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#f1e9df]">{item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-2"/> : <Package className="text-[#b8a9a0]" size={42}/>}</div><h3 className="mt-3 line-clamp-2 font-bold text-[#20191a]">{item.name}</h3><p className="mt-2 font-semibold text-[#760314]">{item.price}</p></Link>)}</div></section>}
          </>
        )}
      </div>
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#5f020f] px-6 py-3 font-semibold text-white shadow-xl">{toast}</div>}
    </main>
  );
}
