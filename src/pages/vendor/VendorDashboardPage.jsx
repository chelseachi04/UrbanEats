/**
 * VendorDashboardPage — UrbanEats Vendor Portal Dashboard Overview
 *
 * Displays calculated real metrics (New, Processing, Ready, Sales) and recent orders.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendor } from '../../hooks/useVendor';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  DollarSign,
  ChevronRight,
  Loader2,
  Store,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { dashboardData, loading, error, loadDashboard, updateOrderStatus } = useVendor();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 700 }}>Calculating store analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
        <strong>Error:</strong> {error}
        <button onClick={loadDashboard} style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#DC2626', fontWeight: 800, cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  const metrics      = dashboardData?.metrics || {};
  const recentOrders = dashboardData?.recent_orders || [];
  const restaurant   = dashboardData?.restaurant || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Enhanced Visual Vendor Hero Banner */}
      <div
        className="vendor-hero-banner"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '1.85rem 1.75rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #431407 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Background Decorative Glow Circles */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '80px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 87, 34, 0.22) 0%, rgba(255, 87, 34, 0) 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-20px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(56, 189, 248, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Decorative Watermark Store / Food Illustration on Right */}
        <div
          style={{
            position: 'absolute',
            right: '24px',
            bottom: '-15px',
            opacity: 0.08,
            pointerEvents: 'none',
            color: '#ffffff',
            transform: 'rotate(-10deg)',
          }}
        >
          <Store size={160} strokeWidth={1.2} />
        </div>

        {/* Content Column */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
          {/* Subtle Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 87, 34, 0.18)',
              color: '#FF7A45',
              border: '1px solid rgba(255, 87, 34, 0.35)',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            <Store size={13} strokeWidth={2.5} />
            <span>Vendor Overview</span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Welcome back, {restaurant.name || 'Delta Food Palace'}!
          </h2>
          <p style={{ fontSize: '0.90rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Manage incoming orders, update live menu items, and track daily sales.
          </p>
        </div>

        {/* Primary Action Button */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <button
            className="btn btn-primary vendor-hero-btn"
            onClick={() => navigate('/vendor/orders')}
            style={{
              borderRadius: '12px',
              padding: '12px 22px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(255, 87, 34, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>View All Orders</span>
            <ArrowUpRight size={17} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* METRICS GRID - Interactive Clickable Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {/* Metric 1: New Orders */}
        <div
          className="vendor-metric-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/vendor/orders?filter=new')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/vendor/orders?filter=new')}
          aria-label="View New Orders"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Orders</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.new_orders || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting processing</span>
        </div>

        {/* Metric 2: Processing */}
        <div
          className="vendor-metric-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/vendor/orders?filter=preparing')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/vendor/orders?filter=preparing')}
          aria-label="View In Kitchen Orders"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Kitchen</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0369A1' }}>{metrics.processing_orders || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Being prepared</span>
        </div>

        {/* Metric 3: Ready for Delivery */}
        <div
          className="vendor-metric-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/vendor/orders?filter=ready')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/vendor/orders?filter=ready')}
          aria-label="View Ready for Delivery Orders"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ready</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857' }}>{metrics.ready_orders || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready for pickup/delivery</span>
        </div>

        {/* Metric 4: Total Sales */}
        <div
          className="vendor-metric-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/vendor/orders')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/vendor/orders')}
          aria-label="View Order Revenue & History"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
            ₦{metrics.total_sales ? parseFloat(metrics.total_sales).toLocaleString() : '0'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {metrics.total_orders || 0} total orders</span>
        </div>
      </div>

      {/* RECENT ORDERS TABLE SECTION */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Recent Incoming Orders
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real customer orders placed for {restaurant.name}
            </span>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/vendor/orders')}
            style={{ borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All ({metrics.total_orders || 0})
            <ChevronRight size={15} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
            <ShoppingBag size={40} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              No incoming orders yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              When customers order food from your restaurant, new orders will instantly show here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>Order Ref</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Items</th>
                  <th style={{ padding: '12px 16px' }}>Total Amount</th>
                  <th style={{ padding: '12px 16px' }}>Payment</th>
                  <th style={{ padding: '12px 16px' }}>Fulfillment Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => {
                  const dateStr = ord.created_at
                    ? new Date(ord.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '';

                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                        #{ord.order_number}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{dateStr}</div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{ord.recipient_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.recipient_phone}</div>
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {ord.item_count} {ord.item_count === 1 ? 'item' : 'items'}
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₦{parseFloat(ord.total_amount).toLocaleString()}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                            backgroundColor: ord.payment_status === 'PAID' ? '#ECFDF5' : '#FEF3C7',
                            color: ord.payment_status === 'PAID' ? '#047857' : '#B45309',
                          }}
                        >
                          {ord.payment_status}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800,
                            backgroundColor: ord.order_status === 'CONFIRMED' ? '#FEF3C7' : ord.order_status === 'PROCESSING' ? '#E0F2FE' : '#ECFDF5',
                            color: ord.order_status === 'CONFIRMED' ? '#B45309' : ord.order_status === 'PROCESSING' ? '#0369A1' : '#047857',
                          }}
                        >
                          {ord.order_status}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {ord.order_status === 'CONFIRMED' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => updateOrderStatus(ord.id, 'PROCESSING')}
                              style={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}
                            >
                              Accept &amp; Process
                            </button>
                          )}

                          {ord.order_status === 'PROCESSING' && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => updateOrderStatus(ord.id, 'READY_FOR_DELIVERY')}
                              style={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, color: '#047857', borderColor: '#A7F3D0' }}
                            >
                              Mark Ready
                            </button>
                          )}

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/vendor/orders/${ord.id}`)}
                            style={{ borderRadius: '8px', fontSize: '0.78rem' }}
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
