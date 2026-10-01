/**
 * UrbanEats Order Details & Status Tracking Page — Phase 4
 * Route: /orders/:orderId
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchOrderDetail } from '../api/ordersApi';
import { getFoodItemImage } from '../data/imageAssets';
import ImageWithFallback from '../components/common/ImageWithFallback';
import SubPageHeader from '../components/common/SubPageHeader';
import {
  ArrowLeft, Store, MapPin, Phone, CheckCircle2,
  Clock, Truck, Package, ShieldCheck, Loader2, AlertCircle
} from 'lucide-react';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrderDetail(orderId);
        setOrder(data);
      } catch (err) {
        setError('Order not found or you do not have permission to view this order.');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="section page-header-tight">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading order details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="section page-header-tight">
        <div className="container">
          <div style={{ maxWidth: '480px', margin: '3rem auto', textAlign: 'center', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '3rem 1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <AlertCircle size={44} style={{ color: '#EF4444', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Denied or Order Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error || 'Unable to retrieve order details.'}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')} style={{ borderRadius: '12px' }}>
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order Timeline Steps
  const timelineSteps = [
    { key: 'PENDING_PAYMENT', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Payment Confirmed', icon: ShieldCheck },
    { key: 'PROCESSING', label: 'Preparing Meal', icon: Package },
    { key: 'READY_FOR_DELIVERY', label: 'Ready for Pickup', icon: Store },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const statusOrder = ['PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(order.order_status);

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '';

  return (
    <div>
      {/* Unified sticky SubPageHeader */}
      <SubPageHeader
        title={`Order #${order.order_number}`}
        onBack={() => {
          if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate('/profile?tab=orders');
          }
        }}
      />

      <div className="section page-header-tight sub-page-content" style={{ paddingBottom: 'max(90px, calc(env(safe-area-inset-bottom, 0px) + 80px))' }}>
        <div className="container">
          {/* Order Title & Status Badges */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h1 className="section-title" style={{ margin: 0, fontSize: '1.45rem' }}>
                Order #{order.order_number}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                Placed on {formattedDate} • {order.restaurant_name}
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.78rem', backgroundColor: order.payment_status === 'PAID' ? '#ECFDF5' : '#FEF3C7', color: order.payment_status === 'PAID' ? '#047857' : '#B45309', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                Payment: {order.payment_status}
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.78rem', backgroundColor: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '20px', border: '1px solid #BAE6FD' }}>
                Status: {order.order_status}
              </span>
            </div>
          </div>

        {/* Status Timeline Progress Card */}
        <div
          className="order-timeline-card"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Order Status Timeline
            </h3>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: order.order_status === 'DELIVERED' ? '#047857' : 'var(--primary)', backgroundColor: order.order_status === 'DELIVERED' ? '#ECFDF5' : '#FFF4EE', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {timelineSteps.find(s => s.key === order.order_status)?.label || order.order_status}
            </span>
          </div>

          {/* Desktop Timeline (≥ 768px) */}
          <div className="order-timeline-desktop">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', position: 'relative' }}>
              {timelineSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isPassed  = currentIndex >= idx && order.order_status !== 'CANCELLED';
                const isCurrent = currentIndex === idx && order.order_status !== 'CANCELLED';

                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', position: 'relative' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--primary)' : isPassed ? '#10B981' : 'var(--bg-alt)',
                        color: isCurrent || isPassed ? '#ffffff' : 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(255,90,31,0.2)' : 'none',
                        transition: 'all 0.2s ease',
                        zIndex: 2,
                      }}
                    >
                      <StepIcon size={20} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 800 : isPassed ? 700 : 500, color: isCurrent ? 'var(--primary)' : isPassed ? 'var(--text-main)' : 'var(--text-muted)', lineHeight: 1.2 }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Timeline (< 768px) */}
          <div className="order-timeline-mobile">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPassed  = currentIndex >= idx && order.order_status !== 'CANCELLED';
              const isCurrent = currentIndex === idx && order.order_status !== 'CANCELLED';
              const isLast = idx === timelineSteps.length - 1;

              return (
                <div key={step.key} className="order-timeline-mobile-step">
                  {/* Left Column: Icon + Connecting Vertical Line */}
                  <div className="order-timeline-icon-col">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--primary)' : isPassed ? '#10B981' : 'var(--bg-alt)',
                        color: isCurrent || isPassed ? '#ffffff' : 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(255,90,31,0.2)' : 'none',
                        flexShrink: 0,
                      }}
                    >
                      <StepIcon size={18} />
                    </div>
                    {!isLast && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          minHeight: '22px',
                          backgroundColor: isPassed && currentIndex > idx ? '#10B981' : '#E2E8F0',
                          margin: '4px 0',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                  </div>

                  {/* Right Column: Step Text */}
                  <div style={{ flex: 1, paddingTop: '8px', paddingBottom: isLast ? '4px' : '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: isCurrent ? 800 : isPassed ? 700 : 500,
                          color: isCurrent ? 'var(--primary)' : isPassed ? 'var(--text-main)' : 'var(--text-muted)',
                        }}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: '#FFF4EE', padding: '2px 8px', borderRadius: '10px', flexShrink: 0 }}>
                          In Progress
                        </span>
                      )}
                      {isPassed && !isCurrent && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#10B981', flexShrink: 0 }}>
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Layout: Items + Delivery Address */}
        <div className="order-details-grid">

          {/* LEFT — Food Items */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <Store size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Purchased Food Items
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items && order.items.map((item) => {
                const imgSrc = item.food_image_url || getFoodItemImage(item.food_slug, item.food_item_id);
                return (
                  <div
                    key={item.id}
                    className="order-item-row"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '0.85rem',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {/* Left: Thumbnail & Center: Title, category, quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '54px', height: '54px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                        <ImageWithFallback src={imgSrc} alt={item.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 2px 0', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.food_name}
                        </h4>
                        {item.category_name && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                            {item.category_name}
                          </span>
                        )}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
                          ₦{parseFloat(item.unit_price).toLocaleString()} × {item.quantity}
                        </div>
                      </div>
                    </div>

                    {/* Right: Price tag */}
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.98rem', flexShrink: 0, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      ₦{parseFloat(item.subtotal).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Delivery Address Snapshot & Total */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Delivery Address Snapshot
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{order.recipient_name}</div>
                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} style={{ color: 'var(--primary)' }} /> {order.recipient_phone}
                </div>
                <div style={{ color: 'var(--text-main)', marginTop: '4px', wordBreak: 'break-word' }}>
                  {order.delivery_address}
                </div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem' }}>
                  {order.delivery_area}, {order.delivery_city}, {order.delivery_state}
                </div>
              </div>
            </div>

            {/* Payment & Charges */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
                Payment Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₦{parseFloat(order.subtotal).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Delivery Fee</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₦{parseFloat(order.delivery_fee).toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Total Paid</span>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>₦{parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  );
}
