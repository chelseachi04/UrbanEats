/**
 * RiderHistoryPage — UrbanEats Completed Delivery Log for Riders
 *
 * View historical completed and past deliveries for the authenticated rider.
 */

import React, { useEffect } from 'react';
import { useRider } from '../../hooks/useRider';
import {
  History,
  CheckCircle2,
  MapPin,
  Store,
  User,
  Phone,
  Loader2,
  ShoppingBag,
} from 'lucide-react';

export default function RiderHistoryPage() {
  const { history, loading, error, loadHistory } = useRider();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
          Delivery History
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Archive of all completed food deliveries fulfilled by your rider account.
        </p>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '12px', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600 }}>Loading delivery history...</span>
        </div>
      )}

      {!loading && error && (
        <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '24px', backgroundColor: '#fff' }}>
          <History size={48} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            No completed deliveries yet
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Once you accept and complete food delivery jobs, your delivery log will appear here.
          </p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item) => {
            const dateStr = item.delivered_at || item.accepted_at
              ? new Date(item.delivered_at || item.accepted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={item.assignment_id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                      #{item.order_number}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#ECFDF5', color: '#047857' }}>
                      {item.delivery_status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Store size={14} style={{ color: 'var(--primary)' }} />
                    {item.restaurant_name} &rarr; <User size={14} style={{ color: '#047857' }} /> {item.recipient_name}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={13} />
                    {item.delivery_address}, {item.delivery_area}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₦{parseFloat(item.total_amount).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Delivered on {dateStr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
