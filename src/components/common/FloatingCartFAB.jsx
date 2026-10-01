import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

/**
 * FloatingCartFAB
 * Pinned floating cart action button placed directly above the scroll-to-top button.
 * Renders on ALL screen sizes (desktop, tablet, and mobile) whenever the cart has items.
 */
export default function FloatingCartFAB() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Only render when the cart has items, and hide on cart/checkout pages
  if (!itemCount || itemCount <= 0) return null;
  if (location.pathname === '/cart' || location.pathname === '/checkout') return null;

  return (
    <button
      type="button"
      className="floating-cart-btn floating-cart-fab desktop-floating-cart"
      onClick={() => navigate('/cart')}
      aria-label={`View cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
      title="View Cart"
    >
      {/* Cart icon */}
      <span className="floating-cart-icon desktop-floating-cart-icon">
        <ShoppingCart size={20} strokeWidth={2.2} />
      </span>

      {/* Live item count notification badge */}
      <span className="floating-cart-badge desktop-floating-cart-count" aria-hidden="true">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    </button>
  );
}
