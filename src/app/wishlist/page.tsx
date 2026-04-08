'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Your <span className="font-serif italic text-muted">Wishlist</span><span className="dot">.</span></h1>
        </div>
      </div>

      <section className="container section pt-0" style={{ minHeight: '40vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {wishlist.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              Your wishlist is empty.<br /><br />
              <Link href="/products" className="btn btn--outline">Continue Shopping</Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <article key={item.id} className="product-card">
                <button 
                  className="btn-wishlist active" 
                  aria-label="Remove from wishlist" 
                  style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(item);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <div className="product-card__link">
                  <Link href={`/products/${item.id}`} style={{ display: 'block' }}>
                    <div className="product-card__image-wrapper" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: 'var(--color-gray-50)', marginBottom: '1.5rem' }}>
                      <img src={item.image} alt={item.title} className="product-card__image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                  </Link>
                  <div className="product-card__info">
                    <h3 className="product-card__title" style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p className="product-card__price" style={{ color: 'var(--color-text-muted)' }}>${item.price.toFixed(2)}</p>
                    <button 
                      className="btn btn--outline btn-add-to-cart" 
                      style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.7rem' }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
