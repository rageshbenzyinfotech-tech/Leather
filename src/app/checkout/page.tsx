'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();
  const [step, setStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const router = useRouter();

  const handlePay = () => {
    alert('Order placed successfully! Redirecting...');
    localStorage.removeItem('zerano_cart_next');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="container checkout-layout" style={{ paddingTop: '10rem' }}>
      <div className="checkout-form">
        
        {/* Contact and Shipping */}
        <div style={{ display: step === 'shipping' ? 'block' : 'none' }}>
          <div className="checkout__section">
            <h2 className="checkout__section-title">Contact</h2>
            <div className="form-group">
              <input type="email" className="form-input" placeholder="Email address" />
            </div>
          </div>
          <div className="checkout__section">
            <h2 className="checkout__section-title">Shipping Address</h2>
            <div className="form-grid form-grid--2col">
              <div className="form-group"><input type="text" className="form-input" placeholder="First name" /></div>
              <div className="form-group"><input type="text" className="form-input" placeholder="Last name" /></div>
            </div>
            <div className="form-group"><input type="text" className="form-input" placeholder="Address" /></div>
            <div className="form-group"><input type="text" className="form-input" placeholder="City" /></div>
          </div>
          <button className="btn btn--primary btn--large" style={{ width: '100%' }} onClick={() => setStep('payment')}>Continue to Payment</button>
        </div>

        {/* Payment */}
        <div style={{ display: step === 'payment' ? 'block' : 'none' }}>
          <div className="checkout__section">
            <h2 className="checkout__section-title">Payment</h2>
            <div className="form-grid">
              <label className="form-checkbox-group" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '1rem' }} /> Credit/Debit Card
              </label>
              <label className="form-checkbox-group" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '1rem' }} /> UPI
              </label>
              <label className="form-checkbox-group" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '1rem' }} /> Cash on Delivery
              </label>
              
              {paymentMethod === 'card' && (
                <div style={{ marginTop: '1rem' }}>
                  <div className="form-group"><input type="text" className="form-input" placeholder="Card number" /></div>
                  <div className="form-grid form-grid--2col">
                    <div className="form-group"><input type="text" className="form-input" placeholder="MM/YY" /></div>
                    <div className="form-group"><input type="text" className="form-input" placeholder="CVV" /></div>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn--primary btn--large" style={{ width: '100%', marginTop: '2rem' }} onClick={handlePay}>Pay Now</button>
            <button className="btn btn--outline" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setStep('shipping')}>Back to Shipping</button>
          </div>
        </div>

      </div>

      <div className="checkout-summary">
        <div className="checkout-items" style={{ marginBottom: '2rem' }}>
          {cart.map((item, i) => (
            <div key={i} className="checkout-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="checkout-item__image-wrapper" style={{ position: 'relative', width: '64px', height: '64px' }}>
                <img src={item.image} alt={item.title} className="checkout-item__image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                <span className="checkout-item__quantity" style={{ position: 'absolute', top: -5, right: -5, background: 'var(--color-gray-300)', color: 'white', fontSize: 12, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
              </div>
              <div className="checkout-item__info">
                <h4 style={{ fontSize: 14 }}>{item.title}</h4>
                {item.color && <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.color}</p>}
              </div>
              <div style={{ marginLeft: 'auto' }}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="checkout-totals">
          <div className="checkout-total-line">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="checkout-total-line">
            <span>Shipping</span>
            <span>$15.00</span>
          </div>
          <div className="checkout-total-line checkout-total-line--final">
            <span className="total-label">Total</span>
            <span className="total-amount">
              <span className="currency-code">USD</span> ${(cartTotal > 0 ? cartTotal + 15 : 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}