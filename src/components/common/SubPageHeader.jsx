/**
 * SubPageHeader — UrbanEats Reusable Sub-Page Header
 *
 * Renders a sticky, clean light header bar with:
 *   Left   : Standalone back arrow button (navigate(-1) or custom onBack)
 *   Center : Clean, bold page title (font-weight: 700; color: #0f172a;)
 *   Right  : Clean logout/exit icon button or contextual action (or spacer for balance)
 *
 * Sticky at top: 0 with z-index: 100 on sub-pages.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SubPageHeader({
  title,
  rightAction = null,
  showLogout = false,
  onLogout = null,
  onBack = null,
  className = ''
}) {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(-1);
    }
  };

  const handleDefaultLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await logoutUser();
      navigate('/');
    }
  };

  // Determine what to display on the right side
  let rightContent = null;
  if (rightAction) {
    rightContent = rightAction;
  } else if (showLogout || (user && showLogout !== false && false)) {
    rightContent = (
      <button
        type="button"
        className="sub-page-logout-btn"
        onClick={handleDefaultLogout}
        aria-label="Log Out"
        title="Log Out"
      >
        <LogOut size={18} strokeWidth={2} />
      </button>
    );
  } else if (showLogout && user) {
    rightContent = (
      <button
        type="button"
        className="sub-page-logout-btn"
        onClick={handleDefaultLogout}
        aria-label="Log Out"
        title="Log Out"
      >
        <LogOut size={18} strokeWidth={2} />
      </button>
    );
  }

  return (
    <header className={`sub-page-header ${className}`} aria-label={`${title} header`}>
      {/* Left: Standalone Back Arrow */}
      <button
        type="button"
        className="sub-page-back-btn"
        onClick={handleBack}
        aria-label="Go back"
        title="Back"
      >
        <ArrowLeft size={20} strokeWidth={2.2} />
      </button>

      {/* Center: Bold Page Title */}
      <h1 className="sub-page-title">{title}</h1>

      {/* Right: Contextual Action, Logout Icon, or Symmetrical Spacer */}
      <div className="sub-page-right-action">
        {rightContent}
      </div>
    </header>
  );
}
