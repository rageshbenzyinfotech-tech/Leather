'use client';

import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  category: string;
  images: string[];
  is_active: boolean;
  created_at: string;
}

const emptyProduct = {
  name: '', slug: '', description: '', price: 0, discount_price: null as number | null,
  stock: 0, category: '', images: [] as string[], is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch { setError('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name, slug: product.slug, description: product.description,
      price: product.price, discount_price: product.discount_price,
      stock: product.stock, category: product.category,
      images: Array.isArray(product.images) ? product.images : [],
      is_active: product.is_active,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
      else setError('Delete failed');
    } catch { setError('Delete failed'); }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const addImage = () => {
    if (imageUrl.trim()) {
      setForm({ ...form, images: [...form.images, imageUrl.trim()] });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || generateSlug(form.name);
    const body = { ...form, slug, price: Number(form.price), discount_price: form.discount_price ? Number(form.discount_price) : null, stock: Number(form.stock) };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyProduct);
        fetchProducts();
      } else {
        const data = await res.json();
        setError(data.error || 'Save failed');
      }
    } catch { setError('Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="admin-loader"></div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Product Management</h1>
        <button onClick={handleNew} className="admin-btn admin-btn--primary">+ Add Product</button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error} <button onClick={() => setError('')} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h2 className="admin-section-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Price (₹) *</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Discount Price (₹)</label>
                <input type="number" step="0.01" value={form.discount_price || ''} onChange={(e) => setForm({ ...form, discount_price: e.target.value ? parseFloat(e.target.value) : null })} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="admin-input">
                  <option value="">Select...</option>
                  <option value="wallets">Wallets</option>
                  <option value="bags">Bags</option>
                  <option value="belts">Belts</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="admin-input admin-textarea" rows={3} />
            </div>
            <div className="admin-form-group">
              <label>Images</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..." className="admin-input" style={{ flex: 1 }} />
                <button type="button" onClick={addImage} className="admin-btn admin-btn--outline">Add</button>
              </div>
              {form.images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                      <img src={img} alt={`Product ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active (visible to customers)
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyProduct); }} className="admin-btn admin-btn--outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>No products found. Add your first product!</td></tr>
            ) : (
              products.map((product) => {
                const imgs = Array.isArray(product.images) ? product.images : [];
                return (
                  <tr key={product.id}>
                    <td>
                      {imgs.length > 0 ? (
                        <img src={imgs[0]} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' }}>No img</div>
                      )}
                    </td>
                    <td><strong>{product.name}</strong><br /><span style={{ fontSize: '0.75rem', color: '#999' }}>{product.slug}</span></td>
                    <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                    <td>
                      ₹{product.price}
                      {product.discount_price && <><br /><span style={{ color: '#38a169', fontSize: '0.8rem' }}>₹{product.discount_price}</span></>}
                    </td>
                    <td>
                      <span style={{ color: product.stock > 0 ? '#38a169' : '#e53e3e' }}>{product.stock}</span>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--${product.is_active ? 'paid' : 'failed'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(product)} className="admin-btn admin-btn--small admin-btn--outline">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="admin-btn admin-btn--small admin-btn--danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
