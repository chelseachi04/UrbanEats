/**
 * UrbanEats Addresses API Functions
 *
 * All address data is fetched from and persisted to the PHP/MySQL backend.
 * Uses centralized apiClient (credentials: 'include' for session cookies).
 * The backend identifies the authenticated user via PHP $_SESSION — never trusts
 * a frontend-supplied user_id.
 *
 * Endpoints:
 *   GET    /addresses/index.php   → fetch all addresses for current session user
 *   POST   /addresses/index.php   → create a new delivery address
 *   POST   /addresses/update.php  → update an existing address
 *   DELETE /addresses/delete.php  → delete an address
 */

import apiClient from './apiClient';

/**
 * Fetch all saved delivery addresses for the currently authenticated user.
 * @returns {Promise<Array>} Array of address objects
 */
export async function fetchAddresses() {
  try {
    const response = await apiClient.get('/addresses/index.php');
    return response.data || [];
  } catch (err) {
    if (err.status === 401) return []; // Unauthenticated — return empty
    throw err;
  }
}

/**
 * Create a new saved delivery address.
 * @param {Object} addressData — { label, recipient_name, phone, address, area, city, state, is_default }
 * @returns {Promise<Object>} Response object containing status and created address data
 */
export async function createAddress(addressData) {
  return apiClient.post('/addresses/index.php', addressData);
}

/**
 * Update an existing delivery address.
 * @param {number} id — address ID
 * @param {Object} addressData — updated address fields
 * @returns {Promise<Object>} Response object containing updated address data
 */
export async function updateAddress(id, addressData) {
  return apiClient.post('/addresses/update.php', { id, ...addressData });
}

/**
 * Delete a saved delivery address.
 * @param {number} id — address ID to delete
 * @returns {Promise<Object>} Response object
 */
export async function deleteAddress(id) {
  return apiClient.request('/addresses/delete.php', {
    method: 'DELETE',
    body: { id },
  });
}
