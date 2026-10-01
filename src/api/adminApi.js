/**
 * UrbanEats Admin API Functions
 * All requests go through the existing apiClient (credentials: 'include' for PHP session).
 */
import apiClient from './apiClient';

const BASE = '/admin';

export async function fetchAdminStats() {
  const res = await apiClient.get(`${BASE}/stats.php`);
  return res.data;
}

export async function fetchAdminUsers(params = {}) {
  const q = new URLSearchParams();
  if (params.role)   q.set('role',   params.role);
  if (params.status) q.set('status', params.status);
  if (params.search) q.set('search', params.search);
  if (params.page)   q.set('page',   params.page);
  const res = await apiClient.get(`${BASE}/users.php?${q.toString()}`);
  return res;
}

export async function fetchAdminOrders(params = {}) {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.search) q.set('search', params.search);
  if (params.page)   q.set('page',   params.page);
  const res = await apiClient.get(`${BASE}/orders.php?${q.toString()}`);
  return res;
}

export async function fetchAdminRestaurants() {
  const res = await apiClient.get(`${BASE}/restaurants.php`);
  return res;
}

export async function approveVendor(userId, action) {
  const res = await apiClient.post(`${BASE}/approve_vendor.php`, { user_id: userId, action });
  return res;
}

export async function approveRider(userId, action) {
  const res = await apiClient.post(`${BASE}/approve_rider.php`, { user_id: userId, action });
  return res;
}

export async function performUserAction(userId, action) {
  const res = await apiClient.post(`${BASE}/user_action.php`, { user_id: userId, action });
  return res;
}

export async function fetchVendorDetails(params = {}) {
  const q = new URLSearchParams();
  if (params.vendor_id)     q.set('vendor_id',     params.vendor_id);
  if (params.restaurant_id) q.set('restaurant_id', params.restaurant_id);
  const res = await apiClient.get(`${BASE}/vendor_details.php?${q.toString()}`);
  return res;
}

export async function fetchOrderDetails(orderId) {
  const res = await apiClient.get(`${BASE}/order_details.php?order_id=${orderId}`);
  return res;
}

export async function assignRiderToOrder(orderId, riderId) {
  const res = await apiClient.post(`${BASE}/order_details.php`, { order_id: orderId, rider_id: riderId });
  return res;
}

export async function fetchDeliveriesMonitoring() {
  const res = await apiClient.get(`${BASE}/deliveries.php`);
  return res;
}

export async function fetchAdminAnalytics() {
  const res = await apiClient.get(`${BASE}/analytics.php`);
  return res;
}

export async function fetchAdminFinance() {
  const res = await apiClient.get(`${BASE}/finance.php`);
  return res;
}

export async function performRestaurantAction(restaurantId, isActive) {
  const res = await apiClient.post(`${BASE}/restaurant_action.php`, { restaurant_id: restaurantId, is_active: isActive ? 1 : 0 });
  return res;
}

