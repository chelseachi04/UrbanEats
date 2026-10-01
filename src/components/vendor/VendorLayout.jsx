import React, { useState, Suspense } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVendor } from '../../hooks/useVendor';
import { useNotifications } from '../../context/NotificationContext';
import { updateVendorStoreStatus } from '../../api/vendorApi';
import NotificationBell from '../common/NotificationBell';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Store,
  LogOut,
  ArrowLeft,
  BadgeCheck,
  Bell,
  Home,
} from 'lucide-react';

// ── Stable Sidebar — defined OUTSIDE VendorLayout so it never remounts on tab change ──
function VendorSidebar({ navItems, onNavigate, onLogout, onGoHome }) {
  return (
    <aside
      className="dashboard-sidebar-panel"
      style={{
        width: '260px',
        height: '100%',
        backgroundColor: 'var(--secondary)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>UE</div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>UrbanEats</h2>
            <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>RESTAURANT DASHBOARD</span>
          </div>
        </div>
      </div>
      <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                borderRadius: '12px', fontSize: '0.88rem', fontWeight: isActive ? 800 : 600,
                color: isActive ? '#ffffff' : '#94A3B8',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s ease',
              })}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{ backgroundColor: '#EF4444', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', lineHeight: 1.2 }}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onGoHome} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#CBD5E1', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <ArrowLeft size={15} /><span>Customer Marketplace</span>
        </button>
        <button onClick={onLogout} className="btn-logout-pill" style={{ width: '100%' }}>
          <LogOut size={15} /><span>Logout Account</span>
        </button>
      </div>
    </aside>
  );
}

// ── Skeleton shown while lazy sub-pages load (no full-screen white flash) ──
function VendorPageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '0.5rem' }}>
      {[180, 80, 80, 80].map((h, i) => (
        <div key={i} style={{ height: `${h}px`, borderRadius: '14px', background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'vendor-skeleton-shimmer 1.4s ease infinite' }} />
      ))}
    </div>
  );
}

export default function VendorLayout() {
  const { user, logoutUser } = useAuth();
  const { restaurant, updateStoreStatus } = useVendor();
  const { unreadCount }      = useNotifications();
  const navigate             = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Store Open/Closed Toggle State ─────────────────────────────────────────
  // Normalize: handle both 'open'/'OPEN' and 'closed'/'CLOSED' from API
  const isStoreCurrentlyOpen =
    restaurant?.status != null
      ? restaurant.status.toLowerCase() === 'open'
      : true;

  const [storeOpen, setStoreOpen] = useState(isStoreCurrentlyOpen);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Sync from context whenever restaurant status loads or updates
  React.useEffect(() => {
    if (restaurant?.status != null && !statusUpdating) {
      const serverIsOpen = restaurant.status.toLowerCase() === 'open';
      setStoreOpen(serverIsOpen);
    }
  }, [restaurant?.status, statusUpdating]);

  const handleToggleStoreStatus = async () => {
    if (statusUpdating) return;

    const nextState = !storeOpen;
    const nextStatusString = nextState ? 'open' : 'closed';

    console.log('[VendorToggle] Toggling status from', storeOpen ? 'OPEN' : 'CLOSED', 'to', nextStatusString.toUpperCase());

    // 1. Immediate optimistic UI update
    setStoreOpen(nextState);
    setStatusUpdating(true);

    try {
      // 2. Call centralized updateStoreStatus (updates hook state + makes API request)
      const res = await updateStoreStatus(nextStatusString);
      console.log('[VendorToggle] Server confirmed status update:', res);
    } catch (err) {
      console.error('[VendorToggle] Failed to update store status on server:', err);
      // 3. Rollback UI on network / server failure
      setStoreOpen(!nextState);
      alert(err.message || 'Failed to update store status. Please check your network connection.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview',            path: '/vendor/dashboard',     icon: LayoutDashboard },
    { label: 'Orders & Fulfillment', path: '/vendor/orders',        icon: ShoppingBag },
    { label: 'Menu Management',     path: '/vendor/menu',          icon: UtensilsCrossed },
    { label: 'Restaurant Profile',  path: '/vendor/restaurant',    icon: Store },
    { label: 'Notifications',       path: '/vendor/notifications', icon: Bell, badge: unreadCount },
  ];


  const vendorCode = user?.vendor_code || 'UE-VND-000001';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <div className="dashboard-sidebar-desktop" style={{ display: 'flex' }}>
        <VendorSidebar
          navItems={navItems}
          onNavigate={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          onGoHome={() => { setSidebarOpen(false); navigate('/'); }}
        />
      </div>

      {/* MOBILE OVERLAY BACKDROP & DRAWER */}
      {sidebarOpen && (
        <div
          className="dashboard-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)', zIndex: 1100,
          }}
        />
      )}
      {sidebarOpen && (
        <div
          className="dashboard-mobile-drawer"
          style={{
            position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh',
            zIndex: 1200, overflowY: 'auto', backgroundColor: 'var(--secondary)',
          }}
        >
          <VendorSidebar
            navItems={navItems}
            onNavigate={() => setSidebarOpen(false)}
            onLogout={handleLogout}
            onGoHome={() => { setSidebarOpen(false); navigate('/'); }}
          />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          className="dashboard-header vendor-dashboard-header vendor-top-header"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
          }}
        >
          <div className="vendor-single-row-header">
            {/* Far Left: Storefront Drawer Trigger Button */}
            <button
              type="button"
              className="vendor-store-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle navigation drawer"
              title="Click me"
              style={{ flexShrink: 0 }}
            >
              <div className="vendor-store-toggle-icon">
                <Store size={20} strokeWidth={2.2} />
              </div>
            </button>

            {/* Middle Section: Cleaned Restaurant Metadata & Compact Status Pill */}
            <div className="vendor-header-middle">
              <div className="vendor-header-text-info">
                <div className="vendor-header-name-line">
                  <h1 className="vendor-header-name">
                    {restaurant?.name || 'Delta Food Palace'}
                  </h1>
                  <span className="vendor-header-code-badge">
                    <BadgeCheck size={11} style={{ color: 'var(--primary)' }} />
                    {vendorCode}
                  </span>
                </div>
                <span className="vendor-header-subtitle">
                  {restaurant?.location || restaurant?.address || 'Site II, Abraka'}
                </span>
              </div>

              {/* Compact Mini-Pill Status Toggle Button (OPEN / CLOSED) */}
              <button
                type="button"
                onClick={handleToggleStoreStatus}
                disabled={statusUpdating}
                className={`vendor-compact-status-pill vendor-status-toggle-btn ${storeOpen ? 'open' : 'closed'}`}
                title={storeOpen ? 'Store is OPEN — click to close' : 'Store is CLOSED — click to open'}
                aria-label={storeOpen ? 'Store Open – tap to close' : 'Store Closed – tap to open'}
              >
                <span className={`vendor-status-dot ${storeOpen ? 'open' : 'closed'}`} />
                <span>{storeOpen ? 'OPEN' : 'CLOSED'}</span>
              </button>
            </div>

            {/* Far Right Action Icons: Notification Bell + Red Logout Button */}
            <div className="vendor-header-right-icons">
              <NotificationBell />

              <button
                type="button"
                onClick={handleLogout}
                className="vendor-header-logout-btn"
                aria-label="Logout"
                title="Logout Account"
              >
                <LogOut size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Body: Suspense scoped here ONLY — the shell (header + bottom nav) never unmounts */}
        <main className="dashboard-main-content vendor-main-content" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', scrollbarGutter: 'stable' }}>
          <Suspense fallback={<VendorPageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>

        {/* VENDOR MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="vendor-bottom-navbar vendor-mobile-bottom-nav" aria-label="Vendor Mobile Bottom Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `vendor-bottom-nav-item ${isActive ? 'active' : ''}`}
            title="Customer Home"
          >
            <span className="vendor-nav-icon-pill">
              <Home size={20} />
            </span>
            <span className="vendor-nav-label">Home</span>
          </NavLink>

          <NavLink
            to="/vendor/dashboard"
            end
            className={({ isActive }) => `vendor-bottom-nav-item ${isActive ? 'active' : ''}`}
            title="Dashboard Overview"
          >
            <span className="vendor-nav-icon-pill">
              <LayoutDashboard size={20} />
            </span>
            <span className="vendor-nav-label">Overview</span>
          </NavLink>

          <NavLink
            to="/vendor/orders"
            className={({ isActive }) => `vendor-bottom-nav-item ${isActive ? 'active' : ''}`}
            title="Orders & Fulfillment"
          >
            <span className="vendor-nav-icon-pill" style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {unreadCount > 0 && (
                <span className="vendor-bottom-nav-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
            <span className="vendor-nav-label">Orders</span>
          </NavLink>

          <NavLink
            to="/vendor/menu"
            className={({ isActive }) => `vendor-bottom-nav-item ${isActive ? 'active' : ''}`}
            title="Menu Management"
          >
            <span className="vendor-nav-icon-pill">
              <UtensilsCrossed size={20} />
            </span>
            <span className="vendor-nav-label">Menu</span>
          </NavLink>

          <NavLink
            to="/vendor/restaurant"
            className={({ isActive }) => `vendor-bottom-nav-item ${isActive ? 'active' : ''}`}
            title="Restaurant Profile"
          >
            <span className="vendor-nav-icon-pill">
              <Store size={20} />
            </span>
            <span className="vendor-nav-label">Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
