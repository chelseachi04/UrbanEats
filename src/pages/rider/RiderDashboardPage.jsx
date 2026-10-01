/**
 * RiderDashboardPage — UrbanEats Rider Portal Dashboard Overview
 *
 * Displays calculated metrics (Available Jobs, Active Job, Today's Completed, Total Completed)
 * and active delivery / available deliveries preview.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRider } from '../../hooks/useRider';
import {
  MapPin,
  Navigation,
  CheckCircle,
  Calendar,
  ChevronRight,
  Loader2,
  Bike,
  Phone,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function RiderDashboardPage() {
  const { dashboardData, loading, error, loadDashboard } = useRider();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 700 }}>Calculating delivery metrics...</span>
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

  const metrics        = dashboardData?.metrics || {};
  const activeDelivery = dashboardData?.active_delivery || null;
  const rider          = dashboardData?.rider || {};

  return (
    <div className="animate-card-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          padding: '1.75rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RIDER OVERVIEW
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0', color: '#fff' }}>
            Welcome back, {rider.full_name || 'Rider'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
            Pick up ready orders from local Abraka restaurants and fulfill deliveries fast.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/rider/deliveries')}
          style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <MapPin size={18} />
          <span>View Available Jobs ({metrics.available_deliveries || 0})</span>
        </button>
      </div>

      {/* METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {/* Metric 1: Ready Pickups */}
        <div
          className="rider-metric-card"
          onClick={() => navigate('/rider/deliveries')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/rider/deliveries')}
          style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ready Pickups</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0369A1' }}>{metrics.available_deliveries || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready for pickup at restaurants</span>
        </div>

        {/* Metric 2: Active Job */}
        <div
          className="rider-metric-card"
          onClick={() => navigate(metrics.has_active_delivery ? '/rider/active-delivery' : '/rider/deliveries')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(metrics.has_active_delivery ? '/rider/active-delivery' : '/rider/deliveries')}
          style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Job</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: metrics.has_active_delivery ? '#FEF3C7' : '#F1F5F9', color: metrics.has_active_delivery ? '#B45309' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: metrics.has_active_delivery ? '#B45309' : 'var(--text-main)' }}>
            {metrics.has_active_delivery ? '1 Active' : 'None'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Currently in progress</span>
        </div>

        {/* Metric 3: Today Completed */}
        <div
          className="rider-metric-card"
          onClick={() => navigate('/rider/history')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/rider/history')}
          style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today's Deliveries</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857' }}>{metrics.today_completed || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivered today</span>
        </div>

        {/* Metric 4: Total Lifetime Completed */}
        <div
          className="rider-metric-card"
          onClick={() => navigate('/rider/history')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/rider/history')}
          style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Completed</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{metrics.total_completed || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lifetime completed orders</span>
        </div>
      </div>

      {/* ACTIVE DELIVERY CARD (IF ANY) */}
      {activeDelivery && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid var(--primary)',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                CURRENT ACTIVE DELIVERY
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0' }}>
                Order #{activeDelivery.order_number}
              </h3>
            </div>

            <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#B45309' }}>
              {activeDelivery.delivery_status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                PICKUP FROM RESTAURANT
              </span>
              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>
                {activeDelivery.restaurant_name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                {activeDelivery.restaurant_location || 'Abraka Main Campus'}
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                DELIVER TO CUSTOMER
              </span>
              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>
                {activeDelivery.recipient_name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                {activeDelivery.delivery_address}, {activeDelivery.delivery_area}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/rider/active-delivery')}
              style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Manage Active Delivery</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS BANNER */}
      {!activeDelivery && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <Bike size={48} style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            You are ready to accept new delivery jobs
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Browse ready orders from restaurants in Abraka and pick up jobs near you.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/rider/deliveries')} style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 800 }}>
            View Available Deliveries
          </button>
        </div>
      )}
    </div>
  );
}
