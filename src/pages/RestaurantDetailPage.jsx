import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchRestaurantById, fetchFoodItemsByRestaurant } from '../api/restaurantApi';
import { getRestaurantImage, getFoodItemImage } from '../data/imageAssets';
import { getFoodImageUrl, getRestaurantCoverUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useFavorites } from '../hooks/useFavorites';
import CartConflictModal from '../components/cart/CartConflictModal';
import FoodCustomizationModal from '../components/food/FoodCustomizationModal';
import ImageWithFallback from '../components/common/ImageWithFallback';
import {
  MapPin, Clock, ArrowLeft, ShoppingBag, CheckCircle2,
  Heart, Loader2, RefreshCw, ShoppingCart
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, replaceCartAndAdd, itemCount, cartRestaurantName } = useCart();
  const { requireAuth } = useAuthGuard();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [restaurant, setRestaurant]         = useState(null);
  const [menuItems, setMenuItems]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [menuLoading, setMenuLoading]       = useState(false);
  const [error, setError]                   = useState(null);
  const [toastMessage, setToastMessage]     = useState(null);

  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState(null);

  // Cart conflict state — tracks pending add when user is from different restaurant
  const [conflictPending, setConflictPending] = useState(null); // { foodItem, restaurant, customizations }
  useScrollAnimation([loading, menuLoading, menuItems.length]);

  // ── Fetch restaurant + menu from PHP API ────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const restaurantData = await fetchRestaurantById(id);
      setRestaurant(restaurantData);
      setMenuLoading(true);
      const items = await fetchFoodItemsByRestaurant(restaurantData.id);
      setMenuItems(items);
    } catch (err) {
      setError(err.status === 404 ? 'not_found' : 'server_error');
    } finally {
      setLoading(false);
      setMenuLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  // ── Open Customization Modal handler ─────────────────────────────────────────
  const handleOpenCustomization = (e, item) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (!restaurant) return;

    // Authentication guard — check BEFORE opening customization
    if (!requireAuth()) return;

    setCustomizingItem(item);
  };

  // ── Add to Cart handler from Customization Modal ──────────────────────────────
  const handleAddCustomizedToCart = ({ foodItem, restaurant: itemRest, customizations }) => {
    const targetRest = itemRest || restaurant;
    const result = addToCart(foodItem, targetRest, customizations);

    if (result === 'conflict') {
      setConflictPending({ foodItem, restaurant: targetRest, customizations });
      return;
    }

    if (result === true) {
      const portionText = customizations?.portion ? ` (${customizations.portion})` : '';
      showToast(`"${foodItem.name}"${portionText} added to cart`);
    }
  };

  const handleConflictConfirm = () => {
    if (!conflictPending) return;
    replaceCartAndAdd(conflictPending.foodItem, conflictPending.restaurant, conflictPending.customizations);
    showToast(`Cart updated — "${conflictPending.foodItem.name}" added`);
    setConflictPending(null);
  };

  const handleConflictCancel = () => setConflictPending(null);

  const handleToggleFavorite = async (e, itemId, itemName) => {
    try {
      const result = await toggleFavorite(e, itemId, itemName);
      if (result?.action === 'added') showToast(`"${itemName}" added to favorites`);
      else if (result?.action === 'removed') showToast(`"${itemName}" removed from favorites`);
    } catch {
      showToast('Failed to update favorites. Please try again.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading restaurant…</p>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────────────────────────
  if (error === 'not_found') {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
        <h2>Restaurant Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem 0' }}>
          This restaurant doesn't exist or is no longer available.
        </p>
        <Link to="/restaurants" className="btn btn-primary">
          <ArrowLeft size={18} />
          Back to All Restaurants
        </Link>
      </div>
    );
  }

  // ── Server Error ─────────────────────────────────────────────────────────────
  if (error === 'server_error') {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
        <h2>Something Went Wrong</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem 0' }}>
          We couldn't load this restaurant. Please try again.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={loadData} style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link to="/restaurants" className="btn btn-outline">
            <ArrowLeft size={18} />
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const coverImg = getRestaurantCoverUrl(restaurant) || getRestaurantImage(restaurant.slug, restaurant.id);





  return (
    <div className="restaurant-detail-page" style={{ margin: 0, padding: 0 }}>
      {/* Cart Conflict Modal */}
      {conflictPending && (
        <CartConflictModal
          existingRestaurantName={cartRestaurantName || ''}
          newRestaurantName={conflictPending.restaurant?.name || ''}
          onConfirm={handleConflictConfirm}
          onCancel={handleConflictCancel}
        />
      )}

      {/* Sticky Restaurant Navigation Header Bar */}
      <div className="restaurant-sticky-header restaurant-header-bar">
        <div className="restaurant-header-bar-inner">
          <button
            onClick={() => navigate('/restaurants')}
            className="restaurant-header-back-btn"
            aria-label="Back to all restaurants"
          >
            <ArrowLeft size={16} />
            <span>All Restaurants</span>
          </button>

          <div className="restaurant-header-info">
            <h2 className="restaurant-header-title">{restaurant.name}</h2>
            {restaurant.status && (
              <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                {restaurant.status}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(restaurant.id)}
            className="restaurant-header-fav-btn"
            aria-label={isFavorite(restaurant.id) ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite(restaurant.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              fill={isFavorite(restaurant.id) ? '#EF4444' : 'none'}
              color={isFavorite(restaurant.id) ? '#EF4444' : '#64748B'}
            />
          </button>
        </div>
      </div>

      {/* Restaurant Hero Banner */}
      <div style={{ position: 'relative', height: '260px', background: 'var(--secondary)' }}>
        <ImageWithFallback
          src={getRestaurantCoverUrl(restaurant) || coverImg || restaurant.cover_image}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
        />

        <div
          className="container animate-on-scroll"
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: '#ffffff', width: '100%' }}
        >
          <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            {restaurant.name}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.95rem' }}>
            {restaurant.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                {restaurant.location}
              </span>
            )}
            {restaurant.opening_hours && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                {restaurant.opening_hours}
              </span>
            )}
            <span className="badge badge-success">{restaurant.status}</span>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="section">
        <div className="container">
          {/* Menu Header */}
          <div className="animate-on-scroll" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Full Menu</h2>
              {restaurant.description && (
                <p style={{ color: 'var(--text-muted)', maxWidth: '520px' }}>{restaurant.description}</p>
              )}
            </div>
            {/* Cart shortcut button */}
            <Link
              to="/cart"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}
              aria-label={`View cart — ${itemCount} items`}
            >
              <ShoppingCart size={18} />
              View Cart
              {itemCount > 0 && (
                <span className="nav-cart-badge" style={{ position: 'static', marginLeft: '4px' }}>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Menu Loading */}
          {menuLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
              <span>Loading menu items…</span>
            </div>
          )}

          {/* Empty menu */}
          {!menuLoading && menuItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍽️</div>
              <h3>No Menu Items Available</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                No menu items are currently available for this restaurant.
              </p>
            </div>
          )}

          {/* Menu Items Grid — content from MySQL via PHP API */}
          {!menuLoading && menuItems.length > 0 && (
            <div className="grid grid-cols-3">
              {menuItems.map((item, index) => {
                const itemImg    = getFoodImageUrl(item) || getFoodItemImage(item.slug, item.id) || item.image;
                const isAvailable = item.is_available !== false && item.is_available !== 0 && item.is_available !== '0';

                return (
                    <div
                      key={item.id}
                      className="dish-card animate-on-scroll"
                      onClick={(e) => isAvailable && handleOpenCustomization(e, item)}
                      style={{
                        transitionDelay: `${index * 0.08}s`,
                        opacity: isAvailable ? 1 : 0.72,
                        filter: isAvailable ? 'none' : 'grayscale(30%)',
                        border: isAvailable ? '1px solid var(--border-color)' : '1px solid #FECACA',
                        backgroundColor: isAvailable ? '#ffffff' : '#F8FAFC',
                        cursor: isAvailable ? 'pointer' : 'default',
                      }}
                    >
                      <div className="dish-img-wrapper" style={{ position: 'relative' }}>
                        <ImageWithFallback src={itemImg} alt={item.name} className="dish-img" />

                        {!isAvailable && (
                          <div
                            style={{
                              position: 'absolute', top: '10px', left: '10px',
                              backgroundColor: '#DC2626', color: '#ffffff',
                              padding: '4px 10px', borderRadius: '8px',
                              fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                              boxShadow: 'var(--shadow-xs)',
                            }}
                          >
                            Temporarily Unavailable
                          </div>
                        )}

                        <button
                          type="button"
                          className={`favorite-btn ${isFavorite(item.id) ? 'active' : ''}`}
                          onClick={(e) => handleToggleFavorite(e, item.id, item.name)}
                          aria-label={isFavorite(item.id) ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
                          title={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart size={18} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="dish-content" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                          <h4 className="dish-name" style={{ color: isAvailable ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {item.name}
                          </h4>
                          <span style={{ fontWeight: 800, color: isAvailable ? 'var(--primary)' : 'var(--text-muted)', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
                            ₦{parseFloat(item.price).toLocaleString()}
                          </span>
                        </div>

                        {item.category_name && (
                          <div style={{ fontSize: '0.78rem', color: isAvailable ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem', opacity: 0.85 }}>
                            {item.category_name}
                          </div>
                        )}

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', height: '42px', overflow: 'hidden' }}>
                          {item.description}
                        </p>

                        <button
                          type="button"
                          className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'} btn-sm btn-full`}
                          disabled={!isAvailable}
                          onClick={(e) => isAvailable && handleOpenCustomization(e, item)}
                          style={{
                            borderRadius: '10px',
                            fontWeight: 800,
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.65,
                          }}
                        >
                          <ShoppingBag size={16} />
                          {isAvailable ? 'Customize & Add' : 'Currently Unavailable'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Food Customization Modal / Bottom Sheet */}
            <FoodCustomizationModal
              isOpen={Boolean(customizingItem)}
              onClose={() => setCustomizingItem(null)}
              foodItem={customizingItem}
              restaurant={restaurant}
              onAddToCart={handleAddCustomizedToCart}
            />

            {/* Toast Notification */}
            {toastMessage && (
              <div className="cart-toast" role="status" aria-live="polite">
                <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
