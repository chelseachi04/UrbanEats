/**
 * NotificationBell — Centralized, Reusable Notification Component for UrbanEats
 * Used across Customer Navigation, Vendor Dashboard, Rider Portal, and Admin Panel.
 * Handles unread counts, near-real-time polling, marking as read, and smart navigation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useRider } from '../../hooks/useRider';
import { Bell, Check, CheckCheck, Package, Bike, Store, AlertCircle, Clock } from 'lucide-react';

export default function NotificationBell({ darkTheme = false }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const { activeDelivery } = useRider();
  const navigate = useNavigate();
  const [isOpen, setIsOpen]               = useState(false);
  const [alignLeft, setAlignLeft]         = useState(false);
  const [loading, setLoading]             = useState(false);
  const dropdownRef                       = useRef(null);

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setAlignLeft(rect.left < 220);
      refreshNotifications();
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleItemClick = async (notif) => {
    if (!notif.is_read || notif.is_read === 0 || notif.is_read === '0') {
      markAsRead(notif.id);
    }

    setIsOpen(false);

    // Smart Navigation based on user role and notification payload
    const role = user.role;
    const type = notif.type || '';
    const title = (notif.title || '').toLowerCase();
    const message = (notif.message || '').toLowerCase();

    if (role === 'admin') {
      if (type === 'NEW_VENDOR_APPLICATION') navigate('/admin/vendors');
      else if (type === 'NEW_RIDER_APPLICATION') navigate('/admin/riders');
      else navigate('/admin/orders');
    } else if (role === 'vendor') {
      if (notif.related_order_id) navigate(`/vendor/orders/${notif.related_order_id}`);
      else navigate('/vendor/orders');
    } else if (role === 'rider') {
      // 1. Available Job Notifications -> route to Available Jobs (/rider/deliveries)
      if (
        type === 'READY_FOR_DELIVERY' ||
        type === 'NEW_DELIVERY_AVAILABLE' ||
        title.includes('available') ||
        title.includes('pickup ready') ||
        message.includes('available for pickup') ||
        message.includes('ready for pickup')
      ) {
        navigate('/rider/deliveries');
        return;
      }

      // 2. Delivered / Completed Deliveries -> route to Delivery History (/rider/history)
      if (
        type === 'ORDER_DELIVERED' ||
        type === 'DELIVERY_COMPLETED' ||
        title.includes('delivered') ||
        title.includes('completed') ||
        message.includes('delivered successfully')
      ) {
        navigate('/rider/history');
        return;
      }

      // 3. Accepted / In-Progress Deliveries -> route to active delivery only if claimed
      if (
        type === 'RIDER_ACCEPTED' ||
        type === 'OUT_FOR_DELIVERY' ||
        type === 'ACTIVE_DELIVERY' ||
        title.includes('out for delivery') ||
        title.includes('active delivery')
      ) {
        if (activeDelivery && (!notif.related_order_id || activeDelivery.order_id === notif.related_order_id)) {
          navigate('/rider/active-delivery');
        } else {
          navigate('/rider/deliveries');
        }
        return;
      }

      // 4. Default for rider
      if (activeDelivery && notif.related_order_id && activeDelivery.order_id === notif.related_order_id) {
        navigate('/rider/active-delivery');
      } else {
        navigate('/rider/dashboard');
      }
    } else {
      // Customer
      if (notif.related_order_id) {
        navigate(`/orders/${notif.related_order_id}`);
      } else {
        navigate('/profile');
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await markAllAsRead();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER_PLACED':
      case 'ORDER_STATUS_UPDATE':
      case 'ORDER_DELIVERED':
        return <Package size={16} style={{ color: 'var(--primary)' }} />;
      case 'READY_FOR_DELIVERY':
      case 'RIDER_ACCEPTED':
      case 'OUT_FOR_DELIVERY':
        return <Bike size={16} style={{ color: '#10B981' }} />;
      case 'NEW_VENDOR_APPLICATION':
        return <Store size={16} style={{ color: '#8B5CF6' }} />;
      case 'NEW_RIDER_APPLICATION':
        return <Bike size={16} style={{ color: '#F59E0B' }} />;
      default:
        return <Bell size={16} style={{ color: '#3B82F6' }} />;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        aria-label="Notifications"
        className="desktop-icon-btn notif-bell-trigger"
        style={
          darkTheme
            ? { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#F8FAFC' }
            : undefined
        }
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#EF4444',
              color: '#ffffff',
              fontSize: '0.66rem',
              fontWeight: 800,
              borderRadius: '9999px',
              padding: '0 4px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop for easy dismissal on mobile/desktop — sits underneath panel */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1040,
              background: 'rgba(0,0,0,0.06)',
            }}
          />

          <div
            className="notifications-dropdown-menu notification-dropdown-panel"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              left: 'auto',
              width: 'min(350px, calc(100vw - 24px))',
              maxWidth: '92vw',
              maxHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #E2E8F0',
              zIndex: 1100,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease-out',
              boxSizing: 'border-box',
            }}
          >
            {/* Pinned Panel Header */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.90rem', color: '#1E293B' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ background: '#FFF7ED', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notifications Scrollable List */}
            <div
              className="notifications-scroll-list"
              style={{
                flex: '1 1 auto',
                maxHeight: '340px',
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              {notifications.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                  <Bell size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={(e) => handleItemClick(notif)}
                    className="notification-item-card"
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #F1F5F9',
                      background: notif.is_read ? '#ffffff' : '#FFF7ED',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      boxSizing: 'border-box',
                      transition: 'background 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: notif.is_read ? '#F1F5F9' : '#FFEDD5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        pointerEvents: 'none',
                      }}
                    >
                      {getIcon(notif.type)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0, pointerEvents: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
                          {notif.title}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap', paddingLeft: '4px' }}>
                          {formatTime(notif.created_at)}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {notif.message}
                      </p>
                    </div>

                    {!notif.is_read && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          flexShrink: 0,
                          marginTop: '6px',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pinned Panel Footer */}
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid #F1F5F9',
                background: '#F8FAFC',
                textAlign: 'center',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (user?.role === 'rider') navigate('/rider/notifications');
                  else if (user?.role === 'vendor') navigate('/vendor/notifications');
                  else if (user?.role === 'admin') navigate('/admin/notifications');
                  else navigate('/notifications');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.80rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                View all notifications →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
