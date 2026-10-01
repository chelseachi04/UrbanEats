/**
 * RiderProfilePage — UrbanEats Rider Profile & Settings
 *
 * View and update rider partner full name and contact phone number.
 */

import React, { useState, useEffect } from 'react';
import { useRider } from '../../hooks/useRider';
import {
  User,
  Phone,
  Mail,
  Bike,
  Check,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export default function RiderProfilePage() {
  const { profile, loading, error, loadProfile, saveProfile } = useRider();

  const [fullName, setFullName]       = useState('');
  const [phone, setPhone]             = useState('');
  const [saving, setSaving]           = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError]     = useState(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSaveError('Please enter a valid full name.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      await saveProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
      });
      setSaveSuccess('Rider profile updated successfully!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 600 }}>Loading rider profile...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
          Rider Partner Settings
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage your delivery partner account details and contact phone number.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {saveSuccess && (
          <div style={{ padding: '0.88rem', borderRadius: '12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div style={{ padding: '0.88rem', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.88rem', fontWeight: 700 }}>
            {saveError}
          </div>
        )}

        {/* Account Badge Card */}
        <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
            <Bike size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {profile?.full_name || 'Rider Partner'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Role: <strong style={{ color: 'var(--primary)' }}>Authorized Rider Partner</strong> • Abraka Zone
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Full Name *
          </label>
          <input
            type="text"
            className="form-control"
            style={{ borderRadius: '12px' }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Email Address (Protected)
          </label>
          <input
            type="email"
            className="form-control"
            style={{ borderRadius: '12px', backgroundColor: 'var(--bg-main)' }}
            value={profile?.email || ''}
            disabled
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            Contact Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            style={{ borderRadius: '12px' }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08077778888"
          />
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ borderRadius: '12px', padding: '12px 28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={16} />
                Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
