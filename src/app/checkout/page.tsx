'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, cartTotal, user, clearCart } = useStore();
  const [step, setStep] = useState('shipping');
  const [paying, setPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const [shippingForm, setShippingForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const { email, firstName, lastName, address, city, pincode, phone } = shippingForm;
    if (!email || !firstName || !lastName || !address || !city || !pincode || !phone) {
      setError('Please fill in all required fields');
      return false;
    }
    setError('');
    return true;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      setError('Please log in before proceeding to payment.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPaying(true);
    setError('');

    try {
      // Step 1: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        setPaying(false);
        return;
      }

      // Step 2: Create Razorpay order on backend
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        setError(data.error || 'Failed to create payment order.');
        setPaying(false);
        return;
      }

      const orderData = await createRes.json();

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_123456789',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Zerano Leather',
        description: 'Premium Leather Goods',
        order_id: orderData.id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // Step 4: Verify payment on backend
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId,
              }),
            });

            if (verifyRes.ok) {
              setOrderSuccess(true);
              clearCart();
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch {
            setError('Payment verification error. Please contact support.');
          }
          setPaying(false);
        },
        prefill: {
          name: `${shippingForm.firstName} ${shippingForm.lastName}`,
          email: shippingForm.email || user.email,
          contact: shippingForm.phone,
        },
        theme: {
          color: '#e55f30',
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setPaying(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container" style={{ paddingTop: '12rem', paddingBottom: '6rem', textAlign: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2rem' }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Thank you for your purchase. Your payment has been verified and your order is being processed.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/orders" className="btn btn--primary">View Orders</Link>
          <Link href="/products" className="btn btn--outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-layout" style={{ paddingTop: '10rem' }}>
      <div className="checkout-form">
        
        {/* Shipping Step */}
        <div style={{ display: step === 'shipping' ? 'block' : 'none' }}>
          <div className="checkout__section">
            <h2 className="checkout__section-title">Contact</h2>
            <div className="form-group">
              <input type="email" name="email" className="form-input" placeholder="Email address" value={shippingForm.email} onChange={handleShippingChange} />
            </div>
          </div>
          <div className="checkout__section">
            <h2 className="checkout__section-title">Shipping Address</h2>
            <div className="form-grid form-grid--2col">
              <div className="form-group"><input type="text" name="firstName" className="form-input" placeholder="First name" value={shippingForm.firstName} onChange={handleShippingChange} /></div>
              <div className="form-group"><input type="text" name="lastName" className="form-input" placeholder="Last name" value={shippingForm.lastName} onChange={handleShippingChange} /></div>
            </div>
            <div className="form-group"><input type="text" name="address" className="form-input" placeholder="Address" value={shippingForm.address} onChange={handleShippingChange} /></div>
            <div className="form-grid form-grid--2col">
              <div className="form-group"><input type="text" name="city" className="form-input" placeholder="City" value={shippingForm.city} onChange={handleShippingChange} /></div>
              <div className="form-group"><input type="text" name="state" className="form-input" placeholder="State" value={shippingForm.state} onChange={handleShippingChange} /></div>
            </div>
            <div className="form-grid form-grid--2col">
              <div className="form-group"><input type="text" name="pincode" className="form-input" placeholder="PIN Code" value={shippingForm.pincode} onChange={handleShippingChange} /></div>
              <div className="form-group"><input type="tel" name="phone" className="form-input" placeholder="Phone number" value={shippingForm.phone} onChange={handleShippingChange} /></div>
            </div>
          </div>
          {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          <button className="btn btn--primary btn--large" style={{ width: '100%' }} onClick={() => { if (validateShipping()) setStep('payment'); }}>Continue to Payment</button>
        </div>

        {/* Payment Step */}
        <div style={{ display: step === 'payment' ? 'block' : 'none' }}>
          <div className="checkout__section">
            <h2 className="checkout__section-title">Payment</h2>
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Razorpay Secure Checkout</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                You&apos;ll be redirected to Razorpay&apos;s secure payment gateway.<br />
                Supports UPI, Credit/Debit Cards, Net Banking & Wallets.
              </p>
            </div>
            
            {!user && (
              <p style={{ color: '#ecc94b', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(236,201,75,0.1)', borderRadius: '6px' }}>
                ⚠️ Please log in to complete your purchase.
              </p>
            )}

            {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

            <button 
              className="btn btn--primary btn--large" 
              style={{ width: '100%', marginTop: '1rem' }} 
              onClick={handlePayment}
              disabled={paying || !user}
            >
              {paying ? 'Processing...' : `Pay ₹${(cartTotal > 0 ? cartTotal + 15 : 0).toLocaleString('en-IN')}`}
            </button>
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
              <div style={{ marginLeft: 'auto' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div className="checkout-totals">
          <div className="checkout-total-line">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="checkout-total-line">
            <span>Shipping</span>
            <span>₹15.00</span>
          </div>
          <div className="checkout-total-line checkout-total-line--final">
            <span className="total-label">Total</span>
            <span className="total-amount">
              <span className="currency-code">INR</span> ₹{(cartTotal > 0 ? cartTotal + 15 : 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}