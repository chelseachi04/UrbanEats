/**
 * UrbanEats Orders API Functions
 *
 * All order operations are persisted to and verified by the PHP/MySQL backend.
 * Uses centralized apiClient (credentials: 'include' for session cookies).
 * Identifies the authenticated customer via PHP $_SESSION.
 */

import apiClient from './apiClient';

/**
 * Create a new pending order on the backend.
 * @param {Object} orderPayload — { delivery_address_id: number, items: Array<{ id: number, quantity: number }> }
 * @returns {Promise<Object>} Response object containing order_id, order_number, total_amount, tx_ref
 */
export async function createOrder(orderPayload) {
  return apiClient.post('/orders/create.php', orderPayload);
}

/**
 * Fetch order history for the currently authenticated customer.
 * @param {boolean} isArchived — If true, fetches soft-archived orders.
 * @returns {Promise<Array>} Array of order header objects
 */
export async function fetchUserOrders(isArchived = false) {
  try {
    const url = isArchived ? '/orders/index.php?archived=1' : '/orders/index.php';
    const response = await apiClient.get(url);
    return response.data || [];
  } catch (err) {
    if (err.status === 401) return [];
    throw err;
  }
}

/**
 * Soft-archive an order for the session user.
 * @param {number} orderId
 * @returns {Promise<Object>}
 */
export async function archiveOrder(orderId) {
  return apiClient.post('/orders/archive.php', { order_id: orderId });
}

/**
 * Restore a soft-archived order for the session user.
 * @param {number} orderId
 * @returns {Promise<Object>}
 */
export async function restoreOrder(orderId) {
  return apiClient.post('/orders/restore.php', { order_id: orderId });
}

/**
 * Fetch detailed record and item snapshots for a single order owned by the user.
 * @param {number|string} orderIdOrNumber
 * @returns {Promise<Object>} Order detail object with items array
 */
export async function fetchOrderDetail(orderIdOrNumber) {
  const isNum = typeof orderIdOrNumber === 'number' || /^\d+$/.test(orderIdOrNumber);
  const param = isNum ? `id=${orderIdOrNumber}` : `order_number=${encodeURIComponent(orderIdOrNumber)}`;
  const response = await apiClient.get(`/orders/detail.php?${param}`);
  return response.data;
}

/**
 * Verify payment for an order and update order status on the backend.
 * @param {Object} paymentData — { order_id: number, tx_ref: string, flw_ref?: string, status: string }
 * @returns {Promise<Object>} Response object with updated order status
 */
export async function verifyOrderPayment(paymentData) {
  return apiClient.post('/orders/verify_payment.php', paymentData);
}
