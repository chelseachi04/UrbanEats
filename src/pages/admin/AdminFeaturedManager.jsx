/**
 * AdminFeaturedManager.jsx — UrbanEats Admin Showcase & Curation Manager
 *
 * Grants full administrative authority to curate which restaurants and dishes
 * appear on the public homepage, set display image overrides, and configure
 * the total featured dishes cap (default: 9).
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchFullCatalogForAdmin,
  updateRestaurantFeatured,
  updateProductFeatured,
  saveShowcaseConfig,
} from '../../services/showcaseService';
import { resolveImageUrl, getFoodImageUrl, getRestaurantCoverUrl } from '../../utils/imageUtils';
import { getRestaurantImage, getFoodItemImage } from '../../data/imageAssets';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import {
  Sparkles,
  Store,
  UtensilsCrossed,
  Search,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Eye,
  ArrowUpDown,
  X,
  Upload,
  Save,
  Plus,
  Info,
} from 'lucide-react';

export default function AdminFeaturedManager() {
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);
  const [toast, setToast]           = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes]           = useState([]);
  const [config, setConfig]           = useState({ maxFeaturedDishes: 9, maxFeaturedRestaurants: 6 });

  const [activeTab, setActiveTab]     = useState('dishes'); // 'dishes' | 'restaurants' | 'settings'
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterFeatured, setFilterFeatured] = useState('ALL'); // 'ALL' | 'FEATURED' | 'UNFEATURED'

  // Image override modal state
  const [editingImageItem, setEditingImageItem] = useState(null); // { type: 'restaurant'|'dish', id, name, currentImage }
  const [customImageUrl, setCustomImageUrl]     = useState('');
  const [savingImage, setSavingImage]           = useState(false);

  // Load catalog data
  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchFullCatalogForAdmin();
      setRestaurants(data.restaurants || []);
      setDishes(data.dishes || []);
      if (data.config) setConfig(data.config);
    } catch (err) {
      setError(err.message || 'Failed to load catalog showcase data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Toggle Restaurant Featured ──────────────────────────────────────────────
  const handleToggleRestaurant = async (restaurant) => {
    const nextState = !restaurant.is_featured;
    try {
      await updateRestaurantFeatured(restaurant.id, { is_featured: nextState });
      setRestaurants(prev =>
        prev.map(r => r.id === restaurant.id ? { ...r, is_featured: nextState } : r)
      );
      showToast(
        `"${restaurant.name}" ${nextState ? 'added to' : 'removed from'} Homepage Featured Restaurants.`
      );
    } catch (err) {
      showToast(err.message || 'Failed to update restaurant status.', 'error');
    }
  };

  // ── Toggle Product (Dish) Featured ──────────────────────────────────────────
  const handleToggleDish = async (dish) => {
    const nextState = !dish.is_featured;
    try {
      await updateProductFeatured(dish.id, { is_featured: nextState });
      setDishes(prev =>
        prev.map(d => d.id === dish.id ? { ...d, is_featured: nextState } : d)
      );
      showToast(
        `"${dish.name}" ${nextState ? 'flagged as featured dish.' : 'removed from featured dishes.'}`
      );
    } catch (err) {
      showToast(err.message || 'Failed to update dish status.', 'error');
    }
  };

  // ── Save Image Override ─────────────────────────────────────────────────────
  const handleSaveImageOverride = async (e) => {
    e.preventDefault();
    if (!editingImageItem) return;

    setSavingImage(true);
    try {
      const imgVal = customImageUrl.trim() || null;
      if (editingImageItem.type === 'restaurant') {
        await updateRestaurantFeatured(editingImageItem.id, { custom_image: imgVal });
        setRestaurants(prev =>
          prev.map(r => r.id === editingImageItem.id ? { ...r, custom_cover_image: imgVal } : r)
        );
      } else {
        await updateProductFeatured(editingImageItem.id, { custom_image: imgVal });
        setDishes(prev =>
          prev.map(d => d.id === editingImageItem.id ? { ...d, custom_display_image: imgVal } : d)
        );
      }
      showToast(`Showcase display image updated for "${editingImageItem.name}".`);
      setEditingImageItem(null);
      setCustomImageUrl('');
    } catch (err) {
      showToast(err.message || 'Failed to save image override.', 'error');
    } finally {
      setSavingImage(false);
    }
  };

  // ── Save Max Featured Limit ─────────────────────────────────────────────────
  const handleSaveMaxLimit = (newLimit) => {
    const num = Math.max(1, Math.min(50, parseInt(newLimit, 10) || 9));
    const updated = saveShowcaseConfig({ maxFeaturedDishes: num });
    setConfig(updated);
    showToast(`Homepage popular dishes limit set to ${num}.`);
  };

  // Computed counts
  const featuredRestaurantsCount = useMemo(() => restaurants.filter(r => r.is_featured).length, [restaurants]);
  const featuredDishesCount      = useMemo(() => dishes.filter(d => d.is_featured).length, [dishes]);

  // Filtered lists
  const filteredDishes = useMemo(() => {
    return dishes.filter(d => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        (d.name && d.name.toLowerCase().includes(term)) ||
        (d.restaurantName && d.restaurantName.toLowerCase().includes(term)) ||
        (d.category_name && d.category_name.toLowerCase().includes(term));
      const matchFeat =
        filterFeatured === 'ALL' ||
        (filterFeatured === 'FEATURED' && d.is_featured) ||
        (filterFeatured === 'UNFEATURED' && !d.is_featured);
      return matchSearch && matchFeat;
    });
  }, [dishes, searchTerm, filterFeatured]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        (r.name && r.name.toLowerCase().includes(term)) ||
        (r.location && r.location.toLowerCase().includes(term)) ||
        (r.category && r.category.toLowerCase().includes(term));
      const matchFeat =
        filterFeatured === 'ALL' ||
        (filterFeatured === 'FEATURED' && r.is_featured) ||
        (filterFeatured === 'UNFEATURED' && !r.is_featured);
      return matchSearch && matchFeat;
    });
  }, [restaurants, searchTerm, filterFeatured]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── Page Header & Stats Banner ────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          borderRadius: '24px',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 87, 34, 0.18)',
              color: '#FF7A45',
              border: '1px solid rgba(255, 87, 34, 0.35)',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            <Sparkles size={13} strokeWidth={2.5} />
            <span>Admin Curation System</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Homepage Showcase Manager
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Decouple automatic vendor publishing from the landing page. Hand-pick featured restaurants and dishes, set custom display images, and control exact showcase limits.
          </p>
        </div>

        {/* Quick Action & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={() => loadData(true)}
            disabled={refreshing}
            style={{
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.84rem',
              fontWeight: 700,
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing…' : 'Refresh Catalog'}</span>
          </button>
        </div>
      </div>

      {/* ── Toast Feedback Notification ─────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            padding: '0.9rem 1.4rem',
            borderRadius: '14px',
            backgroundColor: toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
            border: `1px solid ${toast.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
            color: toast.type === 'error' ? '#DC2626' : '#047857',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Metric Summary Chips & Curation Limit Control ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Metric 1: Featured Dishes */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Popular Dishes Showcase
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FFF0EB', color: '#FF5722', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
              {featuredDishesCount}
            </span>
            <span style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600 }}>
              flagged ({Math.min(featuredDishesCount, config.maxFeaturedDishes)} shown on Homepage)
            </span>
          </div>
        </div>

        {/* Metric 2: Featured Restaurants */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Featured Restaurants
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB' }}>
              {featuredRestaurantsCount}
            </span>
            <span style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600 }}>
              of {restaurants.length} active spots
            </span>
          </div>
        </div>

        {/* Metric 3: Homepage Dishes Cap Control */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Dishes Cap Limit
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <input
              type="number"
              min="1"
              max="30"
              value={config.maxFeaturedDishes || 9}
              onChange={(e) => setConfig(prev => ({ ...prev, maxFeaturedDishes: parseInt(e.target.value, 10) || 9 }))}
              style={{
                width: '75px',
                padding: '6px 10px',
                borderRadius: '10px',
                border: '1.5px solid #E2E8F0',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0F172A',
                textAlign: 'center',
              }}
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleSaveMaxLimit(config.maxFeaturedDishes)}
              style={{ borderRadius: '10px', fontSize: '0.80rem', fontWeight: 700 }}
            >
              Update Limit
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Tab Bar & Search Filters ─────────────────────────── */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '14px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('dishes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'dishes' ? 800 : 600,
                backgroundColor: activeTab === 'dishes' ? '#ffffff' : 'transparent',
                color: activeTab === 'dishes' ? 'var(--primary)' : '#64748B',
                boxShadow: activeTab === 'dishes' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <UtensilsCrossed size={16} />
              <span>Popular Dishes ({dishes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('restaurants')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'restaurants' ? 800 : 600,
                backgroundColor: activeTab === 'restaurants' ? '#ffffff' : 'transparent',
                color: activeTab === 'restaurants' ? 'var(--primary)' : '#64748B',
                boxShadow: activeTab === 'restaurants' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Store size={16} />
              <span>Featured Restaurants ({restaurants.length})</span>
            </button>
          </div>

          {/* Search & Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search catalog…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1.5px solid #E2E8F0',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#fff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="ALL">All Items</option>
              <option value="FEATURED">Featured Only</option>
              <option value="UNFEATURED">Not Featured</option>
            </select>
          </div>
        </div>

        {/* ── Content Loading State ─────────────────────────────────────────── */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '30vh', gap: '12px', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600 }}>Loading showcase catalog…</span>
          </div>
        )}

        {/* ── TAB 1: POPULAR DISHES SHOWCASE ────────────────────────────────── */}
        {!loading && activeTab === 'dishes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredDishes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8', border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
                <UtensilsCrossed size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 4px 0', color: '#475569', fontSize: '1rem' }}>No dishes found</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing your search query or status filter.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
                {filteredDishes.map((dish, idx) => {
                  const defaultImg = getFoodImageUrl(dish) || getFoodItemImage(dish.slug, dish.id);
                  const displayImg = dish.custom_display_image || defaultImg || dish.image;
                  const isWithinTopLimit = dish.is_featured && idx < (config.maxFeaturedDishes || 9);

                  return (
                    <div
                      key={`${dish.restaurantId}-${dish.id}`}
                      style={{
                        backgroundColor: '#fff',
                        border: dish.is_featured ? '2px solid rgba(255, 87, 34, 0.4)' : '1px solid var(--border-color)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: dish.is_featured ? '0 4px 16px rgba(255, 87, 34, 0.08)' : 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Dish Thumbnail & Overlays */}
                      <div style={{ position: 'relative', height: '140px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={displayImg}
                          alt={dish.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Featured Status Badge */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                          {dish.is_featured ? (
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                backgroundColor: '#FF5722',
                                color: '#ffffff',
                                fontSize: '0.70rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(255, 87, 34, 0.3)',
                              }}
                            >
                              <Sparkles size={11} />
                              {isWithinTopLimit ? 'FEATURED ON HOMEPAGE' : 'FEATURED (QUEUED)'}
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                                color: '#94A3B8',
                                fontSize: '0.70rem',
                                fontWeight: 700,
                              }}
                            >
                              NOT FEATURED
                            </span>
                          )}
                        </div>

                        {/* Image Override Tag */}
                        {dish.custom_display_image && (
                          <div style={{ position: 'absolute', bottom: '8px', left: '10px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#38BDF8', fontSize: '0.65rem', fontWeight: 800 }}>
                              Custom Image Active
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                            {dish.name}
                          </h4>
                          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                            ₦{dish.price ? parseFloat(dish.price).toLocaleString() : '---'}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>
                          {dish.restaurantName || 'Restaurant Dish'} • {dish.category_name || 'General'}
                        </span>

                        {dish.description && (
                          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.4, flex: 1 }}>
                            {dish.description.slice(0, 75)}{dish.description.length > 75 ? '…' : ''}
                          </p>
                        )}

                        {/* Action Controls Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9', marginTop: 'auto', gap: '8px' }}>
                          {/* Toggle Switch */}
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                            <input
                              type="checkbox"
                              checked={!!dish.is_featured}
                              onChange={() => handleToggleDish(dish)}
                              style={{ width: '18px', height: '18px', accentColor: '#FF5722', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: dish.is_featured ? '#FF5722' : '#64748B' }}>
                              {dish.is_featured ? 'Featured' : 'Show on Home'}
                            </span>
                          </label>

                          {/* Image Override Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingImageItem({
                                type: 'dish',
                                id: dish.id,
                                name: dish.name,
                                currentImage: dish.custom_display_image || '',
                              });
                              setCustomImageUrl(dish.custom_display_image || '');
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Set custom showcase card image"
                          >
                            <ImageIcon size={13} />
                            <span>{dish.custom_display_image ? 'Edit Image' : 'Override Img'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: FEATURED RESTAURANTS SHOWCASE ───────────────────────────── */}
        {!loading && activeTab === 'restaurants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredRestaurants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8', border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
                <Store size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 4px 0', color: '#475569', fontSize: '1rem' }}>No restaurants found</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing your search query or status filter.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {filteredRestaurants.map((restaurant) => {
                  const defaultCover = getRestaurantCoverUrl(restaurant) || getRestaurantImage(restaurant.slug, restaurant.id);
                  const displayCover = restaurant.custom_cover_image || defaultCover || restaurant.cover_image;

                  return (
                    <div
                      key={restaurant.id}
                      style={{
                        backgroundColor: '#fff',
                        border: restaurant.is_featured ? '2px solid rgba(37, 99, 235, 0.4)' : '1px solid var(--border-color)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: restaurant.is_featured ? '0 4px 16px rgba(37, 99, 235, 0.08)' : 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Restaurant Thumbnail & Overlays */}
                      <div style={{ position: 'relative', height: '140px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={displayCover}
                          alt={restaurant.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Featured Status Badge */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                          {restaurant.is_featured ? (
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                backgroundColor: '#2563EB',
                                color: '#ffffff',
                                fontSize: '0.70rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                              }}
                            >
                              <Sparkles size={11} />
                              FEATURED RESTAURANT
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                                color: '#94A3B8',
                                fontSize: '0.70rem',
                                fontWeight: 700,
                              }}
                            >
                              STANDARD CATALOG
                            </span>
                          )}
                        </div>

                        {/* Image Override Tag */}
                        {restaurant.custom_cover_image && (
                          <div style={{ position: 'absolute', bottom: '8px', left: '10px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#38BDF8', fontSize: '0.65rem', fontWeight: 800 }}>
                              Custom Cover Active
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                          {restaurant.name}
                        </h4>

                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>
                          {restaurant.location || 'Abraka, Delta State'} • {restaurant.category || 'General Cuisine'}
                        </span>

                        {restaurant.description && (
                          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.4, flex: 1 }}>
                            {restaurant.description.slice(0, 85)}{restaurant.description.length > 85 ? '…' : ''}
                          </p>
                        )}

                        {/* Action Controls Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9', marginTop: 'auto', gap: '8px' }}>
                          {/* Toggle Switch */}
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                            <input
                              type="checkbox"
                              checked={!!restaurant.is_featured}
                              onChange={() => handleToggleRestaurant(restaurant)}
                              style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: restaurant.is_featured ? '#2563EB' : '#64748B' }}>
                              {restaurant.is_featured ? 'Featured' : 'Show on Home'}
                            </span>
                          </label>

                          {/* Image Override Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingImageItem({
                                type: 'restaurant',
                                id: restaurant.id,
                                name: restaurant.name,
                                currentImage: restaurant.custom_cover_image || '',
                              });
                              setCustomImageUrl(restaurant.custom_cover_image || '');
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Set custom homepage cover image"
                          >
                            <ImageIcon size={13} />
                            <span>{restaurant.custom_cover_image ? 'Edit Cover' : 'Override Img'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: CUSTOM IMAGE OVERRIDE ────────────────────────────────────── */}
      {editingImageItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingImageItem(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #E2E8F0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF0EB', color: '#FF5722', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={16} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  Showcase Display Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingImageItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Set a dedicated high-resolution image URL for <strong>{editingImageItem.name}</strong> on the public homepage.
            </p>

            <form onSubmit={handleSaveImageOverride} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Custom Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/curated-photo.jpg (or leave empty to reset)"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Preview */}
              {customImageUrl && (
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Preview:</span>
                  <div style={{ height: '120px', borderRadius: '10px', overflow: 'hidden', marginTop: '4px', backgroundColor: '#F1F5F9' }}>
                    <img src={customImageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingImageItem(null)}
                  style={{ borderRadius: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingImage}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} />
                  <span>{savingImage ? 'Saving…' : 'Save Override'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
