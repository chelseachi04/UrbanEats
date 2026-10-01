/**
 * useFavorites — UrbanEats User-Specific Favorites Hook
 *
 * This hook is the single source of truth for the authenticated user's favorites.
 * All pages that show heart/favorite buttons MUST use this hook.
 *
 * Features:
 *   - Fetches favorites from PHP/MySQL backend on mount (when user is authenticated)
 *   - Provides isFavorite(foodItemId) check
 *   - Provides toggleFavorite(foodItemId) for adding/removing
 *   - Auth guard: unauthenticated clicks open the login modal
 *   - Refetches favorites on user login/logout (user dependency)
 *   - Favorites survive page refresh (persisted in MySQL via PHP session)
 *   - User-specific: Each user only sees their own favorites
 *
 * Usage:
 *   const { isFavorite, toggleFavorite, favorites, favLoading } = useFavorites();
 *
 *   <button onClick={(e) => toggleFavorite(e, dish.id, dish.name)}>
 *     <Heart fill={isFavorite(dish.id) ? 'currentColor' : 'none'} />
 *   </button>
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchFavorites, addFavorite, removeFavorite } from '../api/favoritesApi';

export function useFavorites() {
  const { user, openLogin } = useAuth();

  // Set of food_item_id integers that the current user has favorited
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  // Full favorite objects (used for the Favorites & Wishlist display page)
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState(null);

  // Fetch user's favorites from the backend whenever the authenticated user changes
  const loadFavorites = useCallback(async () => {
    if (!user) {
      // User logged out — clear favorites immediately
      setFavoritedIds(new Set());
      setFavorites([]);
      setFavError(null);
      return;
    }

    setFavLoading(true);
    setFavError(null);
    try {
      const items = await fetchFavorites();
      setFavorites(items);
      setFavoritedIds(new Set(items.map((f) => f.food_item_id)));
    } catch (err) {
      setFavError('Unable to load favorites.');
      setFavorites([]);
      setFavoritedIds(new Set());
    } finally {
      setFavLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  /**
   * Check whether a food item is in the current user's favorites.
   * @param {number} foodItemId
   * @returns {boolean}
   */
  const isFavorite = useCallback(
    (foodItemId) => favoritedIds.has(Number(foodItemId)),
    [favoritedIds]
  );

  /**
   * Toggle a food item's favorite state.
   * - If not authenticated: opens the login modal.
   * - If authenticated: calls the backend to add or remove, then updates local state.
   *
   * @param {Event} e - Click event (stopPropagation called internally)
   * @param {number} foodItemId - The food_items.id to toggle
   * @param {string} foodName - Display name for the toast message
   * @returns {Promise<{action: 'added'|'removed'|'auth_required'}>}
   */
  const toggleFavorite = useCallback(
    async (e, foodItemId, foodName) => {
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }

      // Auth guard — unauthenticated users see login modal
      if (!user) {
        openLogin('customer');
        return { action: 'auth_required' };
      }

      const id = Number(foodItemId);
      const alreadyFavorited = favoritedIds.has(id);

      try {
        if (alreadyFavorited) {
          // Optimistically update UI first, then call backend
          setFavoritedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          setFavorites((prev) => prev.filter((f) => f.food_item_id !== id));

          await removeFavorite(id);
          return { action: 'removed', foodName };
        } else {
          // Optimistically update UI first, then call backend
          setFavoritedIds((prev) => new Set([...prev, id]));

          const result = await addFavorite(id);

          // Refetch full favorites list to get complete data (including food name, restaurant, etc.)
          const items = await fetchFavorites();
          setFavorites(items);
          setFavoritedIds(new Set(items.map((f) => f.food_item_id)));

          return { action: 'added', foodName };
        }
      } catch (err) {
        // Rollback optimistic update on error
        await loadFavorites();
        throw err;
      }
    },
    [user, favoritedIds, openLogin, loadFavorites]
  );

  return {
    favorites,      // Array of full favorite objects (for Favorites & Wishlist page)
    favoritedIds,   // Set of food_item_id integers (for fast isFavorite() lookups)
    isFavorite,     // (foodItemId) => boolean
    toggleFavorite, // (e, foodItemId, foodName) => Promise
    favLoading,     // boolean — true while initial fetch is in progress
    favError,       // string | null — error message if fetch failed
    refetchFavorites: loadFavorites, // manual refresh trigger
  };
}
