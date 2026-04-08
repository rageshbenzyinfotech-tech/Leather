'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Get in <span className="font-serif italic text-muted">Touch</span><span className="dot">.</span></h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '600px' }}>
          <p className="about__text" style={{ marginBottom: '3rem' }}>
            Have a question about our products? Need help with an order? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid form-grid--2col">
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <textarea 
                  className="form-input" 
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary">Send Message</button>
          </form>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="footer__grid" style={{ marginBottom: '0' }}>
            <div className="footer__brand">
              <h3 className="footer__title">Email</h3>
              <p className="footer__desc">hello@zerano.com</p>
            </div>
            <div className="footer__brand">
              <h3 className="footer__title">Phone</h3>
              <p className="footer__desc">+1 (555) 123-4567</p>
            </div>
            <div className="footer__brand">
              <h3 className="footer__title">Hours</h3>
              <p className="footer__desc">Mon-Fri: 9am - 6pm EST</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}