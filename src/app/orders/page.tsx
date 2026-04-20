'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_id: string | null;
  created_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (res.status === 401) {
        setError('Please log in to view your orders.');
      } else {
        setError('Failed to load orders.');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return '#38a169';
      case 'SHIPPED': return '#4facfe';
      case 'PENDING': return '#ecc94b';
      case 'FAILED': return '#e53e3e';
      default: return '#888';
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">My <span className="font-serif italic text-muted">Orders</span><span className="dot">.</span></h1>
          <p className="page-subtitle">Track your purchases</p>
        </div>
      </div>

      <section className="container" style={{ paddingBottom: '6rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Loading orders...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{error}</p>
            <Link href="/" className="btn btn--primary">Continue Shopping</Link>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="btn btn--primary">Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Order ID</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order.id.slice(0, 12)}...</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Date</p>
                    <p style={{ fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <span style={{
                      background: getStatusColor(order.status),
                      color: '#fff',
                      padding: '0.3rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item) => {
                    const imgs = Array.isArray(item.product.images) ? item.product.images : [];
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                        {imgs.length > 0 ? (
                          <img src={imgs[0]} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--color-text-muted)' }}>No img</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <Link href={`/products/${item.product.slug}`} style={{ color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>{item.product.name}</Link>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-accent)' }}>₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
