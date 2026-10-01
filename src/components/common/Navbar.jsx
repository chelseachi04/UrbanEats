import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, User, LogOut, UserCheck, ShoppingCart, Store, Bike, 
  Home, UtensilsCrossed, HeartPulse, Info, ChevronRight, Search, SlidersHorizontal, Bell 
} from 'lucide-react';
import { logoImg } from '../../data/restaurantsData';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationBell from './NotificationBell';

// Desktop sub-nav link definitions (for spotlight beam)
const DESKTOP_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/restaurants', label: 'Order Food' },
  { to: '/food-health', label: 'Food & Health' },
  { to: '/about',       label: 'About Us' },
];

// Mobile bottom-nav tab definitions (for curved dip indicator)
const MOBILE_TABS = [
  { to: '/',            label: 'Home',    Icon: Home,          exact: true },
  { to: '/restaurants', label: 'Order',   Icon: UtensilsCrossed, exact: false },
  { to: '/cart',        label: 'My Cart', Icon: ShoppingCart,  exact: true  },
  { to: '/profile',     label: 'Profile', Icon: User,          exact: false },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  // Tracks the hovered desktop link (null = none), for spotlight beam
  const [hoveredLink, setHoveredLink] = useState(null);

  const desktopSearchRef    = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, openLogin, logoutUser } = useAuth();
  const { itemCount } = useCart();

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu  = () => setMobileMenuOpen(false);
  const isActive = (path, exact = true) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  // Derive active desktop link index (for spotlight beam default position)
  const activeDesktopIdx = DESKTOP_LINKS.findIndex(l => location.pathname === l.to);

  // Derive active mobile tab index (for curved dip offset)
  const activeMobileIdx = (() => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/restaurant')) return 1;
    if (location.pathname === '/cart') return 2;
    if (
      location.pathname === '/profile' ||
      location.pathname.startsWith('/vendor') ||
      location.pathname.startsWith('/rider') ||
      location.pathname.startsWith('/admin')
    ) return 3;
    return -1;
  })();

  // Click outside to collapse desktop search
  useEffect(() => {
    function handleClickOutside(event) {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target)) {
        setDesktopSearchOpen(false);
      }
    }
    if (desktopSearchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [desktopSearchOpen]);

  // Focus input when desktop search expands
  useEffect(() => {
    if (desktopSearchOpen && desktopSearchInputRef.current) {
      desktopSearchInputRef.current.focus();
    }
  }, [desktopSearchOpen]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logoutUser();
    closeMobileMenu();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
  };

  // Mobile profile tab click
  const handleProfileTabClick = () => {
    if (!user)                          openLogin('customer');
    else if (user.role === 'vendor')    navigate('/vendor/dashboard');
    else if (user.role === 'rider')     navigate('/rider/dashboard');
    else if (user.role === 'admin')     navigate('/admin');
    else                                navigate('/profile');
  };

  const displayName        = user ? (user.full_name || 'UrbanEats User') : 'Welcome to UrbanEats';
  const displayEmailOrRole = user
    ? (user.email || (user.role ? `${user.role.toUpperCase()} Member` : 'Abraka Member'))
    : 'Sign in to manage your orders';

  // Spotlight beam: use hovered index if hovering, else fallback to active
  const beamIdx = hoveredLink !== null ? hoveredLink : activeDesktopIdx;

  // Check if currently on detailed user profile page or sub-pages that render their own header
  const tabParam = new URLSearchParams(location.search).get('tab');

  // Sub-pages that render their own back-arrow header — hide top navbar bars on these
  const SUB_PAGES_WITH_OWN_HEADER = [
    '/contact',
    '/notifications',
    '/checkout',
    '/about',
    '/food-health',
    '/health',
    '/faq',
    '/support',
    '/terms',
    '/privacy',
    '/legal'
  ];
  const isSubPageWithOwnHeader =
    SUB_PAGES_WITH_OWN_HEADER.some((p) => location.pathname.startsWith(p)) ||
    location.pathname.startsWith('/orders/') ||
    location.pathname.startsWith('/order-confirmation/') ||
    location.pathname === '/profile';

  // On mobile, sub-pages with their own headers hide the generic mobile top header
  const MOBILE_SUB_PAGES = [
    '/restaurant/',
    '/food-health',
    '/health',
    '/about',
    '/contact',
    '/notifications',
    '/checkout',
    '/faq',
    '/support',
    '/terms',
    '/privacy',
    '/legal'
  ];
  const hideMobileTopHeader =
    isSubPageWithOwnHeader ||
    MOBILE_SUB_PAGES.some((p) => location.pathname.startsWith(p));

  return (
    <nav className={isSubPageWithOwnHeader ? 'navbar navbar-subpage-empty' : 'navbar'}>

      {/* ── Phone Sticky Top Header (< 768px) ───────────────────────────── */}
      {!hideMobileTopHeader && (
        <div className="phone-top-navbar" aria-label="Phone Top Header">
          {/* Left: Compact UrbanEats Logo Mark */}
          <Link to="/" className="phone-brand-mark" onClick={closeMobileMenu} aria-label="UrbanEats Home" title="UrbanEats Home">
            <img src={logoImg} alt="UrbanEats" className="phone-brand-logo-img" />
          </Link>

          {/* Center: Full Embedded Search Bar Pill with Filter Icon */}
          <form className="phone-search-form" onSubmit={handleSearchSubmit}>
            <Search size={16} className="phone-search-icon" />
            <input
              type="text"
              placeholder="Search food, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="phone-search-input"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="phone-search-clear-btn"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="phone-filter-btn"
                onClick={() => navigate('/restaurants')}
                aria-label="Filter & browse restaurants"
                title="Filter restaurants"
              >
                <SlidersHorizontal size={14} />
              </button>
            )}
          </form>

          {/* Right: Notification Bell Icon with Active Badge Counter */}
          <div className="phone-header-right">
            {user ? (
              <NotificationBell />
            ) : (
              <button
                type="button"
                className="phone-bell-guest-btn"
                onClick={() => openLogin('customer')}
                aria-label="Sign in to view notifications"
                title="Sign In"
              >
                <Bell size={19} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          UNIFIED NAVBAR — Tablet & Desktop (≥ 768px)
          Logo · Nav Links · Search + Bell + Cart + Profile + Logout
          Hidden on sub-pages that render their own back-arrow header.
          ══════════════════════════════════════════════════════════════════ */}
      {!isSubPageWithOwnHeader && (
        <div className="desktop-navbar tablet-unified-navbar">
          <div className="desktop-navbar-inner">

            {/* ── LEFT: Brand Logo ── */}
            <Link to="/" className="logo-brand desktop-nav-logo" onClick={closeMobileMenu}>
              <img src={logoImg} alt="UrbanEats Logo" className="logo-img" />
              <span className="logo-brand-text">UrbanEats</span>
            </Link>

            {/* ── CENTER: Navigation Links ── */}
            <nav className="desktop-nav-links" onMouseLeave={() => setHoveredLink(null)} aria-label="Main navigation">
              {DESKTOP_LINKS.map((link, idx) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`desktop-nav-link${active ? ' active' : ''}`}
                    onMouseEnter={() => setHoveredLink(idx)}
                  >
                    {link.label}
                    {active && <span className="desktop-nav-link-indicator" aria-hidden="true" />}
                  </Link>
                );
              })}
            </nav>

            {/* ── RIGHT: Action Icons + Auth ── */}
            <div className="desktop-nav-actions">

              {/* Search icon button — toggles dropdown */}
              <button
                type="button"
                className={`desktop-icon-btn${desktopSearchOpen ? ' active' : ''}`}
                onClick={() => setDesktopSearchOpen(prev => !prev)}
                aria-label="Toggle search"
                title="Search"
                ref={desktopSearchRef}
              >
                <Search size={19} />
              </button>

              {/* Notification Bell */}
              <NotificationBell />

              {/* Cart */}
              <Link
                to="/cart"
                className="desktop-icon-btn desktop-cart-btn"
                aria-label={`View cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                title="View Cart"
              >
                <ShoppingCart size={19} />
                {itemCount > 0 && (
                  <span className="desktop-icon-badge desktop-icon-badge--orange">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth section */}
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn btn-primary btn-sm desktop-portal-btn" style={{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' }}>
                      <Store size={15} /><span>Admin</span>
                    </Link>
                  )}
                  {user.role === 'vendor' && (
                    <Link to="/vendor/dashboard" className="btn btn-primary btn-sm desktop-portal-btn">
                      <Store size={15} /><span>Vendor</span>
                    </Link>
                  )}
                  {user.role === 'rider' && (
                    <Link to="/rider/dashboard" className="btn btn-primary btn-sm desktop-portal-btn">
                      <Bike size={15} /><span>Rider</span>
                    </Link>
                  )}
                  {(!user.role || user.role === 'customer') && (
                    <Link to="/profile" className="desktop-profile-btn" title="My Profile">
                      <UserCheck size={16} />
                      <span>{user.full_name ? user.full_name.split(' ')[0] : 'Profile'}</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    className="desktop-icon-btn desktop-logout-btn"
                    onClick={handleLogout}
                    title="Log Out"
                    aria-label="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => openLogin('customer')}>
                  <User size={17} /> Sign In
                </button>
              )}
            </div>
          </div>

          {/* ── Search Dropdown Panel ────────────────────────────────────── */}
          {desktopSearchOpen && (
            <div className="desktop-search-dropdown" ref={desktopSearchRef}>
              <form onSubmit={handleSearchSubmit} className="desktop-search-dropdown-form">
                <span className="search-lead-icon"><Search size={18} /></span>
                <input
                  ref={desktopSearchInputRef}
                  type="text"
                  placeholder="Search food, restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="desktop-search-input"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="desktop-search-close-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button type="submit" className="desktop-search-submit-btn" aria-label="Submit search">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      )}{/* /!isSubPageWithOwnHeader — end desktop-navbar */}

      {/* ══════════════════════════════════════════════════════════════════
          Mobile Slide-Out Navigation Drawer
          ══════════════════════════════════════════════════════════════════ */}
      <div className={`drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu} />

      <aside className={`drawer-sidebar ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="drawer-header">
          <div className="drawer-user-info">
            <div className="drawer-avatar">
              <User size={22} className="drawer-avatar-icon" />
            </div>
            <div className="drawer-user-details">
              <h4 className="drawer-user-name">{displayName}</h4>
              <p className="drawer-user-sub">{displayEmailOrRole}</p>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={closeMobileMenu} aria-label="Close navigation menu">
            <X size={22} />
          </button>
        </div>

        <div className="drawer-body">
          <nav className="drawer-nav">
            <Link to="/" className={`drawer-link ${isActive('/') ? 'active' : ''}`} onClick={closeMobileMenu}>
              <span className="drawer-link-left"><Home size={20} className="drawer-icon" /><span>Home</span></span>
              <ChevronRight size={16} className="drawer-chevron" />
            </Link>
            <Link to="/restaurants" className={`drawer-link ${isActive('/restaurants') ? 'active' : ''}`} onClick={closeMobileMenu}>
              <span className="drawer-link-left"><UtensilsCrossed size={20} className="drawer-icon" /><span>Order Food</span></span>
              <ChevronRight size={16} className="drawer-chevron" />
            </Link>
            <Link to="/food-health" className={`drawer-link ${isActive('/food-health') ? 'active' : ''}`} onClick={closeMobileMenu}>
              <span className="drawer-link-left"><HeartPulse size={20} className="drawer-icon" /><span>Food &amp; Health</span></span>
              <ChevronRight size={16} className="drawer-chevron" />
            </Link>
            <Link to="/about" className={`drawer-link ${isActive('/about') ? 'active' : ''}`} onClick={closeMobileMenu}>
              <span className="drawer-link-left"><Info size={20} className="drawer-icon" /><span>About Us</span></span>
              <ChevronRight size={16} className="drawer-chevron" />
            </Link>
            <Link to="/cart" className={`drawer-link ${isActive('/cart') ? 'active' : ''}`} onClick={closeMobileMenu}>
              <span className="drawer-link-left"><ShoppingCart size={20} className="drawer-icon" /><span>Cart</span></span>
              {itemCount > 0 ? (
                <span className="drawer-cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
              ) : (
                <ChevronRight size={16} className="drawer-chevron" />
              )}
            </Link>

            {user && (
              <div className="drawer-portal-links">
                {user.role === 'admin' && (
                  <Link to="/admin" className={`drawer-link ${isActive('/admin') ? 'active' : ''}`} onClick={closeMobileMenu}>
                    <span className="drawer-link-left"><Store size={20} className="drawer-icon" /><span>Admin Portal</span></span>
                    <ChevronRight size={16} className="drawer-chevron" />
                  </Link>
                )}
                {user.role === 'vendor' && (
                  <Link to="/vendor/dashboard" className={`drawer-link ${isActive('/vendor/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
                    <span className="drawer-link-left"><Store size={20} className="drawer-icon" /><span>Vendor Dashboard</span></span>
                    <ChevronRight size={16} className="drawer-chevron" />
                  </Link>
                )}
                {user.role === 'rider' && (
                  <Link to="/rider/dashboard" className={`drawer-link ${isActive('/rider/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
                    <span className="drawer-link-left"><Bike size={20} className="drawer-icon" /><span>Rider Dashboard</span></span>
                    <ChevronRight size={16} className="drawer-chevron" />
                  </Link>
                )}
                {(!user.role || user.role === 'customer') && (
                  <Link to="/profile" className={`drawer-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMobileMenu}>
                    <span className="drawer-link-left"><UserCheck size={20} className="drawer-icon" /><span>My Profile</span></span>
                    <ChevronRight size={16} className="drawer-chevron" />
                  </Link>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="drawer-footer">
          {user ? (
            <button className="btn-logout-pill" onClick={handleLogout} style={{ width: '100%' }}>
              <LogOut size={18} /><span>Logout</span>
            </button>
          ) : (
            <button className="drawer-action-btn drawer-btn-signin" onClick={() => { closeMobileMenu(); openLogin('customer'); }}>
              <User size={20} /><span>Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          Smartphone Fixed Bottom Navigation Bar (≤ 576px)
          Expanding Pill Indicator style:
          - Inactive tabs: icon only, muted gray, centered
          - Active tab: horizontal pill capsule with soft accent bg + icon + bold label
          ══════════════════════════════════════════════════════════════════ */}
      <nav className="mobile-bottom-nav" aria-label="Smartphone Mobile Bottom Navigation">

        {/* Tab: Home */}
        <Link to="/" className={`mobile-bottom-nav-item${activeMobileIdx === 0 ? ' active' : ''}`}>
          <span className="mbn-icon-wrap">
            <Home size={20} strokeWidth={activeMobileIdx === 0 ? 2.4 : 1.8} />
          </span>
          <span className="mbn-label">Home</span>
        </Link>

        {/* Tab: Order */}
        <Link
          to="/restaurants"
          className={`mobile-bottom-nav-item${activeMobileIdx === 1 ? ' active' : ''}`}
        >
          <span className="mbn-icon-wrap">
            <UtensilsCrossed size={20} strokeWidth={activeMobileIdx === 1 ? 2.4 : 1.8} />
          </span>
          <span className="mbn-label">Order</span>
        </Link>

        {/* Tab: Cart */}
        <Link to="/cart" className={`mobile-bottom-nav-item${activeMobileIdx === 2 ? ' active' : ''}`}>
          <span className="mbn-icon-wrap" style={{ position: 'relative' }}>
            <ShoppingCart size={20} strokeWidth={activeMobileIdx === 2 ? 2.4 : 1.8} />
            {itemCount > 0 && (
              <span className="mbn-badge">{itemCount > 99 ? '99+' : itemCount}</span>
            )}
          </span>
          <span className="mbn-label">My Cart</span>
        </Link>

        {/* Tab: Profile */}
        <button
          type="button"
          className={`mobile-bottom-nav-item${activeMobileIdx === 3 ? ' active' : ''}`}
          onClick={handleProfileTabClick}
        >
          <span className="mbn-icon-wrap">
            <User size={20} strokeWidth={activeMobileIdx === 3 ? 2.4 : 1.8} />
          </span>
          <span className="mbn-label">Profile</span>
        </button>

      </nav>
    </nav>
  );
}
