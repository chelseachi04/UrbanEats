/**
 * VendorOrderDetailsPage — Single Order View & Receipt for Vendors
 *
 * Route: /vendor/orders/:orderId
 * Displays itemized food purchase snapshot, customer contact details, and status transition control.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendor } from '../../hooks/useVendor';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Loader2,
  AlertCircle,
  FileText,
  Bike,
  Mail,
} from 'lucide-react';
import { getFoodItemImage } from '../../data/imageAssets';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function VendorOrderDetailsPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const { getOrderDetail, updateOrderStatus } = useVendor();

  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderDetail(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Order not found or access denied.');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [orderId, getOrderDetail]);

  const handleStatusChange = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      const updated = await getOrderDetail(order.id);
      setOrder(updated);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 600 }}>Loading order receipt...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
        <AlertCircle size={40} style={{ color: '#DC2626', marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>Order Access Error</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/vendor/orders')} style={{ borderRadius: '12px' }}>
          Back to Vendor Orders
        </button>
      </div>
    );
  }

  const dateStr = order.created_at
    ? new Date(order.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Back button & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate('/vendor/orders')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: order.payment_status === 'PAID' ? '#ECFDF5' : '#FEF3C7', color: order.payment_status === 'PAID' ? '#047857' : '#B45309' }}>
            PAYMENT: {order.payment_status}
          </span>
          <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0369A1' }}>
            STATUS: {order.order_status}
          </span>
        </div>
      </div>

      {/* Main Order Card */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ORDER RECEIPT SNAPSHOT</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0' }}>
              #{order.order_number}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Placed on {dateStr}</span>
          </div>

          {/* Quick status actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {order.order_status === 'CONFIRMED' && (
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleStatusChange('PROCESSING')}
                style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: 800 }}
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                <span>Accept &amp; Start Cooking</span>
              </button>
            )}

            {order.order_status === 'PROCESSING' && (
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleStatusChange('READY_FOR_DELIVERY')}
                style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: 800, backgroundColor: '#047857', borderColor: '#047857' }}
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                <span>Mark Ready for Pickup</span>
              </button>
            )}

            {order.order_status === 'READY_FOR_DELIVERY' && (
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleStatusChange('OUT_FOR_DELIVERY')}
                style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: 800, backgroundColor: '#0369A1', borderColor: '#0369A1' }}
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                <span>Dispatch for Delivery</span>
              </button>
            )}
          </div>
        </div>

        {/* Customer & Delivery Section */}
        <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>RECIPIENT NAME</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} style={{ color: 'var(--primary)' }} />
              {order.recipient_name}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>PHONE NUMBER</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} />
              {order.recipient_phone}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>DELIVERY DESTINATION</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              {order.delivery_address}, {order.delivery_area}
            </span>
          </div>
        </div>

        {/* Rider Info Card — shown when a rider has been assigned */}
        {order.rider && (
          <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bike size={15} />
              Assigned Rider
              <span style={{ marginLeft: '6px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#1D4ED8', color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>
                {order.rider.delivery_status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>RIDER NAME</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} style={{ color: '#1D4ED8' }} />{order.rider.rider_name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>PHONE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} />{order.rider.rider_phone || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>EMAIL</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} />{order.rider.rider_email}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Itemized Table */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Ordered Items ({order.items?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {order.items?.map((item) => {
              const imgSrc = item.food_image_url || getFoodItemImage(item.food_slug, item.food_item_id);
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <ImageWithFallback src={imgSrc} alt={item.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.food_name}</div>
                    {item.category_name && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Category: {item.category_name}</span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₦{parseFloat(item.subtotal).toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>x{item.quantity} × ₦{parseFloat(item.unit_price).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'flex-end', minWidth: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <span>Food Subtotal</span>
            <span>₦{parseFloat(order.subtotal).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <span>Delivery Fee</span>
            <span>₦{parseFloat(order.delivery_fee).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
            <span>Total Revenue</span>
            <span>₦{parseFloat(order.total_amount).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
