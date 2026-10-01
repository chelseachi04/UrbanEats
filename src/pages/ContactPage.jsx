import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubPageHeader from '../components/common/SubPageHeader';

export default function ContactPage() {
  const location = useLocation();
  const isLegal = location.search.includes('legal') || location.pathname.includes('privacy') || location.pathname.includes('terms');
  const pageTitle = isLegal ? 'Terms & Privacy Policy' : 'FAQ & Support';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  useScrollAnimation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Mobile-only sub-page header */}
      <SubPageHeader title={pageTitle} />

      <div className="section page-header-tight sub-page-content">
        <div className="container">
          <div className="section-header animate-on-scroll sub-page-desktop-header">
            <div className="section-subtitle">Get In Touch</div>
            <h1 className="section-title">{isLegal ? 'Terms of Use & Privacy Policy' : 'Help & Customer Support'}</h1>
            <p className="section-description">
              Have questions about ordering food, vendor partnership, or delivery riding? Send us a message!
            </p>
          </div>

        <div className="grid grid-cols-2">
          {/* Contact Details */}
          <div className="animate-on-scroll" style={{ transitionDelay: '0.1s', background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contact Information</h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div className="floating-icon" style={{ flexShrink: 0 }}><MapPin size={20} /></div>
              <div>
                <div style={{ fontWeight: 700 }}>Office Headquarters</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Abraka Campus Main Road, Delta State, Nigeria
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div className="floating-icon" style={{ flexShrink: 0 }}><Mail size={20} /></div>
              <div>
                <div style={{ fontWeight: 700 }}>Email Us</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  support@urbaneats.ng
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="floating-icon" style={{ flexShrink: 0 }}><Phone size={20} /></div>
              <div>
                <div style={{ fontWeight: 700 }}>Call Support</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  +234 (0) 800 URBAN EATS
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-on-scroll" style={{ transitionDelay: '0.2s', background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
                <h3>Thank You!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Your message has been received. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
