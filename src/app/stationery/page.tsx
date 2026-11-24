'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ShoppingCart, Search, Package } from 'lucide-react';
import Link from 'next/link';
import { useCart, type CartProduct } from '@/context/CartContext';

type StoreProduct = CartProduct & { stock: number; compareAt: number; featured: boolean; imageUrl: string };
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
const mapProduct = (item: Record<string, unknown>): StoreProduct => ({
  id: String(item._id), name: String(item.name || ''), category: String(item.category || 'Other'),
  price: money(Number(item.price) || 0), unitPrice: Number(item.price) || 0, image: typeof item.image === 'string' ? item.image : '',
  imageUrl: typeof item.image === 'string' ? item.image : '', description: String(item.description || ''),
  stock: Number(item.stock) || 0, compareAt: Number(item.compareAt) || 0, featured: item.featured === true,
});

export default function ProductPage() {
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
      } finally { if (!cancelled) setLoading(false); }
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
    const added = addToCart({ id: product.id, name: product.name, category: product.category, price: product.price, unitPrice: product.unitPrice, stock: product.stock, image: product.image, description: product.description });
    setToast(added ? product.name + ' added to cart' : `Only ${product.stock} available; your cart has reached the stock limit.`);
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#20191a]">
      <section className="border-b border-[#e9e0d5] bg-gradient-to-br from-[#fffdfa] via-[#f8f0e5] to-[#f1e5d8]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="relative mx-auto max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7b78]" size={19}/>
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products..." className="h-12 w-full rounded-xl border border-[#d9cbbd] bg-white pl-12 pr-5 text-base text-[#20191a] outline-none transition focus:border-[#760314] focus:ring-2 focus:ring-[#760314]/15"/>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
        {categories.length > 1 && <div className="category-scroller mb-5 flex min-w-0 items-center gap-2.5 overflow-x-auto overscroll-x-contain pb-2 sm:mb-7">{categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${activeCategory === category ? 'border-[#760314] bg-[#760314] text-white shadow-sm' : 'border-[#e1d5c9] bg-[#fffdfa] text-[#5f020f] hover:border-[#760314]'}`}>{category}</button>)}</div>}
        {loading ? <div className="py-24 text-center text-[#71686a]">Loading products…</div> : error ? <div className="py-24 text-center"><p className="font-semibold text-red-700">{error}</p><button onClick={() => window.location.reload()} className="mt-4 font-semibold text-[#760314] underline">Try again</button></div> : filtered.length === 0 ? <div className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] py-20 text-center"><Package size={42} className="mx-auto mb-4 text-[#b8a9a0]"/><p className="text-xl font-bold text-[#5f020f]">No products available</p><p className="mt-2 text-[#71686a]">Please check back soon or try another search.</p></div> : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(product => {
              const quantity = getProductQuantity(product.id);
              return <article key={product.id} className="group overflow-hidden rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] shadow-sm transition-all hover:-translate-y-1 hover:border-[#d7bd9a] hover:shadow-lg">
                <Link href={`/stationery/${product.id}`} className="relative flex h-36 items-center justify-center overflow-hidden bg-[#f1e9df] sm:h-56 lg:h-64">
                  {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-3 sm:p-6 transition-transform duration-500 group-hover:scale-105"/> : <Package size={64} className="text-[#b8a9a0]"/>}
                  {product.featured && <span className="absolute left-4 top-4 rounded-full bg-[#760314] px-3 py-1 text-xs font-bold text-white">Featured</span>}
                  {quantity > 0 && <span className="absolute right-4 top-4 rounded-full bg-[#e2ba5d] px-3 py-1 text-xs font-bold text-[#20191a]"><ShoppingCart size={12} className="mr-1 inline"/>{quantity}</span>}
                </Link>
                <div className="p-3 sm:p-5">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#760314]">{product.category}</p>
                  <Link href={`/stationery/${product.id}`}><h2 className="mt-1.5 line-clamp-2 text-sm sm:text-lg font-bold leading-snug text-[#20191a]">{product.name}</h2></Link>
                  <p className="mt-1.5 line-clamp-2 min-h-9 text-xs sm:mt-2 sm:min-h-10 sm:text-sm text-[#71686a]">{product.description || 'Quality stationery for everyday use.'}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5">
                    <div className="min-w-0"><strong className="text-base sm:text-xl text-[#5f020f]">{product.price}</strong>{product.compareAt > 0 && product.compareAt > product.unitPrice && <p className="text-xs text-[#91898a] line-through">{money(product.compareAt)}</p>}</div>
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2"><button disabled={product.stock < 1} onClick={() => add(product)} className="rounded-full bg-[#760314] p-2 sm:p-3 text-white transition hover:bg-[#5f020f] disabled:cursor-not-allowed disabled:bg-[#b8a9a0]" aria-label="Add to cart"><ShoppingCart size={18}/></button>
                    <Link href={`/stationery/${product.id}`} className="rounded-full border border-[#e9e0d5] bg-[#f7f3ea] p-2 sm:p-3 text-[#760314] hover:bg-[#efe3d5]" aria-label={`View full details for ${product.name}`} title="View product details"><ChevronRight size={18}/></Link></div>
                  </div>
                  <p className={`mt-2 text-[10px] sm:mt-3 sm:text-xs font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#5f020f] px-6 py-3 font-semibold text-white shadow-xl">{toast}</div>}
    </main>
  );
}
