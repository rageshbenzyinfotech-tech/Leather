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

interface Stats {
  usersCount: number;
  ordersCount: number;
  productsCount: number;
  totalRevenue: number;
  recentOrders: OrderType[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError('Failed to load dashboard data. Make sure you are logged in as admin.');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="admin-loader"></div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</p>
      <button onClick={fetchStats} className="admin-btn admin-btn--primary">Retry</button>
    </div>
  );

  return (
    <div>
      <h1 className="admin-page-title">Dashboard Overview</h1>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div>
            <h3 className="admin-stat-card__label">Total Revenue</h3>
            <p className="admin-stat-card__value">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div>
            <h3 className="admin-stat-card__label">Total Orders</h3>
            <p className="admin-stat-card__value">{stats?.ordersCount || 0}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h3 className="admin-stat-card__label">Active Users</h3>
            <p className="admin-stat-card__value">{stats?.usersCount || 0}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div>
            <h3 className="admin-stat-card__label">Products</h3>
            <p className="admin-stat-card__value">{stats?.productsCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: '3rem' }}>
        <h2 className="admin-section-title">Recent Orders</h2>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.id.slice(0, 8)}...</td>
                    <td>{order.user.name}</td>
                    <td>₹{order.total_amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#999', padding: '2rem', textAlign: 'center' }}>No orders yet.</p>
        )}
      </div>
    </div>
  );
}
