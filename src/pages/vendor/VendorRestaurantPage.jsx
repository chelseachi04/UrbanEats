/**
 * VendorRestaurantPage — UrbanEats Restaurant Profile & Branding Management
 *
 * Fully responsive across all devices (Mobile 360px-480px, Tablet, and Desktop).
 * Stacks into a clean single-column layout on small screens and expands to a balanced 2-column grid on desktop.
 */

import React, { useState, useEffect } from 'react';
import { useVendor } from '../../hooks/useVendor';
import { uploadRestaurantImage } from '../../api/vendorApi';
import { resolveImageUrl } from '../../utils/imageUtils';
import VendorSubpageHeader from '../../components/vendor/VendorSubpageHeader';
import {
  Store,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export default function VendorRestaurantPage() {
  const { restaurant, loading, error, loadRestaurant, saveRestaurant } = useVendor();

  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    location: '',
    phone: '',
    status: 'open',
    opening_hours: '08:00 AM - 10:00 PM',
    description: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        category: restaurant.category || 'General',
        location: restaurant.location || '',
        phone: restaurant.phone || '',
        status: restaurant.status || 'open',
        opening_hours: restaurant.opening_hours || '08:00 AM - 10:00 PM',
        description: restaurant.description || '',
      });

      if (restaurant.logo_url) {
        setLogoPreview(resolveImageUrl(restaurant.logo_url));
      }
      if (restaurant.cover_url) {
        setCoverPreview(resolveImageUrl(restaurant.cover_url));
      }
    }
  }, [restaurant]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErr) setFormErr('');
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));

    setUploadingLogo(true);
    try {
      await uploadRestaurantImage(file, 'logo');
      setSuccessMsg('Restaurant logo updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
      await loadRestaurant();
    } catch (err) {
      setFormErr(err.message || 'Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));

    setUploadingCover(true);
    try {
      await uploadRestaurantImage(file, 'cover');
      setSuccessMsg('Restaurant cover banner updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
      await loadRestaurant();
    } catch (err) {
      setFormErr(err.message || 'Failed to upload cover banner.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErr('');
    setSuccessMsg('');
    try {
      await saveRestaurant(formData);
      setSuccessMsg('Restaurant profile saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setFormErr(err.message || 'Failed to update restaurant profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !restaurant) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 600 }}>Loading restaurant profile...</span>
      </div>
    );
  }

  return (
    <div className="vr-profile-container">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <VendorSubpageHeader
        title="Restaurant Profile"
        subtitle="Manage your restaurant branding, contact details, operating hours, and live store status."
      />

      {/* ── Feedback Banners ──────────────────────────────────────── */}
      {successMsg && (
        <div className="vr-alert vr-alert-success">
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {formErr && (
        <div className="vr-alert vr-alert-error">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{formErr}</span>
        </div>
      )}

      {/* ── Responsive Main Grid ──────────────────────────────────── */}
      <div className="vr-main-grid">
        {/* ══ LEFT COLUMN: Media Uploads ════════════════════════════ */}
        <div className="vr-media-column">
          {/* Cover Banner Card */}
          <div className="vr-card vr-cover-card">
            <h3 className="vr-card-title">
              <div className="vr-icon-badge">
                <ImageIcon size={16} style={{ color: 'var(--primary)' }} />
              </div>
              Restaurant Cover Banner
            </h3>

            {/* Banner Preview / Upload Dropzone */}
            <div className={`banner-upload-box ${coverPreview ? 'has-preview' : ''}`}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover Banner" className="vr-cover-img" />
              ) : (
                <div className="vr-empty-preview">
                  <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.45 }} />
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>No cover banner uploaded</p>
                </div>
              )}
              {uploadingCover && (
                <div className="vr-uploading-overlay">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Uploading Banner...</span>
                </div>
              )}
            </div>

            <label className={`vr-upload-btn ${uploadingCover ? 'disabled' : ''}`}>
              <Upload size={16} />
              <span>{uploadingCover ? 'Uploading Banner...' : 'Upload Cover Banner'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                style={{ display: 'none' }}
                disabled={uploadingCover}
              />
            </label>

            <p className="vr-upload-hint">Recommended: 1200 × 400 px · JPG, PNG or WebP</p>
          </div>

          {/* Logo Card */}
          <div className="vr-card vr-logo-card">
            <h3 className="vr-card-title">
              <div className="vr-icon-badge">
                <Store size={16} style={{ color: 'var(--primary)' }} />
              </div>
              Restaurant Logo
            </h3>

            <div className="vr-logo-row">
              <div className="vr-logo-preview-box">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="vr-logo-img" />
                ) : (
                  <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'R'}</span>
                )}
                {uploadingLogo && (
                  <div className="vr-uploading-overlay">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                )}
              </div>

              <div className="vr-logo-meta">
                <div className="vr-logo-meta-title">Square Brand Logo</div>
                <div className="vr-logo-meta-desc">JPG, PNG or WebP<br />Max 5 MB · Square 1:1</div>
              </div>
            </div>

            <label className={`vr-upload-btn ${uploadingLogo ? 'disabled' : ''}`}>
              <Upload size={16} />
              <span>{uploadingLogo ? 'Uploading Logo...' : 'Upload Brand Logo'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
                disabled={uploadingLogo}
              />
            </label>
          </div>
        </div>

        {/* ══ RIGHT COLUMN: Profile Form ═════════════════════════════ */}
        <form onSubmit={handleSubmit} className="vr-card vr-form-card">
          <div className="vr-form-header">
            <h3 className="vr-form-title">General &amp; Contact Information</h3>
            <p className="vr-form-subtitle">
              Fill in your restaurant details. Changes take effect immediately after saving.
            </p>
          </div>

          <div className="vr-divider" />

          {/* Restaurant Name */}
          <div className="vr-form-group">
            <label className="vr-label" htmlFor="vr-name">Restaurant Name *</label>
            <input
              id="vr-name"
              type="text"
              name="name"
              className="vr-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Obinna's Kitchen"
              required
            />
          </div>

          {/* Cuisine + Status row */}
          <div className="vr-form-row">
            <div className="vr-form-group">
              <label className="vr-label" htmlFor="vr-category">Cuisine Category</label>
              <input
                id="vr-category"
                type="text"
                name="category"
                className="vr-input"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Nigerian, Breakfast"
              />
            </div>

            <div className="vr-form-group">
              <label className="vr-label" htmlFor="vr-status">Store Operating Status</label>
              <select
                id="vr-status"
                name="status"
                className="vr-input vr-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">OPEN FOR ORDERS</option>
                <option value="closed">TEMPORARILY CLOSED</option>
              </select>
            </div>
          </div>

          {/* Phone + Location row */}
          <div className="vr-form-row">
            <div className="vr-form-group">
              <label className="vr-label" htmlFor="vr-phone">Contact Phone Number</label>
              <input
                id="vr-phone"
                type="tel"
                name="phone"
                className="vr-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 09012345678"
              />
            </div>

            <div className="vr-form-group">
              <label className="vr-label" htmlFor="vr-location">Physical Location / Address</label>
              <input
                id="vr-location"
                type="text"
                name="location"
                className="vr-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Site 3, Main Campus Road, Abraka"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="vr-form-group">
            <label className="vr-label" htmlFor="vr-hours">Business Opening Hours</label>
            <input
              id="vr-hours"
              type="text"
              name="opening_hours"
              className="vr-input"
              value={formData.opening_hours}
              onChange={handleChange}
              placeholder="e.g. 08:00 AM – 10:00 PM"
            />
          </div>

          {/* Store Description */}
          <div className="vr-form-group">
            <label className="vr-label" htmlFor="vr-description">Store Description</label>
            <textarea
              id="vr-description"
              name="description"
              className="vr-input vr-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your restaurant — specialties, atmosphere, what makes you unique…"
            />
          </div>

          <div className="vr-divider" />

          {/* Submit Action */}
          <div className="vr-form-action">
            <button
              type="submit"
              disabled={saving}
              className="vr-submit-btn"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Scoped Responsive Styles ───────────────────────────────── */}
      <style>{`
        .vr-profile-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
          padding-top: 0.5rem;
          padding-bottom: 6rem; /* pb-24 clearance for fixed bottom navbar */
        }

        .vr-alert {
          padding: 0.9rem 1.25rem;
          border-radius: 14px;
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          box-sizing: border-box;
          width: 100%;
        }

        .vr-alert-success {
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #047857;
        }

        .vr-alert-error {
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
        }

        /* Main 1-Column Stack on Mobile / 2-Column on Desktop */
        .vr-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
          align-items: flex-start;
          box-sizing: border-box;
        }

        @media (min-width: 1024px) {
          .vr-main-grid {
            grid-template-columns: minmax(320px, 1fr) minmax(0, 1.8fr);
            gap: 2rem;
          }
        }

        .vr-media-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .vr-card {
          background-color: #ffffff;
          border: 1px solid #E8EDF4;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.05);
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .vr-card {
            border-radius: 24px;
            padding: 1.75rem;
          }
          .vr-form-card {
            padding: 2.25rem;
          }
        }

        .vr-card-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main, #0F172A);
          margin: 0 0 1.25rem 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vr-icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background-color: #FFF0EB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Banner Dropzone */
        .banner-upload-box {
          width: 100%;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #CBD5E1;
          border-radius: 1rem;
          background-color: #F8FAFC;
          overflow: hidden;
          position: relative;
          margin-bottom: 1.25rem;
          box-sizing: border-box;
        }

        .banner-upload-box.has-preview {
          border: none;
        }

        .vr-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vr-empty-preview {
          text-align: center;
          color: #94A3B8;
          padding: 1rem;
        }

        .vr-uploading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary, #EA580C);
          z-index: 2;
        }

        .vr-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          background-color: #F8FAFC;
          color: var(--text-main, #0F172A);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }

        .vr-upload-btn:hover:not(.disabled) {
          border-color: var(--primary, #EA580C);
          color: var(--primary, #EA580C);
          background-color: #FFF0EB;
        }

        .vr-upload-btn.disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .vr-upload-hint {
          font-size: 0.75rem;
          color: #94A3B8;
          margin-top: 10px;
          margin-bottom: 0;
          text-align: center;
          line-height: 1.4;
        }

        /* Logo Card Specifics */
        .vr-logo-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .vr-logo-preview-box {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background-color: #F1F5F9;
          border: 2px dashed #CBD5E1;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.6rem;
          color: var(--primary, #EA580C);
          flex-shrink: 0;
          position: relative;
        }

        .vr-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vr-logo-meta {
          flex: 1;
          min-width: 0;
        }

        .vr-logo-meta-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-main, #0F172A);
          margin-bottom: 3px;
        }

        .vr-logo-meta-desc {
          font-size: 0.78rem;
          color: #94A3B8;
          line-height: 1.5;
        }

        /* Form Structure */
        .vr-form-header {
          margin-bottom: 1.5rem;
        }

        .vr-form-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main, #0F172A);
          margin: 0 0 4px 0;
          letter-spacing: -0.01em;
        }

        .vr-form-subtitle {
          font-size: 0.85rem;
          color: #94A3B8;
          margin: 0;
          line-height: 1.5;
        }

        .vr-divider {
          height: 1px;
          background-color: #F1F5F9;
          margin: 1.5rem 0;
        }

        .vr-form-group {
          margin-bottom: 1.4rem;
          width: 100%;
          box-sizing: border-box;
        }

        .vr-form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .vr-form-row {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
        }

        .vr-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .vr-input {
          width: 100%;
          padding: 12px 15px;
          font-size: 0.92rem;
          font-family: inherit;
          font-weight: 500;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          background-color: #FAFBFC;
          color: var(--text-main, #0F172A);
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
          box-sizing: border-box;
        }

        .vr-input:focus {
          border-color: var(--primary, #EA580C);
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
          background-color: #ffffff;
        }

        .vr-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }

        .vr-textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }

        .vr-form-action {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          margin-top: 0.5rem;
        }

        .vr-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 32px;
          border-radius: 12px;
          background-color: var(--primary, #EA580C);
          color: #ffffff;
          border: none;
          font-weight: 800;
          font-size: 0.92rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
          box-sizing: border-box;
          width: 100%;
        }

        @media (min-width: 640px) {
          .vr-submit-btn {
            width: auto;
          }
        }

        .vr-submit-btn:hover:not(:disabled) {
          background-color: #D9480F;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(234, 88, 12, 0.42);
        }

        .vr-submit-btn:disabled {
          opacity: 0.8;
          cursor: wait;
        }
      `}</style>
    </div>
  );
}
