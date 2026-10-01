import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCuratedFeaturedDishes } from '../../services/showcaseService';
import { getFoodItemImage } from '../../data/imageAssets';
import { getFoodImageUrl } from '../../utils/imageUtils';
import { useCart } from '../../context/CartContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useFavorites } from '../../hooks/useFavorites';
import CartConflictModal from '../cart/CartConflictModal';
import FoodCustomizationModal from '../food/FoodCustomizationModal';
import ImageWithFallback from '../common/ImageWithFallback';
import { Heart, ShoppingBag, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function PopularDishes() {
  const navigate = useNavigate();
  const { addToCart, replaceCartAndAdd, cartRestaurantName } = useCart();
  const { requireAuth } = useAuthGuard();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [previewDishes, setPreviewDishes] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [toastMessage, setToastMessage]   = useState(null);
  const [conflictPending, setConflictPending] = useState(null);

  // Customization modal state
  const [customizingItem, setCustomizingItem]             = useState(null);
  const [customizingRestaurant, setCustomizingRestaurant] = useState(null);

  useScrollAnimation();

  useEffect(() => {
    async function loadPreviewDishes() {
      try {
        const dishes = await fetchCuratedFeaturedDishes();
        setPreviewDishes(dishes);
      } catch {
        setPreviewDishes([]);
      } finally {
        setLoading(false);
      }
    }
    loadPreviewDishes();
  }, []);

  // ── Open Customization Modal handler ─────────────────────────────────────────
  const handleOpenCustomization = (e, dish) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

    // Authentication guard — check BEFORE touching cart
    if (!requireAuth()) return;

    const foodItem = {
      id:            dish.id,
      name:          dish.name,
      price:         dish.price,
      slug:          dish.slug,
      category_name: dish.categoryName || dish.category_name,
      image:         dish.image || dish.image_url || dish.imageUrl || dish.img_src,
      image_url:     dish.image_url || dish.imageUrl || dish.image || dish.img_src,
      description:   dish.description,
    };
    const restaurant = dish.restaurantObj || { id: dish.restaurantId, name: dish.restaurantName };

    setCustomizingItem(foodItem);
    setCustomizingRestaurant(restaurant);
  };

  // ── Add to Cart handler from Customization Modal ──────────────────────────────
  const handleAddCustomizedToCart = ({ foodItem, restaurant, customizations }) => {
    const result = addToCart(foodItem, restaurant, customizations);
    if (result === 'conflict') {
      setConflictPending({ foodItem, restaurant, customizations });
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

  const handleToggleFavorite = async (e, dish) => {
    try {
      const result = await toggleFavorite(e, dish.id, dish.name);
      if (result?.action === 'added') showToast(`"${dish.name}" added to favorites`);
      else if (result?.action === 'removed') showToast(`"${dish.name}" removed from favorites`);
    } catch {
      showToast('Failed to update favorites. Please try again.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-alt)', position: 'relative' }} id="popular-dishes">
      {conflictPending && (
        <CartConflictModal
          existingRestaurantName={cartRestaurantName || ''}
          newRestaurantName={conflictPending.restaurant?.name || ''}
          onConfirm={handleConflictConfirm}
          onCancel={() => setConflictPending(null)}
        />
      )}

      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-subtitle">Local Delicacies</div>
          <h2 className="section-title">Popular Dishes Preview</h2>
          <p className="section-description">
            A small taste of what our partner restaurants prepare fresh every single day in Abraka.
          </p>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            <span>Loading popular dishes…</span>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-3">
            {previewDishes.map((dish, index) => {
              const dishImg = dish.custom_display_image || getFoodImageUrl(dish) || getFoodItemImage(dish.slug, dish.id);

              return (
                <div
                  key={`${dish.restaurantId}-${dish.id}`}
                  className="dish-card animate-on-scroll"
                  onClick={(e) => handleOpenCustomization(e, dish)}
                  style={{
                    transitionDelay: `${index * 0.08}s`,
                    cursor: 'pointer',
                  }}
                >
                  <div className="dish-img-wrapper">
                    <ImageWithFallback src={dishImg || dish.image} alt={dish.name} className="dish-img" />
                    <button
                      type="button"
                      className={`favorite-btn ${isFavorite(dish.id) ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, dish)}
                      aria-label={isFavorite(dish.id) ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
                    >
                      <Heart size={18} fill={isFavorite(dish.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="dish-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 160px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 className="dish-name" style={{ margin: 0 }}>{dish.name}</h4>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                        ₦{dish.price ? parseFloat(dish.price).toLocaleString() : '---'}
                      </span>
                    </div>
                    <div className="dish-restaurant" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                      {dish.restaurantName}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: '1' }}>
                      {dish.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        onClick={(e) => handleOpenCustomization(e, dish)}
                        aria-label={`Customize ${dish.name}`}
                      >
                        <ShoppingBag size={16} />
                        Customize & Add
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurant/${dish.restaurantId}`);
                        }}
                        aria-label={`View ${dish.restaurantName} menu`}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="animate-on-scroll" style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/restaurants')} style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', boxShadow: 'var(--shadow-lg)' }}>
            Explore All Bukas &amp; Full Menus
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Food Customization Modal / Bottom Sheet */}
        <FoodCustomizationModal
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
          foodItem={customizingItem}
          restaurant={customizingRestaurant}
          onAddToCart={handleAddCustomizedToCart}
        />

        {toastMessage && (
          <div className="cart-toast" role="status" aria-live="polite">
            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </section>
  );
}
