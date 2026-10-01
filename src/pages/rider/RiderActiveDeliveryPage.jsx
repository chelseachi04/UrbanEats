/**
 * RiderActiveDeliveryPage — UrbanEats Rider Active Job Management
 *
 * Route: /rider/active-delivery
 * Provides step-by-step fulfillment actions:
 *   1. Accept & View Pickup details
 *   2. Mark Picked Up
 *   3. Mark Out for Delivery (Customer tracking updates live)
 *   4. Mark Delivered (Customer tracking updates live)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRider } from '../../hooks/useRider';
import {
  MapPin,
  Store,
  User,
  Phone,
  CheckCircle,
  Navigation,
  Loader2,
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  PackageCheck,
  Truck,
} from 'lucide-react';

export default function RiderActiveDeliveryPage() {
  const { activeDelivery, loading, error, loadActiveDelivery, updateStatus } = useRider();
  const navigate = useNavigate();

  const [updating, setUpdating]   = useState(false);
  const [updateErr, setUpdateErr] = useState(null);

  useEffect(() => {
    loadActiveDelivery();
  }, [loadActiveDelivery]);

  const handleStatusProgress = async (targetStatus, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeDelivery || updating || !targetStatus) return;
    setUpdating(true);
    setUpdateErr(null);
    try {
      await updateStatus(activeDelivery.order_id, targetStatus);
      await loadActiveDelivery();
    } catch (err) {
      setUpdateErr(err.message || 'Failed to update delivery status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 600 }}>Loading active delivery job...</span>
      </div>
    );
  }

  if (error || !activeDelivery) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '24px', backgroundColor: '#fff' }}>
        <Navigation size={48} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
          No Active Delivery in Progress
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          You do not currently have an assigned delivery job. Browse ready orders from local restaurants.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/rider/deliveries')} style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 800 }}>
          Browse Available Deliveries
        </button>
      </div>
    );
  }

  const delStatus = activeDelivery.delivery_status; // ACCEPTED | PICKED_UP | OUT_FOR_DELIVERY

  return (
    <div className="animate-card-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Header & Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ACTIVE JOB FULFILLMENT
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0' }}>
            Order #{activeDelivery.order_number}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
            STATUS: {delStatus}
          </span>
        </div>
      </div>

      {/* Update Error Notice */}
      {updateErr && (
        <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{updateErr}</span>
        </div>
      )}

      {/* MAIN FULFILLMENT WORKFLOW CARD */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Step-by-Step Progress Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          {/* Step 1: Accepted & Pickup */}
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: delStatus === 'ACCEPTED' ? '#E0F2FE' : '#ECFDF5', border: delStatus === 'ACCEPTED' ? '2px solid #0369A1' : '1px solid #A7F3D0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: delStatus === 'ACCEPTED' ? '#0369A1' : '#047857', textTransform: 'uppercase' }}>STEP 1</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>Pick Up Order</div>
          </div>

          {/* Step 2: Out for Delivery */}
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: delStatus === 'OUT_FOR_DELIVERY' ? '#E0F2FE' : delStatus === 'DELIVERED' ? '#ECFDF5' : 'var(--bg-main)', border: delStatus === 'OUT_FOR_DELIVERY' ? '2px solid #0369A1' : '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>STEP 2</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>Out for Delivery</div>
          </div>

          {/* Step 3: Delivered */}
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>STEP 3</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>Delivered</div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>NEXT REQUIRED RIDER ACTION</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {delStatus === 'ACCEPTED' && 'Collect food package from restaurant kitchen'}
              {delStatus === 'PICKED_UP' && 'Start transit to customer address'}
              {delStatus === 'OUT_FOR_DELIVERY' && 'Hand over order to recipient'}
            </div>
          </div>

          <div>
            {delStatus === 'ACCEPTED' && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleStatusProgress('PICKED_UP')}
                style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {updating ? <Loader2 size={18} className="animate-spin" /> : <PackageCheck size={18} />}
                <span>Mark Picked Up from Kitchen</span>
              </button>
            )}

            {delStatus === 'PICKED_UP' && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleStatusProgress('OUT_FOR_DELIVERY')}
                style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 800, backgroundColor: '#0369A1', borderColor: '#0369A1', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
                <span>Start Transit (Out for Delivery)</span>
              </button>
            )}

            {delStatus === 'OUT_FOR_DELIVERY' && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleStatusProgress('DELIVERED')}
                style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 800, backgroundColor: '#047857', borderColor: '#047857', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {updating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                <span>Complete Job (Mark Delivered)</span>
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Pickup Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              RESTAURANT PICKUP LOCATION
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Store size={16} style={{ color: 'var(--primary)' }} />
              {activeDelivery.restaurant_name}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
              <span>{activeDelivery.restaurant_location || 'Main Campus Road, Abraka'}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} />
              <span>Contact: {activeDelivery.restaurant_phone || '08011112222'}</span>
            </div>
          </div>

          {/* Customer Dropoff Info */}
          <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              CUSTOMER DROPOFF DESTINATION
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} style={{ color: '#047857' }} />
              {activeDelivery.recipient_name}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#047857' }} />
              <span>{activeDelivery.delivery_address}, {activeDelivery.delivery_area}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} />
              <span>Call Customer: {activeDelivery.recipient_phone}</span>
            </div>
          </div>
        </div>

        {/* Itemized Order Package Details */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Package Contents ({activeDelivery.items?.length || 0} items)
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Item</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {activeDelivery.items?.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 800, color: 'var(--text-main)' }}>
                    {it.food_name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                    x{it.quantity}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₦{parseFloat(it.subtotal).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Payment Status: <strong style={{ color: activeDelivery.payment_status === 'PAID' ? '#047857' : '#B45309' }}>{activeDelivery.payment_status}</strong>
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
              Total Value: ₦{parseFloat(activeDelivery.total_amount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
