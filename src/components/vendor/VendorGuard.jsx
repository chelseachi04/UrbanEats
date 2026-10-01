/**
 * VendorGuard — UrbanEats Vendor Route Protection Guard
 *
 * Restricts access strictly to users authenticated with role = 'vendor' and application_status = 'APPROVED'.
 * Unapproved or pending vendor applicants see a clear application status screen.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Store, Loader2, ArrowLeft, Clock, XCircle, User } from 'lucide-react';

export default function VendorGuard({ children }) {
  const { user, isAuthLoading, openLogin } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>Verifying vendor authorization...</span>
      </div>
    );
  }

  // Not logged in or not vendor
  if (!user || user.role !== 'vendor') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div
          style={{
            maxWidth: '520px', width: '100%', backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)', borderRadius: '24px',
            padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            style={{
              width: '64px', height: '64px', borderRadius: '20px',
              backgroundColor: '#FEF2F2', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
            Vendor Portal Access Required
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            The Restaurant Dashboard is reserved for authorized vendor partners.
            {!user ? ' Please log in to continue.' : ' Your current account does not have vendor access.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!user && (
              <button
                className="btn btn-primary"
                onClick={() => openLogin('vendor')}
                style={{ borderRadius: '12px', padding: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Store size={18} />
                Login as Vendor Partner
              </button>
            )}
            {!user && (
              <button
                className="btn btn-outline"
                onClick={() => openLogin('customer')}
                style={{ borderRadius: '12px', padding: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <User size={18} />
                Sign In (Customer / Rider)
              </button>
            )}

            <button
              className="btn btn-outline"
              onClick={() => navigate('/')}
              style={{ borderRadius: '12px', padding: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} />
              Return to Food Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending approval status check
  if (user.application_status === 'PENDING') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '540px', width: '100%', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Clock size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
            Vendor Application Under Review
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Thank you for applying to become an UrbanEats Vendor Partner! Your application is currently under review by UrbanEats Admin verification team.
            You will receive your unique Vendor ID and full Restaurant Dashboard access once approved.
          </p>
          <button className="btn btn-outline" onClick={() => navigate('/')} style={{ borderRadius: '12px', padding: '12px', fontWeight: 700, width: '100%' }}>
            Return to Food Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Rejected status check
  if (user.application_status === 'REJECTED') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '540px', width: '100%', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <XCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
            Vendor Application Status: Not Approved
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Your vendor partner application was not approved at this time. Please contact UrbanEats support for further information.
          </p>
          <button className="btn btn-outline" onClick={() => navigate('/')} style={{ borderRadius: '12px', padding: '12px', fontWeight: 700, width: '100%' }}>
            Return to Food Marketplace
          </button>
        </div>
      </div>
    );
  }

  return children;
}
