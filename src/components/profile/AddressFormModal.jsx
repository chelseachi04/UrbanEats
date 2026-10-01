import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader2, Check } from 'lucide-react';

export default function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  userDefaults = null,
}) {
  const [formData, setFormData] = useState({
    label: 'Home',
    recipient_name: '',
    phone: '',
    address: '',
    area: 'Site 1',
    city: 'Abraka',
    state: 'Delta State',
    is_default: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        label:          initialData.label || 'Home',
        recipient_name: initialData.recipient_name || '',
        phone:          initialData.phone || '',
        address:        initialData.address || '',
        area:           initialData.area || 'Site 1',
        city:           initialData.city || 'Abraka',
        state:          initialData.state || 'Delta State',
        is_default:     Boolean(initialData.is_default),
      });
    } else {
      setFormData({
        label:          'Home',
        recipient_name: userDefaults?.full_name || userDefaults?.name || '',
        phone:          userDefaults?.phone || '',
        address:        '',
        area:           'Site 1',
        city:           'Abraka',
        state:          'Delta State',
        is_default:     false,
      });
    }
    setError(null);
  }, [initialData, userDefaults, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.recipient_name.trim()) {
      setError('Please enter recipient name.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter a valid contact phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter street address / hostel / landmark.');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      if (err?.status === 401) {
        setError('You must be signed in to save an address. Please log in and try again.');
      } else {
        setError(err?.data?.message || err?.message || 'Unable to save address. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const labelPresets = ['Home', 'School', 'Work', 'Site 1', 'Site 2', 'Site 3', 'Main Campus', 'Campus 2', 'Express Road'];
  const areaPresets  = ['Site 1', 'Site 2', 'Site 3', 'Main Campus', 'Campus 2', 'Express Road', 'Pela Area', 'Etor Road', 'Old Abraka'];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-main)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MapPin size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {initialData ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px', display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem', borderRadius: '10px',
                backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontSize: '0.85rem', fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Address Label Preset */}
          <div>
            <label className="form-label">Address Tag / Label</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              {labelPresets.slice(0, 5).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormData({ ...formData, label: preset })}
                  className={`btn btn-sm ${formData.label === preset ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '20px', fontSize: '0.78rem', padding: '4px 12px' }}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home, Hostel, Office"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
            />
          </div>

          {/* Recipient Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Recipient Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                value={formData.recipient_name}
                onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="08012345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="form-label">Street Address / Hostel / Landmark</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Room 12, Integrity Hostel, Campus 2 Gate"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          {/* Area & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Area / Campus Location</label>
              <select
                className="form-select"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                {areaPresets.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">City &amp; State</label>
              <input
                type="text"
                className="form-input"
                value={`${formData.city}, ${formData.state}`}
                disabled
                style={{ backgroundColor: 'var(--bg-alt)', color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '0.25rem' }}>
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Set as my default delivery address
            </span>
          </label>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={saving}
              style={{ flex: 1, borderRadius: '12px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {initialData ? 'Update Address' : 'Save Address'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
