/**
 * RiderGuard — UrbanEats Rider Route Protection Guard
 *
 * Restricts access strictly to users authenticated with role = 'rider' and application_status = 'APPROVED'.
 * Unapproved or pending rider applicants see a clear application status screen.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Bike, Loader2, ArrowLeft, Clock, XCircle } from 'lucide-react';

export default function RiderGuard({ children }) {
  const { user, isAuthLoading, openLogin } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>Verifying rider authorization...</span>
      </div>
    );
  }

  // Not logged in or not rider
  if (!user || user.role !== 'rider') {
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
            Rider Portal Access Required
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            The Delivery Portal is reserved strictly for authorized UrbanEats rider partners.
            {!user ? ' Please log in with a registered rider account.' : ` Your current account is registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}.`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => openLogin('rider')}
              style={{ borderRadius: '12px', padding: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Bike size={18} />
              Login as Delivery Partner
            </button>

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
            Rider Application Under Review
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Thank you for applying to become an UrbanEats Rider Partner! Your application is currently under review by UrbanEats Admin verification team.
            You will receive your unique Rider ID and full Delivery Portal access once approved.
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
            Rider Application Status: Not Approved
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Your rider partner application was not approved at this time. Please contact UrbanEats support for further information.
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
