/**
 * UrbanEats Favorites API Functions
 *
 * All favorites data is fetched from and persisted to the PHP/MySQL backend.
 * Uses the existing centralized apiClient (credentials: 'include' for session cookies).
 * The backend identifies the authenticated user via PHP $_SESSION — never trusts
 * a frontend-supplied user_id.
 *
 * Endpoints:
 *   GET    /favorites/index.php      → fetch all favorites for the current session user
 *   POST   /favorites/add.php        → add a food item to favorites
 *   DELETE /favorites/remove.php     → remove a food item from favorites
 */

import apiClient from './apiClient';

/**
 * Fetch all favorited food items for the currently authenticated user.
 * Returns an empty array if the user is not authenticated (401) or has no favorites.
 * @returns {Promise<Array>} Array of favorite objects (each with food_item_id, food_name, etc.)
 */
export async function fetchFavorites() {
  try {
    const response = await apiClient.get('/favorites/index.php');
    return response.data || [];
  } catch (err) {
    if (err.status === 401) return []; // Unauthenticated — return empty, not an error
    throw err;
  }
}

/**
 * Add a food item to the current user's favorites.
 * @param {number} foodItemId - The food_items.id to favorite
 * @returns {Promise<Object>} Response object with status and inserted flag
 */
export async function addFavorite(foodItemId) {
  return apiClient.post('/favorites/add.php', { food_item_id: foodItemId });
}

/**
 * Remove a food item from the current user's favorites.
 * @param {number} foodItemId - The food_items.id to un-favorite
 * @returns {Promise<Object>} Response object with status and deleted flag
 */
export async function removeFavorite(foodItemId) {
  return apiClient.request('/favorites/remove.php', {
    method: 'DELETE',
    body: { food_item_id: foodItemId },
  });
}
