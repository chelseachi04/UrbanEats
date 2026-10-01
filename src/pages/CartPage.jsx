import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getFoodItemImage } from '../data/imageAssets';
import { resolveImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/common/ImageWithFallback';
import {
  ShoppingCart, Trash2, Plus, Minus, X,
  ArrowRight, ShoppingBag, AlertTriangle
} from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items, itemCount, subtotal,
    increaseQty, decreaseQty, removeItem, clearCart
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  // ── Empty Cart ───────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="section page-header-tight">
        <div className="container">
          <div className="section-header animate-on-scroll" style={{ marginBottom: '2rem' }}>
            <div className="section-subtitle">Your Basket</div>
            <h1 className="section-title">Your Cart</h1>
          </div>

          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <ShoppingCart size={36} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Add delicious meals from our restaurants to get started.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/restaurants')}
              style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <ShoppingBag size={20} />
              Explore Restaurants
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section page-header-tight">
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>

          <div>
            <div className="section-subtitle">Your Basket</div>
            <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Your Cart</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {itemCount} item{itemCount !== 1 ? 's' : ''} from&nbsp;
              <strong style={{ color: 'var(--text-main)' }}>{items[0]?.restaurantName}</strong>
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        {/* Clear Cart Confirmation */}
        {showClearConfirm && (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <AlertTriangle size={22} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <p style={{ flex: 1, margin: 0, color: 'var(--text-main)' }}>
              Are you sure you want to remove all items from your cart?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm"
                style={{ background: 'var(--danger)', color: '#fff', borderColor: 'var(--danger)' }}
                onClick={handleClearCart}
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        )}

        <div className="cart-layout">
          {/* ── Cart Items Column ─────────────────────────────────────────── */}
          <div className="cart-items-col">
            {items.map((item) => {
              const rawImg =
                item.image ||
                item.image_url ||
                item.imageUrl ||
                item.img_src ||
                '';
              const resolvedSrc =
                resolveImageUrl(rawImg) ||
                getFoodItemImage(item.slug || item.name, item.id) ||
                rawImg ||
                '/assets/default-food-placeholder.png';
              const effectivePrice = parseFloat(item.unitPrice || item.price) || 0;
              const itemTotal = (effectivePrice * item.quantity).toLocaleString();
              const itemKey = item.cartItemId || item.id;

              return (
                <div key={itemKey} className="cart-item-card">
                  {/* Food Image */}
                  <div className="cart-item-img">
                    <img
                      src={resolvedSrc}
                      alt={item.name || item.title || 'Food item'}
                      className="w-20 h-20 rounded-xl object-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        const localFallback = getFoodItemImage(item.slug || item.name, item.id);
                        e.currentTarget.src = localFallback || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="cart-item-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-restaurant">{item.restaurantName}</p>
                        {item.categoryName && (
                          <span className="cart-item-category">{item.categoryName}</span>
                        )}

                        {/* Customization Details Badges */}
                        <div className="cart-item-custom-tags">
                          {item.portion && (
                            <span className="cart-custom-badge cart-custom-badge-portion">
                              🍚 {item.portion}
                            </span>
                          )}

                          {item.swallow && (
                            <span className="cart-custom-badge cart-custom-badge-swallow">
                              🍲 {item.swallow.name || item.swallow}
                            </span>
                          )}

                          {Array.isArray(item.proteins) && item.proteins.map((p, idx) => (
                            <span key={idx} className="cart-custom-badge cart-custom-badge-protein">
                              🍗 {p.name} {p.quantity > 1 ? `(×${p.quantity})` : ''}
                            </span>
                          ))}

                          {Array.isArray(item.sides) && item.sides.map((s, idx) => (
                            <span key={idx} className="cart-custom-badge cart-custom-badge-side">
                              🥗 {typeof s === 'string' ? s : s.name}
                            </span>
                          ))}
                        </div>

                        {/* Special Instructions Note */}
                        {item.specialInstructions && (
                          <div className="cart-custom-note">
                            Note: "{item.specialInstructions}"
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeItem(itemKey)}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="cart-item-footer">
                      {/* Quantity Controls */}
                      <div className="cart-qty-controls">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => decreaseQty(itemKey)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-qty-value" aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => increaseQty(itemKey)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Pricing */}
                      <div className="cart-item-pricing">
                        <span className="cart-unit-price">₦{effectivePrice.toLocaleString()} each</span>
                        <span className="cart-item-total">₦{itemTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary Column ──────────────────────────────────────── */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Cart Summary</h2>

              {/* Item breakdown */}
              <div className="cart-summary-lines">
                {items.map((item) => {
                  const effectivePrice = parseFloat(item.unitPrice || item.price) || 0;
                  const itemKey = item.cartItemId || item.id;
                  return (
                    <div key={itemKey} className="cart-summary-line">
                      <span className="cart-summary-line-name">
                        {item.name}
                        {item.portion ? ` (${item.portion})` : ''}
                        <span className="cart-summary-qty"> ×{item.quantity}</span>
                      </span>
                      <span className="cart-summary-line-price">
                        ₦{(effectivePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary-divider" />

              {/* Subtotal */}
              <div className="cart-subtotal-row">
                <span className="cart-subtotal-label">Subtotal</span>
                <span className="cart-subtotal-value">₦{subtotal.toLocaleString()}</span>
              </div>

              <p className="cart-summary-note">
                Delivery fees and any applicable charges will be calculated at checkout.
              </p>

              {/* Proceed to Checkout — Primary Action */}
              <button
                id="proceed-to-checkout-btn"
                className="btn btn-primary btn-full"
                onClick={() => navigate('/checkout')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.05rem',
                  padding: '0.85rem 1.5rem', boxShadow: 'var(--shadow-md)',
                }}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <button
                className="btn btn-outline btn-full"
                onClick={() => navigate(`/restaurant/${items[0]?.restaurantId}`)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
              >
                Continue Ordering
              </button>

              <button
                className="btn btn-outline btn-full"
                onClick={() => navigate('/restaurants')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
              >
                <ShoppingBag size={15} />
                Browse All Restaurants
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
