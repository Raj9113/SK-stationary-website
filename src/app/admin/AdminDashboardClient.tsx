"use client";
import "./admin.css";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package, Boxes, AlertTriangle, X, Save, Image as ImageIcon, Star, Eye, LayoutDashboard, Tags, Settings, ArrowUpRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  compareAt: number;
  stock: number;
  description: string;
  image: string;
  imagePublicId?: string;
  status: "Active" | "Draft";
  featured: boolean;
};

const categories = ["Notebooks & Registers", "Pens & Writing", "Art & Craft", "Files & Folders", "Printing & Paper", "School Essentials", "Office Stationery", "Inks & Refills", "Exam & Academic", "Other"];
const empty: Product = { id: "", name: "", sku: "", category: categories[0], price: 0, compareAt: 0, stock: 0, description: "", image: "", imagePublicId: "", status: "Draft", featured: false };
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(empty);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || "Unable to load products.");
        if (!cancelled) setProducts((data.products || []).map((p: Record<string, unknown>) => ({
          ...p,
          id: String(p._id),
          imagePublicId: typeof p.imagePublicId === "string" ? p.imagePublicId : "",
        })) as Product[]);
      } catch (error) {
        if (!cancelled) setNotice(error instanceof Error ? error.message : "Unable to load products.");
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(
    () => products.filter(p => (filter === "All" || p.status === filter) && [p.name, p.sku, p.category].join(" ").toLowerCase().includes(query.toLowerCase())),
    [products, filter, query]
  );

  const openNew = () => { setForm({ ...empty, id: "new" }); setEditing(null); };
  const openEdit = (product: Product) => { setForm({ ...product }); setEditing(product); };
  const closeForm = () => { setForm(empty); setEditing(null); };

  const save = async () => {
    if (!form.name.trim() || !form.sku.trim()) { setNotice("Add a product name and SKU."); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name, sku: form.sku, category: form.category, price: form.price,
        compareAt: form.compareAt, stock: form.stock, description: form.description,
        image: form.image, imagePublicId: form.imagePublicId || "", status: form.status, featured: form.featured,
      };
      const response = await fetch(editing ? "/api/products/" + editing.id : "/api/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to save product.");
      const saved = { ...data.product, id: String(data.product._id) } as Product;
      setProducts(current => editing ? current.map(p => p.id === saved.id ? saved : p) : [saved, ...current]);
      closeForm();
      setNotice("Product saved to the database.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save product.");
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this product?")) return;
    try {
      const response = await fetch("/api/products/" + id, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to delete product.");
      setProducts(current => current.filter(p => p.id !== id));
      setNotice("Product deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to delete product.");
    }
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/product-image", { method: "POST", body });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Image upload failed.");
      setForm(current => ({ ...current, image: data.image, imagePublicId: data.imagePublicId }));
      setNotice("Image uploaded successfully. Save the product to apply the change.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Image upload failed.");
    } finally { setUploading(false); }
  };

  const removeImage = () => {
    if (!form.image && !form.imagePublicId) return;
    setForm(current => ({ ...current, image: "", imagePublicId: "" }));
    setNotice("Image marked for removal. Save the product to remove it from the listing and Cloudinary.");
  };

  const low = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const out = products.filter(p => p.stock === 0).length;

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span className="admin-seal">SK</span><div><b>S K Stationary</b><small>Admin workspace</small></div></div>
        <div className="admin-nav-label">WORKSPACE</div>
        <a className="admin-nav active"><LayoutDashboard /> Overview</a>
        <a className="admin-nav"><Package /> Products</a>
        <a className="admin-nav"><Tags /> Categories</a>
        <a className="admin-nav"><Settings /> Store settings</a>
        <div className="admin-sidebar-bottom"><span className="admin-avatar">SK</span><div><b>Store Admin</b><small>Database connected</small></div></div>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div><span className="admin-breadcrumb">Workspace / Products</span><h1>Product dashboard</h1><p>Manage your stationery catalogue and inventory.</p></div>
          <a href="/" className="admin-view"><Eye size={17} /> View storefront <ArrowUpRight size={15} /></a>
        </header>
        <div className="admin-warning"><AlertTriangle size={18} /><span><b>Live inventory:</b> product changes are saved to the store database. Image uploads are restricted to the administrator account.</span></div>

        <section className="admin-stats">
          <article><span>Total products</span><strong>{products.length}</strong><small><Package /> In your catalogue</small></article>
          <article><span>Active products</span><strong>{products.filter(p => p.status === "Active").length}</strong><small><Eye /> Visible status</small></article>
          <article><span>Low stock</span><strong>{low}</strong><small><AlertTriangle /> 10 units or fewer</small></article>
          <article><span>Out of stock</span><strong>{out}</strong><small><Boxes /> Needs restocking</small></article>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading"><div><h2>Products</h2><p>Add, edit and organise your store items.</p></div><button className="admin-primary" onClick={openNew}><Plus size={18} /> Add product</button></div>
          <div className="admin-toolbar">
            <label className="admin-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by product, SKU or category" /></label>
            <select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>Active</option><option>Draft</option></select>
          </div>
          {!ready ? <div className="admin-empty">Loading products…</div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>{filtered.map(p => (
                  <tr key={p.id}>
                    <td><div className="admin-product-cell"><div className="admin-thumb">{p.image ? <img src={p.image} alt="" /> : <ImageIcon />}</div><div><b>{p.name}</b><small>{p.featured ? "★ Featured" : p.description}</small></div></div></td>
                    <td>{p.sku}</td><td>{p.category}</td>
                    <td><b>{money(p.price)}</b>{p.compareAt > p.price && <small className="admin-old-price">{money(p.compareAt)}</small>}</td>
                    <td><span className={p.stock === 0 ? "stock-out" : p.stock <= 10 ? "stock-low" : "stock-ok"}>{p.stock} units</span></td>
                    <td><span className={p.status === "Active" ? "status-active" : "status-draft"}>{p.status}</span></td>
                    <td><div className="admin-actions"><button onClick={() => openEdit(p)} aria-label="Edit product"><Pencil size={16} /></button><button onClick={() => void remove(p.id)} aria-label="Delete product"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}</tbody>
              </table>
              {filtered.length === 0 && <div className="admin-empty">No products match your search.</div>}
            </div>
          )}
        </section>
        <p className="admin-footnote">Products are stored in MongoDB. Images are uploaded to Cloudinary and referenced by secure delivery URL.</p>
      </main>

      {form.id && (
        <div className="admin-modal-backdrop" onClick={closeForm}>
          <section className="admin-modal" onClick={e => e.stopPropagation()}>
            <header><div><span className="admin-breadcrumb">{editing ? "EDIT PRODUCT" : "NEW LISTING"}</span><h2>{editing ? "Update product" : "Add a product"}</h2></div><button className="admin-close" onClick={closeForm}><X /></button></header>
            <div className="admin-form-grid">
              <label className="wide">Product name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classmate long notebook" /></label>
              <label>SKU / Item code<input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. NB-200" /></label>
              <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
              <label>Selling price (₹)<input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></label>
              <label>MRP / Compare price (₹)<input type="number" min="0" value={form.compareAt} onChange={e => setForm({ ...form, compareAt: Number(e.target.value) })} /></label>
              <label>Stock quantity<input type="number" min="0" step="1" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} /></label>
              <label>Publication status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Product["status"] })}><option>Draft</option><option>Active</option></select></label>
              <label className="wide">Product image
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={e => { void uploadImage(e.target.files?.[0]); e.currentTarget.value = ""; }} />
                {uploading && <small>Uploading image…</small>}
                {form.image ? (
                  <div className="admin-image-editor">
                    <div className="admin-product-cell"><img src={form.image} alt="Product preview" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }} /><small>Current image</small></div>
                    <button type="button" className="admin-secondary admin-remove-image" onClick={removeImage} disabled={uploading || saving}>
                      <Trash2 size={15} /> Remove image
                    </button>
                  </div>
                ) : (
                  <div className="admin-image-empty"><ImageIcon size={18} /><small>No product image selected</small></div>
                )}
                {!form.image && form.imagePublicId && <small>Image reference is pending removal.</small>}
              </label>
              <label className="wide">Description<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product details, size, pages, colour, pack quantity..." /></label>
              <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /><Star size={16} /> Feature this product</label>
            </div>
            <footer><button className="admin-secondary" onClick={closeForm}>Cancel</button><button className="admin-primary" onClick={() => void save()} disabled={saving || uploading}><Save size={17} /> {saving ? "Saving…" : "Save product"}</button></footer>
          </section>
        </div>
      )}
      {notice && <button className="admin-toast" onClick={() => setNotice("")}>{notice} <X size={14} /></button>}
    </div>
  );
}
