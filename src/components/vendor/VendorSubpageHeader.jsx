import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Standardized Vendor Sub-page Header Bar
 *
 * @param {string} title - Page name (e.g., "Menu Management", "Order Fulfillment")
 * @param {string} subtitle - Descriptive subtitle
 * @param {React.ReactNode} actionButton - Optional primary action button (e.g., "+ Add New Dish")
 * @param {string|Function} backTo - Route or custom callback for back navigation (default: "/vendor/dashboard")
 * @param {React.ReactNode} rightAction - Optional custom right header action
 */
export default function VendorSubpageHeader({
  title,
  subtitle,
  actionButton,
  backTo = '/vendor/dashboard',
  rightAction,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof backTo === 'function') {
      backTo();
    } else if (backTo === -1) {
      navigate(-1);
    } else {
      navigate(backTo);
    }
  };

  return (
    <div className="vendor-subpage-header-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.5rem' }}>
      {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
      <div
        className="vendor-subpage-top-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #f1f5f9',
          gap: '12px',
        }}
      >
        {/* Left: Interactive Back Navigation Button */}
        <button
          type="button"
          onClick={handleBack}
          className="vendor-subpage-back-btn"
          aria-label="Go Back"
          title="Back to Overview"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #E2E8F0',
            color: '#334155',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.18s ease',
            flexShrink: 0,
            outline: 'none',
          }}
        >
          <ArrowLeft size={18} strokeWidth={2.4} />
        </button>

        {/* Center: Clean Page Name / Title */}
        <h2
          className="vendor-subpage-title"
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.02em',
            flex: 1,
            textAlign: 'left',
          }}
        >
          {title}
        </h2>

        {/* Optional Right Action (if provided) */}
        {rightAction && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {rightAction}
          </div>
        )}
      </div>

      {/* ── Subtitle & Action Row ────────────────────────────────────────────── */}
      <div
        className="vendor-subpage-action-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '4px',
          marginBottom: '8px',
        }}
      >
        {subtitle && (
          <p
            className="vendor-subpage-subtitle"
            style={{
              fontSize: '0.88rem',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: '650px',
            }}
          >
            {subtitle}
          </p>
        )}

        {actionButton && (
          <div className="vendor-subpage-action-btn-wrap" style={{ flexShrink: 0 }}>
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}
