/**
 * UrbanEats CartContext — Phase 2C & Interactive Customization
 *
 * Architecture: Client-side only (React Context + localStorage).
 *
 * Cart Item shape:
 *   {
 *     id:                  number   — real MySQL food_item.id (for backend API compatibility)
 *     cartItemId:          string   — unique identifier for this customized order item
 *     itemId:              number   — real MySQL food_item.id
 *     itemName:            string
 *     name:                string
 *     restaurantId:        number   — real MySQL restaurant.id
 *     vendorId:            number   — alias for restaurantId
 *     restaurantName:      string
 *     vendorName:          string   — alias for restaurantName
 *     price:               number   — customized unitPrice (from MySQL + selected add-ons)
 *     unitPrice:           number   — customized single unit price
 *     basePrice:           number   — original food item base price
 *     quantity:            number
 *     portion:             string   — e.g. "2 Scoops"
 *     portionPrice:        number
 *     proteins:            Array<{ name: string, price: number, quantity: number }>
 *     swallow:             Object|null — { name: string, price: number }
 *     sides:               Array<string> — e.g. ["Fried Plantain (Dodo)"]
 *     sidesDetails:        Array<Object>
 *     specialInstructions: string|null
 *     slug:                string   — for local image lookup
 *     categoryName:        string
 *     image:               string
 *     image_url:           string
 *   }
 *
 * Restaurant policy: ONE restaurant per cart (standard food-delivery behaviour).
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { resolveCartItemImage } from '../utils/imageUtils';
import { getFoodItemImage } from '../data/imageAssets';

// ── Constants ────────────────────────────────────────────────────────────────
const CART_STORAGE_KEY = 'urbaneats_cart_v1';

// Helper to generate unique cart item ID
function generateCartItemId(itemId) {
  return `cart_${itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// Helper to check if two customized items are identical
function areCustomizationsEqual(a, b) {
  if (a.id !== b.id) return false;
  if ((a.portion || null) !== (b.portion || null)) return false;
  if (JSON.stringify(a.swallow || null) !== JSON.stringify(b.swallow || null)) return false;
  if ((a.specialInstructions || null) !== (b.specialInstructions || null)) return false;
  
  const proteinsA = JSON.stringify(a.proteins || []);
  const proteinsB = JSON.stringify(b.proteins || []);
  if (proteinsA !== proteinsB) return false;

  const sidesA = JSON.stringify((a.sides || []).slice().sort());
  const sidesB = JSON.stringify((b.sides || []).slice().sort());
  if (sidesA !== sidesB) return false;

  return true;
}

// ── Initial cart state loader (synchronous, runs ONCE before first render) ────
function loadInitialCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          const resolvedImg =
            item.image ||
            item.image_url ||
            item.imageUrl ||
            item.img_src ||
            item.photo ||
            item.thumbnail ||
            resolveCartItemImage(item) ||
            getFoodItemImage(item.slug || item.name, item.id) ||
            '';
          return {
            ...item,
            cartItemId: item.cartItemId || `cart_${item.id}_${Math.random().toString(36).substr(2, 6)}`,
            price: parseFloat(item.unitPrice || item.price) || 0,
            unitPrice: parseFloat(item.unitPrice || item.price) || 0,
            image: resolvedImg,
            image_url: resolvedImg,
          };
        });
      }
    }
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return [];
}

// ── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const newItem = action.payload;
      const addQty = newItem.quantity || 1;

      // Check if item with identical customization signature already exists
      const existingIndex = state.findIndex(i => areCustomizationsEqual(i, newItem));
      if (existingIndex > -1) {
        return state.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      }

      return [...state, { ...newItem, quantity: addQty }];
    }

    case 'INCREASE_QTY':
      return state.map(i =>
        (i.cartItemId === action.payload || i.id === action.payload)
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );

    case 'DECREASE_QTY':
      return state
        .map(i =>
          (i.cartItemId === action.payload || i.id === action.payload)
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0);

    case 'REMOVE_ITEM':
      return state.filter(i =>
        i.cartItemId !== action.payload && i.id !== action.payload
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadInitialCart);

  // ── Persist to localStorage on every change ─────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable — silently continue
    }
  }, [items]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce((sum, i) => {
    const unitPrice = parseFloat(i.unitPrice || i.price) || 0;
    return sum + (unitPrice * i.quantity);
  }, 0);

  const cartRestaurantId   = items.length > 0 ? items[0].restaurantId   : null;
  const cartRestaurantName = items.length > 0 ? items[0].restaurantName : null;

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Add a customized food item to the cart.
   *
   * @param {Object} foodItem — the raw API food item object
   * @param {Object} restaurant — the raw API restaurant object
   * @param {Object} [customizations] — granular customizations object
   * @returns {boolean|'conflict'} true if added, 'conflict' if different restaurant
   */
  const addToCart = useCallback((foodItem, restaurant, customizations = null) => {
    if (!foodItem?.id || !restaurant?.id) return false;

    // Check single-restaurant constraint
    if (cartRestaurantId !== null && cartRestaurantId !== restaurant.id) {
      return 'conflict';
    }

    const resolvedImage =
      foodItem.image ||
      foodItem.image_url ||
      foodItem.imageUrl ||
      foodItem.img_src ||
      foodItem.photo ||
      foodItem.thumbnail ||
      foodItem.food_image ||
      foodItem.food_image_url ||
      resolveCartItemImage(foodItem) ||
      getFoodItemImage(foodItem.slug || foodItem.food_slug || foodItem.name, foodItem.id) ||
      '';

    const basePrice = parseFloat(foodItem.price) || 0;
    const unitPrice = customizations?.unitPrice != null
      ? parseFloat(customizations.unitPrice)
      : basePrice;
    const addQuantity = customizations?.quantity || 1;

    const payload = {
      id:                  foodItem.id,
      cartItemId:          generateCartItemId(foodItem.id),
      itemId:              foodItem.id,
      itemName:            foodItem.name,
      name:                foodItem.name,
      restaurantId:        restaurant.id,
      vendorId:            restaurant.id,
      restaurantName:      restaurant.name,
      vendorName:          restaurant.name,
      price:               unitPrice,
      unitPrice:           unitPrice,
      basePrice:           basePrice,
      quantity:            addQuantity,
      portion:             customizations?.portion || null,
      portionPrice:        customizations?.portionPrice || 0,
      proteins:            customizations?.proteins || [],
      swallow:             customizations?.swallow || null,
      sides:               customizations?.sides || [],
      sidesDetails:        customizations?.sidesDetails || [],
      specialInstructions: customizations?.specialInstructions || null,
      slug:                foodItem.slug || foodItem.food_slug || '',
      categoryName:        foodItem.category_name || foodItem.categoryName || '',
      image:               resolvedImage,
      image_url:           resolvedImage,
    };

    dispatch({
      type: 'ADD_ITEM',
      payload,
    });
    return true;
  }, [cartRestaurantId]);

  /**
   * Replace the entire cart with a single new item (used after conflict confirmation).
   */
  const replaceCartAndAdd = useCallback((foodItem, restaurant, customizations = null) => {
    if (!foodItem?.id || !restaurant?.id) return;

    const resolvedImage =
      foodItem.image ||
      foodItem.image_url ||
      foodItem.imageUrl ||
      foodItem.img_src ||
      foodItem.photo ||
      foodItem.thumbnail ||
      foodItem.food_image ||
      foodItem.food_image_url ||
      resolveCartItemImage(foodItem) ||
      getFoodItemImage(foodItem.slug || foodItem.food_slug || foodItem.name, foodItem.id) ||
      '';

    const basePrice = parseFloat(foodItem.price) || 0;
    const unitPrice = customizations?.unitPrice != null
      ? parseFloat(customizations.unitPrice)
      : basePrice;
    const addQuantity = customizations?.quantity || 1;

    const payload = {
      id:                  foodItem.id,
      cartItemId:          generateCartItemId(foodItem.id),
      itemId:              foodItem.id,
      itemName:            foodItem.name,
      name:                foodItem.name,
      restaurantId:        restaurant.id,
      vendorId:            restaurant.id,
      restaurantName:      restaurant.name,
      vendorName:          restaurant.name,
      price:               unitPrice,
      unitPrice:           unitPrice,
      basePrice:           basePrice,
      quantity:            addQuantity,
      portion:             customizations?.portion || null,
      portionPrice:        customizations?.portionPrice || 0,
      proteins:            customizations?.proteins || [],
      swallow:             customizations?.swallow || null,
      sides:               customizations?.sides || [],
      sidesDetails:        customizations?.sidesDetails || [],
      specialInstructions: customizations?.specialInstructions || null,
      slug:                foodItem.slug || foodItem.food_slug || '',
      categoryName:        foodItem.category_name || foodItem.categoryName || '',
      image:               resolvedImage,
      image_url:           resolvedImage,
    };

    dispatch({ type: 'CLEAR_CART' });
    dispatch({
      type: 'ADD_ITEM',
      payload,
    });
  }, []);

  const increaseQty = useCallback((idOrKey) => dispatch({ type: 'INCREASE_QTY', payload: idOrKey }), []);
  const decreaseQty = useCallback((idOrKey) => dispatch({ type: 'DECREASE_QTY', payload: idOrKey }), []);
  const removeItem  = useCallback((idOrKey) => dispatch({ type: 'REMOVE_ITEM',  payload: idOrKey }), []);
  const clearCart   = useCallback(()          => dispatch({ type: 'CLEAR_CART' }), []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        cartRestaurantId,
        cartRestaurantName,
        addToCart,
        replaceCartAndAdd,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
