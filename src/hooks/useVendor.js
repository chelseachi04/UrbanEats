/**
 * useVendor — UrbanEats Vendor Hook
 *
 * Provides reactive state management for vendor restaurant, dashboard metrics,
 * incoming orders, menu items, and order status updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchVendorRestaurant,
  updateVendorRestaurant,
  updateVendorStoreStatus,
  fetchVendorDashboard,
  fetchVendorOrders,
  fetchVendorOrderDetail,
  updateOrderStatus,
  fetchVendorMenu,
  createFoodItem,
  updateFoodItem,
  toggleFoodAvailability,
  deleteFoodItem,
} from '../api/vendorApi';

export function useVendor() {
  const { user } = useAuth();

  const [restaurant, setRestaurant]       = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders]               = useState([]);
  const [menuItems, setMenuItems]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const isVendor = user && user.role === 'vendor';

  // Load vendor restaurant profile
  const loadRestaurant = useCallback(async () => {
    if (!isVendor) return;
    try {
      const data = await fetchVendorRestaurant();
      setRestaurant(data);
    } catch (err) {
      console.warn('Failed to load vendor restaurant:', err.message);
    }
  }, [isVendor]);

  // Load dashboard data
  const loadDashboard = useCallback(async () => {
    if (!isVendor) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVendorDashboard();
      setDashboardData(data);
      if (data.restaurant) {
        setRestaurant((prev) => ({ ...prev, ...data.restaurant }));
      }
    } catch (err) {
      setError(err.message || 'Unable to load vendor dashboard.');
    } finally {
      setLoading(false);
    }
  }, [isVendor]);

  // Load vendor orders
  const loadOrders = useCallback(async (status = 'ALL') => {
    if (!isVendor) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchVendorOrders(status);
      setOrders(list);
    } catch (err) {
      setError('Failed to fetch vendor orders.');
    } finally {
      setLoading(false);
    }
  }, [isVendor]);

  // Load vendor menu items
  const loadMenu = useCallback(async () => {
    if (!isVendor) return;
    setLoading(true);
    setError(null);
    try {
      const items = await fetchVendorMenu();
      setMenuItems(items);
    } catch (err) {
      setError('Failed to fetch vendor menu items.');
    } finally {
      setLoading(false);
    }
  }, [isVendor]);

  useEffect(() => {
    if (isVendor) {
      loadDashboard();
    }
  }, [isVendor, loadDashboard]);

  // Update order status
  const handleUpdateOrderStatus = useCallback(async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    // Refresh local lists
    await Promise.all([loadDashboard(), loadOrders()]);
    return res;
  }, [loadDashboard, loadOrders]);

  // Toggle food item availability
  // newAvailable = the DESIRED new state (true = available, false = not)
  const handleToggleAvailability = useCallback(async (foodId, newAvailable) => {
    await toggleFoodAvailability(foodId, newAvailable);
    setMenuItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, is_available: newAvailable ? 1 : 0 } : item))
    );
  }, []);

  // Save food item (Create or Edit) — imageFile is optional
  const handleSaveFoodItem = useCallback(async (foodData, imageFile = null) => {
    let result;
    if (foodData.id) {
      result = await updateFoodItem(foodData, imageFile);
    } else {
      result = await createFoodItem(foodData, imageFile);
    }
    await loadMenu();
    return result; // callers need data.data.id and data.data.image_url
  }, [loadMenu]);

  // Save restaurant details
  const handleSaveRestaurant = useCallback(async (restData) => {
    const updated = await updateVendorRestaurant(restData);
    setRestaurant(updated);
    return updated;
  }, []);

  // Update store status (open/closed)
  const handleUpdateStoreStatus = useCallback(async (newStatus) => {
    // 1. Optimistic update in restaurant hook state immediately
    setRestaurant((prev) => (prev ? { ...prev, status: newStatus } : { status: newStatus }));
    try {
      const data = await updateVendorStoreStatus(newStatus);
      if (data) {
        setRestaurant((prev) => ({ ...prev, ...data }));
      }
      return data;
    } catch (err) {
      console.error('[useVendor] Failed to update store status:', err);
      // Reload on failure to restore true state
      await loadRestaurant();
      throw err;
    }
  }, [loadRestaurant]);

  // Delete (soft-remove) a food item
  const handleDeleteFoodItem = useCallback(async (foodId) => {
    await deleteFoodItem(foodId);
    setMenuItems((prev) => prev.filter((item) => item.id !== foodId));
  }, []);

  return {
    isVendor,
    restaurant,
    setRestaurant,
    dashboardData,
    orders,
    menuItems,
    loading,
    error,
    loadDashboard,
    loadOrders,
    loadMenu,
    loadRestaurant,
    updateOrderStatus: handleUpdateOrderStatus,
    updateStoreStatus: handleUpdateStoreStatus,
    toggleAvailability: handleToggleAvailability,
    saveFoodItem: handleSaveFoodItem,
    deleteFoodItem: handleDeleteFoodItem,
    saveRestaurant: handleSaveRestaurant,
    getOrderDetail: fetchVendorOrderDetail,
  };
}

