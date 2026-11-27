"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, MapPin, PackageCheck, ShieldCheck, WalletCards } from "lucide-react";
import { useCart } from "@/context/CartContext";

export type CheckoutAddress = {
  id: string; label: string; line1: string; line2: string; locality: string;
  city: string; state: string; postalCode: string; country: string; isPrimary: boolean;
};
type Customer = { name: string; email: string; mobile: string };
type PaymentMethod = "cod" | "razorpay";
const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
const field = "w-full rounded-xl border border-[#d9cbbd] bg-white px-3.5 py-3 text-sm text-[#20191a] outline-none transition focus:border-[#760314] focus:ring-2 focus:ring-[#760314]/15";
const label = "grid gap-1.5 text-sm font-semibold text-[#463b3b]";

export default function CheckoutClient({ customer, addresses }: { customer: Customer; addresses: CheckoutAddress[] }) {
  const { cart, cartTotal, cartItemCount } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(addresses.find(a => a.isPrimary)?.id || addresses[0]?.id || "");
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [details, setDetails] = useState<Customer>(customer);
  const [newAddress, setNewAddress] = useState({
    label: "Home", line1: "", line2: "", locality: "", city: "", state: "", postalCode: "", country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [validated, setValidated] = useState(false);

  const address = useMemo(() => addresses.find(a => a.id === selectedAddress), [addresses, selectedAddress]);
  const canCheckout = cart.length > 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!details.name.trim() || !details.email.trim() || !details.mobile.trim()) {
      setError("Enter your name, email address and contact number.");
      return;
    }
    if (useNewAddress) {
      if (!newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !/^[0-9]{6}$/.test(newAddress.postalCode)) {
        setError("Enter address line, city, state and a valid 6-digit PIN code.");
        return;
      }
    } else if (!address) {
      setError("Choose a delivery address or enter a new one.");
      return;
    }
    setValidated(true);
    setNotice("Your checkout details are complete. Order placement and payment processing will be enabled in the next P3 stages.");
  }

  if (!canCheckout) return (
    <main className="min-h-[65vh] bg-[#f7f3ea] px-4 py-16 text-[#20191a]">
      <section className="mx-auto max-w-xl rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-8 text-center">
        <PackageCheck className="mx-auto mb-4 text-[#760314]" size={42}/>
        <h1 className="text-2xl font-extrabold text-[#5f020f]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[#71686a]">Add some products before proceeding to checkout.</p>
        <Link href="/stationery" className="mt-6 inline-flex rounded-xl bg-[#760314] px-5 py-3 font-bold text-white">Browse stationery</Link>
      </section>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-4 py-6 text-[#20191a] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/stationery" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#760314]"><ArrowLeft size={17}/> Continue shopping</Link>
        <div className="mb-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#760314]">S K Stationary</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#5f020f] sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-[#71686a]">Confirm your contact details, delivery address and preferred payment method.</p>
        </div>
        <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f1e5d8] font-extrabold text-[#760314]">1</span><div><h2 className="text-lg font-extrabold text-[#5f020f]">Contact details</h2><p className="text-xs text-[#71686a]">Where we can reach you about this order</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={label}>Full name<input className={field} required maxLength={100} value={details.name} onChange={e=>setDetails(p=>({...p,name:e.target.value}))}/></label>
                <label className={label}>Mobile number<input className={field} required type="tel" maxLength={20} autoComplete="tel" value={details.mobile} onChange={e=>setDetails(p=>({...p,mobile:e.target.value}))}/></label>
                <label className={label+" sm:col-span-2"}>Email address<input className={field} required type="email" maxLength={254} autoComplete="email" value={details.email} onChange={e=>setDetails(p=>({...p,email:e.target.value}))}/></label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f1e5d8] font-extrabold text-[#760314]">2</span><div><h2 className="text-lg font-extrabold text-[#5f020f]">Delivery address</h2><p className="text-xs text-[#71686a]">Choose a saved address or enter another one</p></div></div>
              {addresses.length > 0 && <div className="mb-4 grid gap-3 sm:grid-cols-2">{addresses.map(a=><label key={a.id} className={"flex cursor-pointer gap-3 rounded-xl border p-3.5 transition "+(!useNewAddress&&selectedAddress===a.id?"border-[#760314] bg-[#fbf2ee]":"border-[#e9e0d5] bg-white")}><input type="radio" name="savedAddress" checked={!useNewAddress&&selectedAddress===a.id} onChange={()=>{setUseNewAddress(false);setSelectedAddress(a.id);}} className="mt-1 accent-[#760314]"/><span className="min-w-0 text-sm"><b className="block text-[#5f020f]">{a.label}{a.isPrimary?" · Primary":""}</b><span className="mt-1 block text-[#71686a]">{[a.line1,a.line2,a.locality,a.city,a.state,a.postalCode,a.country].filter(Boolean).join(", ")}</span></span></label>)}</div>}
              <button type="button" onClick={()=>setUseNewAddress(true)} className={"rounded-lg border px-4 py-2.5 text-sm font-bold "+(useNewAddress?"border-[#760314] bg-[#760314] text-white":"border-[#d9cbbd] bg-white text-[#760314]")}>{addresses.length?"＋ Use a different address":"＋ Enter delivery address"}</button>
              {useNewAddress && <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className={label}>Address label<select className={field} value={newAddress.label} onChange={e=>setNewAddress(p=>({...p,label:e.target.value}))}><option>Home</option><option>Work</option><option>Other</option></select></label>
                <label className={label+" sm:col-span-2"}>Address line 1<input className={field} required maxLength={160} autoComplete="address-line1" value={newAddress.line1} onChange={e=>setNewAddress(p=>({...p,line1:e.target.value}))}/></label>
                <label className={label+" sm:col-span-2"}>Address line 2<input className={field} maxLength={160} autoComplete="address-line2" value={newAddress.line2} onChange={e=>setNewAddress(p=>({...p,line2:e.target.value}))}/></label>
                <label className={label}>Area / locality<input className={field} maxLength={100} value={newAddress.locality} onChange={e=>setNewAddress(p=>({...p,locality:e.target.value}))}/></label>
                <label className={label}>City<input className={field} required maxLength={80} autoComplete="address-level2" value={newAddress.city} onChange={e=>setNewAddress(p=>({...p,city:e.target.value}))}/></label>
                <label className={label}>State<input className={field} required maxLength={80} autoComplete="address-level1" value={newAddress.state} onChange={e=>setNewAddress(p=>({...p,state:e.target.value}))}/></label>
                <label className={label}>PIN code<input className={field} required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" value={newAddress.postalCode} onChange={e=>setNewAddress(p=>({...p,postalCode:e.target.value}))}/></label>
                <label className={label}>Country<input className={field} required maxLength={80} value={newAddress.country} onChange={e=>setNewAddress(p=>({...p,country:e.target.value}))}/></label>
              </div>}
              {addresses.length===0&&<p className="mt-3 text-xs text-[#71686a]">You can save this address to your profile after the order workflow is connected.</p>}
            </section>

            <section className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f1e5d8] font-extrabold text-[#760314]">3</span><div><h2 className="text-lg font-extrabold text-[#5f020f]">Payment method</h2><p className="text-xs text-[#71686a]">Choose how you would like to pay</p></div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={"flex cursor-pointer items-center gap-3 rounded-xl border p-4 "+(paymentMethod==="cod"?"border-[#760314] bg-[#fbf2ee]":"border-[#e9e0d5] bg-white")}><input type="radio" name="paymentMethod" checked={paymentMethod==="cod"} onChange={()=>setPaymentMethod("cod")} className="accent-[#760314]"/><WalletCards className="text-[#760314]" size={22}/><span><b className="block text-sm text-[#5f020f]">Cash on Delivery</b><span className="text-xs text-[#71686a]">Pay when your order arrives</span></span></label>
                <label className={"flex cursor-pointer items-center gap-3 rounded-xl border p-4 "+(paymentMethod==="razorpay"?"border-[#760314] bg-[#fbf2ee]":"border-[#e9e0d5] bg-white")}><input type="radio" name="paymentMethod" checked={paymentMethod==="razorpay"} onChange={()=>setPaymentMethod("razorpay")} className="accent-[#760314]"/><ShieldCheck className="text-[#760314]" size={22}/><span><b className="block text-sm text-[#5f020f]">Pay Online</b><span className="text-xs text-[#71686a]">Secure payment with Razorpay</span></span></label>
              </div>
              <label className={label+" mt-4"}>Delivery instructions (optional)<textarea className={field+" min-h-20 resize-y"} maxLength={300} placeholder="Any directions for finding your address?" value={notes} onChange={e=>setNotes(e.target.value)}/></label>
            </section>
          </div>

          <aside className="rounded-2xl border border-[#e9e0d5] bg-[#fffdfa] p-5 shadow-sm lg:sticky lg:top-36">
            <h2 className="text-lg font-extrabold text-[#5f020f]">Order summary</h2>
            <p className="mt-1 text-xs text-[#71686a]">{cartItemCount} item{cartItemCount===1?"":"s"} in your cart</p>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">{cart.map(item=><div key={item.id} className="flex justify-between gap-3 border-b border-[#f0e8df] pb-3 text-sm"><div className="min-w-0"><b className="block text-[#20191a]">{item.name}</b><span className="text-xs text-[#71686a]">Qty {item.quantity} × {money(item.unitPrice)}</span></div><b className="shrink-0 text-[#5f020f]">{money(item.unitPrice*item.quantity)}</b></div>)}</div>
            <div className="mt-4 flex justify-between text-sm text-[#71686a]"><span>Subtotal</span><b className="text-[#20191a]">{money(cartTotal)}</b></div>
            <div className="mt-2 flex justify-between text-sm text-[#71686a]"><span>Delivery</span><span>Calculated later</span></div>
            <div className="mt-4 flex justify-between border-t border-[#e9e0d5] pt-4"><b className="text-[#5f020f]">Estimated total</b><strong className="text-xl text-[#760314]">{money(cartTotal)}</strong></div>
            <p className="mt-2 text-[11px] leading-relaxed text-[#71686a]">Final price, stock availability and delivery charges will be confirmed by the server before an order is placed.</p>
            {error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            {notice&&<p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800">{notice}</p>}
            <button type="submit" disabled={validated} className="mt-5 w-full rounded-xl bg-[#760314] px-4 py-3.5 font-extrabold text-white transition hover:bg-[#5f020f] disabled:cursor-not-allowed disabled:opacity-60">{validated?"Details validated":"Review checkout details"}</button>
            <p className="mt-3 text-center text-[11px] text-[#71686a]">No payment is taken and no order is created in this preview stage.</p>
            <Link href="/account/profile/addresses" className="mt-4 block text-center text-xs font-bold text-[#760314]">Manage saved addresses</Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
