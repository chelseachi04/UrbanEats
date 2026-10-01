/**
 * NotificationContext.jsx — Centralized Notification State & Sync Management
 *
 * Provides synchronized notification state across all user roles (Customers, Vendors, Riders, Admin).
 * Keeps top navbar icons (NotificationBell) and central Notification views in real-time sync.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notificationsApi';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);

  // Load / Refresh notifications from backend API
  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const res = await fetchNotifications();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setNotifications(list);
      const unread = list.filter((n) => !n.is_read || n.is_read === 0 || n.is_read === '0').length;
      setUnreadCount(unread);
    } catch (err) {
      console.warn('[NotificationContext] Failed to fetch notifications:', err?.message || err);
    }
  }, [user]);

  // Initial load and periodic polling (every 10 seconds) when authenticated
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    refreshNotifications().finally(() => setLoading(false));

    const timer = setInterval(() => {
      refreshNotifications();
    }, 10000);

    return () => clearInterval(timer);
  }, [user, refreshNotifications]);

  // Mark a single notification as read
  const markAsRead = async (id) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.warn('[NotificationContext] Failed to mark read:', err?.message || err);
      // Re-sync with server on failure
      refreshNotifications();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.warn('[NotificationContext] Failed to mark all read:', err?.message || err);
      refreshNotifications();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
