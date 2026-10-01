import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRider } from '../../hooks/useRider';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from '../common/NotificationBell';
import SubPageHeader from '../common/SubPageHeader';
import {
  Home,
  LayoutDashboard,
  MapPin,
  Bike,
  History,
  User,
  LogOut,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  BadgeCheck,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Menu,
  Bell,
} from 'lucide-react';

export default function RiderLayout() {
  const { user, logoutUser }       = useAuth();
  const { activeDelivery, toggleOnline } = useRider();
  const { unreadCount }            = useNotifications();
  const navigate                   = useNavigate();
  const location                   = useLocation();

  const [isOnline, setIsOnline] = useState(user?.is_online !== 0);
  const [toggling, setToggling] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleToggleOnlineStatus = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (toggling) return;
    setToggling(true);
    try {
      const next = !isOnline;
      await toggleOnline(next);
      setIsOnline(next);
    } catch (err) {
      console.warn('Failed to toggle online:', err.message);
    } finally {
      setToggling(false);
    }
  };

  const navItems = [
    { label: 'Overview',          path: '/rider/dashboard',       icon: LayoutDashboard },
    { label: 'Available Jobs',    path: '/rider/deliveries',      icon: MapPin },
    { label: 'Active Delivery',   path: '/rider/active-delivery', icon: Navigation, badgeText: Boolean(activeDelivery) ? 'LIVE' : null },
    { label: 'Notifications',     path: '/rider/notifications',   icon: Bell, badgeCount: unreadCount },
    { label: 'Delivery History',  path: '/rider/history',         icon: History },
    { label: 'Rider Profile',     path: '/rider/profile',         icon: User },
  ];

  const riderCode = user?.rider_code || 'UE-RDR-000001';

  const isOverview = location.pathname === '/rider/dashboard' || location.pathname === '/rider';

  const getSubPageTitle = (path) => {
    if (path.includes('/deliveries')) return 'Available Deliveries';
    if (path.includes('/active-delivery')) return 'Active Delivery';
    if (path.includes('/history')) return 'Delivery History';
    if (path.includes('/profile')) return 'Rider Profile';
    if (path.includes('/notifications')) return 'Notifications';
    return 'Rider Portal';
  };

  const SidebarContent = () => (
    <aside
      className="dashboard-sidebar-panel"
      style={{
        width: '260px',
        height: '100%',
        backgroundColor: '#0F172A',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px', height: '40px', borderRadius: '12px',
              backgroundColor: 'var(--primary)', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem',
            }}
          >
            <Bike size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              UrbanEats
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RIDER PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#ffffff' : '#94A3B8',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>

              {item.badgeText && (
                <span
                  style={{
                    padding: '2px 8px', borderRadius: '10px',
                    backgroundColor: '#EF4444', color: '#ffffff',
                    fontSize: '0.7rem', fontWeight: 800, animation: 'pulse 2s infinite',
                  }}
                >
                  {item.badgeText}
                </span>
              )}
              {item.badgeCount > 0 && (
                <span
                  style={{
                    padding: '2px 8px', borderRadius: '10px',
                    backgroundColor: '#EF4444', color: '#ffffff',
                    fontSize: '0.7rem', fontWeight: 800,
                  }}
                >
                  {item.badgeCount > 99 ? '99+' : item.badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => { setSidebarOpen(false); navigate('/'); }}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'transparent',
            color: '#CBD5E1',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <ArrowLeft size={15} />
          <span>Customer Marketplace</span>
        </button>

        <button
          onClick={handleLogout}
          className="btn-logout-pill"
          style={{ width: '100%' }}
        >
          <LogOut size={15} />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <div className="dashboard-sidebar-desktop" style={{ display: 'flex' }}>
        <SidebarContent />
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
            zIndex: 1200, overflowY: 'auto', backgroundColor: '#0F172A',
          }}
        >
          <SidebarContent />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* On Sub-pages on Mobile: Render Standardized SubPageHeader */}
        {!isOverview && (
          <div className="rider-mobile-subpage-header">
            <SubPageHeader
              title={getSubPageTitle(location.pathname)}
              showLogout={true}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* Dashboard Top Header (Shown on Overview or on Desktop) */}
        <header
          className={`dashboard-header rider-dashboard-header rider-top-header ${!isOverview ? 'rider-header-desktop-only' : ''}`}
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
          {/* Single Horizontal Row: Avatar [S] | Details & Compact Status Pill | Bell + Logout */}
          <div className="rider-single-row-header">
            {/* Far Left: Avatar Initial Button [S] (Drawer Trigger) */}
            <button
              type="button"
              className="rider-avatar-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle navigation drawer"
              title="Navigation Menu"
            >
              <div className="rider-avatar-initial">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
              </div>
            </button>

            {/* Middle Section: Rider Info & Compact Status Pill */}
            <div className="rider-header-middle">
              <div className="rider-header-text-info">
                <div className="rider-header-name-line">
                  <h1 className="rider-header-name">
                    {user?.full_name || 'Swift Rider Delta'}
                  </h1>
                  <span className="rider-header-code-badge">
                    <BadgeCheck size={11} style={{ color: '#38BDF8' }} />
                    {riderCode}
                  </span>
                </div>
                <span className="rider-header-subtitle">
                  Abraka Delivery Zone
                </span>
              </div>

              {/* Compact Mini-Pill Online Toggle */}
              <button
                type="button"
                disabled={toggling}
                onClick={handleToggleOnlineStatus}
                className={`rider-compact-status-pill ${isOnline ? 'online' : 'offline'}`}
                title={`Currently ${isOnline ? 'Online' : 'Offline'} — Tap to switch`}
              >
                <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
            </div>

            {/* Far Right Action Icons: Notification Bell + Red Logout Button */}
            <div className="rider-header-right-icons">
              <NotificationBell />

              {/* Active Delivery Status Badge (Desktop/Tablet) */}
              {activeDelivery && (
                <div
                  className="rider-active-delivery-badge"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '20px',
                    backgroundColor: '#FEF3C7', color: '#B45309',
                    fontSize: '0.72rem', fontWeight: 800,
                    border: '1px solid #FDE68A',
                  }}
                >
                  <Navigation size={12} className="animate-spin" />
                  <span>LIVE</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rider-header-logout-btn"
                aria-label="Logout"
                title="Logout Account"
              >
                <LogOut size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Body Container */}
        <main className="dashboard-main-content rider-main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>

        {/* RIDER MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="rider-mobile-bottom-nav" aria-label="Rider Mobile Bottom Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `rider-bottom-nav-item ${isActive ? 'active' : ''}`}
            title="Customer Marketplace"
          >
            <span className="rider-nav-icon-wrap">
              <Home size={19} />
            </span>
            <span className="rider-nav-label">Home</span>
          </NavLink>

          <NavLink
            to="/rider/dashboard"
            end
            className={({ isActive }) => `rider-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="rider-nav-icon-wrap">
              <LayoutDashboard size={19} />
            </span>
            <span className="rider-nav-label">Overview</span>
          </NavLink>

          <NavLink
            to="/rider/deliveries"
            className={({ isActive }) => `rider-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="rider-nav-icon-wrap">
              <MapPin size={19} />
            </span>
            <span className="rider-nav-label">Jobs</span>
          </NavLink>

          <NavLink
            to="/rider/active-delivery"
            className={({ isActive }) => `rider-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="rider-nav-icon-wrap" style={{ position: 'relative' }}>
              <Navigation size={19} />
              {activeDelivery && <span className="rider-nav-live-dot" />}
            </span>
            <span className="rider-nav-label">Active</span>
          </NavLink>

          <NavLink
            to="/rider/history"
            className={({ isActive }) => `rider-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="rider-nav-icon-wrap">
              <History size={19} />
            </span>
            <span className="rider-nav-label">History</span>
          </NavLink>

          <NavLink
            to="/rider/profile"
            className={({ isActive }) => `rider-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="rider-nav-icon-wrap">
              <User size={19} />
            </span>
            <span className="rider-nav-label">Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
