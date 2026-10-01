import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  User,
  Heart,
  Truck,
  Package,
  Settings,
  HeartPulse,
  Info,
  HelpCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── Gradient palette for icon badges ─── */
const ICON_GRADIENTS = {
  orange:  'linear-gradient(135deg, #FF5A1F 0%, #FF8C00 100%)',
  rose:    'linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)',
  emerald: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  blue:    'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
  teal:    'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
  indigo:  'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
};

/* ─── MenuItem: Router Link or Button with left-aligned text & Chevron ─── */
function MenuItem({ icon: Icon, gradient, title, subtitle, to, onClick }) {
  const handleClick = (e) => {
    try {
      sessionStorage.setItem('scroll_/profile', window.scrollY.toString());
    } catch {
      // ignore
    }
    if (onClick) onClick(e);
  };

  const innerContent = (
    <div className="mps-menu-item">
      <span className="mps-menu-icon" style={{ background: gradient }}>
        <Icon size={18} color="#fff" />
      </span>
      <div className="mps-menu-text">
        <span className="mps-menu-title">{title}</span>
        {subtitle && <span className="mps-menu-sub">{subtitle}</span>}
      </div>
      <ChevronRight size={18} className="mps-menu-chevron" />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="mps-menu-btn" onClick={handleClick}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button type="button" className="mps-menu-btn" onClick={handleClick}>
      {innerContent}
    </button>
  );
}

/* ─── Main Component ─── */
export default function MobileProfileScreen() {
  const navigate = useNavigate();
  const { user, logoutUser, openLogin } = useAuth();

  /* Derived user data */
  const fullName  = user ? (user.full_name || user.name || 'UrbanEats User') : 'Guest User';
  const email     = user ? (user.email || 'No email on file') : 'Sign in to continue';
  const nameParts = fullName.trim().split(' ');
  const initials  = nameParts.length >= 2 && nameParts[0] && nameParts[1]
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    : fullName.slice(0, 2).toUpperCase();

  /* Logout: clear session → redirect home */
  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  /* Deep-link guard check */
  const handleItemClick = (e, section) => {
    try {
      sessionStorage.setItem('scroll_/profile', window.scrollY.toString());
    } catch {
      // ignore
    }
    if (!user) {
      e.preventDefault();
      openLogin('customer');
    }
  };

  /* Restore scroll position on mount if returning to profile menu */
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('scroll_/profile');
      if (saved) {
        const y = parseFloat(saved);
        if (y > 0) {
          window.scrollTo({ top: y, left: 0, behavior: 'instant' });
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' });
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="mps-root" aria-label="Mobile Profile Screen">

      {/* ── Scrollable Body ── */}
      <div className="mps-body">

        {/* ── User Identity Card — tap to go to full profile ── */}
        <section className="mps-card mps-identity-card">
          <Link
            to="/profile?tab=overview"
            className="mps-identity-row"
            onClick={(e) => handleItemClick(e, 'overview')}
            aria-label="View full account profile"
            style={{ textDecoration: 'none', width: '100%', display: 'flex', alignItems: 'center' }}
          >
            <div className="mps-avatar">
              <span className="mps-avatar-initials">{initials}</span>
              <span className="mps-avatar-ring" />
            </div>
            <div className="mps-identity-info">
              <p className="mps-identity-name">{fullName}</p>
              <p className="mps-identity-email">{email}</p>
            </div>
            <span className="mps-edit-btn" aria-hidden="true">
              <Edit3 size={15} />
            </span>
          </Link>
        </section>

        {/* ── Primary Menu ── */}
        <section className="mps-section">
          <div className="mps-menu-list">

            <MenuItem
              icon={User}
              gradient={ICON_GRADIENTS.orange}
              title="User Profile"
              subtitle="Personal Info & Account Details"
              to="/profile?tab=overview"
              onClick={(e) => handleItemClick(e, 'overview')}
            />
            <div className="mps-menu-separator" />

            <MenuItem
              icon={Heart}
              gradient={ICON_GRADIENTS.rose}
              title="Favorites & Wishlist"
              subtitle="Saved Items & Liked Dishes"
              to="/profile?tab=favorites"
              onClick={(e) => handleItemClick(e, 'favorites')}
            />
            <div className="mps-menu-separator" />

            <MenuItem
              icon={Package}
              gradient={ICON_GRADIENTS.indigo}
              title="My Orders & History"
              subtitle="Past Purchases & Order Receipts"
              to="/profile?tab=orders"
              onClick={(e) => handleItemClick(e, 'orders')}
            />
            <div className="mps-menu-separator" />

            <MenuItem
              icon={Truck}
              gradient={ICON_GRADIENTS.blue}
              title="Track Live Order"
              subtitle="Active Order Status & Timeline"
              to="/profile?tab=track"
              onClick={(e) => handleItemClick(e, 'track')}
            />
            <div className="mps-menu-separator" />

            <MenuItem
              icon={Settings}
              gradient={ICON_GRADIENTS.emerald}
              title="Account Settings"
              subtitle="Security & Notifications"
              to="/profile?tab=settings"
              onClick={(e) => handleItemClick(e, 'settings')}
            />
          </div>
        </section>

        {/* ── Section Divider ── */}
        <div className="mps-section-divider" />

        {/* ── Secondary Menu & Logout ── */}
        <section className="mps-section">
          <div className="mps-menu-list">

            <MenuItem
              icon={HeartPulse}
              gradient={ICON_GRADIENTS.rose}
              title="Food & Health"
              subtitle="Nutritional Advice & Healthy Eating Guides"
              to="/food-health"
            />
            <div className="mps-menu-separator" />

            <MenuItem
              icon={Info}
              gradient={ICON_GRADIENTS.blue}
              title="About UrbanEats"
              subtitle="Our Story & Local Abraka Partner Restaurants"
              to="/about"
            />
            <div className="mps-menu-separator" />

            <MenuItem
              icon={HelpCircle}
              gradient={ICON_GRADIENTS.teal}
              title="FAQ & Support"
              subtitle="Payments, Delivery Info & Help"
              to="/faq"
            />

            {/* ── Bottom Logout Menu Row ── */}
            {user && (
              <>
                <div className="mps-menu-separator" />
                <button
                  type="button"
                  className="mps-menu-btn mps-logout-row-btn"
                  onClick={handleLogout}
                  aria-label="Log out of account"
                >
                  <div className="mps-menu-item mps-logout-menu-item">
                    <span className="mps-menu-icon mps-logout-icon-badge">
                      <LogOut size={18} color="#EF4444" />
                    </span>
                    <div className="mps-menu-text">
                      <span className="mps-menu-title mps-logout-title">Log Out</span>
                      <span className="mps-menu-sub mps-logout-sub">Sign out of your session</span>
                    </div>
                    <ChevronRight size={18} className="mps-menu-chevron mps-logout-chevron" />
                  </div>
                </button>
              </>
            )}
          </div>
        </section>

        {/* Bottom breathing space for 90px clearance above bottom navbar */}
        <div style={{ height: '24px' }} />
      </div>
    </div>
  );
}
