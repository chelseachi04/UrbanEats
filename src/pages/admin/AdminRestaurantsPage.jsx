/**
 * AdminRestaurantsPage — UrbanEats Restaurant Management
 * Responsive, clean, and well-arranged layout for Admin Portal
 */
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAdminRestaurants, performRestaurantAction, fetchVendorDetails } from '../../api/adminApi';
import {
  Loader2, AlertCircle, RefreshCw, UtensilsCrossed, Store,
  Search, X, MapPin, Phone, Mail, User, ShieldCheck, Clock,
  LayoutGrid, List, Building2, Hash, CheckCircle2, AlertTriangle, Power
} from 'lucide-react';

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'APPROVED'
  const [viewMode, setViewMode]         = useState('grid'); // 'grid' | 'table'
  const [actionLoading, setAL]          = useState({});
  const [toast, setToast]               = useState(null);
  const [selectedMenuData, setSelectedMenuData] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminRestaurants();
      setRestaurants(res.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load restaurants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleStatus = async (restaurantId, currentStatus, name) => {
    setAL(p => ({ ...p, [restaurantId]: true }));
    try {
      const nextStatus = !currentStatus;
      const res = await performRestaurantAction(restaurantId, nextStatus);
      showToast(res.message || `Restaurant status updated.`, nextStatus ? 'success' : 'error');
      load();
    } catch (e) {
      showToast(e.message || 'Action failed.', 'error');
    } finally {
      setAL(p => { const n = {...p}; delete n[restaurantId]; return n; });
    }
  };

  const handleInspectMenu = async (restaurantId) => {
    try {
      const res = await fetchVendorDetails({ restaurant_id: restaurantId });
      if (res.data) {
        setSelectedMenuData(res.data);
      }
    } catch (e) {
      showToast(e.message || 'Failed to fetch restaurant menu.', 'error');
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Filtered dataset
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || (
        (r.name && r.name.toLowerCase().includes(term)) ||
        (r.owner_name && r.owner_name.toLowerCase().includes(term)) ||
        (r.owner_email && r.owner_email.toLowerCase().includes(term)) ||
        (r.vendor_code && r.vendor_code.toLowerCase().includes(term)) ||
        (r.category && r.category.toLowerCase().includes(term)) ||
        (r.location && r.location.toLowerCase().includes(term))
      );

      if (!matchesSearch) return false;

      if (statusFilter === 'ACTIVE') return r.is_active;
      if (statusFilter === 'INACTIVE') return !r.is_active;
      if (statusFilter === 'PENDING') return r.owner_status === 'PENDING';
      if (statusFilter === 'APPROVED') return r.owner_status === 'APPROVED';

      return true;
    });
  }, [restaurants, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = restaurants.length;
    const active = restaurants.filter(r => r.is_active).length;
    const pending = restaurants.filter(r => r.owner_status === 'PENDING').length;
    const approved = restaurants.filter(r => r.owner_status === 'APPROVED').length;
    return { total, active, pending, approved };
  }, [restaurants]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', margin: 0, tracking: '-0.02em' }}>
            Restaurant Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0' }}>
            Manage registered outlets, monitor vendor approval status, and inspect menu item metrics.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            background: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: '#475569',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* SUMMARY STATS ROW */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard
          label="Total Restaurants"
          count={stats.total}
          icon={Building2}
          color="#3B82F6"
          bg="#EFF6FF"
        />
        <StatCard
          label="Active Outlets"
          count={stats.active}
          icon={CheckCircle2}
          color="#10B981"
          bg="#ECFDF5"
        />
        <StatCard
          label="Approved Vendors"
          count={stats.approved}
          icon={ShieldCheck}
          color="#8B5CF6"
          bg="#F5F3FF"
        />
        <StatCard
          label="Pending Approvals"
          count={stats.pending}
          icon={Clock}
          color="#F59E0B"
          bg="#FEF3C7"
          highlight={stats.pending > 0}
        />
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by restaurant name, owner, code, email, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 36px 9px 40px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                outline: 'none',
                color: '#1E293B',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', border: 'none',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#1E293B' : '#64748B',
                fontWeight: viewMode === 'grid' ? 700 : 500,
                fontSize: '0.8rem', cursor: 'pointer',
                boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', border: 'none',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#1E293B' : '#64748B',
                fontWeight: viewMode === 'table' ? 700 : 500,
                fontSize: '0.8rem', cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <List size={15} />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginRight: '4px' }}>Filter:</span>
          {[
            { id: 'ALL', label: `All (${restaurants.length})` },
            { id: 'ACTIVE', label: `Active (${stats.active})` },
            { id: 'INACTIVE', label: `Inactive (${restaurants.length - stats.active})` },
            { id: 'PENDING', label: `Pending Vendor (${stats.pending})` },
            { id: 'APPROVED', label: `Approved Vendor (${stats.approved})` },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              style={{
                padding: '5px 13px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: statusFilter === filter.id ? '1px solid var(--primary)' : '1px solid #E2E8F0',
                background: statusFilter === filter.id ? 'var(--primary)' : '#F8FAFC',
                color: statusFilter === filter.id ? '#ffffff' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94A3B8', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Fetching restaurants...</span>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#DC2626', background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FECACA' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ fontWeight: 700, margin: '0 0 1rem 0' }}>{error}</p>
          <button
            onClick={load}
            style={{ padding: '8px 18px', borderRadius: '10px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {!loading && !error && (
        <>
          {filteredRestaurants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#94A3B8', background: '#ffffff', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <UtensilsCrossed size={40} style={{ display: 'block', margin: '0 auto 1rem', opacity: 0.35, color: '#64748B' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', margin: '0 0 4px 0' }}>No Restaurants Found</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
                {searchTerm ? 'No results matched your search criteria.' : 'There are currently no restaurants matching this filter.'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {filteredRestaurants.map(r => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onToggleStatus={() => handleToggleStatus(r.id, r.is_active, r.name)}
                  onInspectMenu={() => handleInspectMenu(r.id)}
                  loading={actionLoading[r.id]}
                />
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Restaurant</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Owner &amp; Contact</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Vendor Code</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Location</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Items</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Vendor Status</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRestaurants.map((r, idx) => (
                      <tr key={r.id} style={{ borderBottom: idx < filteredRestaurants.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>{r.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>{r.category || 'General'}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#1E293B' }}>{r.owner_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', wordBreak: 'break-all' }}>{r.owner_email}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <code style={{ fontSize: '0.78rem', background: '#F1F5F9', padding: '3px 7px', borderRadius: '6px', fontWeight: 700, color: '#334155' }}>
                            {r.vendor_code || '—'}
                          </code>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#475569', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.location || '—'}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1E293B' }}>
                          {r.menu_item_count} items
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <VendorStatusBadge status={r.owner_status} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleInspectMenu(r.id)}
                              style={{ padding: '4px 10px', borderRadius: '6px', background: '#FFF5F1', color: 'var(--primary)', border: '1px solid var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Menu
                            </button>
                            <button
                              onClick={() => handleToggleStatus(r.id, r.is_active, r.name)}
                              style={{ padding: '4px 10px', borderRadius: '6px', background: r.is_active ? '#FEF2F2' : '#ECFDF5', color: r.is_active ? '#DC2626' : '#047857', border: r.is_active ? '1px solid #FECACA' : '1px solid #A7F3D0', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {r.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.type === 'success' ? '#047857' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', zIndex: 9999 }}>{toast.msg}</div>}

      {/* RESTAURANT MENU MODAL */}
      {selectedMenuData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  {selectedMenuData.restaurant.restaurant_name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Category: {selectedMenuData.restaurant.category || 'General Buka'} • Owner: {selectedMenuData.restaurant.vendor_name}
                </span>
              </div>
              <button onClick={() => setSelectedMenuData(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>LOCATION</div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedMenuData.restaurant.location || 'Abraka'}</div></div>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL ORDERS</div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedMenuData.restaurant.total_orders} orders</div></div>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL REVENUE</div><div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>₦{selectedMenuData.restaurant.total_revenue.toLocaleString()}</div></div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>
              Menu Items ({selectedMenuData.menu_count})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedMenuData.menu.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.category_name || 'General'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₦{item.price.toLocaleString()}</div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: item.is_available ? '#ECFDF5' : '#FEF2F2', color: item.is_available ? '#047857' : '#DC2626', fontWeight: 700 }}>
                      {item.is_available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              ))}
              {selectedMenuData.menu.length === 0 && <div style={{ color: '#94A3B8', textAlign: 'center', padding: '1.5rem' }}>No menu items listed yet.</div>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── STAT CARD COMPONENT ──────────────────────────────────────────────────────
function StatCard({ label, count, icon: Icon, color, bg, highlight }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: highlight ? `1.5px solid ${color}` : '1px solid #E2E8F0',
        padding: '1.25rem',
        boxShadow: highlight ? `0 4px 12px ${color}1A` : '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: highlight ? color : '#1E293B', lineHeight: 1 }}>
          {count}
        </div>
      </div>
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
}

// ── RESTAURANT CARD COMPONENT ────────────────────────────────────────────────
function RestaurantCard({ restaurant: r, onToggleStatus, onInspectMenu, loading }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        padding: '1.25rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div>
        {/* CARD TOP HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              border: '1px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Store size={24} style={{ color: 'var(--primary)' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              title={r.name}
              style={{
                margin: '0 0 2px 0',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#1E293B',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.25,
              }}
            >
              {r.name}
            </h3>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#64748B',
                background: '#F1F5F9',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {r.category || 'General Buka'}
            </span>
          </div>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 800,
              background: r.is_active ? '#ECFDF5' : '#FEF2F2',
              color: r.is_active ? '#047857' : '#DC2626',
              border: r.is_active ? '1px solid #A7F3D0' : '1px solid #FECACA',
              flexShrink: 0,
            }}
          >
            {r.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '0 0 1rem 0' }} />

        {/* DETAILS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
          
          {/* Owner Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <User size={15} style={{ color: '#64748B', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Owner</div>
              <div style={{ fontWeight: 700, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.owner_name || '—'}
              </div>
            </div>
          </div>

          {/* Email Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Mail size={15} style={{ color: '#64748B', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email Address</div>
              <div
                title={r.owner_email}
                style={{
                  fontWeight: 600,
                  color: '#334155',
                  fontSize: '0.8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.owner_email || '—'}
              </div>
            </div>
          </div>

          {/* Location & Phone Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
              <MapPin size={15} style={{ color: '#64748B', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location</div>
                <div
                  title={r.location}
                  style={{
                    fontWeight: 600,
                    color: '#334155',
                    fontSize: '0.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.location || '—'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
              <Phone size={15} style={{ color: '#64748B', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Phone</div>
                <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.phone || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Code & Status Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
              <Hash size={15} style={{ color: '#64748B', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Vendor Code</div>
                <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.78rem' }}>
                  {r.vendor_code ? (
                    <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{r.vendor_code}</code>
                  ) : '—'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
              <ShieldCheck size={15} style={{ color: '#64748B', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Vendor Status</div>
                <div style={{ marginTop: '2px' }}>
                  <VendorStatusBadge status={r.owner_status} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CARD FOOTER WITH ACTION BUTTONS */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          fontSize: '0.78rem',
        }}
      >
        <button
          onClick={onInspectMenu}
          style={{
            padding: '6px 12px', borderRadius: '8px',
            background: '#FFF5F1', color: 'var(--primary)', border: '1px solid var(--primary)',
            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <UtensilsCrossed size={13} />
          <span>Menu ({r.menu_item_count})</span>
        </button>

        <button
          onClick={onToggleStatus}
          disabled={loading}
          style={{
            padding: '6px 12px', borderRadius: '8px',
            background: r.is_active ? '#FEF2F2' : '#ECFDF5',
            color: r.is_active ? '#DC2626' : '#047857',
            border: r.is_active ? '1px solid #FECACA' : '1px solid #A7F3D0',
            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <Power size={13} />
          <span>{r.is_active ? 'Deactivate' : 'Activate'}</span>
        </button>
      </div>
    </div>
  );
}

// ── VENDOR STATUS BADGE HELPER ───────────────────────────────────────────────
function VendorStatusBadge({ status }) {
  const isApproved = status === 'APPROVED';
  const isPending = status === 'PENDING';

  const style = isApproved
    ? { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', text: 'APPROVED' }
    : isPending
    ? { bg: '#FFF7ED', color: '#C2410C', border: '#FFEDD5', text: 'PENDING' }
    : { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: status || 'UNAPPROVED' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '0.72rem',
        fontWeight: 800,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: '0.02em',
      }}
    >
      {isPending && <Clock size={11} />}
      {isApproved && <CheckCircle2 size={11} />}
      {style.text}
    </span>
  );
}
