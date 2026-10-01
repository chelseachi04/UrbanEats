/**
 * UrbanEats Food Customization Modal / Bottom Sheet
 *
 * Interactive configuration sheet for food items:
 * - Dynamic vendor-configured option groups (Pack sizes, add-ons, bundle variants, proteins, temperatures)
 * - Single-select options (Radio card choices) & Multi-select options (Checkboxes & Piece counters)
 * - Fallback to authentic Nigerian cuisine schemas if no custom vendor options are set
 * - Real-time live subtotal computation
 * - "Add to Cart - ₦[Total]" CTA with quantity stepper
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Plus, Minus, Check, ShoppingBag, Sparkles,
  ChefHat, MessageSquare
} from 'lucide-react';
import { getCustomizationSchema, QUICK_INSTRUCTION_SUGGESTIONS } from '../../data/foodCustomizationSchemas';
import { resolveImageUrl, getFoodImageUrl } from '../../utils/imageUtils';
import { getFoodItemImage } from '../../data/imageAssets';
import ImageWithFallback from '../common/ImageWithFallback';

export default function FoodCustomizationModal({
  isOpen,
  onClose,
  foodItem,
  restaurant,
  onAddToCart,
}) {
  if (!isOpen || !foodItem) return null;

  const basePrice = parseFloat(foodItem.price) || 0;

  // ── Parse Vendor-Configured Option Groups ──────────────────────────────────
  const customOptionGroups = useMemo(() => {
    if (!foodItem) return null;
    let groups = foodItem.option_groups;
    if (typeof groups === 'string') {
      try {
        groups = JSON.parse(groups);
      } catch {
        groups = null;
      }
    }
    if (Array.isArray(groups) && groups.length > 0) {
      const valid = groups.filter(g => g && g.title && Array.isArray(g.options) && g.options.length > 0);
      return valid.length > 0 ? valid : null;
    }
    return null;
  }, [foodItem]);

  const fallbackSchema = useMemo(() => {
    return customOptionGroups ? null : getCustomizationSchema(foodItem);
  }, [customOptionGroups, foodItem]);

  // ── State for Dynamic Vendor Groups ─────────────────────────────────────────
  // Map of groupIndex -> selected option object (for single)
  const [selectedDynamicSingle, setSelectedDynamicSingle] = useState({});
  // Map of groupIndex -> Map of optName -> { name, subtitle, price, quantity } (for multiple)
  const [selectedDynamicMulti, setSelectedDynamicMulti] = useState({});

  // ── Fallback State (when no vendor groups configured) ───────────────────────
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [selectedSwallow, setSelectedSwallow] = useState(null);
  const [selectedProteins, setSelectedProteins] = useState({});
  const [selectedSides, setSelectedSides] = useState({});

  // ── General State ───────────────────────────────────────────────────────────
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Initialize and reset selections whenever foodItem changes
  useEffect(() => {
    if (customOptionGroups) {
      const initSingle = {};
      const initMulti = {};

      customOptionGroups.forEach((group, idx) => {
        const isSingle = group.selection_type !== 'multiple';
        if (isSingle && group.options?.length > 0) {
          // Default to first option (especially if 0 additional price or required)
          initSingle[idx] = group.options[0];
        } else {
          initMulti[idx] = {};
        }
      });

      setSelectedDynamicSingle(initSingle);
      setSelectedDynamicMulti(initMulti);
    } else if (fallbackSchema) {
      if (fallbackSchema.portions?.options) {
        const def = fallbackSchema.portions.defaultId
          ? fallbackSchema.portions.options.find(o => o.id === fallbackSchema.portions.defaultId)
          : fallbackSchema.portions.options[0];
        setSelectedPortion(def || null);
      } else {
        setSelectedPortion(null);
      }

      if (fallbackSchema.swallow?.options) {
        const def = fallbackSchema.swallow.defaultId
          ? fallbackSchema.swallow.options.find(o => o.id === fallbackSchema.swallow.defaultId)
          : fallbackSchema.swallow.options[0];
        setSelectedSwallow(def || null);
      } else {
        setSelectedSwallow(null);
      }

      setSelectedProteins({});
      setSelectedSides({});
    }

    setSpecialInstructions('');
    setQuantity(1);
  }, [foodItem, customOptionGroups, fallbackSchema]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ── Dynamic Handlers ────────────────────────────────────────────────────────
  const handleSelectDynamicSingle = (groupIndex, option) => {
    setSelectedDynamicSingle(prev => ({
      ...prev,
      [groupIndex]: option,
    }));
  };

  const handleToggleDynamicMulti = (groupIndex, option) => {
    setSelectedDynamicMulti(prev => {
      const groupSelections = { ...(prev[groupIndex] || {}) };
      const optKey = option.name;
      if (groupSelections[optKey]) {
        delete groupSelections[optKey];
      } else {
        groupSelections[optKey] = {
          name: option.name,
          subtitle: option.subtitle || '',
          price: parseFloat(option.additional_price) || 0,
          quantity: 1,
        };
      }
      return {
        ...prev,
        [groupIndex]: groupSelections,
      };
    });
  };

  const handleUpdateDynamicMultiQty = (groupIndex, option, delta) => {
    setSelectedDynamicMulti(prev => {
      const groupSelections = { ...(prev[groupIndex] || {}) };
      const optKey = option.name;
      const current = groupSelections[optKey];
      const newQty = (current?.quantity || 0) + delta;

      if (newQty <= 0) {
        delete groupSelections[optKey];
      } else {
        groupSelections[optKey] = {
          name: option.name,
          subtitle: option.subtitle || '',
          price: parseFloat(option.additional_price) || 0,
          quantity: newQty,
        };
      }
      return {
        ...prev,
        [groupIndex]: groupSelections,
      };
    });
  };

  // ── Fallback Handlers ───────────────────────────────────────────────────────
  const handleToggleProtein = (protein) => {
    setSelectedProteins(prev => {
      const current = prev[protein.id];
      if (current) {
        const next = { ...prev };
        delete next[protein.id];
        return next;
      }
      return {
        ...prev,
        [protein.id]: {
          name: protein.name,
          price: protein.price,
          quantity: 1,
        },
      };
    });
  };

  const handleUpdateProteinQty = (protein, delta) => {
    setSelectedProteins(prev => {
      const current = prev[protein.id];
      const newQty = (current?.quantity || 0) + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[protein.id];
        return next;
      }
      return {
        ...prev,
        [protein.id]: {
          name: protein.name,
          price: protein.price,
          quantity: newQty,
        },
      };
    });
  };

  const handleToggleSide = (side) => {
    setSelectedSides(prev => {
      const next = { ...prev };
      if (next[side.id]) delete next[side.id];
      else next[side.id] = side;
      return next;
    });
  };

  const handleAddSuggestion = (text) => {
    setSpecialInstructions(prev => {
      if (!prev.trim()) return text;
      if (prev.includes(text)) return prev;
      return `${prev.trim()}, ${text}`;
    });
  };

  // ── Price Computations ──────────────────────────────────────────────────────
  const dynamicTotalCost = useMemo(() => {
    if (!customOptionGroups) return 0;
    let sum = 0;
    // Single selections
    Object.values(selectedDynamicSingle).forEach(opt => {
      if (opt && opt.additional_price) {
        sum += (parseFloat(opt.additional_price) || 0);
      }
    });
    // Multi selections
    Object.values(selectedDynamicMulti).forEach(groupMap => {
      Object.values(groupMap || {}).forEach(item => {
        sum += (parseFloat(item.price) || 0) * (item.quantity || 1);
      });
    });
    return sum;
  }, [customOptionGroups, selectedDynamicSingle, selectedDynamicMulti]);

  const fallbackTotalCost = useMemo(() => {
    if (customOptionGroups) return 0;
    const portionP = selectedPortion?.price || 0;
    const swallowP = selectedSwallow?.price || 0;
    const proteinsP = Object.values(selectedProteins).reduce((s, p) => s + (p.price * p.quantity), 0);
    const sidesP = Object.values(selectedSides).reduce((s, side) => s + (side.price || 0), 0);
    return portionP + swallowP + proteinsP + sidesP;
  }, [customOptionGroups, selectedPortion, selectedSwallow, selectedProteins, selectedSides]);

  const unitPrice = basePrice + (customOptionGroups ? dynamicTotalCost : fallbackTotalCost);
  const totalAmount = unitPrice * quantity;

  // ── Handle Add to Cart ──────────────────────────────────────────────────────
  const handleAdd = () => {
    let customizationsPayload = {};

    if (customOptionGroups) {
      // Gather all selected dynamic options
      const formattedSelections = [];
      let portionName = null;
      let portionExtraPrice = 0;
      const proteinsList = [];
      const sidesList = [];

      customOptionGroups.forEach((group, gIdx) => {
        const isSingle = group.selection_type !== 'multiple';
        if (isSingle) {
          const opt = selectedDynamicSingle[gIdx];
          if (opt) {
            const addP = parseFloat(opt.additional_price) || 0;
            formattedSelections.push({
              groupTitle: group.title,
              name: opt.name,
              price: addP,
              quantity: 1,
            });
            if (group.title.toLowerCase().includes('pack') || group.title.toLowerCase().includes('portion') || group.title.toLowerCase().includes('size')) {
              portionName = opt.name;
              portionExtraPrice = addP;
            }
          }
        } else {
          const multiMap = selectedDynamicMulti[gIdx] || {};
          Object.values(multiMap).forEach(item => {
            formattedSelections.push({
              groupTitle: group.title,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            });
            if (group.title.toLowerCase().includes('protein') || group.title.toLowerCase().includes('meat')) {
              proteinsList.push({ name: item.name, price: item.price, quantity: item.quantity });
            } else {
              sidesList.push(item.name + (item.quantity > 1 ? ` (×${item.quantity})` : ''));
            }
          });
        }
      });

      customizationsPayload = {
        portion: portionName || (formattedSelections[0]?.name ?? null),
        portionPrice: portionExtraPrice,
        optionSelections: formattedSelections,
        proteins: proteinsList,
        sides: sidesList,
        specialInstructions: specialInstructions.trim() || null,
        basePrice,
        unitPrice,
        quantity,
      };
    } else {
      const customizedProteinsList = Object.values(selectedProteins).map(p => ({
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      }));
      const customizedSidesList = Object.values(selectedSides).map(s => s.name);

      customizationsPayload = {
        portion: selectedPortion ? selectedPortion.name : null,
        portionPrice: selectedPortion?.price || 0,
        swallow: selectedSwallow && selectedSwallow.id !== 'none'
          ? { name: selectedSwallow.name, price: selectedSwallow.price }
          : null,
        proteins: customizedProteinsList,
        sides: customizedSidesList,
        sidesDetails: Object.values(selectedSides),
        specialInstructions: specialInstructions.trim() || null,
        basePrice,
        unitPrice,
        quantity,
      };
    }

    const payload = {
      foodItem,
      restaurant: restaurant || { id: foodItem.restaurant_id, name: foodItem.restaurant_name },
      customizations: customizationsPayload,
    };

    onAddToCart(payload);
    onClose();
  };

  // Resolve dish image
  const resolvedImg =
    foodItem.custom_display_image ||
    getFoodImageUrl(foodItem) ||
    getFoodItemImage(foodItem.slug || foodItem.food_slug || foodItem.name, foodItem.id) ||
    foodItem.image ||
    foodItem.image_url ||
    '/assets/default-food-placeholder.png';

  const restaurantName = restaurant?.name || foodItem.restaurant_name || foodItem.restaurantName || 'UrbanEats Partner';

  return (
    <div className="custom-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="custom-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="custom-modal-handle-bar">
          <div className="custom-modal-drag-handle" />
        </div>

        {/* Modal Top Header with Close Button */}
        <div className="custom-modal-hero">
          <div className="custom-modal-hero-img-wrap">
            <ImageWithFallback
              src={resolvedImg}
              alt={foodItem.name}
              className="custom-modal-hero-img"
            />
            <div className="custom-modal-hero-overlay" />
          </div>

          <button
            type="button"
            className="custom-modal-close-btn"
            onClick={onClose}
            aria-label="Close customization modal"
          >
            <X size={20} />
          </button>

          <div className="custom-modal-hero-content">
            <div className="custom-modal-hero-badges">
              <span className="custom-badge custom-badge-restaurant">
                <ChefHat size={13} style={{ marginRight: '4px' }} />
                {restaurantName}
              </span>
              {fallbackSchema?.badge && (
                <span className="custom-badge custom-badge-category">
                  {fallbackSchema.badge}
                </span>
              )}
            </div>

            <h2 className="custom-modal-title">{foodItem.name}</h2>
            {foodItem.description && (
              <p className="custom-modal-desc">{foodItem.description}</p>
            )}

            <div className="custom-modal-base-price-pill">
              <span className="custom-modal-base-label">Base Price:</span>
              <strong className="custom-modal-base-val">₦{basePrice.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="custom-modal-body custom-scrollbar">

          {/* ════════════════════════════════════════════════════════════════════
              CASE A: VENDOR-CONFIGURED DYNAMIC OPTION GROUPS
             ════════════════════════════════════════════════════════════════════ */}
          {customOptionGroups && customOptionGroups.map((group, gIdx) => {
            const isSingle = group.selection_type !== 'multiple';
            const selectedOpt = selectedDynamicSingle[gIdx];
            const multiMap = selectedDynamicMulti[gIdx] || {};

            return (
              <section key={gIdx} className="custom-section">
                <div className="custom-section-header">
                  <div className="custom-section-title-wrap">
                    <span className="custom-step-number">{gIdx + 1}</span>
                    <h3 className="custom-section-title">{group.title}</h3>
                  </div>
                  {group.required ? (
                    <span className="custom-tag-required">Required</span>
                  ) : (
                    <span className="custom-tag-optional">{isSingle ? 'Optional' : 'Multi-select'}</span>
                  )}
                </div>

                {group.subtitle && (
                  <p className="custom-section-subtitle">{group.subtitle}</p>
                )}

                {/* Single Choice (Radio List) */}
                {isSingle ? (
                  <div className="custom-options-grid">
                    {(group.options || []).map((opt, oIdx) => {
                      const isSelected = selectedOpt?.name === opt.name;
                      const addPrice = parseFloat(opt.additional_price) || 0;

                      return (
                        <label
                          key={oIdx}
                          className={`custom-option-card ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectDynamicSingle(gIdx, opt)}
                        >
                          <input
                            type="radio"
                            name={`dynamic_group_${gIdx}`}
                            checked={isSelected}
                            onChange={() => handleSelectDynamicSingle(gIdx, opt)}
                            className="custom-radio-input"
                          />
                          <div className="custom-option-content">
                            <div className="custom-option-name">{opt.name}</div>
                            {opt.subtitle && (
                              <div className="custom-option-desc">{opt.subtitle}</div>
                            )}
                          </div>
                          <div className="custom-option-price">
                            {addPrice > 0 ? `+₦${addPrice.toLocaleString()}` : 'Included'}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  /* Multiple Choice (Checkboxes & Stepper Counters) */
                  <div className="custom-proteins-grid">
                    {(group.options || []).map((opt, oIdx) => {
                      const selectedItem = multiMap[opt.name];
                      const isSelected = Boolean(selectedItem);
                      const qty = selectedItem?.quantity || 0;
                      const addPrice = parseFloat(opt.additional_price) || 0;

                      return (
                        <div
                          key={oIdx}
                          className={`custom-protein-card ${isSelected ? 'active' : ''}`}
                          onClick={() => !isSelected && handleToggleDynamicMulti(gIdx, opt)}
                        >
                          <div className="custom-protein-left">
                            <button
                              type="button"
                              className={`custom-checkbox-btn ${isSelected ? 'checked' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleDynamicMulti(gIdx, opt);
                              }}
                              aria-label={`Toggle ${opt.name}`}
                            >
                              {isSelected && <Check size={13} strokeWidth={3} />}
                            </button>

                            <div className="custom-protein-meta">
                              <span className="custom-protein-name">{opt.name}</span>
                              {opt.subtitle && (
                                <span className="custom-protein-tag">{opt.subtitle}</span>
                              )}
                            </div>
                          </div>

                          <div className="custom-protein-right">
                            <span className="custom-protein-price">
                              {addPrice > 0 ? `+₦${addPrice.toLocaleString()}` : 'Free'}
                            </span>

                            {isSelected && (
                              <div className="custom-stepper-mini" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="custom-stepper-mini-btn"
                                  onClick={() => handleUpdateDynamicMultiQty(gIdx, opt, -1)}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="custom-stepper-mini-val">{qty}</span>
                                <button
                                  type="button"
                                  className="custom-stepper-mini-btn"
                                  onClick={() => handleUpdateDynamicMultiQty(gIdx, opt, 1)}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          {/* ════════════════════════════════════════════════════════════════════
              CASE B: FALLBACK CUISINE-BASED SCHEMAS (WHEN NO VENDOR GROUPS)
             ════════════════════════════════════════════════════════════════════ */}
          {!customOptionGroups && fallbackSchema && (
            <>
              {/* 1. Portion Size */}
              {fallbackSchema.portions && (
                <section className="custom-section">
                  <div className="custom-section-header">
                    <div className="custom-section-title-wrap">
                      <span className="custom-step-number">1</span>
                      <h3 className="custom-section-title">{fallbackSchema.portions.title}</h3>
                    </div>
                    <span className="custom-tag-required">Required</span>
                  </div>
                  <p className="custom-section-subtitle">
                    {fallbackSchema.portions.description || 'Choose the preferred serving size for this meal'}
                  </p>

                  <div className="custom-options-grid">
                    {fallbackSchema.portions.options.map((portion) => {
                      const isSelected = selectedPortion?.id === portion.id;
                      return (
                        <label
                          key={portion.id}
                          className={`custom-option-card ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedPortion(portion)}
                        >
                          <input
                            type="radio"
                            name="food_portion"
                            checked={isSelected}
                            onChange={() => setSelectedPortion(portion)}
                            className="custom-radio-input"
                          />
                          <div className="custom-option-content">
                            <div className="custom-option-name">{portion.name}</div>
                            {portion.description && (
                              <div className="custom-option-desc">{portion.description}</div>
                            )}
                          </div>
                          <div className="custom-option-price">
                            {portion.price > 0 ? `+₦${portion.price.toLocaleString()}` : 'Included'}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 2. Swallow Selector */}
              {fallbackSchema.swallow && (
                <section className="custom-section">
                  <div className="custom-section-header">
                    <div className="custom-section-title-wrap">
                      <span className="custom-step-number">2</span>
                      <h3 className="custom-section-title">{fallbackSchema.swallow.title}</h3>
                    </div>
                    <span className="custom-tag-optional">Optional</span>
                  </div>
                  <p className="custom-section-subtitle">
                    Select your freshly prepared swallow wrap or choose Soup Only
                  </p>

                  <div className="custom-swallow-grid">
                    {fallbackSchema.swallow.options.map((swallow) => {
                      const isSelected = selectedSwallow?.id === swallow.id;
                      return (
                        <div
                          key={swallow.id}
                          className={`custom-swallow-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedSwallow(swallow)}
                        >
                          <div className="custom-swallow-indicator">
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div className="custom-swallow-info">
                            <span className="custom-swallow-name">{swallow.name}</span>
                            {swallow.tag && <span className="custom-swallow-tag">{swallow.tag}</span>}
                          </div>
                          <span className="custom-swallow-price">
                            {swallow.price > 0 ? `+₦${swallow.price.toLocaleString()}` : '₦0'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3. Protein Selection */}
              {fallbackSchema.proteins && (
                <section className="custom-section">
                  <div className="custom-section-header">
                    <div className="custom-section-title-wrap">
                      <span className="custom-step-number">
                        {fallbackSchema.portions && fallbackSchema.swallow ? '3' : fallbackSchema.portions || fallbackSchema.swallow ? '2' : '1'}
                      </span>
                      <h3 className="custom-section-title">{fallbackSchema.proteins.title}</h3>
                    </div>
                    <span className="custom-tag-multi">Multi-select & Piece Counter</span>
                  </div>
                  <p className="custom-section-subtitle">
                    {fallbackSchema.proteins.description || 'Tap to add your choice of meat, fish or poultry and adjust piece quantity'}
                  </p>

                  <div className="custom-proteins-grid">
                    {fallbackSchema.proteins.options.map((protein) => {
                      const selectedItem = selectedProteins[protein.id];
                      const isSelected = Boolean(selectedItem);
                      const qty = selectedItem?.quantity || 0;

                      return (
                        <div
                          key={protein.id}
                          className={`custom-protein-card ${isSelected ? 'active' : ''}`}
                          onClick={() => !isSelected && handleToggleProtein(protein)}
                        >
                          <div className="custom-protein-left">
                            <button
                              type="button"
                              className={`custom-checkbox-btn ${isSelected ? 'checked' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleProtein(protein);
                              }}
                              aria-label={`Toggle ${protein.name}`}
                            >
                              {isSelected && <Check size={13} strokeWidth={3} />}
                            </button>

                            <div className="custom-protein-meta">
                              <span className="custom-protein-name">{protein.name}</span>
                              {protein.tag && (
                                <span className="custom-protein-tag">{protein.tag}</span>
                              )}
                            </div>
                          </div>

                          <div className="custom-protein-right">
                            <span className="custom-protein-price">
                              {protein.price > 0 ? `+₦${protein.price.toLocaleString()}` : 'Free'}
                            </span>

                            {isSelected && (
                              <div className="custom-stepper-mini" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="custom-stepper-mini-btn"
                                  onClick={() => handleUpdateProteinQty(protein, -1)}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="custom-stepper-mini-val">{qty}</span>
                                <button
                                  type="button"
                                  className="custom-stepper-mini-btn"
                                  onClick={() => handleUpdateProteinQty(protein, 1)}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 4. Sides & Extras */}
              {fallbackSchema.sides && (
                <section className="custom-section">
                  <div className="custom-section-header">
                    <div className="custom-section-title-wrap">
                      <span className="custom-step-number">✨</span>
                      <h3 className="custom-section-title">{fallbackSchema.sides.title}</h3>
                    </div>
                    <span className="custom-tag-optional">Optional Extras</span>
                  </div>
                  <p className="custom-section-subtitle">
                    Complete your meal with traditional Nigerian sides
                  </p>

                  <div className="custom-sides-grid">
                    {fallbackSchema.sides.options.map((side) => {
                      const isChecked = Boolean(selectedSides[side.id]);
                      return (
                        <label
                          key={side.id}
                          className={`custom-side-card ${isChecked ? 'active' : ''}`}
                          onClick={() => handleToggleSide(side)}
                        >
                          <div className="custom-side-left">
                            <div className={`custom-checkbox-btn ${isChecked ? 'checked' : ''}`}>
                              {isChecked && <Check size={13} strokeWidth={3} />}
                            </div>
                            <div className="custom-side-meta">
                              <span className="custom-side-name">{side.name}</span>
                              {side.tag && <span className="custom-side-tag">{side.tag}</span>}
                            </div>
                          </div>
                          <span className="custom-side-price">
                            {side.price > 0 ? `+₦${side.price.toLocaleString()}` : 'Free'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}

          {/* 5. SPECIAL INSTRUCTIONS & NOTES */}
          <section className="custom-section">
            <div className="custom-section-header">
              <div className="custom-section-title-wrap">
                <MessageSquare size={18} style={{ color: 'var(--primary)', marginRight: '6px' }} />
                <h3 className="custom-section-title">Special Instructions</h3>
              </div>
              <span className="custom-tag-optional">Chef Note</span>
            </div>
            <p className="custom-section-subtitle">
              Any special requests, pepper preferences, separate packing or allergies?
            </p>

            {/* Quick Suggestion Chips */}
            <div className="custom-chips-row">
              {QUICK_INSTRUCTION_SUGGESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`custom-chip-btn ${specialInstructions.includes(chip) ? 'active' : ''}`}
                  onClick={() => handleAddSuggestion(chip)}
                >
                  <Plus size={12} style={{ marginRight: '4px' }} />
                  {chip}
                </button>
              ))}
            </div>

            <div className="custom-textarea-wrap">
              <textarea
                className="custom-textarea"
                rows={3}
                placeholder="Special instructions or notes (e.g., less pepper, pack in separate wrap, sauce on the side)..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                maxLength={300}
              />
              <span className="custom-char-count">{specialInstructions.length}/300</span>
            </div>
          </section>

          {/* LIVE SUMMARY BREAKDOWN DRAWER */}
          <div className="custom-summary-card">
            <div className="custom-summary-header">
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <span className="custom-summary-title">Configuration Breakdown</span>
            </div>

            <div className="custom-summary-list">
              <div className="custom-summary-row">
                <span>Base Dish ({foodItem.name})</span>
                <strong>₦{basePrice.toLocaleString()}</strong>
              </div>

              {/* Dynamic groups breakdown */}
              {customOptionGroups ? (
                <>
                  {customOptionGroups.map((group, gIdx) => {
                    const isSingle = group.selection_type !== 'multiple';
                    if (isSingle) {
                      const opt = selectedDynamicSingle[gIdx];
                      const addP = parseFloat(opt?.additional_price) || 0;
                      if (!opt) return null;
                      return (
                        <div key={gIdx} className="custom-summary-row">
                          <span>{group.title}: {opt.name}</span>
                          <strong>{addP > 0 ? `+₦${addP.toLocaleString()}` : 'Included'}</strong>
                        </div>
                      );
                    } else {
                      const multiMap = selectedDynamicMulti[gIdx] || {};
                      return Object.values(multiMap).map((item, mIdx) => (
                        <div key={`${gIdx}_${mIdx}`} className="custom-summary-row">
                          <span>{item.name} {item.quantity > 1 ? `(×${item.quantity})` : ''}</span>
                          <strong>+₦{(item.price * item.quantity).toLocaleString()}</strong>
                        </div>
                      ));
                    }
                  })}
                </>
              ) : (
                /* Fallback schema breakdown */
                <>
                  {selectedPortion && selectedPortion.price > 0 && (
                    <div className="custom-summary-row">
                      <span>Portion ({selectedPortion.name})</span>
                      <strong>+₦{selectedPortion.price.toLocaleString()}</strong>
                    </div>
                  )}

                  {selectedSwallow && selectedSwallow.id !== 'none' && selectedSwallow.price > 0 && (
                    <div className="custom-summary-row">
                      <span>Swallow ({selectedSwallow.name})</span>
                      <strong>+₦{selectedSwallow.price.toLocaleString()}</strong>
                    </div>
                  )}

                  {Object.values(selectedProteins).map(p => (
                    <div key={p.name} className="custom-summary-row">
                      <span>{p.name} {p.quantity > 1 ? `(×${p.quantity})` : ''}</span>
                      <strong>+₦{(p.price * p.quantity).toLocaleString()}</strong>
                    </div>
                  ))}

                  {Object.values(selectedSides).map(s => (
                    <div key={s.id} className="custom-summary-row">
                      <span>{s.name}</span>
                      <strong>+₦{(s.price || 0).toLocaleString()}</strong>
                    </div>
                  ))}
                </>
              )}

              <div className="custom-summary-divider" />

              <div className="custom-summary-row custom-summary-unit-total">
                <span>Customized Unit Price</span>
                <span className="custom-summary-highlight">₦{unitPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION FOOTER */}
        <div className="custom-modal-footer">
          {/* Quantity Stepper */}
          <div className="custom-footer-qty-stepper">
            <button
              type="button"
              className="custom-footer-qty-btn"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease item quantity"
            >
              <Minus size={16} />
            </button>
            <span className="custom-footer-qty-val" aria-label={`Quantity: ${quantity}`}>
              {quantity}
            </span>
            <button
              type="button"
              className="custom-footer-qty-btn"
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase item quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart Button with Live Dynamic Subtotal */}
          <button
            type="button"
            className="custom-modal-add-btn"
            onClick={handleAdd}
            id="modal-add-to-cart-btn"
          >
            <ShoppingBag size={20} />
            <span>Add to Cart • ₦{totalAmount.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
