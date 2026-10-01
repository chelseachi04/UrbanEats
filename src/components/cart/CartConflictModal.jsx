/**
 * CartConflictModal
 *
 * Shown when the user tries to add a food item from a different restaurant
 * while their cart already contains items from another restaurant.
 *
 * Single-restaurant cart policy: the user must confirm they want to
 * replace the existing cart before the new item is added.
 *
 * This modal does NOT create an order. It does NOT involve payment.
 * It simply asks whether to replace the cart contents.
 */
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function CartConflictModal({
  existingRestaurantName,
  newRestaurantName,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cart-conflict-title">
      <div
        className="modal-box cart-conflict-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div style={{
          width: '56px', height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <AlertTriangle size={26} style={{ color: 'var(--warning)' }} />
        </div>

        {/* Heading */}
        <h3 id="cart-conflict-title" style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
          Start a new order?
        </h3>

        {/* Body */}
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
          Your cart already has items from{' '}
          <strong style={{ color: 'var(--text-main)' }}>{existingRestaurantName}</strong>.
          <br />
          Adding from{' '}
          <strong style={{ color: 'var(--primary)' }}>{newRestaurantName}</strong>
          {' '}will clear your current cart.
          <br />
          Do you want to start a fresh order?
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={onConfirm}
          >
            Yes, start fresh order from {newRestaurantName}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-full"
            onClick={onCancel}
          >
            Keep current cart ({existingRestaurantName})
          </button>
        </div>
      </div>
    </div>
  );
}
