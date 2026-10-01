/**
 * VendorMenuPage — UrbanEats Food Item & Menu Management
 *
 * Add, edit, upload dish images, and toggle availability.
 * Delete dishes with confirmation prompt.
 *
 * Image upload flow (fixed):
 *   - Food item creation and image upload happen in ONE multipart/form-data request.
 *   - Edit replaces image in ONE request if a new file is selected.
 *   - No separate two-step upload; no lost item IDs; no blob: URLs persisted.
 */

import React, { useState, useEffect } from 'react';
import { useVendor } from '../../hooks/useVendor';
import { getFoodItemImage } from '../../data/imageAssets';
import { getFoodImageUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import VendorSubpageHeader from '../../components/vendor/VendorSubpageHeader';
import {
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Upload,
  AlertTriangle,
  Layers,
  Sparkles,
  ChevronDown,
  ListPlus,
  CheckSquare,
  CircleDot,
  Info,
} from 'lucide-react';

const PRESET_CATEGORIES = [
  { id: '1', name: 'Soups & Swallow' },
  { id: '2', name: 'Rice & Mains' },
  { id: '3', name: 'Sides & Snacks' },
  { id: '4', name: 'Morning Specials' },
  { id: '5', name: 'Sandwiches & Bakery' },
  { id: '6', name: 'Bakery & Sweets' },
  { id: '7', name: 'Cold Beverages' },
  { id: '8', name: 'Peppersoup & Grills' },
  { id: '9', name: 'Native Meals' },
  { id: '10', name: 'Fast Food & Burgers' },
  { id: 'custom', name: '+ Add Custom Category…' },
];

export default function VendorMenuPage() {
  const { menuItems, loading, error, loadMenu, toggleAvailability, saveFoodItem, deleteFoodItem } = useVendor();

  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [editingItem,    setEditingItem]    = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [formError,      setFormError]      = useState(null);

  // Delete confirmation state
  const [deleteTarget,   setDeleteTarget]   = useState(null); // item to delete
  const [deleting,       setDeleting]       = useState(false);

  // Toggle loading per-item
  const [togglingId,     setTogglingId]     = useState(null);

  // Form fields
  const [name,            setName]            = useState('');
  const [description,     setDescription]     = useState('');
  const [price,           setPrice]           = useState('');
  const [categoryId,      setCategoryId]      = useState('1');
  const [customCategory,  setCustomCategory]  = useState('');
  const [isAvailable,     setIsAvailable]     = useState(true);

  // Dynamic Option Groups state
  const [optionGroups,    setOptionGroups]    = useState([]);
  const [showPresetMenu,  setShowPresetMenu]  = useState(false);

  // Image state
  const [imageFile,    setImageFile]    = useState(null);   // File object to upload
  const [imagePreview, setImagePreview] = useState(null);   // URL for <img> preview

  useEffect(() => { loadMenu(); }, [loadMenu]);

  // ── Preset Helpers ───────────────────────────────────────────────────────────
  const handleAddOptionGroup = (presetType = null) => {
    setShowPresetMenu(false);

    if (presetType === 'pack_size') {
      const baseNum = parseFloat(price) || 0;
      setOptionGroups((prev) => [
        ...prev,
        {
          id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: 'Select Pack Size',
          subtitle: 'Choose the preferred serving size for this meal',
          required: true,
          selection_type: 'single',
          options: [
            { id: `opt_1_${Date.now()}`, name: '1 Piece (Base Price)', subtitle: 'Standard single portion', additional_price: 0 },
            { id: `opt_2_${Date.now()}`, name: '3 Pieces Box Combo', subtitle: 'Triple pack bundle', additional_price: baseNum > 0 ? Math.round(baseNum * 1.8) : 1000 },
            { id: `opt_3_${Date.now()}`, name: '6 Pieces Family Pack', subtitle: 'Save on half-dozen pack', additional_price: baseNum > 0 ? Math.round(baseNum * 3.8) : 2500 },
          ],
        },
      ]);
      return;
    }

    if (presetType === 'protein') {
      setOptionGroups((prev) => [
        ...prev,
        {
          id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: 'Select Protein / Meat Add-ons',
          subtitle: 'Choose your desired meat, chicken, or fish pairings',
          required: false,
          selection_type: 'multiple',
          options: [
            { id: `opt_1_${Date.now()}`, name: 'Tender Stewed Beef', subtitle: 'Tender seasoned beef chunk', additional_price: 700 },
            { id: `opt_2_${Date.now()}`, name: 'Crispy Fried Chicken Lap', subtitle: 'Crispy golden fried chicken', additional_price: 1200 },
            { id: `opt_3_${Date.now()}`, name: 'Golden Fried Turkey Cut', subtitle: 'Seasoned jumbo turkey', additional_price: 1600 },
            { id: `opt_4_${Date.now()}`, name: 'Soft Peppered Ponmo', subtitle: 'Spiced tender cow skin', additional_price: 400 },
            { id: `opt_5_${Date.now()}`, name: 'Hard Boiled Egg', subtitle: 'Farm fresh boiled egg', additional_price: 300 },
          ],
        },
      ]);
      return;
    }

    if (presetType === 'sides') {
      setOptionGroups((prev) => [
        ...prev,
        {
          id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: 'Sides & Extras',
          subtitle: 'Complete your meal with authentic Nigerian sides',
          required: false,
          selection_type: 'multiple',
          options: [
            { id: `opt_1_${Date.now()}`, name: 'Fried Sweet Plantain (Dodo)', subtitle: 'Sweet fried ripe plantain', additional_price: 500 },
            { id: `opt_2_${Date.now()}`, name: 'Fresh Creamy Coleslaw', subtitle: 'Chilled cabbage & carrot slaw', additional_price: 400 },
            { id: `opt_3_${Date.now()}`, name: 'Steamed Leaf Moi-Moi', subtitle: 'Traditional steamed bean cake', additional_price: 600 },
            { id: `opt_4_${Date.now()}`, name: 'Extra Pepper Sauce Cup', subtitle: 'Spicy habanero sauce dip', additional_price: 300 },
          ],
        },
      ]);
      return;
    }

    if (presetType === 'drinks') {
      setOptionGroups((prev) => [
        ...prev,
        {
          id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: 'Serving Temperature',
          subtitle: 'Choose your preferred drink serving condition',
          required: true,
          selection_type: 'single',
          options: [
            { id: `opt_1_${Date.now()}`, name: 'Ice Cold / Chilled', subtitle: 'Directly from refrigerator', additional_price: 0 },
            { id: `opt_2_${Date.now()}`, name: 'Room Temperature', subtitle: 'Standard non-chilled bottle', additional_price: 0 },
          ],
        },
      ]);
      return;
    }

    // Default blank group
    setOptionGroups((prev) => [
      ...prev,
      {
        id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: '',
        subtitle: '',
        required: false,
        selection_type: 'single',
        options: [
          { id: `opt_1_${Date.now()}`, name: '', subtitle: '', additional_price: 0 },
        ],
      },
    ]);
  };

  const handleUpdateGroup = (groupIndex, field, value) => {
    setOptionGroups((prev) => {
      const next = [...prev];
      next[groupIndex] = { ...next[groupIndex], [field]: value };
      return next;
    });
  };

  const handleDeleteGroup = (groupIndex) => {
    setOptionGroups((prev) => prev.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddOption = (groupIndex) => {
    setOptionGroups((prev) => {
      const next = [...prev];
      const targetGroup = next[groupIndex];
      const newOpt = {
        id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: '',
        subtitle: '',
        additional_price: 0,
      };
      next[groupIndex] = {
        ...targetGroup,
        options: [...(targetGroup.options || []), newOpt],
      };
      return next;
    });
  };

  const handleUpdateOption = (groupIndex, optIndex, field, value) => {
    setOptionGroups((prev) => {
      const next = [...prev];
      const targetGroup = next[groupIndex];
      const updatedOpts = [...(targetGroup.options || [])];
      updatedOpts[optIndex] = { ...updatedOpts[optIndex], [field]: value };
      next[groupIndex] = { ...targetGroup, options: updatedOpts };
      return next;
    });
  };

  const handleDeleteOption = (groupIndex, optIndex) => {
    setOptionGroups((prev) => {
      const next = [...prev];
      const targetGroup = next[groupIndex];
      next[groupIndex] = {
        ...targetGroup,
        options: (targetGroup.options || []).filter((_, idx) => idx !== optIndex),
      };
      return next;
    });
  };

  // ── Open Add modal ───────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('1');
    setCustomCategory('');
    setIsAvailable(true);
    setOptionGroups([]);
    setShowPresetMenu(false);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // ── Open Edit modal ──────────────────────────────────────────────────────────
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setDescription(item.description || '');
    setPrice(String(item.price || ''));
    
    const catIdStr = item.category_id ? String(item.category_id) : '';
    const presetMatch = PRESET_CATEGORIES.find((c) => c.id === catIdStr);
    if (presetMatch && presetMatch.id !== 'custom') {
      setCategoryId(presetMatch.id);
      setCustomCategory('');
    } else if (item.category_name) {
      setCategoryId('custom');
      setCustomCategory(item.category_name);
    } else {
      setCategoryId('1');
      setCustomCategory('');
    }

    setIsAvailable(item.is_available === 1 || item.is_available === true);
    
    // Parse existing option_groups if present
    let parsedGroups = [];
    if (item.option_groups) {
      if (Array.isArray(item.option_groups)) {
        parsedGroups = item.option_groups;
      } else if (typeof item.option_groups === 'string') {
        try {
          const decoded = JSON.parse(item.option_groups);
          if (Array.isArray(decoded)) parsedGroups = decoded;
        } catch (e) {
          console.warn('Failed to parse item.option_groups JSON:', e);
        }
      }
    }
    setOptionGroups(parsedGroups);
    setShowPresetMenu(false);

    setImageFile(null); // no pending new file
    // Resolve existing image for preview
    setImagePreview(getFoodImageUrl(item) || getFoodItemImage(item.slug, item.id) || null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // ── User selects a new image file ─────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Form submission ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || name.trim().length < 2) {
      setFormError('Dish name must be at least 2 characters.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price greater than ₦0.');
      return;
    }

    let finalCatId = parseInt(categoryId, 10);
    let finalCatName = '';
    if (categoryId === 'custom') {
      if (!customCategory.trim()) {
        setFormError('Please enter a category name for your dish.');
        return;
      }
      finalCatName = customCategory.trim();
      finalCatId = undefined;
    } else {
      const match = PRESET_CATEGORIES.find((c) => c.id === String(categoryId));
      if (match) finalCatName = match.name;
    }

    // Clean & sanitize option groups before saving
    const cleanedOptionGroups = optionGroups
      .filter((g) => g && g.title && g.title.trim().length > 0)
      .map((g) => ({
        title: g.title.trim(),
        subtitle: (g.subtitle || '').trim(),
        required: Boolean(g.required),
        selection_type: g.selection_type === 'multiple' ? 'multiple' : 'single',
        options: (g.options || [])
          .filter((o) => o && o.name && o.name.trim().length > 0)
          .map((o) => ({
            name: o.name.trim(),
            subtitle: (o.subtitle || '').trim(),
            additional_price: parseFloat(o.additional_price) || 0,
          })),
      }))
      .filter((g) => g.options.length > 0);

    setSaving(true);
    try {
      const foodData = {
        id:            editingItem?.id,          // undefined for new items
        name:          name.trim(),
        description:   description.trim(),
        price:         parsedPrice,
        category_id:   isNaN(finalCatId) ? undefined : finalCatId,
        category_name: finalCatName,
        is_available:  isAvailable ? 1 : 0,
        option_groups: cleanedOptionGroups,
      };

      await saveFoodItem(foodData, imageFile);
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save dish. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Availability toggle ───────────────────────────────────────────────────────
  const handleToggle = async (item) => {
    if (togglingId === item.id) return; // prevent double-click
    const currentlyAvailable = item.is_available === 1 || item.is_available === true;
    const newAvailableState  = !currentlyAvailable; // the desired NEW state
    setTogglingId(item.id);
    try {
      await toggleAvailability(item.id, newAvailableState);
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete dish ───────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFoodItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete failed:', err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Standardized Sub-page Header */}
      <VendorSubpageHeader
        title="Menu Management"
        subtitle="Add dishes, upload photos, and toggle availability."
        actionButton={
          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            style={{
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(255, 87, 34, 0.25)',
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add New Dish</span>
          </button>
        }
      />

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '12px', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600 }}>Loading menu…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && menuItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍽️</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No menu items yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click <strong>Add New Dish</strong> to create your first menu item.</p>
        </div>
      )}

      {/* Dishes Grid */}
      {!loading && !error && menuItems.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {menuItems.map((item) => {
            const imgSrc    = getFoodImageUrl(item) || getFoodItemImage(item.slug, item.id) || item.image;
            const itemAvail = item.is_available === 1 || item.is_available === true;
            const isToggling = togglingId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: itemAvail ? '1px solid var(--border-color)' : '1px solid #FECACA',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.88rem',
                  opacity: itemAvail ? 1 : 0.78,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {/* Dish Image */}
                <div style={{ height: '160px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#f8f9fa', position: 'relative' }}>
                  <ImageWithFallback
                    src={imgSrc}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800,
                      backgroundColor: itemAvail ? '#ECFDF5' : '#FEF2F2',
                      color: itemAvail ? '#047857' : '#DC2626',
                      border: itemAvail ? '1px solid #A7F3D0' : '1px solid #FECACA',
                    }}>
                      {itemAvail ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {item.name}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#EA580C',
                        backgroundColor: '#FFF7ED',
                        border: '1px solid #FFEDD5',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        marginTop: '4px'
                      }}>
                        {item.category_name || PRESET_CATEGORIES.find((c) => String(c.id) === String(item.category_id))?.name || 'General'}
                      </span>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                      ₦{parseFloat(item.price).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0', minHeight: '36px', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  {/* Active / Muted Toggle — fully functional */}
                  <button
                    type="button"
                    onClick={() => handleToggle(item)}
                    disabled={isToggling}
                    title={itemAvail ? 'Click to mark as unavailable' : 'Click to mark as available'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: isToggling ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: itemAvail ? '#047857' : '#DC2626',
                      opacity: isToggling ? 0.6 : 1,
                      transition: 'opacity 0.15s ease',
                      padding: '4px 6px',
                      borderRadius: '8px',
                    }}
                  >
                    {isToggling ? (
                      <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
                    ) : itemAvail ? (
                      <ToggleRight size={22} style={{ color: '#047857' }} />
                    ) : (
                      <ToggleLeft size={22} style={{ color: '#DC2626' }} />
                    )}
                    {itemAvail ? 'Active' : 'Muted'}
                  </button>

                  {/* Right-side action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Edit button */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenEdit(item)}
                      style={{ borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      title="Delete dish"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        border: '1.5px solid #FECACA',
                        backgroundColor: '#FFF5F5',
                        color: '#DC2626',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                        e.currentTarget.style.borderColor = '#F87171';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF5F5';
                        e.currentTarget.style.borderColor = '#FECACA';
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', width: '92vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="modal-title" style={{ margin: 0 }}>{editingItem ? 'Edit Dish' : 'Add New Dish'}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    {editingItem ? 'Update dish details, prices, and variant options' : 'Create a new dish offering for your restaurant menu'}
                  </p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', paddingRight: '4px' }}>
              {/* Error */}
              {formError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.85rem', fontWeight: 600 }}>
                  {formError}
                </div>
              )}

              {/* Basic Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {/* Name */}
                <div>
                  <label className="form-label">Dish Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: '10px' }}
                    placeholder="e.g. Jollof Rice & Fried Chicken"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    style={{ borderRadius: '10px' }}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categoryId === 'custom' && (
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '10px', marginTop: '8px' }}
                      placeholder="Type custom category name..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>

              {/* Price + Availability */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Base Price (₦) *</label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    className="form-control"
                    style={{ borderRadius: '10px' }}
                    placeholder="e.g. 2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Availability</label>
                  <select
                    className="form-control"
                    style={{ borderRadius: '10px' }}
                    value={isAvailable ? '1' : '0'}
                    onChange={(e) => setIsAvailable(e.target.value === '1')}
                  >
                    <option value="1">Available to Order</option>
                    <option value="0">Temporarily Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="form-label">Dish Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Preview */}
                  <div style={{ width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#f8f9fa', flexShrink: 0 }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                        <Upload size={22} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className="btn btn-outline btn-sm"
                      style={{ borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                    >
                      <Upload size={14} />
                      {imageFile ? 'Change Photo' : editingItem && imagePreview ? 'Replace Photo' : 'Select Photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                      JPG, PNG or WebP. Max 5 MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  style={{ borderRadius: '10px', minHeight: '68px' }}
                  placeholder="Ingredients, sides, or preparation details…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ── CUSTOMIZATION OPTIONS / VARIANTS SECTION ──────────────────────── */}
              <div style={{
                backgroundColor: '#FAFAFA',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                {/* Section Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>✨</span>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Customization Options / Variants
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Configure pack sizes (e.g. 1 Pc, 3 Pcs Combo), add-on proteins, sides, or drink choices for customers.
                    </p>
                  </div>

                  {/* Add Group & Presets Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    {/* Quick Presets Dropdown */}
                    <button
                      type="button"
                      onClick={() => setShowPresetMenu((v) => !v)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#ffffff',
                        color: 'var(--text-main)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={13} style={{ color: '#EA580C' }} />
                      <span>Quick Presets</span>
                      <ChevronDown size={14} />
                    </button>

                    {showPresetMenu && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: '6px',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          padding: '6px',
                          zIndex: 50,
                          minWidth: '220px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleAddOptionGroup('pack_size')}
                          style={{
                            textAlign: 'left',
                            padding: '8px 10px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF7ED')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span>📦</span>
                          <span>Pack Size / Box Combo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddOptionGroup('protein')}
                          style={{
                            textAlign: 'left',
                            padding: '8px 10px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF7ED')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span>🥩</span>
                          <span>Protein & Meat Add-ons</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddOptionGroup('sides')}
                          style={{
                            textAlign: 'left',
                            padding: '8px 10px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF7ED')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span>🍟</span>
                          <span>Extra Sides & Dips</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddOptionGroup('drinks')}
                          style={{
                            textAlign: 'left',
                            padding: '8px 10px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF7ED')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span>🥤</span>
                          <span>Serving Temperature (Drinks)</span>
                        </button>
                      </div>
                    )}

                    {/* + Add Option Group Button */}
                    <button
                      type="button"
                      onClick={() => handleAddOptionGroup(null)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(255, 87, 34, 0.25)',
                      }}
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      <span>+ Add Option Group</span>
                    </button>
                  </div>
                </div>

                {/* Empty State when no groups exist */}
                {optionGroups.length === 0 && (
                  <div style={{
                    padding: '1.25rem',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px dashed #CBD5E1',
                    borderRadius: '12px',
                    color: 'var(--text-muted)',
                  }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 600 }}>
                      No custom option groups configured for this dish.
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
                      Click <strong>+ Add Option Group</strong> or pick a <strong>Quick Preset</strong> above to let customers pick pack sizes, meats, or toppings!
                    </p>
                  </div>
                )}

                {/* Option Groups List */}
                {optionGroups.map((group, gIdx) => (
                  <div
                    key={group.id || gIdx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.88rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Group Card Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#FFF7ED',
                          color: '#EA580C',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                        }}>
                          Group {gIdx + 1}
                        </span>

                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', padding: '6px 10px', fontSize: '0.88rem', fontWeight: 700 }}
                          placeholder="Group Title (e.g., Select Pack Size, Choose Protein) *"
                          value={group.title || ''}
                          onChange={(e) => handleUpdateGroup(gIdx, 'title', e.target.value)}
                          required
                        />
                      </div>

                      {/* Delete Group Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(gIdx)}
                        title="Delete this option group"
                        style={{
                          background: 'none',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FFF5F5',
                          color: '#DC2626',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Remove Group</span>
                      </button>
                    </div>

                    {/* Subtitle / Helper description */}
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem' }}
                        placeholder="Subtitle / Instruction for customers (e.g., Choose your preferred serving size)"
                        value={group.subtitle || ''}
                        onChange={(e) => handleUpdateGroup(gIdx, 'subtitle', e.target.value)}
                      />
                    </div>

                    {/* Group Settings: Type & Required */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #F1F5F9',
                    }}>
                      {/* Selection Type */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Selection Rule:
                        </span>
                        <select
                          className="form-control"
                          style={{ borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                          value={group.selection_type || 'single'}
                          onChange={(e) => handleUpdateGroup(gIdx, 'selection_type', e.target.value)}
                        >
                          <option value="single">Single Choice (Radio button — Pick 1)</option>
                          <option value="multiple">Multiple Choice (Checkboxes & Piece counters)</option>
                        </select>
                      </div>

                      {/* Required Toggle */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={Boolean(group.required)}
                          onChange={(e) => handleUpdateGroup(gIdx, 'required', e.target.checked)}
                          style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span>Required Choice</span>
                      </label>
                    </div>

                    {/* Individual Options List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1.4fr 0.9fr 36px',
                        gap: '8px',
                        padding: '0 4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}>
                        <span>Option Name *</span>
                        <span>Short Note (optional)</span>
                        <span>Extra Price (+₦)</span>
                        <span></span>
                      </div>

                      {(group.options || []).map((opt, oIdx) => (
                        <div
                          key={opt.id || oIdx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.4fr 1.4fr 0.9fr 36px',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            type="text"
                            className="form-control"
                            style={{ borderRadius: '8px', padding: '6px 8px', fontSize: '0.82rem' }}
                            placeholder="e.g. 1 Piece, 3 Pieces Box"
                            value={opt.name || ''}
                            onChange={(e) => handleUpdateOption(gIdx, oIdx, 'name', e.target.value)}
                            required
                          />

                          <input
                            type="text"
                            className="form-control"
                            style={{ borderRadius: '8px', padding: '6px 8px', fontSize: '0.82rem' }}
                            placeholder="e.g. Standard portion"
                            value={opt.subtitle || ''}
                            onChange={(e) => handleUpdateOption(gIdx, oIdx, 'subtitle', e.target.value)}
                          />

                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', left: '8px', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>+₦</span>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              className="form-control"
                              style={{ borderRadius: '8px', padding: '6px 8px 6px 26px', fontSize: '0.82rem' }}
                              placeholder="0"
                              value={opt.additional_price ?? 0}
                              onChange={(e) => handleUpdateOption(gIdx, oIdx, 'additional_price', e.target.value)}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteOption(gIdx, oIdx)}
                            disabled={(group.options || []).length <= 1}
                            title="Remove this option"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid #FECACA',
                              backgroundColor: '#FFF5F5',
                              color: '#DC2626',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: (group.options || []).length <= 1 ? 'not-allowed' : 'pointer',
                              opacity: (group.options || []).length <= 1 ? 0.4 : 1,
                              padding: 0,
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}

                      {/* + Add Option Row Button */}
                      <button
                        type="button"
                        onClick={() => handleAddOption(gIdx)}
                        style={{
                          alignSelf: 'flex-start',
                          marginTop: '4px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px dashed #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: 'var(--text-main)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={13} />
                        <span>+ Add Option Row</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '10px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px' }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {saving ? 'Saving Dish…' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px' }}
          >
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '0',
              }}>
                <AlertTriangle size={26} style={{ color: '#DC2626' }} />
              </div>
              <button className="modal-close" onClick={() => !deleting && setDeleteTarget(null)} disabled={deleting}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ paddingTop: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Delete Dish?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Are you sure you want to remove <strong style={{ color: 'var(--text-main)' }}>{deleteTarget.name}</strong> from your menu?
                This action will mark it as permanently unavailable.
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  style={{ borderRadius: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '10px',
                    backgroundColor: '#DC2626', color: '#ffffff',
                    border: 'none', fontWeight: 800, fontSize: '0.88rem',
                    cursor: deleting ? 'wait' : 'pointer',
                    opacity: deleting ? 0.7 : 1,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {deleting ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={16} />}
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
