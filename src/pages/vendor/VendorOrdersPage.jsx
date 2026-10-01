/**
 * VendorOrdersPage — UrbanEats Vendor Order Management & Fulfillment
 *
 * Filter incoming customer orders, manage kitchen preparation, and dispatch orders.
 * Refactored with 3 simplified status tabs and optimized for smooth mobile viewport scrolling.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVendor } from '../../hooks/useVendor';
import VendorSubpageHeader from '../../components/vendor/VendorSubpageHeader';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Loader2,
  MapPin,
  Phone,
  User,
  UtensilsCrossed,
} from 'lucide-react';

export default function VendorOrdersPage() {
  const { orders, loading, error, loadOrders, updateOrderStatus } = useVendor();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getInitialFilter = () => {
    const f = (searchParams.get('filter') || searchParams.get('status') || '').toLowerCase();
    if (f === 'new' || f === 'confirmed' || f === 'pending') return 'CONFIRMED';
    if (f === 'ready' || f === 'ready_for_delivery') return 'READY_FOR_DELIVERY';
    return 'ALL';
  };

  const [activeFilter, setActiveFilter] = useState(getInitialFilter);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const f = getInitialFilter();
    setActiveFilter(f);
  }, [searchParams]);

  useEffect(() => {
    loadOrders(activeFilter);
  }, [activeFilter, loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // 3 Primary Order Pipeline Filter Tabs
  const filterTabs = [
    { id: 'all', label: 'All Orders', value: 'ALL' },
    { id: 'confirmed', label: 'New Confirmed', value: 'CONFIRMED' },
    { id: 'ready', label: 'Ready for Pickup', value: 'READY_FOR_DELIVERY' },
  ];

  return (
    <div className="vendor-orders-container">
      {/* Standardized Sub-page Header */}
      <VendorSubpageHeader
        title="Order Fulfillment"
        subtitle="Manage incoming customer orders, track kitchen preparation, and handle dispatch."
      />

      {/* 3 Status Filter Tabs */}
      <div className="vendor-orders-tabs-wrapper">
        <div className="vendor-orders-tabs">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.id}
                type="button"
                className={`vendor-order-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="vendor-orders-center-state">
          <Loader2 size={26} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Fetching vendor orders...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="vendor-orders-error-state">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="vendor-orders-empty-card">
          <ShoppingBag size={48} style={{ color: '#94A3B8', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            No orders found
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, maxWidth: '420px' }}>
            {activeFilter === 'ALL'
              ? 'Orders placed for your restaurant will appear here immediately.'
              : `No orders currently match "${filterTabs.find(t => t.value === activeFilter)?.label}".`}
          </p>
        </div>
      )}

      {/* ORDERS CARDS LIST */}
      {!loading && !error && orders.length > 0 && (
        <div className="vendor-orders-list">
          {orders.map((ord) => {
            const dateStr = ord.created_at
              ? new Date(ord.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            const isUpdating = updatingId === ord.id;

            return (
              <div key={ord.id} className="vendor-order-card">
                {/* Order Header / Top Row */}
                <div className="vendor-order-card-header">
                  <div className="vendor-order-number-wrap">
                    <span className="vendor-order-number">#{ord.order_number}</span>
                    <span className="vendor-order-date">• {dateStr}</span>
                  </div>

                  <div className="vendor-order-badge-group">
                    <span
                      className={`vendor-payment-badge ${
                        ord.payment_status === 'PAID' ? 'paid' : 'pending'
                      }`}
                    >
                      {ord.payment_status}
                    </span>

                    <span
                      className={`vendor-status-badge ${
                        ord.order_status === 'CONFIRMED'
                          ? 'confirmed'
                          : ord.order_status === 'PROCESSING'
                          ? 'processing'
                          : ord.order_status === 'READY_FOR_DELIVERY'
                          ? 'ready'
                          : 'completed'
                      }`}
                    >
                      {ord.order_status === 'READY_FOR_DELIVERY' ? 'READY' : ord.order_status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="vendor-order-details-grid">
                  {/* Customer Info Box */}
                  <div className="vendor-order-info-box">
                    <div className="vendor-order-box-label">Customer Info</div>
                    <div className="vendor-order-customer-name">
                      <User size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{ord.recipient_name}</span>
                    </div>
                    <div className="vendor-order-customer-phone">
                      <Phone size={14} style={{ flexShrink: 0 }} />
                      <span>{ord.recipient_phone}</span>
                    </div>
                    <div className="vendor-order-customer-address">
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                      <span>{ord.delivery_address}, {ord.delivery_area}</span>
                    </div>
                  </div>

                  {/* Summary Info Box */}
                  <div className="vendor-order-info-box vendor-order-summary-box">
                    <div>
                      <div className="vendor-order-box-label">Order Summary</div>
                      <div className="vendor-order-items-count">
                        {ord.item_count} {ord.item_count === 1 ? 'Food Item' : 'Food Items'}
                      </div>
                      <div className="vendor-order-breakdown">
                        Subtotal: ₦{parseFloat(ord.subtotal).toLocaleString()} • Delivery: ₦{parseFloat(ord.delivery_fee).toLocaleString()}
                      </div>
                    </div>

                    <div className="vendor-order-total-row">
                      <span className="vendor-order-total-label">TOTAL REVENUE</span>
                      <span className="vendor-order-total-amount">
                        ₦{parseFloat(ord.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons Bar */}
                <div className="vendor-order-card-actions">
                  <button
                    type="button"
                    className="btn btn-outline vendor-order-receipt-btn"
                    onClick={() => navigate(`/vendor/orders/${ord.id}`)}
                  >
                    <UtensilsCrossed size={15} />
                    <span>View Receipt</span>
                  </button>

                  <div className="vendor-order-status-btns">
                    {ord.order_status === 'CONFIRMED' && (
                      <button
                        type="button"
                        className="btn btn-primary vendor-order-action-btn"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(ord.id, 'PROCESSING')}
                      >
                        {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Clock size={15} />}
                        <span>Accept &amp; Start Cooking</span>
                      </button>
                    )}

                    {ord.order_status === 'PROCESSING' && (
                      <button
                        type="button"
                        className="btn btn-primary vendor-order-action-btn vendor-btn-ready"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(ord.id, 'READY_FOR_DELIVERY')}
                      >
                        {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {ord.order_status === 'READY_FOR_DELIVERY' && (
                      <button
                        type="button"
                        className="btn btn-primary vendor-order-action-btn vendor-btn-dispatch"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(ord.id, 'OUT_FOR_DELIVERY')}
                      >
                        {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Truck size={15} />}
                        <span>Dispatched to Rider</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Scoped Mobile & Responsive Styles ──────────────────────── */}
      <style>{`
        .vendor-orders-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
          padding-top: 0.5rem;
          padding-bottom: 96px; /* Clearance for fixed bottom navigation bar */
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* 3 Filter Tabs Bar */
        .vendor-orders-tabs-wrapper {
          width: 100%;
          box-sizing: border-box;
        }

        .vendor-orders-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          background-color: #ffffff;
          border: 1px solid var(--border-color, #E2E8F0);
          padding: 5px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          width: 100%;
          box-sizing: border-box;
        }

        .vendor-order-tab-btn {
          padding: 9px 8px;
          border-radius: 12px;
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          background-color: transparent;
          color: #64748B;
          transition: all 0.18s ease;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 480px) {
          .vendor-order-tab-btn {
            font-size: 0.74rem;
            padding: 8px 4px;
          }
        }

        .vendor-order-tab-btn.active {
          background-color: var(--primary, #EA580C);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
        }

        /* States */
        .vendor-orders-center-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
          gap: 12px;
          color: #64748B;
        }

        .vendor-orders-error-state {
          padding: 1.25rem;
          border-radius: 14px;
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .vendor-orders-empty-card {
          text-align: center;
          padding: 3.5rem 1.5rem;
          border: 2px dashed var(--border-color, #CBD5E1);
          border-radius: 20px;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Orders List */
        .vendor-orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          box-sizing: border-box;
        }

        .vendor-order-card {
          background-color: #ffffff;
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: 20px;
          padding: 1.25rem;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-sizing: border-box;
          width: 100%;
        }

        @media (min-width: 768px) {
          .vendor-order-card {
            padding: 1.5rem;
            border-radius: 22px;
          }
        }

        /* Card Header */
        .vendor-order-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color, #F1F5F9);
        }

        .vendor-order-number-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vendor-order-number {
          font-weight: 800;
          color: var(--primary, #EA580C);
          font-size: 1.1rem;
        }

        .vendor-order-date {
          font-size: 0.78rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .vendor-order-badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .vendor-payment-badge {
          padding: 3px 8px;
          border-radius: 8px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .vendor-payment-badge.paid {
          background-color: #ECFDF5;
          color: #047857;
        }

        .vendor-payment-badge.pending {
          background-color: #FEF3C7;
          color: #B45309;
        }

        .vendor-status-badge {
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .vendor-status-badge.confirmed {
          background-color: #FEF3C7;
          color: #B45309;
        }

        .vendor-status-badge.processing {
          background-color: #E0F2FE;
          color: #0369A1;
        }

        .vendor-status-badge.ready {
          background-color: #ECFDF5;
          color: #047857;
        }

        .vendor-status-badge.completed {
          background-color: #F1F5F9;
          color: #475569;
        }

        /* Details Grid */
        .vendor-order-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .vendor-order-details-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
        }

        .vendor-order-info-box {
          padding: 1rem;
          border-radius: 14px;
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          box-sizing: border-box;
        }

        .vendor-order-summary-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .vendor-order-box-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .vendor-order-customer-name {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-main, #0F172A);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .vendor-order-customer-phone {
          font-size: 0.8rem;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .vendor-order-customer-address {
          font-size: 0.8rem;
          color: #334155;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          line-height: 1.4;
        }

        .vendor-order-items-count {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main, #0F172A);
        }

        .vendor-order-breakdown {
          font-size: 0.78rem;
          color: #64748B;
          margin-top: 2px;
        }

        .vendor-order-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px dashed #CBD5E1;
        }

        .vendor-order-total-label {
          font-size: 0.76rem;
          font-weight: 800;
          color: #64748B;
        }

        .vendor-order-total-amount {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary, #EA580C);
        }

        /* Actions Bar */
        .vendor-order-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #F1F5F9;
        }

        .vendor-order-receipt-btn {
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
        }

        .vendor-order-status-btns {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .vendor-order-action-btn {
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vendor-btn-ready {
          background-color: #047857 !important;
          border-color: #047857 !important;
        }

        .vendor-btn-dispatch {
          background-color: #0369A1 !important;
          border-color: #0369A1 !important;
        }

        @media (max-width: 540px) {
          .vendor-order-card-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .vendor-order-receipt-btn,
          .vendor-order-action-btn {
            width: 100%;
            justify-content: center;
          }
          .vendor-order-status-btns {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
