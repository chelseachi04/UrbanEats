/**
 * UrbanEats Restaurant & Menu API Functions
 *
 * All restaurant and menu CONTENT is fetched from the PHP/MySQL backend.
 * Uses the existing centralized apiClient (credentials: 'include' for session cookies).
 *
 * Endpoints:
 *   GET /restaurants/index.php                       → all active restaurants
 *   GET /restaurants/show.php?id={id}               → single restaurant by ID
 *   GET /food-items/index.php?restaurant_id={id}    → menu items for a restaurant
 */

import apiClient from './apiClient';

/**
 * Fetch all active restaurants from the MySQL database.
 * @returns {Promise<Array>} Array of restaurant objects
 */
export async function fetchRestaurants() {
  const response = await apiClient.get('/restaurants/index.php');
  return response.data || [];
}

/**
 * Fetch a single restaurant by its numeric database ID.
 * @param {number|string} id - restaurant primary key
 * @returns {Promise<Object>} restaurant object
 * @throws Error with status 404 if not found
 */
export async function fetchRestaurantById(id) {
  const response = await apiClient.get(`/restaurants/show.php?id=${id}`);
  return response.data;
}

/**
 * Fetch all available food items for a specific restaurant.
 * Includes category_name and category_slug from a LEFT JOIN.
 * @param {number|string} restaurantId - restaurant primary key
 * @returns {Promise<Array>} array of food item objects
 */
export async function fetchFoodItemsByRestaurant(restaurantId) {
  const response = await apiClient.get(`/food-items/index.php?restaurant_id=${restaurantId}`);
  return response.data || [];
}

/**
 * Fetch all available food items across all active restaurants.
 * @returns {Promise<Array>} array of food item objects
 */
export async function fetchAllFoodItems() {
  const response = await apiClient.get('/food-items/index.php');
  return response.data || [];
}


