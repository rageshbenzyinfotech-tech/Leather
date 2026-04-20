'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('center center');
  const [activeTab, setActiveTab] = useState('additional');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setProduct(data.product);
        if (data.product.images?.length > 0) setMainImage(data.product.images[0]);
        // Note: colors are not in DB yet, but we can mock them for UI or add them later
        // Requirement didn't specify colors in DB, usually they are variants
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const inWishlist = product ? wishlist.some(i => i.id === product.id) : false;

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <p className="page-subtitle">Finding the perfect piece...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <h1 className="font-serif italic text-muted">Product <span className="accent-color">not found</span>.</h1>
        <Link href="/products" className="btn btn--primary" style={{ marginTop: '2rem' }}>Back to Products</Link>
      </div>
    );
  }

  return (
    <>
      <div className="container product-detail">
        <div className="product-gallery">
          <div 
            className="product-gallery__main"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            style={{ cursor: 'crosshair', overflow: 'hidden' }}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              style={{ 
                transform: isZoomed ? 'scale(2)' : 'scale(1)', 
                transformOrigin: zoomOrigin, 
                transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          </div>
          <div className="product-gallery__thumbs">
            {product.images.map((img: string, index: number) => (
              <div 
                key={index} 
                className="product-gallery__thumb" 
                onClick={() => setMainImage(img)}
                style={{ 
                  border: mainImage === img ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <img src={img} alt={`${product.title} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 400, textTransform: 'uppercase', marginBottom: 0, fontFamily: 'var(--font-serif)' }}>{product.name}</h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}</p>
              {product.discount_price && (
                <>
                  <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</p>
                  <p style={{ fontSize: '1rem', color: '#ff4d4d', fontWeight: '600' }}>({Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF)</p>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ cursor: 'pointer', color: '#888' }} title="Copy Link"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>
              <span style={{ cursor: 'pointer', color: '#25D366' }} title="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>
              <span style={{ cursor: 'pointer', color: '#1877F2' }} title="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <p style={{ marginBottom: '0.25rem', textTransform: 'capitalize' }}>Type : {product.category}</p>
            <p>Size : 13 x 8 cm</p>
          </div>

          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <p style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Features:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
              <li style={{ marginBottom: '0.25rem' }}>Premium leather</li>
              <li>Hand-crafted design</li>
              <li>Stock available: {product.stock}</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>Unit Price</span>
              <span>₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>₹{((product.discount_price ?? product.price) * quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
            <input 
              type="number" 
              value={quantity} 
              min="1" max={product.stock}
              onChange={(e) => setQuantity(Math.min(product.stock, Number(e.target.value)))} 
              style={{ 
                padding: '0.75rem', 
                background: 'transparent', 
                border: '1px solid rgba(255,255,255,0.2)', 
                color: 'var(--color-text)', 
                width: '80px',
                borderRadius: '4px',
                textAlign: 'center'
              }} 
            />
            <button 
              type="button" 
              className="btn" 
              disabled={product.stock <= 0}
              style={{ flex: 1, backgroundColor: product.stock > 0 ? '#f6c358' : '#ccc', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', padding: '0.75rem', fontSize: '1rem', cursor: product.stock > 0 ? 'pointer' : 'not-allowed' }} 
              onClick={() => addToCart({ id: product.id, title: product.name, price: (product.discount_price ?? product.price), image: product.images[0], color: selectedColor }, quantity)}
            >
              {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            <button 
              type="button" 
              className={`btn btn--outline btn-wishlist ${inWishlist ? 'active' : ''}`} 
              style={{ padding: '0 1rem', border: 'none' }} 
              onClick={() => toggleWishlist({ id: product.id, title: product.name, price: (product.discount_price ?? product.price), image: product.images[0] })}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? 'var(--color-accent)' : 'none'} stroke={inWishlist ? 'var(--color-accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem' }}>
            <span><strong style={{ color: 'var(--color-text)' }}>SKU:</strong> ZRN-{product.id.slice(0,6).toUpperCase()}</span>
            <span><strong style={{ color: 'var(--color-text)' }}>Categories:</strong> <Link href="/products" style={{ color: '#f6c358' }}>All</Link>, <Link href={`/products?category=${product.category}`} style={{ color: '#f6c358' }}>{product.category}</Link></span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem', marginBottom: '4rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
          <button 
            style={{ padding: '0 0 1rem 0', background: 'transparent', border: 'none', color: activeTab === 'description' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: activeTab === 'description' ? 'bold' : 'normal', borderBottom: activeTab === 'description' ? '2px solid #f6c358' : '2px solid transparent', cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            style={{ padding: '0 0 1rem 0', background: 'transparent', border: 'none', color: activeTab === 'additional' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: activeTab === 'additional' ? 'bold' : 'normal', borderBottom: activeTab === 'additional' ? '2px solid #f6c358' : '2px solid transparent', cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => setActiveTab('additional')}
          >
            Additional information
          </button>
        </div>

        {activeTab === 'additional' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '20%', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontWeight: 'bold' }}>Category</th>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{product.category}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '20%', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontWeight: 'bold' }}>Dimensions</th>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>8 × 13 cm</td>
              </tr>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '20%', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontWeight: 'bold' }}>Material</th>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>Full Grain Leather</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 'description' && (
          <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </>
  );
}