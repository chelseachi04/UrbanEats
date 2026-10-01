/**
 * AdminDashboardPage — Platform overview stats, analytics, and platform finance
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminStats, fetchAdminAnalytics, fetchAdminFinance } from '../../api/adminApi';
import {
  Users, Store, Bike, ShoppingBag, UtensilsCrossed,
  Clock, TrendingUp, RefreshCw, Loader2, AlertCircle, DollarSign, Award, PieChart, Sparkles
} from 'lucide-react';

const STATUS_COLORS = {
  DELIVERED:          { bg: '#ECFDF5', color: '#047857' },
  CONFIRMED:          { bg: '#EFF6FF', color: '#1D4ED8' },
  PROCESSING:         { bg: '#FFF7ED', color: '#C2410C' },
  READY_FOR_DELIVERY: { bg: '#F5F3FF', color: '#7C3AED' },
  OUT_FOR_DELIVERY:   { bg: '#FEF9C3', color: '#A16207' },
  CANCELLED:          { bg: '#FEF2F2', color: '#DC2626' },
  PENDING_PAYMENT:    { bg: '#F8FAFC', color: '#64748B' },
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats]         = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [finance, setFinance]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'finance'

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [sData, aData, fData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminAnalytics().catch(() => null),
        fetchAdminFinance().catch(() => null)
      ]);
      setStats(sData);
      if (aData && aData.data) setAnalytics(aData.data);
      if (fData && fData.data) setFinance(fData.data);
    } catch (e) {
      setError(e.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader />;
  if (error)   return <ErrorBlock msg={error} onRetry={load} />;

  const cards = [
    { label: 'Customers',       value: stats.total_customers,   icon: Users,          color: '#3B82F6' },
    { label: 'Vendors',         value: stats.total_vendors,     icon: Store,          color: '#F97316' },
    { label: 'Riders',          value: stats.total_riders,      icon: Bike,           color: '#10B981' },
    { label: 'Restaurants',     value: stats.total_restaurants, icon: UtensilsCrossed,color: '#8B5CF6' },
    { label: 'Total Orders',    value: stats.total_orders,      icon: ShoppingBag,    color: '#EC4899' },
    { label: 'Pending Vendors', value: stats.pending_vendors,   icon: Clock,          color: '#F59E0B', alert: true },
    { label: 'Pending Riders',  value: stats.pending_riders,    icon: Clock,          color: '#F59E0B', alert: true },
    { label: 'Revenue (₦)',     value: `₦${Number(stats.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: '#14B8A6', raw: true },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Platform Overview &amp; Intelligence</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0' }}>Live statistics, analytics performance, and financial metrics across UrbanEats.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
            {[{ id: 'overview', l: 'Overview' }, { id: 'analytics', l: '📊 Analytics' }, { id: 'finance', l: '💰 Finance' }].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '7px 14px', borderRadius: '8px', border: 'none',
                  background: activeTab === t.id ? '#fff' : 'transparent',
                  color: activeTab === t.id ? '#1E293B' : '#64748B',
                  fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer'
                }}
              >
                {t.l}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/admin/featured')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #FF5722 0%, #EA580C 100%)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(255, 87, 34, 0.25)',
            }}
          >
            <Sparkles size={15} /> Curate Showcase
          </button>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {cards.map(({ label, value, icon: Icon, color, alert, raw }) => (
              <div key={label} style={{
                background: '#fff', borderRadius: '14px', padding: '1.25rem',
                border: alert && value > 0 ? `1px solid ${color}` : '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                </div>
                <div style={{ fontSize: raw ? '1.2rem' : '2rem', fontWeight: 800, color: alert && value > 0 ? color : '#1E293B' }}>
                  {raw ? value : value.toLocaleString()}
                </div>
                {alert && value > 0 && <div style={{ fontSize: '0.72rem', color, fontWeight: 700, marginTop: '4px' }}>⚠ Requires action</div>}
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F1F5F9' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Recent Orders</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Order #', 'Customer', 'Restaurant', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats.recent_orders || []).map((o, i) => {
                    const sc = STATUS_COLORS[o.order_status] || { bg: '#F8FAFC', color: '#475569' };
                    return (
                      <tr key={o.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>{o.order_number}</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{o.customer_name || o.recipient_name}</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{o.restaurant_name}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>₦{Number(o.total_amount).toLocaleString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>
                            {o.order_status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#94A3B8', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                  {!stats.recent_orders?.length && (
                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && analytics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>GROSS SALES GMV</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>₦{analytics.overview.total_gmv.toLocaleString()}</div>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>PAID REVENUE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>₦{analytics.overview.paid_revenue.toLocaleString()}</div>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>AVG ORDER VALUE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>₦{analytics.overview.avg_order_value.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* VENDOR PERFORMANCE */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: '0 0 1rem 0' }}>Top Vendors by Sales</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analytics.vendor_performance.map((v, idx) => (
                  <div key={v.restaurant_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.85rem' }}>#{idx+1} {v.restaurant_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Owner: {v.owner_name} • {v.order_count} orders</div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.9rem' }}>₦{v.total_sales.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIDER PERFORMANCE */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', margin: '0 0 1rem 0' }}>Top Rider Delivery Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analytics.rider_performance.map(r => (
                  <div key={r.rider_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.85rem' }}>{r.rider_name} ({r.rider_code || 'N/A'})</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{r.is_online ? '● Online' : '○ Offline'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#3B82F6', fontSize: '0.85rem' }}>{r.completed_deliveries} Completed</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{r.active_deliveries} Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM FINANCE TAB */}
      {activeTab === 'finance' && finance && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>PLATFORM COMMISSION (10%)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>₦{finance.overview.commission_earned.toLocaleString()}</div>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>DELIVERY FEE EARNINGS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>₦{finance.overview.total_delivery_fees.toLocaleString()}</div>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>NET VENDOR PAYOUTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>₦{finance.overview.net_vendor_payouts.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 1rem 0' }}>Vendor Payout Breakdown</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Restaurant', 'Owner', 'Gross Sales', '10% Commission', 'Net Payout Due'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {finance.vendor_payouts.map(vp => (
                    <tr key={vp.restaurant_id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1E293B' }}>{vp.restaurant_name}</td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{vp.vendor_name} ({vp.vendor_code || 'N/A'})</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1E293B' }}>₦{vp.vendor_gross_sales.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#DC2626' }}>-₦{vp.commission_fee.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10B981' }}>₦{vp.net_payout.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Loader() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem', gap: '12px', color: '#64748B' }}>
    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
    <span>Loading dashboard...</span>
  </div>;
}

function ErrorBlock({ msg, onRetry }) {
  return <div style={{ textAlign: 'center', padding: '4rem', color: '#DC2626' }}>
    <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
    <p style={{ marginBottom: '1rem' }}>{msg}</p>
    <button onClick={onRetry} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
  </div>;
}

