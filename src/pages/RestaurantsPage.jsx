/**
 * OrderFoodPage (rendered at /restaurants)
 *
 * Food-first discovery page: fetches ALL food items from ALL active restaurants
 * via the existing PHP/MySQL API, then renders them as dish cards.
 *
 * Data flow: MySQL → PHP API → restaurantApi.js → React state → cards
 *
 * Features:
 *  - Full-text tokenized keyword search (food name, restaurant name, category, description)
 *  - Restaurant filter (dynamically built from API data)
 *  - Category filter  (dynamically built from API data)
 *  - Loading / error / empty / no-results states
 *  - Auth guard on "Add to Cart"
 *  - Cart conflict modal (same restaurant policy)
 *  - Scroll animation (existing hook)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRestaurants, fetchFoodItemsByRestaurant, fetchAllFoodItems } from '../api/restaurantApi';
import { getFoodItemImage } from '../data/imageAssets';
import { getFoodImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useFavorites } from '../hooks/useFavorites';
import CartConflictModal from '../components/cart/CartConflictModal';
import FoodCustomizationModal from '../components/food/FoodCustomizationModal';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  Search, ShoppingBag, CheckCircle2, Loader2,
  RefreshCw, ArrowRight, UtensilsCrossed, X, Store, MapPin, Heart, ChevronDown
} from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function OrderFoodPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, replaceCartAndAdd, cartRestaurantName } = useCart();
  const { requireAuth } = useAuthGuard();
  const { isFavorite, toggleFavorite } = useFavorites();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [allDishes, setAllDishes]               = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  // ── Filter state ────────────────────────────────────────────────────────────
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm]               = useState(urlSearchQuery);
  const [selectedRestaurant, setSelectedRestaurant] = useState('All');
  const [selectedCategory, setSelectedCategory]   = useState('All');

  // ── Pagination state ────────────────────────────────────────────────────────
  const [visibleCount, setVisibleCount]           = useState(ITEMS_PER_PAGE);

  // ── Customization modal state ───────────────────────────────────────────────
  const [customizingItem, setCustomizingItem]       = useState(null);
  const [customizingRestaurant, setCustomizingRestaurant] = useState(null);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, selectedRestaurant, selectedCategory]);

  const updateSearchQueryParam = (val) => {
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams, { replace: true });
  };

  // ── UI state ────────────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage]       = useState(null);
  const [conflictPending, setConflictPending] = useState(null); // { foodItem, restaurant, customizations }

  useScrollAnimation([loading, allDishes.length, searchTerm, selectedRestaurant, selectedCategory, visibleCount]);

  // ── Fetch all food items from all restaurants ────────────────────────────────
  const loadAllFood = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Direct fetch of all dishes across all active restaurants
      const allItems = await fetchAllFoodItems();
      if (Array.isArray(allItems) && allItems.length > 0) {
        const formatted = allItems.map((item) => ({
          ...item,
          restaurantId:   item.restaurant_id,
          restaurantName: item.restaurant_name,
          restaurantObj: {
            id: item.restaurant_id,
            name: item.restaurant_name,
            slug: item.restaurant_slug,
            address: item.restaurant_address,
            cover_image: item.cover_image,
            cover_url: item.cover_url,
            logo_image: item.logo_image,
            logo_url: item.logo_url,
          },
        }));
        setAllDishes(formatted);
        return;
      }

      // 2. Fallback: fetch per restaurant
      const restaurants = await fetchRestaurants();
      const dishArrays = await Promise.all(
        restaurants.map(async (r) => {
          try {
            const items = await fetchFoodItemsByRestaurant(r.id);
            return items.map((item) => ({
              ...item,
              restaurantId:   r.id,
              restaurantName: r.name,
              restaurantObj:  r,
            }));
          } catch {
            return [];
          }
        })
      );
      setAllDishes(dishArrays.flat());
    } catch (err) {
      console.error('Failed to load food items:', err);
      setError('server_error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllFood();
  }, []);

  // ── Derived filter options ───────────────────────────────────────────────────
  const restaurantOptions = useMemo(() => {
    const names = Array.from(new Set(allDishes.map((d) => d.restaurantName).filter(Boolean)));
    return ['All', ...names.sort()];
  }, [allDishes]);

  const categoryOptions = useMemo(() => {
    const names = Array.from(new Set(allDishes.map((d) => d.category_name).filter(Boolean)));
    return ['All', ...names.sort()];
  }, [allDishes]);

  // ── Filtered dishes ──────────────────────────────────────────────────────────
  const filteredDishes = useMemo(() => {
    const tokens = searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return allDishes.filter((dish) => {
      // 1. Keyword search (AND match across tokens)
      if (tokens.length > 0) {
        const searchable = [
          dish.name,
          dish.restaurantName,
          dish.category_name,
          dish.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesAll = tokens.every((token) => searchable.includes(token));
        if (!matchesAll) return false;
      }

      // 2. Restaurant filter
      if (selectedRestaurant !== 'All' && dish.restaurantName !== selectedRestaurant) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'All' && dish.category_name !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [allDishes, searchTerm, selectedRestaurant, selectedCategory]);

  // ── Paginated dishes ────────────────────────────────────────────────────────
  const displayedDishes = useMemo(() => {
    return filteredDishes.slice(0, visibleCount);
  }, [filteredDishes, visibleCount]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const clearFilters = () => {
    updateSearchQueryParam('');
    setSelectedRestaurant('All');
    setSelectedCategory('All');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedRestaurant !== 'All' ||
    selectedCategory !== 'All';

  // ── Open Customization Modal handler ─────────────────────────────────────────
  const handleOpenCustomization = (e, dish) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

    // Authentication guard — check BEFORE opening customization
    if (!requireAuth()) return;

    const foodItem = {
      id:            dish.id,
      name:          dish.name,
      price:         dish.price,
      slug:          dish.slug,
      category_name: dish.category_name,
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

  // ── Toggle Favorite handler ──────────────────────────────────────────────────
  const handleToggleFavorite = async (e, dish) => {
    try {
      const result = await toggleFavorite(e, dish.id, dish.name);
      if (result?.action === 'added') {
        showToast(`"${dish.name}" added to favorites`);
      } else if (result?.action === 'removed') {
        showToast(`"${dish.name}" removed from favorites`);
      }
    } catch {
      showToast('Failed to update favorites. Please try again.');
    }
  };


  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="section page-header-tight">
        <div className="container">
          <div className="section-header animate-on-scroll" style={{ marginBottom: '2rem' }}>
            <div className="section-subtitle">ORDER FOOD IN ABRAKA</div>
            <h1 className="section-title">Find Your Favorite Food</h1>
            <p className="section-description">
              Browse delicious meals from restaurants around Abraka.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <Loader2 size={26} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            <span style={{ fontSize: '1.1rem' }}>Loading food from local restaurants…</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="section page-header-tight">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍽️</div>
            <h2 style={{ marginBottom: '0.75rem' }}>Food Unavailable</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
              {error}
            </p>
            <button className="btn btn-primary" onClick={loadAllFood} style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="section page-header-tight">
      {/* Cart Conflict Modal */}
      {conflictPending && (
        <CartConflictModal
          existingRestaurantName={cartRestaurantName || ''}
          newRestaurantName={conflictPending.restaurant?.name || ''}
          onConfirm={handleConflictConfirm}
          onCancel={() => setConflictPending(null)}
        />
      )}

      <div className="container">
        {/* Page Header */}
        <div className="section-header animate-on-scroll" style={{ marginBottom: '2rem' }}>
          <div className="section-subtitle">ORDER FOOD IN ABRAKA</div>
          <h1 className="section-title">Find Your Favorite Food</h1>
          <p className="section-description">
            Browse delicious meals from restaurants around Abraka. Search for food, filter by category or restaurant, and order your favorite dishes directly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="animate-on-scroll"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              id="order-food-search"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem', paddingRight: searchTerm ? '2.75rem' : undefined }}
              placeholder="Search food, restaurant, category, or keyword..."
              value={searchTerm}
              onChange={(e) => updateSearchQueryParam(e.target.value)}
              aria-label="Search food, restaurant, category, or keyword"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => updateSearchQueryParam('')}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)', padding: '4px',
                  display: 'flex', alignItems: 'center',
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Restaurant Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1', minWidth: '220px' }}>
              <label htmlFor="restaurant-filter-select" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Filter by Restaurant
              </label>
              <select
                id="restaurant-filter-select"
                className="form-select"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                aria-label="Filter by Restaurant"
              >
                <option value="All">All Food / Restaurants</option>
                {restaurantOptions
                  .filter((r) => r !== 'All')
                  .map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </select>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1', minWidth: '220px' }}>
              <label htmlFor="category-filter-select" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Filter by Category
              </label>
              <select
                id="category-filter-select"
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                {categoryOptions
                  .filter((cat) => cat !== 'All')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Active filters summary + clear */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Active Filters Applied
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={clearFilters}
                style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}
              >
                <X size={14} />
                Clear Search &amp; Filters
              </button>
            </div>
          )}
        </div>

        {/* Empty state — API returned zero food */}
        {allDishes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍽️</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No Food Available</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              There are currently no food items available. Please check back later.
            </p>
          </div>
        )}

        {/* No-results state — active filters produced zero matches */}
        {allDishes.length > 0 && filteredDishes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <UtensilsCrossed size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Food Found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
              No food matches your current search or filters.
            </p>
            <button className="btn btn-primary btn-sm" onClick={clearFilters} style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <RefreshCw size={16} />
              Clear Search &amp; Filters
            </button>
          </div>
        )}

        {/* Food Cards Grid — from MySQL via PHP API */}
        {displayedDishes.length > 0 && (
          <div className="grid grid-cols-3">
            {displayedDishes.map((dish, index) => {
              const dishImg = getFoodImageUrl(dish) || getFoodItemImage(dish.slug, dish.id);
              const restaurantLocation = dish.restaurantObj?.location || dish.restaurantObj?.address;
              const isAvailable = dish.is_available !== false && dish.is_available !== 0;

              return (
                <div
                  key={`${dish.restaurantId}-${dish.id}`}
                  className="dish-card animate-on-scroll"
                  onClick={(e) => isAvailable && handleOpenCustomization(e, dish)}
                  style={{
                    transitionDelay: `${(index % ITEMS_PER_PAGE) * 0.04}s`,
                    cursor: isAvailable ? 'pointer' : 'default',
                  }}
                >
                  {/* Food Image */}
                  <div className="dish-img-wrapper">
                    <ImageWithFallback
                      src={dishImg || dish.image}
                      alt={dish.name}
                      className="dish-img"
                    />
                    <button
                      type="button"
                      className={`favorite-btn ${isFavorite(dish.id) ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, dish)}
                      aria-label={isFavorite(dish.id) ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
                    >
                      <Heart size={18} fill={isFavorite(dish.id) ? 'currentColor' : 'none'} />
                    </button>
                    {/* Availability badge */}
                    {!isAvailable ? (
                      <span
                        style={{
                          position: 'absolute', top: '0.6rem', left: '0.6rem',
                          background: 'rgba(0,0,0,0.65)', color: '#fff',
                          fontSize: '0.7rem', fontWeight: 700, borderRadius: '4px',
                          padding: '2px 8px', letterSpacing: '0.04em',
                        }}
                      >
                        Unavailable
                      </span>
                    ) : null}
                  </div>

                  {/* Card Content */}
                  <div className="dish-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Name + Price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h4 className="dish-name" style={{ margin: 0, fontSize: '1.05rem' }}>{dish.name}</h4>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
                        ₦{dish.price ? parseFloat(dish.price).toLocaleString() : '---'}
                      </span>
                    </div>

                    {/* Category */}
                    {dish.category_name && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        {dish.category_name}
                      </div>
                    )}

                    {/* Restaurant Info (Name & Location) */}
                    <div
                      style={{
                        fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)',
                        marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap',
                        alignItems: 'center', gap: '0.5rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Store size={13} />
                        {dish.restaurantName}
                      </span>
                      {restaurantLocation && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', fontWeight: 500 }}>
                          <MapPin size={12} />
                          {restaurantLocation}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {dish.description && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: '1', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {dish.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        type="button"
                        id={`add-to-cart-${dish.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        onClick={(e) => isAvailable && handleOpenCustomization(e, dish)}
                        aria-label={`Customize ${dish.name}`}
                        disabled={!isAvailable}
                      >
                        <ShoppingBag size={15} />
                        {isAvailable ? 'Customize & Add' : 'Unavailable'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurant/${dish.restaurantId}`);
                        }}
                        aria-label={`View ${dish.restaurantName} restaurant menu`}
                        title={`View ${dish.restaurantName} menu`}
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {displayedDishes.length < filteredDishes.length && (
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              id="load-more-food-btn"
              className="btn btn-primary"
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              style={{
                padding: '0.875rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 4px 14px rgba(255, 90, 0, 0.25)',
                cursor: 'pointer',
              }}
            >
              <span>Load More Food</span>
              <ChevronDown size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Cart Conflict Modal */}
      {conflictPending && (
        <CartConflictModal
          existingRestaurantName={cartRestaurantName || ''}
          newRestaurantName={conflictPending.restaurant?.name || ''}
          onConfirm={handleConflictConfirm}
          onCancel={() => setConflictPending(null)}
        />
      )}

      {/* Food Customization Modal / Bottom Sheet */}
      <FoodCustomizationModal
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        foodItem={customizingItem}
        restaurant={customizingRestaurant}
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
  );
}

