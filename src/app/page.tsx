import Image from "next/image";
import logo from "./icon.png";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, FileText, Phone, ShieldCheck, ShoppingCart, Star, Truck, Wallet, Zap } from "lucide-react";

const categories = [
  { name: "Notebooks & Registers", icon: "📓" }, { name: "Pens & Writing", icon: "🖊️" },
  { name: "Art & Craft", icon: "🎨" }, { name: "Files & Folders", icon: "📁" },
  { name: "Printing & Paper", icon: "📄" }, { name: "School Essentials", icon: "🎒" },
  { name: "Office Stationery", icon: "🖇️" }, { name: "Inks & Refills", icon: "🖋️" },
  { name: "Exam & Academic", icon: "📐" },
];
const services = [
  { title: "Government Applications", icon: FileText }, { title: "ID & Certificate Services", icon: BadgeCheck },
  { title: "Utility Services", icon: Wallet }, { title: "Student Services", icon: BookOpen },
  { title: "Other Digital Services", icon: Zap },
];
const products = [
  { name: "Classmate Notebook", detail: "200 Pages", price: "₹85", old: "₹100", rating: "4.8", reviews: "1.2k", tag: "Popular", image: "📕" },
  { name: "Cello Ball Pen", detail: "Pack of 10", price: "₹120", old: "₹140", rating: "4.7", reviews: "856", tag: "", image: "🖊️" },
  { name: "A4 Printing Paper", detail: "500 Sheets", price: "₹295", old: "₹320", rating: "4.8", reviews: "2.1k", tag: "", image: "📄" },
  { name: "Camlin Colour Pencils", detail: "24 Shades", price: "₹180", old: "₹200", rating: "4.9", reviews: "731", tag: "Bestseller", image: "🖍️" },
];
function Logo() {
  return <Link href="/" className="brand-lockup"><Image src={logo} alt="S K Stationary logo" width={76} height={76} priority className="object-contain" /><span><strong>S K Stationary</strong><b>&amp; Janseva Kendr</b></span></Link>;
}
export default async function Home() {
  return <main className="site-shell">
    <section className="hero container"><div className="hero-copy"><p className="eyebrow">WELCOME TO</p><h1>S K Stationary<br/>&amp; Janseva Kendr</h1><p className="hero-desc">Your one-stop destination for quality stationery and trusted online services.</p><div className="hero-buttons"><Link className="btn btn-primary" href="/stationery"><ShoppingCart size={18}/> Shop Stationery <ArrowRight size={17}/></Link><Link className="btn btn-outline" href="/janseva-kendr"><FileText size={18}/> Explore Online Services</Link></div><div className="trust-points"><span><Truck/> Fast Service</span><span><ShieldCheck/> Trusted &amp; Secure</span><span><Phone/> Local Support</span></div></div><div className="hero-art"><div className="hero-seal"><Image src={logo} alt="S K Stationary logo" width={128} height={128} className="object-contain" /></div><div className="desk-plant">🪴</div><div className="desk-cup">✏️ 🖊️ ✂️</div><div className="desk-books"><span>📕</span><span>📘</span><span>📗</span></div><div className="desk-note">Your everyday essentials, all in one place.</div></div></section>
    <section className="container section-block"><div className="section-heading"><h2>Shop by Category</h2><Link href="/stationery">View All Categories <ArrowRight size={17}/></Link></div><div className="category-grid">{categories.map(c=><Link href="/stationery" className="category-tile" key={c.name}><span>{c.icon}</span><b>{c.name}</b></Link>)}<Link href="/stationery" className="category-tile more-tile"><span>⌘</span><b>More Categories</b></Link></div></section>
    <section className="container services-strip"><div className="services-label"><div className="services-mark">▤</div><div><strong>Online Services</strong><span>(Janseva Kendr)</span></div></div><div className="services-list">{services.map(s=><Link href="/janseva-kendr" key={s.title}><s.icon/><b>{s.title}</b></Link>)}</div><Link className="btn btn-outline service-cta" href="/janseva-kendr">Explore All Services <ArrowRight size={17}/></Link></section>
    <section className="container section-block best-sellers"><div className="section-heading"><h2>Best Sellers</h2><div className="tabs"><span className="selected">Popular</span><Link href="/stationery?sort=new">New Arrivals</Link><Link href="/offers">Offers</Link></div><Link href="/stationery">View All <ArrowRight size={17}/></Link></div><div className="product-grid">{products.map(p=><article className="product-card" key={p.name}><div className="product-image"><span>{p.image}</span>{p.tag&&<small>{p.tag}</small>}</div><div className="product-info"><h3>{p.name}</h3><p>{p.detail}</p><strong>{p.price} <del>{p.old}</del></strong><div className="rating"><Star size={14} fill="currentColor"/> {p.rating} <span>({p.reviews})</span></div></div><Link href="/stationery" className="add-cart" aria-label={"Shop "+p.name}><ShoppingCart size={18}/></Link></article>)}</div></section>
    <footer className="footer"><div className="container footer-inner"><Logo/><p>Quality stationery and dependable digital services, with a local touch.</p><span>© {new Date().getFullYear()} S K Stationary &amp; Janseva Kendr</span></div></footer>
  </main>;
}
