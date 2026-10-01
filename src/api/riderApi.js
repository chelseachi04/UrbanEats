/**
 * riderApi.js — UrbanEats Rider Portal API Client
 *
 * Centralized API calls for rider dashboard, available deliveries, active delivery,
 * status updates, online toggling, history, and profile.
 */

import apiClient from './apiClient';

/**
 * Fetch rider dashboard overview stats & active delivery summary
 */
export async function fetchRiderDashboard() {
  const data = await apiClient.get('/rider/dashboard.php');
  return data.data;
}

/**
 * Fetch list of available deliveries ready for pickup
 */
export async function fetchAvailableDeliveries() {
  const data = await apiClient.get('/rider/deliveries.php');
  return data.data || [];
}

/**
 * Accept an available delivery
 */
export async function acceptDelivery(orderId) {
  const data = await apiClient.post('/rider/accept.php', { order_id: orderId });
  return data;
}

/**
 * Fetch current active delivery details for rider
 */
export async function fetchActiveDelivery() {
  const data = await apiClient.get('/rider/active.php');
  return data.data;
}

/**
 * Update delivery status (PICKED_UP | OUT_FOR_DELIVERY | DELIVERED)
 */
export async function updateDeliveryStatus(orderId, status) {
  const data = await apiClient.post('/rider/update_status.php', {
    order_id: orderId,
    status: status,
  });
  return data;
}

/**
 * Toggle rider ONLINE / OFFLINE status
 */
export async function toggleRiderOnline(isOnline) {
  const data = await apiClient.post('/rider/toggle_online.php', {
    is_online: isOnline ? 1 : 0,
  });
  return data;
}

/**
 * Fetch completed delivery history
 */
export async function fetchRiderHistory() {
  const data = await apiClient.get('/rider/history.php');
  return data.data || [];
}

/**
 * Fetch rider profile
 */
export async function fetchRiderProfile() {
  const data = await apiClient.get('/rider/profile.php');
  return data.data;
}

/**
 * Update rider profile
 */
export async function updateRiderProfile(profileData) {
  const data = await apiClient.post('/rider/profile.php', profileData);
  return data.data;
}
