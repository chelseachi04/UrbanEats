/**
 * showcaseService.js — Admin-Curated Featured Showcase System
 *
 * Decouples vendor creation from the public homepage.
 * Only restaurants and dishes explicitly flagged as is_featured = true by Admin
 * appear in "Explore Featured Restaurants" and "Popular Dishes Preview".
 */

import { fetchRestaurants, fetchFoodItemsByRestaurant } from '../api/restaurantApi';
import { fetchAdminRestaurants, fetchVendorDetails } from '../api/adminApi';
import apiClient from '../api/apiClient';

const STORAGE_KEYS = {
  FEATURED_RESTAURANTS: 'urbaneats_curated_featured_restaurants_v1',
  FEATURED_PRODUCTS:    'urbaneats_curated_featured_products_v1',
  SHOWCASE_CONFIG:      'urbaneats_curated_showcase_config_v1',
};

// Default initial curated showcase config
const DEFAULT_CONFIG = {
  maxFeaturedDishes: 9,
  maxFeaturedRestaurants: 6,
};

// Seeded initial curated restaurants (by ID or slug)
const INITIAL_FEATURED_RESTAURANTS = {
  1: { is_featured: true, featured_order: 1, custom_image: null },
  2: { is_featured: true, featured_order: 2, custom_image: null },
  3: { is_featured: true, featured_order: 3, custom_image: null },
};

// Seeded initial curated dishes (by food item ID)
const INITIAL_FEATURED_PRODUCTS = {
  1:  { is_featured: true, featured_order: 1, custom_image: null },
  2:  { is_featured: true, featured_order: 2, custom_image: null },
  3:  { is_featured: true, featured_order: 3, custom_image: null },
  7:  { is_featured: true, featured_order: 4, custom_image: null },
  8:  { is_featured: true, featured_order: 5, custom_image: null },
  9:  { is_featured: true, featured_order: 6, custom_image: null },
  13: { is_featured: true, featured_order: 7, custom_image: null },
  14: { is_featured: true, featured_order: 8, custom_image: null },
  15: { is_featured: true, featured_order: 9, custom_image: null },
};

/**
 * Get stored showcase configuration
 */
export function getShowcaseConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHOWCASE_CONFIG);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

/**
 * Update showcase configuration (e.g., max dishes count)
 */
export function saveShowcaseConfig(newConfig) {
  try {
    const current = getShowcaseConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(STORAGE_KEYS.SHOWCASE_CONFIG, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save showcase config:', err);
    return DEFAULT_CONFIG;
  }
}

/**
 * Get the map of featured restaurant overrides: { [id]: { is_featured, custom_image, featured_order } }
 */
export function getFeaturedRestaurantsMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEATURED_RESTAURANTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEATURED_RESTAURANTS, JSON.stringify(INITIAL_FEATURED_RESTAURANTS));
      return INITIAL_FEATURED_RESTAURANTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FEATURED_RESTAURANTS;
  }
}

/**
 * Save the map of featured restaurant overrides
 */
export function saveFeaturedRestaurantsMap(map) {
  try {
    localStorage.setItem(STORAGE_KEYS.FEATURED_RESTAURANTS, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save featured restaurants map:', err);
  }
}

/**
 * Get the map of featured product overrides: { [id]: { is_featured, custom_image, featured_order } }
 */
export function getFeaturedProductsMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEATURED_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEATURED_PRODUCTS, JSON.stringify(INITIAL_FEATURED_PRODUCTS));
      return INITIAL_FEATURED_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FEATURED_PRODUCTS;
  }
}

/**
 * Save the map of featured product overrides
 */
export function saveFeaturedProductsMap(map) {
  try {
    localStorage.setItem(STORAGE_KEYS.FEATURED_PRODUCTS, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save featured products map:', err);
  }
}

/**
 * Toggle or update restaurant featured status and optional image override
 */
export async function updateRestaurantFeatured(restaurantId, updateData) {
  const map = getFeaturedRestaurantsMap();
  const current = map[restaurantId] || { is_featured: false, custom_image: null, featured_order: 99 };
  map[restaurantId] = {
    ...current,
    ...updateData,
  };
  saveFeaturedRestaurantsMap(map);

  // Attempt backend sync if available
  try {
    await apiClient.post('/admin/featured_toggle.php', {
      type: 'restaurant',
      id: restaurantId,
      ...updateData,
    }).catch(() => {});
  } catch {
    // Graceful fallback to local persistence
  }

  return map[restaurantId];
}

/**
 * Toggle or update product (dish) featured status and optional image override
 */
export async function updateProductFeatured(productId, updateData) {
  const map = getFeaturedProductsMap();
  const current = map[productId] || { is_featured: false, custom_image: null, featured_order: 99 };
  map[productId] = {
    ...current,
    ...updateData,
  };
  saveFeaturedProductsMap(map);

  // Attempt backend sync if available
  try {
    await apiClient.post('/admin/featured_toggle.php', {
      type: 'product',
      id: productId,
      ...updateData,
    }).catch(() => {});
  } catch {
    // Graceful fallback to local persistence
  }

  return map[productId];
}

/**
 * Fetch ONLY admin-curated featured restaurants for Homepage showcase.
 */
export async function fetchCuratedFeaturedRestaurants() {
  const allRestaurants = await fetchRestaurants();
  const featuredMap = getFeaturedRestaurantsMap();
  const config = getShowcaseConfig();

  const curated = allRestaurants
    .map(r => {
      const featInfo = featuredMap[r.id] || (r.is_featured ? { is_featured: true } : { is_featured: false });
      const isFeat = featInfo.is_featured === true || featInfo.is_featured === 1;
      return {
        ...r,
        is_featured: isFeat,
        custom_cover_image: featInfo.custom_image || null,
        featured_order: featInfo.featured_order || 99,
      };
    })
    .filter(r => r.is_featured === true)
    .sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99));

  return curated.slice(0, config.maxFeaturedRestaurants || 6);
}

/**
 * Fetch ONLY admin-curated featured dishes for Homepage Popular Dishes Preview.
 * Capped strictly at maxFeaturedDishes (default 9).
 */
export async function fetchCuratedFeaturedDishes() {
  const restaurants = await fetchRestaurants();
  const featuredProductMap = getFeaturedProductsMap();
  const config = getShowcaseConfig();

  // Fetch all items from active restaurants
  const dishPromises = restaurants.map(async (r) => {
    try {
      const items = await fetchFoodItemsByRestaurant(r.id);
      return items.map((item) => {
        const featInfo = featuredProductMap[item.id] || (item.is_featured ? { is_featured: true } : { is_featured: false });
        const isFeat = featInfo.is_featured === true || featInfo.is_featured === 1;
        return {
          ...item,
          restaurantName: r.name,
          restaurantId: r.id,
          restaurantObj: r,
          is_featured: isFeat,
          custom_display_image: featInfo.custom_image || null,
          featured_order: featInfo.featured_order || 99,
        };
      });
    } catch {
      return [];
    }
  });

  const allDishes = (await Promise.all(dishPromises)).flat();

  // Filter strictly by is_featured === true
  const curatedFeatured = allDishes
    .filter(item => item.is_featured === true)
    .sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99));

  // Cap strictly at configured limit (default 9)
  return curatedFeatured.slice(0, config.maxFeaturedDishes || 9);
}

/**
 * Fetch full catalog of all restaurants and dishes for the Admin Showcase Manager
 */
export async function fetchFullCatalogForAdmin() {
  let restaurants = [];
  try {
    const res = await fetchAdminRestaurants();
    restaurants = res.data || [];
  } catch {
    restaurants = await fetchRestaurants();
  }

  const featuredRestMap = getFeaturedRestaurantsMap();
  const featuredProdMap = getFeaturedProductsMap();

  // Attach featured status to restaurants
  const enrichedRestaurants = restaurants.map(r => {
    const featInfo = featuredRestMap[r.id] || { is_featured: false, custom_image: null, featured_order: 99 };
    return {
      ...r,
      is_featured: featInfo.is_featured === true || featInfo.is_featured === 1,
      custom_cover_image: featInfo.custom_image || null,
      featured_order: featInfo.featured_order || 99,
    };
  });

  // Fetch dishes across all restaurants
  const dishPromises = restaurants.map(async (r) => {
    try {
      const details = await fetchVendorDetails({ restaurant_id: r.id }).catch(() => null);
      let items = details?.data?.menu_items || details?.data?.food_items;
      if (!items || !items.length) {
        items = await fetchFoodItemsByRestaurant(r.id).catch(() => []);
      }
      return (items || []).map(item => {
        const featInfo = featuredProdMap[item.id] || { is_featured: false, custom_image: null, featured_order: 99 };
        return {
          ...item,
          restaurantName: r.name,
          restaurantId: r.id,
          restaurantCover: r.cover_image,
          is_featured: featInfo.is_featured === true || featInfo.is_featured === 1,
          custom_display_image: featInfo.custom_image || null,
          featured_order: featInfo.featured_order || 99,
        };
      });
    } catch {
      return [];
    }
  });

  const enrichedDishes = (await Promise.all(dishPromises)).flat();

  return {
    restaurants: enrichedRestaurants,
    dishes: enrichedDishes,
    config: getShowcaseConfig(),
  };
}
