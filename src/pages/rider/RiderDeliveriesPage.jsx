/**
 * RiderDeliveriesPage — UrbanEats Available Jobs for Riders
 *
 * View eligible food orders that are ready for pickup and accept delivery jobs.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRider } from '../../hooks/useRider';
import {
  MapPin,
  Store,
  User,
  Phone,
  ShoppingBag,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react';

export default function RiderDeliveriesPage() {
  const { availableDeliveries, loading, error, loadAvailableDeliveries, acceptDelivery } = useRider();
  const navigate = useNavigate();

  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptError, setAcceptError] = useState(null);

  useEffect(() => {
    loadAvailableDeliveries();
  }, [loadAvailableDeliveries]);

  const handleAccept = async (e, orderId) => {
    if (e && e.preventDefault) e.preventDefault();
    if (acceptingId) return;
    setAcceptingId(orderId);
    setAcceptError(null);
    try {
      await acceptDelivery(orderId);
      navigate('/rider/active-delivery');
    } catch (err) {
      setAcceptError(err.message || 'Failed to accept delivery. Another rider may have accepted it.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="animate-card-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            Available Delivery Jobs
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            Orders ready for pickup at restaurants in Abraka. Accept a job to start delivery.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={loadAvailableDeliveries}
          style={{ borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700 }}
        >
          Refresh List
        </button>
      </div>

      {/* Accept Error Notice */}
      {acceptError && (
        <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{acceptError}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '12px', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600 }}>Checking available deliveries...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && availableDeliveries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '24px', backgroundColor: '#fff' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            No ready delivery jobs right now
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Orders appear here when vendors mark them as "Ready for Pickup" or dispatch them for delivery.
          </p>
        </div>
      )}

      {/* DELIVERIES GRID */}
      {!loading && !error && availableDeliveries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {availableDeliveries.map((del) => {
            const dateStr = del.created_at
              ? new Date(del.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '';

            const isAccepting = acceptingId === del.order_id;

            return (
              <div
                key={del.order_id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Header Line */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>
                      #{del.order_number}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Placed {dateStr}</span>
                  </div>

                  <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: del.order_status === 'OUT_FOR_DELIVERY' ? '#EFF6FF' : '#ECFDF5', color: del.order_status === 'OUT_FOR_DELIVERY' ? '#1D4ED8' : '#047857' }}>
                    {del.order_status === 'OUT_FOR_DELIVERY' ? 'DISPATCHED BY VENDOR' : 'READY FOR PICKUP'}
                  </span>
                </div>

                {/* Locations Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {/* Restaurant Pickup */}
                  <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      1. PICKUP RESTAURANT
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Store size={16} style={{ color: 'var(--primary)' }} />
                      {del.restaurant_name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{del.restaurant_location || 'Abraka Main Campus'}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Phone size={14} />
                      {del.restaurant_phone || 'N/A'}
                    </div>
                  </div>

                  {/* Customer Dropoff */}
                  <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '8px' }}>
                      2. DROPOFF DESTINATION
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <User size={16} style={{ color: '#047857' }} />
                      {del.recipient_name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#047857' }} />
                      <span>{del.delivery_address}, {del.delivery_area}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Phone size={14} />
                      {del.recipient_phone}
                    </div>
                  </div>
                </div>

                {/* Footer Bar & Accept Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Order Items: <strong>{del.item_count} items</strong> • Total: <strong>₦{parseFloat(del.total_amount).toLocaleString()}</strong> ({del.payment_status})
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isAccepting}
                    onClick={(e) => handleAccept(e, del.order_id)}
                    style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Accepting...</span>
                      </>
                    ) : (
                      <>
                        <span>Accept Delivery Job</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
