/**
 * UrbanEats Order Confirmation Page — Phase 4
 * Route: /order-confirmation/:orderId
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchOrderDetail } from '../api/ordersApi';
import { getFoodItemImage } from '../data/imageAssets';
import ImageWithFallback from '../components/common/ImageWithFallback';
import SubPageHeader from '../components/common/SubPageHeader';
import {
  CheckCircle2, ShoppingBag, ArrowRight, MapPin, Phone,
  Store, Loader2, RefreshCw, Calendar, Truck, Home
} from 'lucide-react';

export default function OrderConfirmationPage() {
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
        setError('Unable to load order confirmation details.');
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
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading order confirmation...</span>
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
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Confirmation Error</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error || 'Order record not found.'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')} style={{ borderRadius: '12px' }}>
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '';

  return (
    <div>
      {/* Unified sticky SubPageHeader */}
      <SubPageHeader
        title="Order Confirmation"
        onBack={() => navigate('/profile?tab=orders')}
      />

      <div className="section page-header-tight sub-page-content" style={{ paddingBottom: 'max(90px, calc(env(safe-area-inset-bottom, 0px) + 80px))' }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>

          {/* Success Banner */}
          <div
            style={{
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '24px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.25)',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#065F46', margin: '0 0 0.5rem 0' }}>
              Order Placed Successfully!
            </h1>
            <p style={{ color: '#047857', fontSize: '1.05rem', margin: '0 0 1.25rem 0' }}>
              Thank you for ordering with UrbanEats Abraka. Your payment has been verified and confirmed.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '8px 18px', borderRadius: '20px', border: '1px solid #A7F3D0', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              <span>Order #:</span>
              <span style={{ color: 'var(--primary)' }}>{order.order_number}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="order-details-grid">

            {/* LEFT — Items Snapshot & Delivery Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Items Card */}
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Store size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {order.restaurant_name}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items && order.items.map((item) => {
                    const imgSrc = getFoodItemImage(item.food_slug, item.food_item_id);
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '0.75rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                            <ImageWithFallback src={imgSrc} alt={item.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.food_name}
                            </h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              ₦{parseFloat(item.unit_price).toLocaleString()} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          ₦{parseFloat(item.subtotal).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address Card */}
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Delivery Destination
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{order.recipient_name}</div>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} style={{ color: 'var(--primary)' }} /> {order.recipient_phone}
                  </div>
                  <div style={{ color: 'var(--text-main)', marginTop: '4px' }}>
                    {order.delivery_address}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem' }}>
                    {order.delivery_area}, {order.delivery_city}, {order.delivery_state}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT — Summary & Actions */}
            <div>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '5.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Order Date</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>{formattedDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Payment Status</span>
                    <span style={{ fontWeight: 800, color: '#047857', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>{order.payment_status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Order Status</span>
                    <span style={{ fontWeight: 800, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '6px' }}>{order.order_status}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Truck size={16} />
                    Track Order &amp; Details
                  </button>
                  <button
                    className="btn btn-outline btn-full"
                    onClick={() => navigate('/restaurants')}
                    style={{ borderRadius: '12px', fontSize: '0.85rem' }}
                  >
                    <ShoppingBag size={15} />
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-outline btn-full"
                    onClick={() => navigate('/')}
                    style={{ borderRadius: '12px', fontSize: '0.85rem' }}
                  >
                    <Home size={15} />
                    Back Home
                  </button>
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
