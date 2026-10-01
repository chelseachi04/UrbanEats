/**
 * EditProfileModal — UrbanEats Customer Profile Editing Modal
 *
 * Allows authenticated customers to update Full Name and Phone Number.
 * Email address remains protected / read-only.
 * Persists updates to MySQL database via AuthContext.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, Lock, X, Check, Loader2 } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, onSuccess }) {
  const { user, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.fullName || '');
      setPhone(user.phone || '');
      setError(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter a valid full name (at least 2 characters).');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setError('Please enter a valid phone number (at least 7 digits).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUserProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      if (onSuccess) onSuccess('Profile updated successfully');
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--secondary)',
            color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                Edit Customer Profile
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Update your account details
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Full Name Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem', borderRadius: '12px', width: '100%' }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Phone Number *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                className="form-control"
                style={{ paddingLeft: '2.4rem', borderRadius: '12px', width: '100%' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                required
              />
            </div>
          </div>

          {/* Email Field (Protected / Read Only) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Email Address
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                <Lock size={11} /> Read Only
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.4rem', borderRadius: '12px', width: '100%', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                value={user?.email || ''}
                disabled
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Your email is tied to account security and cannot be changed here.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
              style={{ flex: 1, borderRadius: '12px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
