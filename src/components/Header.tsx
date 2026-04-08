'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, wishlist, removeFromCart, cartTotal, cartCount } = useStore();

  return (
    <header className="header">
      <div className="container header__container">
        <Link href="/" className="header__logo">Zerano</Link>
        
        <nav className="header__nav" aria-label="Main Navigation">
          <ul className="header__nav-list">
            <li className="has-megamenu">
              <Link href="/products" className="header__nav-link">Shop</Link>
              <div className="megamenu">
                <div className="container megamenu__container">
                  <div className="megamenu__sidebar">
                    <ul className="megamenu__categories">
                      <li>
                        <Link href="/products" className="active">
                          Wallets
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="/products">
                          Bags
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="/products">
                          Belts
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="/products">
                          Accessories
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </li>
                      <li>
                        <Link href="/products">
                          All Products
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="megamenu__content">
                    <div className="megamenu__grid">
                      <Link href="/products/essential-slim-wallet" className="megamenu__product">
                        <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop" alt="Slim Wallet" className="megamenu__product-image" />
                        <h4 className="megamenu__product-title">Slim Wallet</h4>
                        <p className="megamenu__product-price">$65.00</p>
                      </Link>
                      <Link href="/products/essential-slim-wallet" className="megamenu__product">
                        <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop" alt="Cardholder" className="megamenu__product-image" />
                        <h4 className="megamenu__product-title">Cardholder</h4>
                        <p className="megamenu__product-price">$45.00</p>
                      </Link>
                      <Link href="/products/essential-slim-wallet" className="megamenu__product">
                        <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop" alt="Folio Wallet" className="megamenu__product-image" />
                        <h4 className="megamenu__product-title">Folio Wallet</h4>
                        <p className="megamenu__product-price">$95.00</p>
                      </Link>
                      <Link href="/products/essential-slim-wallet" className="megamenu__product">
                        <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop" alt="Bifold Wallet" className="megamenu__product-image" />
                        <h4 className="megamenu__product-title">Bifold Wallet</h4>
                        <p className="megamenu__product-price">$85.00</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li><Link href="/about" className="header__nav-link">About</Link></li>
            <li><Link href="/contact" className="header__nav-link">Contact</Link></li>
          </ul>
        </nav>
        
        <div className="header__actions">
          <Link href="/wishlist" className="header__action-link" style={{ marginRight: '1rem' }}>
            Wishlist ({wishlist.length})
          </Link>
          <button 
            className="header__action-link" 
            id="cart-toggle"
            onClick={() => setCartOpen(!cartOpen)}
          >
            Cart ({cartCount})
          </button>
          
          <div className={`cart-dropdown ${cartOpen ? 'is-active' : ''}`} id="cart-dropdown">
            <div className="cart-dropdown__header">
              <h3 className="cart-dropdown__title">Your Cart</h3>
              <button className="cart-dropdown__close" id="cart-close" aria-label="Close cart" onClick={() => setCartOpen(false)}>
                &times;
              </button>
            </div>
            <div className="cart-dropdown__body">
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>Your cart is empty.</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="cart-dropdown__item">
                    <img src={item.image} alt={item.title} className="cart-dropdown__item-image" />
                    <div className="cart-dropdown__item-info">
                      <h4 className="cart-dropdown__item-title">{item.title} {item.color ? `(${item.color})` : ''}</h4>
                      <p className="cart-dropdown__item-price">{item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <button className="cart-dropdown__item-remove" onClick={() => removeFromCart(item.id + (item.color ? '-' + item.color : ''))} aria-label="Remove item">Remove</button>
                  </div>
                ))
              )}
            </div>
            <div className="cart-dropdown__footer">
              <div className="cart-dropdown__total">
                <span>Subtotal</span>
                <span className="cart-dropdown__total-price">${cartTotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="btn btn--primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => setCartOpen(false)}>Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}