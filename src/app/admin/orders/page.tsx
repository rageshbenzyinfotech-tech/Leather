'use client';

import React, { useEffect, useState } from 'react';

interface OrderType {
  id: string;
  total_amount: number;
  status: string;
  payment_id: string | null;
  created_at: string;
  user: { name: string; email: string };
  items: { id: string; quantity: number; price: number; product: { name: string } }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        setError('Failed to load orders');
      }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        setError('Failed to update order status');
      }
    } catch { setError('Network error'); }
    finally { setUpdatingStatus(null); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="admin-loader"></div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Order Management</h1>
        <button onClick={fetchOrders} className="admin-btn admin-btn--outline">↻ Refresh</button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error} <button onClick={() => setError('')} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>No orders yet.</td></tr>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      <button 
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} 
                        style={{ background: 'none', border: 'none', color: '#4facfe', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      >
                        {order.id.slice(0, 8)}... {expandedOrder === order.id ? '▲' : '▼'}
                      </button>
                    </td>
                    <td>{order.user.name}</td>
                    <td style={{ fontSize: '0.8rem', color: '#666' }}>{order.user.email}</td>
                    <td><strong>₹{order.total_amount.toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span className={`admin-badge admin-badge--${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#666' }}>
                      {order.payment_id ? order.payment_id.slice(0, 12) + '...' : '—'}
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="admin-input"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', minWidth: '100px' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={8} style={{ background: '#f0f4f8', padding: '1rem 2rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Order Items:</h4>
                        <table style={{ width: '100%', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                              <th style={{ textAlign: 'left', padding: '0.3rem 0' }}>Product</th>
                              <th style={{ textAlign: 'center', padding: '0.3rem 0' }}>Qty</th>
                              <th style={{ textAlign: 'right', padding: '0.3rem 0' }}>Price</th>
                              <th style={{ textAlign: 'right', padding: '0.3rem 0' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td style={{ padding: '0.3rem 0' }}>{item.product.name}</td>
                                <td style={{ textAlign: 'center', padding: '0.3rem 0' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', padding: '0.3rem 0' }}>₹{item.price}</td>
                                <td style={{ textAlign: 'right', padding: '0.3rem 0' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
