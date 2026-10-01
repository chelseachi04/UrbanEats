/**
 * useAuthGuard — UrbanEats Authentication Guard
 *
 * Use this hook wherever "Add to Cart" is handled.
 * Call `requireAuth()` BEFORE any cart mutation.
 * If the user is not authenticated, the AuthModal is opened
 * and `false` is returned — the caller must abort the cart action.
 *
 * Usage:
 *   const { requireAuth } = useAuthGuard();
 *
 *   const handleAddToCart = (e, item) => {
 *     e.stopPropagation();
 *     if (!requireAuth()) return;   // ← guard: do NOT touch cart if false
 *     const result = addToCart(item, restaurant);
 *     ...
 *   };
 */

import { useAuth } from '../context/AuthContext';

export function useAuthGuard() {
  const { user, openLogin } = useAuth();

  /**
   * Check if the current visitor is authenticated.
   * If NOT authenticated, open the Sign In modal and return false.
   * If authenticated, return true — the caller may proceed.
   *
   * @returns {boolean} true if authenticated, false if not
   */
  const requireAuth = () => {
    if (user) return true;
    openLogin('customer');
    return false;
  };

  return { requireAuth, isAuthenticated: !!user };
}
