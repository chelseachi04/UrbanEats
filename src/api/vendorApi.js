/**
 * vendorApi.js — UrbanEats Vendor Portal API Client
 *
 * Centralized API calls for vendor dashboard, orders, menu items, restaurant details,
 * and image uploads (single-step multipart/form-data endpoints).
 */

import apiClient, { parseCleanJson } from './apiClient';

const rawImageBase = import.meta.env.VITE_API_IMAGE_BASE_URL || '/urbaneats-api';
const isLocalDev = typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173';
const API_BASE = (isLocalDev && rawImageBase.startsWith('/')) ? `http://localhost${rawImageBase}` : rawImageBase;



// ─── Restaurant ────────────────────────────────────────────────────────────────

export async function fetchVendorRestaurant() {
  const data = await apiClient.get('/vendor/restaurant.php');
  return data.data;
}

export async function updateVendorRestaurant(restaurantData) {
  const data = await apiClient.post('/vendor/restaurant.php', restaurantData);
  return data.data;
}

/**
 * Lightweight status-only toggle — sends PATCH with { status: 'open'|'closed' }.
 * Bypasses the full restaurant POST validation (which requires a valid name).
 */
export async function updateVendorStoreStatus(status) {
  const data = await apiClient.patch('/vendor/restaurant.php', { status });
  return data.data;
}


export async function uploadRestaurantImage(file, type = 'logo') {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);

  const response = await fetch(`${API_BASE}/api/vendor/upload_restaurant_image.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const rawText = await response.text();
  const data = parseCleanJson(rawText);
  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message || 'Failed to upload restaurant image.');
  }
  return data;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export async function fetchVendorDashboard() {
  const data = await apiClient.get('/vendor/dashboard.php');
  return data.data;
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export async function fetchVendorOrders(status = 'ALL') {
  const data = await apiClient.get(`/vendor/orders.php?status=${status}`);
  return data.data || [];
}

export async function fetchVendorOrderDetail(orderIdOrNumber) {
  const isNum = isNaN(orderIdOrNumber);
  const param = isNum ? `order_number=${orderIdOrNumber}` : `id=${orderIdOrNumber}`;
  const data = await apiClient.get(`/vendor/order_detail.php?${param}`);
  return data.data;
}

export async function updateOrderStatus(orderId, orderStatus) {
  const data = await apiClient.post('/vendor/update_order_status.php', {
    order_id: orderId,
    order_status: orderStatus,
  });
  return data;
}

// ─── Menu / Food Items ─────────────────────────────────────────────────────────

export async function fetchVendorMenu() {
  const data = await apiClient.get('/vendor/menu.php');
  return data.data || [];
}

/**
 * Create a new food item with optional image.
 * Uses single-step multipart/form-data endpoint.
 *
 * @param {Object} foodData  - { name, price, description, category_id, is_available }
 * @param {File|null} imageFile - optional image file
 * @returns {Object} - full API response including data.id and data.image_url
 */
export async function createFoodItem(foodData, imageFile = null) {
  const formData = new FormData();
  formData.append('name', foodData.name || '');
  formData.append('price', foodData.price ?? '');
  formData.append('description', foodData.description || '');
  formData.append('category_id', foodData.category_id ?? 1);
  if (foodData.category_name) {
    formData.append('category_name', foodData.category_name);
  }
  formData.append('is_available', foodData.is_available ?? 1);
  if (foodData.option_groups !== undefined) {
    formData.append('option_groups', typeof foodData.option_groups === 'string' ? foodData.option_groups : JSON.stringify(foodData.option_groups));
  }

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE}/api/vendor/create_food_item.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const rawText = await response.text();
  const data = parseCleanJson(rawText);
  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message || 'Failed to create food item.');
  }
  return data; // data.data.id, data.data.image_url
}

/**
 * Update an existing food item with optional new image.
 * Uses single-step multipart/form-data endpoint.
 *
 * @param {Object} foodData  - { id, name, price, description, category_id, is_available, option_groups }
 * @param {File|null} imageFile - optional replacement image file
 * @returns {Object} - full API response
 */
export async function updateFoodItem(foodData, imageFile = null) {
  const formData = new FormData();
  formData.append('id', foodData.id);

  if (foodData.name !== undefined)          formData.append('name', foodData.name);
  if (foodData.price !== undefined)         formData.append('price', foodData.price);
  if (foodData.description !== undefined)   formData.append('description', foodData.description);
  if (foodData.category_id !== undefined)   formData.append('category_id', foodData.category_id);
  if (foodData.category_name !== undefined) formData.append('category_name', foodData.category_name);
  if (foodData.is_available !== undefined)   formData.append('is_available', foodData.is_available);
  if (foodData.option_groups !== undefined) {
    formData.append('option_groups', typeof foodData.option_groups === 'string' ? foodData.option_groups : JSON.stringify(foodData.option_groups));
  }

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE}/api/vendor/update_food_item.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const rawText = await response.text();
  const data = parseCleanJson(rawText);
  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message || 'Failed to update food item.');
  }
  return data;
}

/**
 * Toggle food availability only (lightweight PUT via JSON).
 */
export async function toggleFoodAvailability(foodId, isAvailable) {
  const data = await apiClient.put('/vendor/menu.php', {
    id: foodId,
    is_available: isAvailable ? 1 : 0,
  });
  return data;
}

/**
 * Delete (soft-remove) a food item by ID.
 * The backend marks it as unavailable; removes it from the vendor's active menu.
 *
 * @param {number} foodId - The food item ID to delete
 * @returns {Object} API response
 */
export async function deleteFoodItem(foodId) {
  const data = await apiClient.delete(`/vendor/menu.php?id=${foodId}`);
  return data;
}
