/**
 * NotificationsPage.jsx — UrbanEats Centralized Notifications Page
 *
 * Accessible from Customer, Vendor, Rider, and Admin Dashboard Sidebars.
 * Provides user-isolated notification feed with unread filter, mark all read,
 * notification detail dialog/modal, and smart direct routing.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useRider } from '../hooks/useRider';
import SubPageHeader from '../components/common/SubPageHeader';
import {
  Bell,
  CheckCheck,
  Package,
  Bike,
  Store,
  Clock,
  Filter,
  CheckCircle2,
  Inbox,
  Loader2,
  Check,
  X,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  ReceiptText,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications, loading } = useNotifications();
  const { activeDelivery } = useRider();
  const navigate = useNavigate();
  const location = useLocation();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [markingAll, setMarkingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Bell size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
        <h3>Authentication Required</h3>
        <p style={{ color: 'var(--text-muted)' }}>Please log in to view your notifications.</p>
      </div>
    );
  }

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await markAllAsRead();
    } catch (e) {
      console.warn('Failed to mark all read', e);
    } finally {
      setMarkingAll(false);
    }
  };

  // Open detail view and mark as read
  const handleItemClick = (notif) => {
    if (!notif.is_read || notif.is_read === 0 || notif.is_read === '0') {
      markAsRead(notif.id);
    }
    setSelectedNotification(notif);
  };

  // Perform specific routing action based on notification details
  const handleNotificationAction = (notif) => {
    if (!notif) return;
    setSelectedNotification(null);

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
          showToast('Job has already been completed or claimed by another rider.');
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

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') {
      return !item.is_read || item.is_read === 0 || item.is_read === '0';
    }
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_PLACED':
      case 'ORDER_STATUS_UPDATE':
      case 'ORDER_DELIVERED':
        return <Package size={18} style={{ color: 'var(--primary)' }} />;
      case 'READY_FOR_DELIVERY':
      case 'RIDER_ACCEPTED':
      case 'OUT_FOR_DELIVERY':
        return <Bike size={18} style={{ color: '#10B981' }} />;
      case 'NEW_VENDOR_APPLICATION':
        return <Store size={18} style={{ color: '#8B5CF6' }} />;
      case 'NEW_RIDER_APPLICATION':
        return <Bike size={18} style={{ color: '#F59E0B' }} />;
      default:
        return <Bell size={18} style={{ color: '#3B82F6' }} />;
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

  const isPortal = location.pathname.startsWith('/rider') || location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin');

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1300,
            background: '#0F172A',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontSize: '0.85rem',
            fontWeight: 700,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Unified sub-page header only rendered for customer route, since portal layouts render their own */}
      {!isPortal && (
        <SubPageHeader title="Notifications" />
      )}

      <div
        className="sub-page-content"
        style={{ maxWidth: '850px', margin: '0 auto', padding: isPortal ? '0 0 100px' : '1rem 1rem 100px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        {/* Filter Tabs & Clean Mark All Read Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === 'all' ? 'var(--primary)' : 'transparent',
                color: filter === 'all' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === 'unread' ? 'var(--primary)' : 'transparent',
                color: filter === 'unread' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff',
                color: 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Mark all as read"
            >
              {markingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Inbox size={48} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications Available'}
              </h4>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                {filter === 'unread' ? 'You are all caught up!' : 'Notifications will appear here when order or account activity occurs.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isUnread = !item.is_read || item.is_read === 0 || item.is_read === '0';
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: isUnread ? '#FFF7ED' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: isUnread ? '#FFEDD5' : '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>
                        {formatTime(item.created_at)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                      {item.message}
                    </p>
                  </div>

                  {isUnread && (
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* NOTIFICATION DETAIL MODAL */}
      {selectedNotification && (
        <div
          onClick={() => setSelectedNotification(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Notification Details
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatTime(selectedNotification.created_at)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#ffffff',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.35 }}>
                {selectedNotification.title}
              </h3>

              <div style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                {selectedNotification.message}
              </div>

              {selectedNotification.related_order_id && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#1E40AF' }}>
                    <ReceiptText size={16} />
                    <span>Order Reference #{selectedNotification.related_order_id}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px', justifyContent: 'flex-end', backgroundColor: '#FAFAFA' }}>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleNotificationAction(selectedNotification)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(255, 87, 34, 0.3)',
                }}
              >
                <span>{user?.role === 'rider' ? 'View Job Action' : 'View Details'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
