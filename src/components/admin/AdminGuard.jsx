/**
 * AdminGuard — Restricts access to users with role = 'admin'
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminGuard({ children }) {
  const { user, isAuthLoading, openLogin } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>Verifying admin authorization...</span>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: '#0F172A' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F1F5F9', margin: '0 0 0.5rem 0' }}>Admin Access Required</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            This portal is restricted to UrbanEats system administrators.
            {!user ? ' Please log in with an admin account.' : ' Your account does not have admin privileges.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!user && (
              <button
                className="btn btn-primary"
                onClick={() => openLogin('admin')}
                style={{ borderRadius: '12px', padding: '12px', fontWeight: 800 }}
              >
                Sign In as Admin
              </button>
            )}
            <button
              className="btn btn-outline"
              onClick={() => navigate('/')}
              style={{ borderRadius: '12px', padding: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: '#334155', color: '#94A3B8' }}
            >
              <ArrowLeft size={16} />
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
