'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Shopping <span className="font-serif italic text-muted">Cart</span><span className="dot">.</span></h1>
        </div>
      </div>

      <section className="container cart-layout">
        <div className="cart-items" style={{ overflowX: 'auto' }}>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: 'center' }}>Quantity</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '3rem' }}>
                    Your cart is empty. <br/><br/>
                    <Link href="/products" className="btn btn--outline">Continue Shopping</Link>
                  </td>
                </tr>
              ) : (
                cart.map((item, index) => {
                  const idKey = item.id + (item.color ? `-${item.color}` : '');
                  return (
                    <tr key={index}>
                      <td>
                        <div className="cart-product">
                          <img src={item.image} alt={item.title} className="cart-product__image" style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                          <div>
                            <h3 className="cart-product__title">{item.title} {item.color && `(${item.color})`}</h3>
                            <button className="cart-product__remove" onClick={() => removeFromCart(idKey)}>Remove</button>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="cart-quantity">
                          <button className="cart-quantity__btn" onClick={() => updateQuantity(idKey, -1)}>-</button>
                          <input type="number" value={item.quantity} readOnly className="cart-quantity__input" style={{ width: '40px', textAlign: 'center', background: 'transparent', color: 'white', border: 'none' }} />
                          <button className="cart-quantity__btn" onClick={() => updateQuantity(idKey, 1)}>+</button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div>
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="cart-summary__line">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary__line">
              <span>Shipping</span>
              <span>₹15.00</span>
            </div>
            <div className="cart-summary__total">
              <span>Total</span>
              <span>₹{(cartTotal > 0 ? cartTotal + 15 : 0).toLocaleString('en-IN')}</span>
            </div>
            {cart.length > 0 && (
              <Link href="/checkout" className="btn btn--primary" style={{ width: '100%', marginTop: '2rem', textAlign: 'center' }}>Proceed to Checkout</Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}