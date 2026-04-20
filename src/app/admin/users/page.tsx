'use client';

import React, { useEffect, useState } from 'react';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  _count: { orders: number };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to load users. Make sure you are logged in as admin.');
      }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => u.id === userId ? { ...u, role: data.user.role } : u));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update role');
      }
    } catch { setError('Network error'); }
    finally { setUpdatingRole(null); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="admin-loader"></div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>User Management</h1>
        <button onClick={fetchUsers} className="admin-btn admin-btn--outline">↻ Refresh</button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error} <button onClick={() => setError('')} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td style={{ fontSize: '0.85rem', color: '#666' }}>{user.email}</td>
                  <td>
                    <span className={`admin-badge ${user.role === 'ADMIN' ? 'admin-badge--paid' : 'admin-badge--pending'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user._count.orders}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      disabled={updatingRole === user.id}
                      className="admin-input"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', minWidth: '100px' }}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
