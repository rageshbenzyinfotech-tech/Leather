import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        // Display in console for dev testing since it's mocked
        console.log('OTP Mock info:', data.data);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose(); // Auto close on success
          // Reset state for next time
          setTimeout(() => {
            setStep(1);
            setPhone('');
            setOtp('');
            setSuccess(false);
          }, 300);
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
          
          <h2 className="login-title font-serif">Unlock Exclusive Access.</h2>
          
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
                <h3 className="form-title">Login Successful!</h3>
                <p className="text-muted">Welcome back to Zerano.</p>
              </div>
            ) : step === 1 ? (
              <>
                <h3 className="form-title">Enter your mobile number</h3>
                <p className="form-subtitle text-muted">We will send you a one-time password.</p>

                <div className="phone-input-group">
                  <div className="country-code">
                    <span>+91</span>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    className="phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                  />
                </div>
                
                {error && <p style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '-1rem', marginBottom: '1rem' }}>{error}</p>}
                
                <label className="notify-checkbox">
                  <input type="checkbox" defaultChecked className="custom-checkbox" />
                  <span>Notify me with offers & updates</span>
                </label>

                <button 
                  className="btn btn--primary login-submit-btn" 
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                >
                  {loading ? 'SENDING...' : 'CONTINUE'}
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => { setStep(1); setError(null); setOtp(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', marginRight: '0.5rem', padding: '0.2rem' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                  <h3 className="form-title" style={{ margin: 0 }}>Enter OTP</h3>
                </div>
                <p className="form-subtitle text-muted">We've sent a code to +91 {phone}</p>

                <div className="phone-input-group">
                  <input 
                    type="text" 
                    placeholder="6-digit code (Hint: 123456)" 
                    className="phone-input"
                    style={{ paddingLeft: '1rem', letterSpacing: '0.2em' }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    maxLength={6}
                    onKeyDown={(e) => e.key === 'Enter' && handleOtpSubmit()}
                  />
                </div>
                
                {error && <p style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '-1rem', marginBottom: '1rem' }}>{error}</p>}

                <button 
                  className="btn btn--primary login-submit-btn" 
                  onClick={handleOtpSubmit}
                  disabled={loading}
                >
                  {loading ? 'VERIFYING...' : 'VERIFY & LOGIN'}
                </button>
              </>
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
