'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { login, register } = useStore();

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (mode === 'login') {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      result = await login(email, password);
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      result = await register(name, email, password);
    }

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          resetForm();
          setMode('login');
        }, 300);
      }, 1500);
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="login-left">
          <div className="login-brand">
            <h3 className="section-title" style={{ fontSize: '2rem', margin: 0 }}>Zerano</h3>
            <p className="page-subtitle" style={{ marginTop: '0.5rem', marginBottom: '3rem' }}>Premium Leather</p>
          </div>
          
          <h2 className="login-title font-serif">
            {mode === 'login' ? 'Welcome Back.' : 'Join Zerano.'}
          </h2>
          
          <div className="login-features">
            <div className="feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <h4>Members Only</h4>
              <p>Early access to new drops</p>
            </div>
            <div className="feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <h4>Free Shipping</h4>
              <p>On all domestic orders</p>
            </div>
            <div className="feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <h4>Secure Checkout</h4>
              <p>Fast and encrypted</p>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-form-wrapper">
            {success ? (
              <div style={{ textAlign: 'center', margin: 'auto' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3 className="form-title">{mode === 'login' ? 'Login Successful!' : 'Account Created!'}</h3>
                <p className="text-muted">Welcome to Zerano.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="form-title">
                  {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                </h3>
                <p className="form-subtitle text-muted" style={{ marginBottom: '2rem' }}>
                  {mode === 'login' 
                    ? 'Enter your email and password below.' 
                    : 'Fill in your details to get started.'}
                </p>

                {mode === 'register' && (
                  <div className="phone-input-group" style={{ marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="phone-input"
                      style={{ paddingLeft: '1rem' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="phone-input-group" style={{ marginBottom: '1rem' }}>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="phone-input"
                    style={{ paddingLeft: '1rem' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="phone-input-group" style={{ marginBottom: '1rem' }}>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="phone-input"
                    style={{ paddingLeft: '1rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                {error && <p style={{ color: '#e53e3e', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

                <button 
                  type="submit"
                  className="btn btn--primary login-submit-btn" 
                  disabled={loading}
                >
                  {loading 
                    ? (mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...')
                    : (mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')
                  }
                </button>

                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button 
                    type="button"
                    onClick={switchMode} 
                    style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </form>
            )}
          </div>
          
          <div className="login-terms">
            By continuing, you agree to our <br/>
            <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
