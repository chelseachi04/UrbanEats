import React, { useState, Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from '../common/NotificationBell';
import {
  LayoutDashboard, Users, Store, ShoppingBag, Bike,
  UtensilsCrossed, LogOut, ArrowLeft, Menu, Shield, Bell, Sparkles, Home,
} from 'lucide-react';

// ── Skeleton shown while lazy sub-pages load (no full-screen white flash) ──
function AdminPageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '0.5rem' }}>
      {[120, 80, 80, 60, 60].map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`, borderRadius: '14px',
            background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'vendor-skeleton-shimmer 1.4s ease infinite',
          }}
        />
      ))}
    </div>
  );
}

export default function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview',          path: '/admin/dashboard',   icon: LayoutDashboard },
    { label: 'Featured Showcase', path: '/admin/featured',    icon: Sparkles },
    { label: 'Vendors',           path: '/admin/vendors',     icon: Store },
    { label: 'Riders',            path: '/admin/riders',      icon: Bike },
    { label: 'Users',             path: '/admin/users',       icon: Users },
    { label: 'Orders',            path: '/admin/orders',      icon: ShoppingBag },
    { label: 'Restaurants',       path: '/admin/restaurants', icon: UtensilsCrossed },
    { label: 'Notifications',     path: '/admin/notifications', icon: Bell, badge: unreadCount },
  ];

  // Bottom nav shows primary tabs on mobile including Home to marketplace
  const bottomNavItems = [
    { label: 'Home',      path: '/',                  icon: Home },
    { label: 'Overview',  path: '/admin/dashboard',   icon: LayoutDashboard },
    { label: 'Vendors',   path: '/admin/vendors',     icon: Store },
    { label: 'Orders',    path: '/admin/orders',      icon: ShoppingBag },
    { label: 'Users',     path: '/admin/users',       icon: Users },
    { label: 'More',      path: '/admin/restaurants', icon: UtensilsCrossed },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside style={{
      width: mobile ? '100%' : '240px',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: mobile ? 'none' : '1px solid #1E293B',
      minHeight: mobile ? 'auto' : '100vh',
    }}>
      {/* Brand */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>UrbanEats</div>
          <div style={{ fontSize: '0.65rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Portal</div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ label, path, icon: Icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              fontSize: '0.85rem', fontWeight: isActive ? 800 : 600,
              color: isActive ? '#fff' : '#94A3B8',
              background: isActive ? 'var(--primary)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s ease',
            })}
          >
            <Icon size={17} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge > 0 && (
              <span style={{ backgroundColor: '#EF4444', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px' }}>
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '4px', paddingLeft: '4px' }}>
          Signed in as <strong style={{ color: '#94A3B8' }}>{user?.full_name || 'Admin'}</strong>
        </div>
        <button onClick={() => navigate('/')} style={btnStyle('#1E293B', '#94A3B8')}>
          <ArrowLeft size={14} /> Marketplace
        </button>
        <button onClick={handleLogout} className="btn-logout-pill" style={{ width: '100%' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="admin-sidebar-desktop">
        <Sidebar />
      </div>
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-mobile-bar { display: none !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
        />
      )}
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', zIndex: 50, overflowY: 'auto' }}>
          <Sidebar mobile />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '60px', background: '#fff', borderBottom: '1px solid #E2E8F0',
          padding: '0 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <button
            className="admin-mobile-bar"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>Admin Management Portal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <NotificationBell />
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
              {user?.full_name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'none' }} className="admin-sidebar-desktop">
              {user?.full_name}
            </span>
          </div>
        </header>

        {/* ── Page Content: Suspense scoped here so the shell never flickers ── */}
        <main
          className="admin-main-content"
          style={{ flex: 1, padding: '1.75rem', overflowY: 'auto', maxWidth: '1400px', width: '100%', margin: '0 auto', scrollbarGutter: 'stable' }}
        >
          <Suspense fallback={<AdminPageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>

        {/* ── Mobile Bottom Navigation Bar ── */}
        <nav className="admin-mobile-bottom-nav" aria-label="Admin Mobile Bottom Navigation">
          {bottomNavItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `admin-bottom-nav-item${isActive ? ' active' : ''}`}
              title={label}
            >
              <span className="admin-nav-icon-wrap">
                <Icon size={20} />
              </span>
              <span className="admin-nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: 'none', background: bg, color, fontSize: '0.8rem',
    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
  };
}
