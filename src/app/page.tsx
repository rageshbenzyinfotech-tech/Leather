'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const products = [
  {
    id: 'essential-slim-wallet',
    title: 'Essential Slim Wallet',
    price: 65,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    colors: ['black', 'brown', 'tan'],
    category: 'wallets'
  },
  {
    id: 'the-weekender',
    title: 'The Weekender',
    price: 345,
    discount_price: 299,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
    colors: ['brown', 'black'],
    category: 'bags'
  },
  {
    id: 'classic-leather-belt',
    title: 'Classic Leather Belt',
    price: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    colors: ['black', 'tan'],
    category: 'belts'
  },
  {
    id: 'minimalist-cardholder',
    title: 'Minimalist Cardholder',
    price: 45,
    discount_price: 39,
    image: 'https://images.unsplash.com/photo-1628149462153-29ecda955685?q=80&w=600&auto=format&fit=crop',
    colors: ['tan', 'black', 'maroon', 'dual'],
    category: 'wallets'
  },
  {
    id: 'everyday-tote',
    title: 'Everyday Tote Bag',
    price: 195,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    category: 'bags'
  },
  {
    id: 'signature-belt',
    title: 'Signature Belt',
    price: 95,
    image: 'https://images.unsplash.com/photo-1624823183572-c515a81e3a95?q=80&w=600&auto=format&fit=crop',
    category: 'belts'
  },
  {
    id: 'passport-cover',
    title: 'Passport Cover',
    price: 55,
    image: 'https://images.unsplash.com/photo-1579758629938-03607fc1ce5b?q=80&w=600&auto=format&fit=crop',
    category: 'accessories'
  },
  {
    id: 'key-organizer',
    title: 'Key Organizer',
    price: 35,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=600&auto=format&fit=crop',
    category: 'accessories'
  }
];

export default function Home() {
  const { addToCart, toggleWishlist, wishlist } = useStore();

  return (
    <>
      <section className="hero">
        <div className="container hero__container">
          <div className="hero__content">
            <h1 className="hero__title">
              Crafted Leather.<br />
              <span className="font-serif italic text-muted">Built to</span> <span className="accent-color">Last</span><span className="dot">.</span>
            </h1>
            <p className="hero__subtitle">Minimalist designs crafted from premium full-grain leather. Designed for the modern journey.</p>
            <div className="hero__actions">
              <Link href="/products" className="btn btn--primary">Shop Collection</Link>
              <Link href="/about" className="btn btn--outline">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="categories section">
        <div className="container">
          <div className="categories__grid">
            <Link href="/products?category=wallets" className="category-card">
              <div className="category-card__image-wrapper">
                <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" alt="Leather wallets assortment" className="category-card__image" loading="lazy" />
              </div>
              <h2 className="category-card__title">Wallets</h2>
            </Link>
            
            <Link href="/products?category=bags" className="category-card">
              <div className="category-card__image-wrapper">
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop" alt="Premium leather bags" className="category-card__image" loading="lazy" />
              </div>
              <h2 className="category-card__title">Bags</h2>
            </Link>
            
            <Link href="/products?category=belts" className="category-card">
              <div className="category-card__image-wrapper">
                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop" alt="Leather belts collection" className="category-card__image" loading="lazy" />
              </div>
              <h2 className="category-card__title">Belts</h2>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="about section">
        <div className="container about__container">
          <h2 className="about__title">The <span className="font-serif italic text-muted">art of</span> <span className="accent-color font-serif italic">simplicity</span><span className="dot">.</span></h2>
          <p className="about__text">We believe in doing more with less. Every piece is meticulously crafted by master artisans using sustainably sourced materials, ensuring your everyday carry ages beautifully alongside you.</p>
        </div>
      </section>

      <section className="products section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <div className="section-header__actions">
              <div className="slider-controls">
                <button className="slider-btn" id="slider-prev" aria-label="Previous">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </button>
                <button className="slider-btn" id="slider-next" aria-label="Next">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>
              <Link href="/products" className="link-animate">View All</Link>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation]}
            navigation={{ nextEl: '#slider-next', prevEl: '#slider-prev' }}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              576: { slidesPerView: 2, spaceBetween: 24 },
              992: { slidesPerView: 4, spaceBetween: 24 }
            }}
            className="products-carousel"
          >
            {products.map((product) => {
              const inWishlist = wishlist.some(i => i.id === product.id);
              return (
                <SwiperSlide key={product.id}>
                  <article className="product-card" style={{ position: 'relative' }}>
                    <button 
                      className={`btn-wishlist ${inWishlist ? 'active' : ''}`} 
                      aria-label="Toggle wishlist" 
                      style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? 'var(--color-accent)' : 'none'} stroke={inWishlist ? 'var(--color-accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>

                    <div className="product-card__link">
                      <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
                        <div className="product-card__image-wrapper">
                          <img src={product.image} alt={product.title} className="product-card__image" loading="lazy" />
                        </div>
                      </Link>
                      <div className="product-card__info">
                        <h3 className="product-card__title">{product.title}</h3>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <p className="product-card__price">₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}</p>
                          {product.discount_price && (
                            <>
                              <p className="product-card__price text-muted" style={{ textDecoration: 'line-through', fontSize: '0.8rem' }}>₹{product.price.toLocaleString('en-IN')}</p>
                              <p style={{ fontSize: '0.75rem', color: '#ff4d4d', fontWeight: '600' }}>{Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF</p>
                            </>
                          )}
                        </div>
                        {product.colors && (
                          <div className="product-card__colors">
                            {product.colors.map((color, index) => (
                              <span key={color} className={`swatch swatch--${color} ${index === 0 ? 'is-active' : ''}`}></span>
                            ))}
                          </div>
                        )}
                        <button 
                          className="btn btn--outline btn-add-to-cart" 
                          style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.7rem' }}
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({...product, quantity: 1, color: product.colors ? product.colors[0] : undefined});
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      <section className="showcase">
        <div className="showcase__image-wrapper">
          <img src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1600&auto=format&fit=crop" alt="Leather craftsmanship showing detailed texture" className="showcase__image" loading="lazy" />
          <div className="showcase__overlay">
            <h2 className="showcase__title">Uncompromising Quality</h2>
          </div>
        </div>
      </section>

      <section className="testimonials section">
        <div className="container testimonials__container">
          <blockquote className="testimonial">
            <p className="testimonial__text">"The craftsmanship is unparalleled. My wallet looks better today than the day I bought it three years ago."</p>
            <footer className="testimonial__author">— James H.</footer>
          </blockquote>
        </div>
      </section>

      <section className="cta section">
        <div className="container cta__container">
          <h2 className="cta__title">Ready to <span className="font-serif italic text-muted">upgrade</span> your <span className="accent-color font-serif italic">carry</span><span className="dot">?</span></h2>
          <Link href="/products" className="btn btn--primary btn--large">Explore The Collection</Link>
        </div>
      </section>

      <section className="instagram section">
        <div className="container">
          <div className="instagram__header">
            <h2 className="instagram__title"><a href="#" target="_blank" rel="noopener noreferrer">@Zerano</a></h2>
            <p className="instagram__subtitle">Follow our journey on Instagram</p>
          </div>
        </div>
        <div className="instagram__grid">
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram__item">
            <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop" alt="Instagram post 1" className="instagram__image" loading="lazy" />
            <div className="instagram__overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram__item">
            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop" alt="Instagram post 2" className="instagram__image" loading="lazy" />
            <div className="instagram__overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram__item">
            <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop" alt="Instagram post 3" className="instagram__image" loading="lazy" />
            <div className="instagram__overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram__item">
            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop" alt="Instagram post 4" className="instagram__image" loading="lazy" />
            <div className="instagram__overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram__item instagram__item--hide-mobile">
            <img src="https://images.unsplash.com/photo-1624823183572-c515a81e3a95?q=80&w=400&auto=format&fit=crop" alt="Instagram post 5" className="instagram__image" loading="lazy" />
            <div className="instagram__overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram__item instagram__item--hide-mobile">
            <img src="https://images.unsplash.com/photo-1579758629938-03607fc1ce5b?q=80&w=400&auto=format&fit=crop" alt="Instagram post 6" className="instagram__image" loading="lazy" />
            <div className="instagram__overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}