import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ScrollToTop from '../components/common/ScrollToTop';
import FloatingActionGroup from '../components/common/FloatingActionGroup';
import PageSpinner from '../components/common/PageSpinner';

// Customer & Marketplace Pages (Lazy Loaded)
const HomePage = lazy(() => import('../pages/HomePage'));
const RestaurantsPage = lazy(() => import('../pages/RestaurantsPage'));
const RestaurantDetailPage = lazy(() => import('../pages/RestaurantDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const FoodHealthPage = lazy(() => import('../pages/FoodHealthPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const TermsPrivacyPage = lazy(() => import('../pages/TermsPrivacyPage'));
const CustomerProfilePage = lazy(() => import('../pages/CustomerProfilePage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
const OrderDetailsPage = lazy(() => import('../pages/OrderDetailsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));

// Vendor Portal imports
import VendorGuard from '../components/vendor/VendorGuard';
import VendorLayout from '../components/vendor/VendorLayout';
const VendorDashboardPage = lazy(() => import('../pages/vendor/VendorDashboardPage'));
const VendorOrdersPage = lazy(() => import('../pages/vendor/VendorOrdersPage'));
const VendorOrderDetailsPage = lazy(() => import('../pages/vendor/VendorOrderDetailsPage'));
const VendorMenuPage = lazy(() => import('../pages/vendor/VendorMenuPage'));
const VendorRestaurantPage = lazy(() => import('../pages/vendor/VendorRestaurantPage'));

// Rider Portal imports
import RiderGuard from '../components/rider/RiderGuard';
import RiderLayout from '../components/rider/RiderLayout';
const RiderDashboardPage = lazy(() => import('../pages/rider/RiderDashboardPage'));
const RiderDeliveriesPage = lazy(() => import('../pages/rider/RiderDeliveriesPage'));
const RiderActiveDeliveryPage = lazy(() => import('../pages/rider/RiderActiveDeliveryPage'));
const RiderHistoryPage = lazy(() => import('../pages/rider/RiderHistoryPage'));
const RiderProfilePage = lazy(() => import('../pages/rider/RiderProfilePage'));

// Admin Portal imports
import AdminGuard from '../components/admin/AdminGuard';
import AdminLayout from '../components/admin/AdminLayout';
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminVendorsPage = lazy(() => import('../pages/admin/AdminVendorsPage'));
const AdminRidersPage = lazy(() => import('../pages/admin/AdminRidersPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminRestaurantsPage = lazy(() => import('../pages/admin/AdminRestaurantsPage'));
const AdminFeaturedManager = lazy(() => import('../pages/admin/AdminFeaturedManager'));

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <FloatingActionGroup />
      <Routes>
        {/* VENDOR PORTAL ROUTES — VendorLayout has its own internal Suspense */}
        <Route
          path="/vendor"
          element={
            <VendorGuard>
              <VendorLayout />
            </VendorGuard>
          }
        >
          <Route index element={<Suspense fallback={null}><VendorDashboardPage /></Suspense>} />
          <Route path="dashboard" element={<Suspense fallback={null}><VendorDashboardPage /></Suspense>} />
          <Route path="overview" element={<Suspense fallback={null}><VendorDashboardPage /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={null}><VendorOrdersPage /></Suspense>} />
          <Route path="orders/:orderId" element={<Suspense fallback={null}><VendorOrderDetailsPage /></Suspense>} />
          <Route path="menu" element={<Suspense fallback={null}><VendorMenuPage /></Suspense>} />
          <Route path="restaurant" element={<Suspense fallback={null}><VendorRestaurantPage /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={null}><VendorRestaurantPage /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={null}><NotificationsPage /></Suspense>} />
        </Route>

        {/* ADMIN PORTAL ROUTES — AdminLayout has its own internal Suspense */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Suspense fallback={null}><AdminDashboardPage /></Suspense>} />
          <Route path="dashboard"   element={<Suspense fallback={null}><AdminDashboardPage /></Suspense>} />
          <Route path="vendors"     element={<Suspense fallback={null}><AdminVendorsPage /></Suspense>} />
          <Route path="riders"      element={<Suspense fallback={null}><AdminRidersPage /></Suspense>} />
          <Route path="users"       element={<Suspense fallback={null}><AdminUsersPage /></Suspense>} />
          <Route path="orders"      element={<Suspense fallback={null}><AdminOrdersPage /></Suspense>} />
          <Route path="restaurants" element={<Suspense fallback={null}><AdminRestaurantsPage /></Suspense>} />
          <Route path="featured"    element={<Suspense fallback={null}><AdminFeaturedManager /></Suspense>} />
          <Route path="showcase"    element={<Suspense fallback={null}><AdminFeaturedManager /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={null}><NotificationsPage /></Suspense>} />
        </Route>

        {/* RIDER PORTAL ROUTES — RiderLayout has its own internal Suspense */}
        <Route
          path="/rider"
          element={
            <RiderGuard>
              <RiderLayout />
            </RiderGuard>
          }
        >
          <Route index element={<Suspense fallback={null}><RiderDashboardPage /></Suspense>} />
          <Route path="dashboard" element={<Suspense fallback={null}><RiderDashboardPage /></Suspense>} />
          <Route path="deliveries" element={<Suspense fallback={null}><RiderDeliveriesPage /></Suspense>} />
          <Route path="active-delivery" element={<Suspense fallback={null}><RiderActiveDeliveryPage /></Suspense>} />
          <Route path="history" element={<Suspense fallback={null}><RiderHistoryPage /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={null}><RiderProfilePage /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={null}><NotificationsPage /></Suspense>} />
        </Route>

        {/* CUSTOMER & MARKETPLACE ROUTES — use global PageSpinner */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Suspense fallback={<PageSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                  <Route path="/food-health" element={<FoodHealthPage />} />
                  <Route path="/health" element={<FoodHealthPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/support" element={<FAQPage />} />
                  <Route path="/contact" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPrivacyPage />} />
                  <Route path="/privacy" element={<TermsPrivacyPage />} />
                  <Route path="/legal" element={<TermsPrivacyPage />} />
                  <Route path="/profile" element={<CustomerProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}

