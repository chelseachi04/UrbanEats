/**
 * useOrders — UrbanEats Orders, Archiving & Tracking Hook
 *
 * Single source of truth for the customer's active orders, archived orders, and live order tracking state.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserOrders,
  fetchOrderDetail,
  createOrder as apiCreateOrder,
  verifyOrderPayment as apiVerifyPayment,
  archiveOrder as apiArchiveOrder,
  restoreOrder as apiRestoreOrder,
} from '../api/ordersApi';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders]                 = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setArchivedOrders([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [activeList, archivedList] = await Promise.all([
        fetchUserOrders(false),
        fetchUserOrders(true),
      ]);
      setOrders(activeList);
      setArchivedOrders(archivedList);
    } catch (err) {
      setError('Unable to load order history.');
      setOrders([]);
      setArchivedOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const placeOrder = useCallback(async (deliveryAddressId, items) => {
    const formattedItems = items.map((i) => ({ id: i.id, quantity: i.quantity }));
    return apiCreateOrder({
      delivery_address_id: deliveryAddressId,
      items: formattedItems,
    });
  }, []);

  const confirmPayment = useCallback(async (orderId, txRef, status = 'successful', flwRef = null) => {
    const res = await apiVerifyPayment({
      order_id: orderId,
      tx_ref:   txRef,
      flw_ref:  flwRef,
      status:   status,
    });
    await loadOrders();
    return res;
  }, [loadOrders]);

  const handleArchiveOrder = useCallback(async (orderId) => {
    const res = await apiArchiveOrder(orderId);
    await loadOrders();
    return res;
  }, [loadOrders]);

  const handleRestoreOrder = useCallback(async (orderId) => {
    const res = await apiRestoreOrder(orderId);
    await loadOrders();
    return res;
  }, [loadOrders]);

  const getOrderDetails = useCallback(async (orderIdOrNum) => {
    return fetchOrderDetail(orderIdOrNum);
  }, []);

  // Compute active order for tracking (most recent order that is not delivered or cancelled)
  const activeOrder = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    return orders.find(
      (o) => o.order_status !== 'DELIVERED' && o.order_status !== 'CANCELLED'
    ) || orders[0] || null;
  }, [orders]);

  return {
    orders,
    archivedOrders,
    activeOrder,
    loading,
    error,
    placeOrder,
    confirmPayment,
    archiveOrder: handleArchiveOrder,
    restoreOrder: handleRestoreOrder,
    getOrderDetails,
    refetchOrders: loadOrders,
  };
}
