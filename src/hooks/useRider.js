/**
 * useRider — UrbanEats Rider Hook
 *
 * Provides reactive state management for rider dashboard, available deliveries,
 * active delivery workflow, status updates, online toggling, and history.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchRiderDashboard,
  fetchAvailableDeliveries,
  acceptDelivery,
  fetchActiveDelivery,
  updateDeliveryStatus,
  toggleRiderOnline,
  fetchRiderHistory,
  fetchRiderProfile,
  updateRiderProfile,
} from '../api/riderApi';

export function useRider() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRider = user && user.role === 'rider';

  // Load Rider Dashboard
  const loadDashboard = useCallback(async () => {
    if (!isRider) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRiderDashboard();
      setDashboardData(data);
      if (data.active_delivery) {
        setActiveDelivery(data.active_delivery);
      }
    } catch (err) {
      setError(err.message || 'Unable to load rider dashboard.');
    } finally {
      setLoading(false);
    }
  }, [isRider]);

  // Load Available Deliveries
  const loadAvailableDeliveries = useCallback(async () => {
    if (!isRider) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAvailableDeliveries();
      setAvailableDeliveries(list);
    } catch (err) {
      setError('Failed to fetch available deliveries.');
    } finally {
      setLoading(false);
    }
  }, [isRider]);

  // Load Active Delivery Details
  const loadActiveDelivery = useCallback(async () => {
    if (!isRider) return;
    setLoading(true);
    setError(null);
    try {
      const active = await fetchActiveDelivery();
      setActiveDelivery(active);
    } catch (err) {
      setError('Failed to load active delivery.');
    } finally {
      setLoading(false);
    }
  }, [isRider]);

  // Load Delivery History
  const loadHistory = useCallback(async () => {
    if (!isRider) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchRiderHistory();
      setHistory(list);
    } catch (err) {
      setError('Failed to fetch delivery history.');
    } finally {
      setLoading(false);
    }
  }, [isRider]);

  // Load Rider Profile
  const loadProfile = useCallback(async () => {
    if (!isRider) return;
    try {
      const data = await fetchRiderProfile();
      setProfile(data);
    } catch (err) {
      console.warn('Failed to load rider profile:', err.message);
    }
  }, [isRider]);

  useEffect(() => {
    if (isRider) {
      loadDashboard();
    }
  }, [isRider, loadDashboard]);

  // Accept Delivery Action
  const handleAcceptDelivery = useCallback(async (orderId) => {
    const res = await acceptDelivery(orderId);
    await Promise.all([loadDashboard(), loadActiveDelivery()]);
    return res;
  }, [loadDashboard, loadActiveDelivery]);

  // Update Status Action
  const handleUpdateStatus = useCallback(async (orderId, status) => {
    const res = await updateDeliveryStatus(orderId, status);
    await Promise.all([loadDashboard(), loadActiveDelivery()]);
    return res;
  }, [loadDashboard, loadActiveDelivery]);

  // Toggle Online Action
  const handleToggleOnline = useCallback(async (isOnline) => {
    const res = await toggleRiderOnline(isOnline);
    await loadDashboard();
    return res;
  }, [loadDashboard]);

  // Save Rider Profile
  const handleSaveProfile = useCallback(async (profData) => {
    const updated = await updateRiderProfile(profData);
    setProfile(updated);
    return updated;
  }, []);

  return {
    isRider,
    dashboardData,
    availableDeliveries,
    activeDelivery,
    history,
    profile,
    loading,
    error,
    loadDashboard,
    loadAvailableDeliveries,
    loadActiveDelivery,
    loadHistory,
    loadProfile,
    acceptDelivery: handleAcceptDelivery,
    updateStatus: handleUpdateStatus,
    toggleOnline: handleToggleOnline,
    saveProfile: handleSaveProfile,
  };
}
