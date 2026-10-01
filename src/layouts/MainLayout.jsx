import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';

const SUB_PAGES = [
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

export default function MainLayout({ children }) {
  const location = useLocation();
  const isSubPage =
    SUB_PAGES.some((p) => location.pathname.startsWith(p)) ||
    location.pathname.startsWith('/orders/') ||
    location.pathname.startsWith('/order-confirmation/') ||
    location.pathname === '/profile';

  return (
    <div className={`page-wrapper ${isSubPage ? 'sub-page-mode' : ''}`}>
      <Navbar />
      <main className={`main-content ${isSubPage ? 'main-content-subpage' : ''}`}>{children}</main>
      <Footer />
      <AuthModal />
    </div>
  );
}
