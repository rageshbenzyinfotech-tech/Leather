'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

const products = {
  'essential-slim-wallet': {
    id: 'essential-slim-wallet',
    title: 'Essential Slim Wallet',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['black', 'brown', 'tan'],
    category: 'wallets',
    description: 'Designed for the minimalist, the Essential Slim Wallet holds your core cards and cash without adding bulk. Hand-stitched from premium full-grain Italian leather, it will develop a unique patina over time.',
    details: 'Holds 4-6 cards and half-folded bills. Hand-burnished edges. Comes in a signature presentation box.',
    material: '100% vegetable-tanned full-grain leather. Industrial-grade nylon stitching.'
  },
  'the-weekender': {
    id: 'the-weekender',
    title: 'The Weekender',
    price: 345,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['brown', 'black'],
    category: 'bags',
    description: 'The perfect companion for your short getaways. Crafted from full-grain leather with a cotton canvas lining.',
    details: 'Dimensions: 20" x 12" x 10". Multiple interior pockets. Removable shoulder strap.',
    material: 'Full-grain leather. Cotton canvas lining. YKK zippers.'
  },
  'classic-leather-belt': {
    id: 'classic-leather-belt',
    title: 'Classic Leather Belt',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['black', 'tan'],
    category: 'belts',
    description: 'Timeless design meets everyday durability. A belt that only gets better with age.',
    details: 'Width: 1.25". Single-loop styling. Antique brass buckle.',
    material: 'Full-grain leather. Solid brass buckle.'
  },
  'minimalist-cardholder': {
    id: 'minimalist-cardholder',
    title: 'Minimalist Cardholder',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1628149462153-29ecda955685?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['tan', 'black', 'maroon', 'dual'],
    category: 'wallets',
    description: 'Slim, simple, functional. The essential card carrier for the modern minimalist.',
    details: 'Holds up to 8 cards. Center pocket for cash.',
    material: 'Vegetable-tanned leather.'
  }
};

const relatedProducts = [
  {
    id: 'the-weekender',
    title: 'The Weekender',
    price: 345,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'classic-leather-belt',
    title: 'Classic Leather Belt',
    price: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop'
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products[slug as keyof typeof products];
  
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [mainImage, setMainImage] = useState(product?.images?.[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('center center');
  const [activeTab, setActiveTab] = useState('additional');

  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0]);
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const inWishlist = product ? wishlist.some(i => i.id === product.id) : false;

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <h1>Product not found</h1>
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
              alt={product.title} 
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
            {product.images.map((img, index) => (
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
            <h1 style={{ fontSize: '2rem', fontWeight: 400, textTransform: 'uppercase', marginBottom: 0, fontFamily: 'var(--font-serif)' }}>{product.title}</h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{(product.price * 80).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ cursor: 'pointer', color: '#888' }} title="Copy Link"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>
              <span style={{ cursor: 'pointer', color: '#25D366' }} title="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>
              <span style={{ cursor: 'pointer', color: '#1877F2' }} title="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <p style={{ marginBottom: '0.25rem' }}>Type : {product.category || 'perfume case'}</p>
            <p>Size : 13 x 8 cm</p>
          </div>

          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <p style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Features:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
              <li style={{ marginBottom: '0.25rem' }}>Imported vegetable tan leather</li>
              <li>Snap-button closure</li>
            </ul>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`swatch swatch--${color} ${selectedColor === color ? 'is-active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', 
                      border: selectedColor === color ? '2px solid white' : '1px solid #ccc',
                      boxShadow: selectedColor === color ? '0 0 0 1px var(--color-bg)' : 'none'
                    }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{selectedColor ? 'CLEAR' : 'SELECT'}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>What to Print In A?</label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--color-text)' }}>
              <option value="" style={{ color: 'black' }}>SELECT</option>
              <option value="initials" style={{ color: 'black' }}>Initials (Max 3)</option>
              <option value="fullname" style={{ color: 'black' }}>Full Name</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>What to Print In B?</label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--color-text)' }}>
              <option value="" style={{ color: 'black' }}>SELECT</option>
              <option value="logo" style={{ color: 'black' }}>Logo</option>
              <option value="empty" style={{ color: 'black' }}>Empty</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>Options Price</span>
              <span>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>Product Price</span>
              <span>₹{(product.price * 80).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>₹{((product.price * 80) * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
            <input 
              type="number" 
              value={quantity} 
              min="1" max="10" 
              onChange={(e) => setQuantity(Number(e.target.value))} 
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
              style={{ flex: 1, backgroundColor: '#f6c358', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', padding: '0.75rem', fontSize: '1rem' }} 
              onClick={() => addToCart({ ...product, price: product.price * 80, image: product.images[0], color: selectedColor }, quantity)}
            >
              ADD TO CART
            </button>
            <button 
              type="button" 
              className={`btn btn--outline btn-wishlist ${inWishlist ? 'active' : ''}`} 
              style={{ padding: '0 1rem', border: 'none' }} 
              onClick={() => toggleWishlist({ ...product, image: product.images[0] })}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? 'var(--color-accent)' : 'none'} stroke={inWishlist ? 'var(--color-accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem' }}>
            <span><strong style={{ color: 'var(--color-text)' }}>SKU:</strong> N/A</span>
            <span><strong style={{ color: 'var(--color-text)' }}>Categories:</strong> <Link href="/products" style={{ color: '#f6c358' }}>All</Link>, <Link href="/products" style={{ color: '#f6c358' }}>{product.category}</Link>, <Link href="/products" style={{ color: '#f6c358' }}>Unisex</Link></span>
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
          <button 
            style={{ padding: '0 0 1rem 0', background: 'transparent', border: 'none', color: activeTab === 'reviews' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: activeTab === 'reviews' ? 'bold' : 'normal', borderBottom: activeTab === 'reviews' ? '2px solid #f6c358' : '2px solid transparent', cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (0)
          </button>
        </div>

        {activeTab === 'additional' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '20%', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontWeight: 'bold' }}>Weight</th>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>173 g</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '20%', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontWeight: 'bold' }}>Dimensions</th>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>8 × 13 cm</td>
              </tr>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', width: '20%', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', fontWeight: 'bold' }}>Select Colour</th>
                <td style={{ padding: '1rem 1.5rem', color: '#f6c358', textTransform: 'uppercase' }}>BLACK VS TAN</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 'description' && (
          <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            <p>There are no reviews yet.</p>
          </div>
        )}
      </div>

      <section className="products section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">You Might <span className="font-serif italic text-muted">Also</span> <span className="accent-color font-serif italic">Like</span></h2>
          </div>
          
          <div className="products__grid">
            {relatedProducts.map((p) => (
              <article key={p.id} className="product-card">
                <Link href={`/products/${p.id}`} className="product-card__link">
                  <div className="product-card__image-wrapper">
                    <img src={p.image} alt={p.title} className="product-card__image" loading="lazy" />
                  </div>
                  <div className="product-card__info">
                    <h3 className="product-card__title">{p.title}</h3>
                    <p className="product-card__price">${p.price}.00</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}