/**
 * imageUtils.js — UrbanEats Centralized Image URL Helper
 *
 * Single source of truth for resolving backend image URLs.
 * All food image, restaurant logo, and cover URLs go through here.
 */

const rawImageBase = import.meta.env.VITE_API_IMAGE_BASE_URL || '/urbaneats-api';
const isLocalDev = typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173';
const API_BASE = (isLocalDev && rawImageBase.startsWith('/')) ? `http://localhost${rawImageBase}` : rawImageBase;



import { getFoodItemImage } from '../data/imageAssets';

/**
 * Resolve a backend relative image path to a full accessible URL.
 * If already a full URL, returns as-is.
 * If null/empty, returns null.
 *
 * @param {string|null} imageUrl - Raw value from API (e.g. "/uploads/food/food_12_abc.jpg")
 * @returns {string|null}
 */
export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (typeof imageUrl !== 'string') return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  // Vite static assets
  if (trimmed.startsWith('/assets/') || trimmed.startsWith('/@fs/')) {
    return trimmed;
  }
  if (trimmed.startsWith('src/') || trimmed.startsWith('/src/')) {
    return trimmed.startsWith('/') ? trimmed : '/' + trimmed;
  }
  // Ensure leading slash
  const path = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
  return `${API_BASE}${path}`;
}

/**
 * Standardized image resolver for cart and food items across all vendors.
 */
export function resolveCartItemImage(item) {
  if (!item) return '';
  const rawCandidate =
    item.image ||
    item.image_url ||
    item.imageUrl ||
    item.img_src ||
    item.photo ||
    item.thumbnail ||
    item.food_image ||
    item.food_image_url ||
    '';

  if (typeof rawCandidate === 'string' && rawCandidate.trim()) {
    const resolved = resolveImageUrl(rawCandidate);
    if (resolved) return resolved;
  }

  const localAsset = getFoodItemImage(item.slug || item.food_slug || item.name, item.id || item.food_item_id);
  if (localAsset) {
    return resolveImageUrl(localAsset) || localAsset;
  }

  return rawCandidate || '';
}

/**
 * Get the best available image URL for a food item.
 * Priority: image_url (uploaded) → image (legacy static string) → null
 *
 * @param {Object} item - food item object from API
 * @returns {string|null}
 */
export function getFoodImageUrl(item) {
  if (!item) return null;
  if (item.image_url) return resolveImageUrl(item.image_url);
  if (item.image) return resolveImageUrl(item.image) || item.image;
  return null;
}

/**
 * Get the best available image URL for a restaurant.
 * Priority: cover_url (uploaded) → cover_image (legacy) → null
 *
 * @param {Object} restaurant - restaurant object from API
 * @returns {string|null}
 */
export function getRestaurantCoverUrl(restaurant) {
  if (!restaurant) return null;
  if (restaurant.cover_url) return resolveImageUrl(restaurant.cover_url);
  if (restaurant.cover_image) return restaurant.cover_image;
  return null;
}

/**
 * Get the best available logo URL for a restaurant.
 * Priority: logo_url (uploaded) → logo_image (legacy) → null
 *
 * @param {Object} restaurant - restaurant object from API
 * @returns {string|null}
 */
export function getRestaurantLogoUrl(restaurant) {
  if (!restaurant) return null;
  if (restaurant.logo_url) return resolveImageUrl(restaurant.logo_url);
  if (restaurant.logo_image) return restaurant.logo_image;
  return null;
}
