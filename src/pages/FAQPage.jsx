import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubPageHeader from '../components/common/SubPageHeader';

const FAQ_ITEMS = [
  {
    id: 'track-delivery',
    question: 'How do I track my delivery in Abraka?',
    answer: 'Once your order is accepted and dispatched by the restaurant, you can track the assigned rider in real-time under "My Orders" or the live delivery tracking screen. You will receive instant status updates from preparation to doorstep drop-off at your hostel or campus location.'
  },
  {
    id: 'payment-methods',
    question: 'What payment methods are supported?',
    answer: 'UrbanEats supports secure direct online payments via Debit/Credit cards, instant Bank Transfers, and Pay on Delivery (Cash or POS) for eligible Abraka hostel and campus locations.'
  },
  {
    id: 'cancel-modify',
    question: 'How do I cancel or modify an active order?',
    answer: 'You can modify or cancel an order directly from the Order Details page before the restaurant starts food preparation. If the restaurant has already begun cooking, please contact our instant support line immediately for assistance.'
  },
  {
    id: 'delivery-time',
    question: 'How long does delivery typically take?',
    answer: 'Standard delivery across Abraka Site I, Site II, Site III, Campus Gates, and neighboring areas typically takes 25 to 45 minutes depending on kitchen prep times and traffic conditions.'
  },
  {
    id: 'out-of-stock',
    question: 'What happens if an item is out of stock?',
    answer: 'If a partner kitchen runs out of a specific ingredient or dish, they will immediately notify you through the platform or call you to offer an alternative item or process an instant refund.'
  },
  {
    id: 'partner-registration',
    question: 'How do I register as a vendor or delivery rider?',
    answer: 'You can register as a vendor or rider by clicking "Become a Vendor" or "Become a Rider" in the footer or navigation menu. Our Abraka operations team reviews and approves applications within 24 hours.'
  }
];

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState('track-delivery');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  useScrollAnimation();

  const toggleFaq = (id) => {
    setOpenFaq(prev => prev === id ? null : id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Sticky top sub-page header */}
      <SubPageHeader title="FAQ & Support" />

      <div className="section page-header-tight sub-page-content">
        <div className="container">
          {/* Desktop header */}
          <div className="section-header animate-on-scroll sub-page-desktop-header">
            <div className="section-subtitle">Help Center</div>
            <h1 className="section-title">Frequently Asked Questions &amp; Support</h1>
            <p className="section-description">
              Find fast answers to common ordering questions or reach out directly to our Abraka customer support team.
            </p>
          </div>

          {/* Top Contact Channels Banner */}
          <div className="grid grid-cols-3 animate-on-scroll" style={{ marginBottom: '3.5rem', gap: '1.25rem' }}>
            {/* Headquarters Card */}
            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', marginBottom: '4px' }}>
                  Office Headquarters
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.4' }}>
                  Abraka Campus Main Road, Delta State, Nigeria
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', marginBottom: '4px' }}>
                  Email Us
                </div>
                <a
                  href="mailto:support@urbaneats.ng"
                  style={{ color: 'var(--primary)', fontSize: '0.90rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  support@urbaneats.ng
                </a>
              </div>
            </div>

            {/* Call Support Card */}
            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Phone size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', marginBottom: '4px' }}>
                  Call Support
                </div>
                <a
                  href="tel:+234800872263287"
                  style={{ color: 'var(--primary)', fontSize: '0.90rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  +234 (0) 800 URBAN EATS
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Grid: FAQ Accordion (Left) + Inquiry Form (Right) */}
          <div className="grid grid-cols-2 animate-on-scroll" style={{ gap: '2.5rem', alignItems: 'flex-start', marginBottom: '4rem' }}>
            {/* Left: Interactive FAQ Accordions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <HelpCircle size={22} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0F172A' }}>Frequently Asked Questions</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FAQ_ITEMS.map((item) => {
                  const isOpen = openFaq === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#ffffff',
                        border: isOpen ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: isOpen ? '0 4px 16px rgba(255, 87, 34, 0.08)' : '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(item.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          background: isOpen ? '#FFF7ED' : '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: isOpen ? 'var(--primary)' : '#1E293B',
                          transition: 'background 0.18s ease'
                        }}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.22s ease',
                            color: isOpen ? 'var(--primary)' : '#94A3B8',
                            flexShrink: 0,
                            marginLeft: '12px'
                          }}
                        />
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '14px 20px 18px 20px',
                            color: '#475569',
                            fontSize: '0.90rem',
                            lineHeight: '1.6',
                            borderTop: '1px solid #FFE4D6',
                            background: '#FFFDFB'
                          }}
                        >
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Direct Support Message Form */}
            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '2.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Send Us a Message</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Need help with an order, account verification, or partnership inquiry? Fill out the form below.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <CheckCircle size={52} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Dispatched!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.90rem', lineHeight: '1.5' }}>
                    Thank you! Your support request has been logged. An UrbanEats representative will reply via email or phone shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: '1.25rem' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. David Okon"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. name@student.delsu.edu.ng"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Subject</label>
                    <select
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Order Tracking & Status">Order Tracking &amp; Status</option>
                      <option value="Payment & Refund Inquiry">Payment &amp; Refund Inquiry</option>
                      <option value="Vendor Partnership">Vendor Partnership</option>
                      <option value="Rider Delivery Application">Rider Delivery Application</option>
                      <option value="Technical Feedback">Technical Feedback</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Message</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      placeholder="Describe your issue or question in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" style={{ padding: '0.75rem' }}>
                    <Send size={17} />
                    Send Support Message
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
