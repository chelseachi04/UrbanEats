import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Shield, UserCheck, ShoppingBag, Truck, AlertCircle, Database, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubPageHeader from '../components/common/SubPageHeader';

export default function TermsPrivacyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  useScrollAnimation();

  // Determine active tab from URL (/terms vs /privacy)
  const isPrivacyRoute = location.pathname.includes('privacy');
  const [activeTab, setActiveTab] = useState(isPrivacyRoute ? 'privacy' : 'terms');

  useEffect(() => {
    if (location.pathname.includes('privacy')) {
      setActiveTab('privacy');
    } else if (location.pathname.includes('terms')) {
      setActiveTab('terms');
    }
  }, [location.pathname]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'terms') navigate('/terms', { replace: true });
    else if (tab === 'privacy') navigate('/privacy', { replace: true });
  };

  return (
    <div style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Sticky top sub-page header */}
      <SubPageHeader title={activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'} />

      <div className="section page-header-tight sub-page-content">
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Desktop header */}
          <div className="section-header animate-on-scroll sub-page-desktop-header" style={{ marginBottom: '2rem' }}>
            <div className="section-subtitle">Legal &amp; Compliance</div>
            <h1 className="section-title">Terms of Use &amp; Privacy Policy</h1>
            <p className="section-description">
              Please review the operational terms, customer rights, and privacy practices governing the UrbanEats platform across Abraka.
            </p>
          </div>

          {/* Legal Tab Switcher Bar */}
          <div
            className="animate-on-scroll"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '2.5rem'
            }}
          >
            <button
              type="button"
              onClick={() => handleTabSwitch('terms')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                border: activeTab === 'terms' ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                background: activeTab === 'terms' ? 'var(--primary)' : '#ffffff',
                color: activeTab === 'terms' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeTab === 'terms' ? '0 4px 14px rgba(255, 87, 34, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={18} />
              <span>Terms of Service</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('privacy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                border: activeTab === 'privacy' ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                background: activeTab === 'privacy' ? 'var(--primary)' : '#ffffff',
                color: activeTab === 'privacy' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeTab === 'privacy' ? '0 4px 14px rgba(255, 87, 34, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Shield size={18} />
              <span>Privacy Policy</span>
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              TERMS OF SERVICE TAB CONTENT
              ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'terms' && (
            <div
              className="animate-on-scroll"
              style={{
                background: '#ffffff',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                <FileText size={26} style={{ color: 'var(--primary)' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#0F172A' }}>UrbanEats Terms of Service</h2>
                  <span style={{ fontSize: '0.80rem', color: '#94A3B8' }}>Effective Date: January 2026 • Abraka, Delta State</span>
                </div>
              </div>

              {/* Section 1: User Account Responsibilities */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <UserCheck size={18} style={{ color: 'var(--primary)' }} />
                  1. User Account Responsibilities
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  To place food orders or register as a partner vendor or dispatch rider on UrbanEats, users must provide accurate, current, and authentic contact details, including a verifiable telephone number and delivery destination in Abraka. Users are responsible for safeguarding their login credentials and all transactions carried out under their account.
                </p>
              </div>

              {/* Section 2: Order Placements & Menu Pricing */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
                  2. Order Placements &amp; Menu Pricing
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Menu items, portion sizes, prices, and dish availability are managed directly by verified partner kitchens in Abraka. An order is confirmed once payment authorization or Pay-on-Delivery confirmation is received and accepted by the kitchen. Prices displayed are inclusive of item costs; delivery fees are transparently calculated at checkout based on distance.
                </p>
              </div>

              {/* Section 3: Food Preparation & Restaurant Dispatch Policies */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981' }} />
                  3. Food Preparation &amp; Restaurant Dispatch Policies
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Partner kitchens commit to strict hygiene and food safety guidelines. All orders are sealed in tamper-evident food packaging before dispatch. Once packaged, an assigned dispatch rider collects the thermal carrier bag for immediate transport without unnecessary intermediate stops.
                </p>
              </div>

              {/* Section 4: Delivery Conditions Across Abraka Campuses & Zones */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <Truck size={18} style={{ color: 'var(--primary)' }} />
                  4. Delivery Conditions Across Abraka Campuses &amp; Zones
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  UrbanEats provides doorstep and designated landmark delivery coverage across DELSU Site I, Site II, Site III, Campus Main Gates, Abraka Police Station Axis, and surrounding university hostel communities. Customers must remain reachable via telephone when a rider arrives at the delivery drop-off point.
                </p>
              </div>

              {/* Section 5: Cancellations, Refunds & Dispute Resolutions */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <AlertCircle size={18} style={{ color: '#EF4444' }} />
                  5. Cancellations, Refunds &amp; Dispute Resolutions
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Orders can be cancelled free of charge prior to kitchen preparation commencement. If an order has incorrect or missing items upon delivery, customers should report the discrepancy within 1 hour via the Order Details support action. Verified claims are refunded immediately to the original payment source or issued as platform food credit.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              PRIVACY POLICY TAB CONTENT
              ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'privacy' && (
            <div
              className="animate-on-scroll"
              style={{
                background: '#ffffff',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                <Shield size={26} style={{ color: 'var(--primary)' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#0F172A' }}>UrbanEats Privacy &amp; Data Policy</h2>
                  <span style={{ fontSize: '0.80rem', color: '#94A3B8' }}>Effective Date: January 2026 • Delta State, Nigeria</span>
                </div>
              </div>

              {/* Section 1: Information We Collect */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <Database size={18} style={{ color: 'var(--primary)' }} />
                  1. Information We Collect
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  We collect essential information required to process food orders, ensure safe delivery, and manage customer accounts. This includes customer names, contact phone numbers, delivery addresses/hostel names in Abraka, order items, and transactional records.
                </p>
              </div>

              {/* Section 2: Usage of Customer Data */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <Eye size={18} style={{ color: 'var(--primary)' }} />
                  2. Usage of Customer Data
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  Customer data is utilized strictly for: (a) fulfilling delivery logistics and connecting customers with restaurants and riders; (b) sending transactional notifications and delivery status alerts; (c) customer support assistance; and (d) maintaining platform integrity and fraud prevention.
                </p>
              </div>

              {/* Section 3: Data Security & Protection Practices */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <Lock size={18} style={{ color: '#10B981' }} />
                  3. Data Security &amp; Protection Practices
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  All network traffic is encrypted using modern TLS/SSL security protocols. Sensitive authentication credentials and payment authorizations are securely tokenized. We enforce strict role-based access restrictions so only assigned delivery personnel can view pertinent drop-off details during an active order.
                </p>
              </div>

              {/* Section 4: Cookies & Local Storage Policies */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                  4. Cookies &amp; Local Storage Policies
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  UrbanEats uses local storage and lightweight session tokens solely to preserve your active shopping cart, remember your authenticated session state, and maintain user preferences across page navigation. We do not sell or monetize personal customer data to external advertising networks.
                </p>
              </div>

              {/* Section 5: Data Rights & Contact */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                  5. Customer Rights &amp; Privacy Contact
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  You retain the right to access, update, or request the deletion of your account data at any time. For legal or privacy inquiries, please contact our data compliance officer directly at{' '}
                  <a href="mailto:privacy@urbaneats.ng" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                    privacy@urbaneats.ng
                  </a>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
