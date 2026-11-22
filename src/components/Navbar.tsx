'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, X, Minus, Plus, Trash2, CheckCircle2, Home, BookOpen, FileText, UserRound, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const { cart, removeFromCart, clearCart, updateQuantity, cartTotal, cartItemCount } = useCart();

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(current => current === message ? '' : current), 2600);
  };
  const removeItem = (id: string, name: string) => { removeFromCart(id); notify(`${name} removed from your cart`); };
  const emptyCart = () => { clearCart(); notify('Your cart has been emptied'); };
  const changeQuantity = (id: string, name: string, quantity: number) => {
    if (quantity <= 0) { removeItem(id, name); return; }
    updateQuantity(id, quantity);
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e9e0d5] bg-[#fffdfa]/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <img src="/sk-seal.svg" alt="" className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"/>
            <span className="min-w-0"><strong className="block truncate text-base font-extrabold tracking-tight text-[#760314] sm:text-xl">S K Stationary</strong><span className="block text-xs font-semibold text-[#5f020f] sm:text-sm">&amp; Janseva Kendr</span></span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={isMobileMenuOpen} className="rounded-full border border-[#e9e0d5] p-2.5 text-[#760314] sm:hidden"><Menu size={20}/></button>
            <Link href="/account/profile" aria-label="Account" className="rounded-full border border-[#e9e0d5] p-2.5 text-[#760314] hover:bg-[#f7f3ea]"><UserRound size={19}/></Link>
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative rounded-full bg-[#760314] p-3 text-white shadow-sm transition hover:bg-[#5f020f]" aria-label="Shopping cart">
              <ShoppingCart size={20}/>
              {cartItemCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#e2ba5d] px-1 text-xs font-bold text-[#20191a]">{cartItemCount}</span>}
            </button>
          </div>
        </div>
        <nav aria-label="Main navigation" className="hidden border-t border-[#f0e8df] sm:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-3 py-1.5 sm:gap-3 sm:px-6">
            <Link href="/" className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#5f020f] hover:bg-[#f7f3ea] sm:text-sm"><Home size={15}/> Home</Link>
            <Link href="/stationery" className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#5f020f] hover:bg-[#f7f3ea] sm:text-sm"><ShoppingCart size={15}/> Stationery Store</Link>
            <Link href="/janseva-kendr" className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#5f020f] hover:bg-[#f7f3ea] sm:text-sm"><FileText size={15}/> Online Services</Link>
            <Link href="/offers" className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#5f020f] hover:bg-[#f7f3ea] sm:text-sm"><BookOpen size={15}/> Offers</Link>
            <Link href="/stationery?sort=new" className="inline-flex shrink-0 items-center rounded-full px-3 py-2 text-xs font-bold text-[#5f020f] hover:bg-[#f7f3ea] sm:text-sm">New Arrivals</Link>
          </div>
        </nav>
      </header>

      <div className={isMobileMenuOpen ? "fixed inset-0 z-[70] sm:hidden" : "pointer-events-none fixed inset-0 z-[70] sm:hidden"} aria-hidden={!isMobileMenuOpen}>
        <button type="button" aria-label="Close navigation menu" onClick={() => setIsMobileMenuOpen(false)} className={isMobileMenuOpen ? "absolute inset-0 h-full w-full bg-black/45 opacity-100 transition-opacity duration-300" : "absolute inset-0 h-full w-full bg-black/45 opacity-0 transition-opacity duration-300"}/>
        <section role="dialog" aria-modal="true" aria-label="Website navigation" className={isMobileMenuOpen ? "absolute left-3 right-3 top-3 rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-4 shadow-2xl opacity-100 translate-y-0 transition-all duration-300" : "absolute left-3 right-3 top-3 rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-4 shadow-2xl opacity-0 -translate-y-5 transition-all duration-300"}>
          <div className="mb-4 flex items-center justify-between border-b border-[#f0e8df] pb-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#760314]">Explore</p><h2 className="text-lg font-extrabold text-[#5f020f]">Menu</h2></div>
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="rounded-full border border-[#e9e0d5] p-2 text-[#760314]"><X size={20}/></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="flex min-h-14 items-center gap-2 rounded-xl border border-[#e9e0d5] bg-[#f7f3ea] px-3 py-3 text-sm font-bold text-[#5f020f]"><Home size={18}/> Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/stationery" className="flex min-h-14 items-center gap-2 rounded-xl border border-[#e9e0d5] bg-[#f7f3ea] px-3 py-3 text-sm font-bold text-[#5f020f]"><ShoppingCart size={18}/> Stationery Store</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/janseva-kendr" className="flex min-h-14 items-center gap-2 rounded-xl border border-[#e9e0d5] bg-[#f7f3ea] px-3 py-3 text-sm font-bold text-[#5f020f]"><FileText size={18}/> Online Services</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/offers" className="flex min-h-14 items-center gap-2 rounded-xl border border-[#e9e0d5] bg-[#f7f3ea] px-3 py-3 text-sm font-bold text-[#5f020f]"><BookOpen size={18}/> Offers</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/stationery?sort=new" className="col-span-2 flex min-h-14 items-center gap-2 rounded-xl border border-[#e9e0d5] bg-[#f7f3ea] px-3 py-3 text-sm font-bold text-[#5f020f]"><BookOpen size={18}/> New Arrivals</Link>
          </div>
        </section>
      </div>
      {isCartOpen && (
        <>
          <button aria-label="Close cart" className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsCartOpen(false)}/>
          <aside className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-[#e9e0d5] bg-[#fffdfa] text-[#20191a] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#e9e0d5] px-5 py-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#760314]">Your selection</p><h2 className="text-xl font-bold">Shopping Cart <span className="text-sm font-semibold text-[#71686a]">({cartItemCount})</span></h2></div>
              <button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 text-[#71686a] hover:bg-[#f7f3ea]" aria-label="Close cart"><X size={20}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#71686a]"><ShoppingCart size={42} className="mb-3 text-[#b8a9a0]"/><p className="font-semibold">Your cart is empty</p><Link href="/stationery" onClick={() => setIsCartOpen(false)} className="mt-4 rounded-lg bg-[#760314] px-5 py-2.5 font-semibold text-white">Continue shopping</Link></div>
              ) : <div className="space-y-3">{cart.map(item => (
                <article key={item.id} className="rounded-xl border border-[#e9e0d5] bg-white p-4">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-bold text-[#20191a]">{item.name}</h3><p className="mt-1 text-sm font-semibold text-[#760314]">{item.price}</p></div><button onClick={() => removeItem(item.id,item.name)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#760314] hover:bg-[#f7f3ea]" aria-label={`Remove ${item.name} from cart`}><Trash2 size={14}/> Remove</button></div>
                  <div className="mt-3 flex items-center gap-3"><button onClick={() => changeQuantity(item.id,item.name,item.quantity-1)} className="rounded-md border border-[#e9e0d5] bg-[#f7f3ea] p-2" aria-label="Decrease quantity"><Minus size={14}/></button><span className="min-w-6 text-center font-bold">{item.quantity}</span><button onClick={() => changeQuantity(item.id,item.name,item.quantity+1)} className="rounded-md border border-[#e9e0d5] bg-[#f7f3ea] p-2" aria-label="Increase quantity"><Plus size={14}/></button></div>
                </article>
              ))}</div>}
            </div>
            {cart.length > 0 && <footer className="border-t border-[#e9e0d5] bg-[#f7f3ea] p-5">
              <div className="mb-3 flex items-center justify-between"><span className="font-semibold text-[#71686a]">Subtotal</span><strong className="text-xl text-[#760314]">₹{cartTotal.toFixed(2)}</strong></div>
              <div className="flex items-center justify-between gap-3"><button onClick={emptyCart} className="inline-flex items-center gap-2 rounded-lg border border-[#d9cbbd] bg-white px-3 py-2.5 text-sm font-semibold text-[#760314] transition hover:bg-[#f7ece8]"><Trash2 size={15}/> Empty cart</button><span className="text-xs text-[#71686a]">Removes all items instantly</span></div>
              <button disabled className="mt-4 w-full cursor-not-allowed rounded-xl bg-[#760314] py-3 font-bold text-white opacity-80">Checkout coming soon</button><p className="mt-2 text-center text-xs text-[#71686a]">Checkout will be available in the next phase.</p>
            </footer>}
          </aside>
        </>
      )}
      {notice && <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-[60] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-xl bg-[#5f020f] px-4 py-3 text-sm font-semibold text-white shadow-xl"><CheckCircle2 size={18} className="shrink-0 text-[#e2ba5d]"/><span>{notice}</span></div>}
    </>
  );
}
