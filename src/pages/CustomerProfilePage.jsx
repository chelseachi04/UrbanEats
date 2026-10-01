import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Package,
  Truck,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Edit3,
  Lock,
  UtensilsCrossed,
  Loader2,
  RefreshCw,
  Trash2,
  Store,
  Plus,
  Phone,
  Check,
  CheckCheck,
  Archive,
  RotateCcw,
  Menu,
  X as XIcon,
  HeartPulse,
  Info,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../context/CartContext';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAddresses } from '../hooks/useAddresses';
import { useOrders } from '../hooks/useOrders';
import CartConflictModal from '../components/cart/CartConflictModal';
import FoodCustomizationModal from '../components/food/FoodCustomizationModal';
import AddressFormModal from '../components/profile/AddressFormModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import { getFoodItemImage } from '../data/imageAssets';
import ImageWithFallback from '../components/common/ImageWithFallback';
import SubPageHeader from '../components/common/SubPageHeader';
import MobileProfileScreen from '../components/profile/MobileProfileScreen';

export default function CustomerProfilePage() {
  const { user, isAuthLoading, logoutUser, openLogin } = useAuth();
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite, favLoading, favError, refetchFavorites } = useFavorites();
  const { addToCart, replaceCartAndAdd, cartRestaurantName } = useCart();
  const { requireAuth } = useAuthGuard();
  const { addresses, loading: addrLoading, error: addrError, addAddress, editAddress, removeAddress, refetchAddresses } = useAddresses();
  const { orders, archivedOrders, activeOrder, loading: ordersLoading, error: ordersError, archiveOrder, restoreOrder, refetchOrders } = useOrders();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab'); // e.g. 'favorites', 'orders', 'settings'

  const [activeTab, setActiveTab] = useState(
    tabFromUrl && ['overview','orders','track','favorites','addresses','payment','notifications','settings'].includes(tabFromUrl)
      ? tabFromUrl
      : 'overview'
  );

  React.useEffect(() => {
    if (tabFromUrl && ['overview','orders','track','favorites','addresses','payment','notifications','settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Synchronize tab changes to URL query parameters to preserve router history stack
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (searchParams.get('tab') !== tabId) {
      navigate(`/profile?tab=${tabId}`);
    }
  };

  // State-preserving & history-aware back navigation
  const handleBackNavigation = () => {
    if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (activeTab !== 'overview') {
      handleTabChange('overview');
    } else {
      navigate('/profile');
    }
  };

  const [removeToast, setRemoveToast]         = useState(null);
  const [conflictPending, setConflictPending] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress]         = useState(null);
  const [addressToast, setAddressToast]             = useState(null);

  const [isEditProfileOpen, setIsEditProfileOpen]   = useState(false);
  const [orderViewMode, setOrderViewMode]           = useState('active'); // 'active' | 'archived'
  const [archiveConfirmOrder, setArchiveConfirmOrder] = useState(null);

  /* ── Profile drawer (hamburger menu) ── */
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const openProfileDrawer  = () => setIsProfileDrawerOpen(true);
  const closeProfileDrawer = () => setIsProfileDrawerOpen(false);

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (formData) => {
    if (editingAddress) {
      await editAddress(editingAddress.id, formData);
      setAddressToast('Address updated successfully');
    } else {
      await addAddress(formData);
      setAddressToast('New delivery address saved');
    }
    setTimeout(() => setAddressToast(null), 3000);
  };

  const handleDeleteAddress = async (id, label) => {
    try {
      await removeAddress(id);
      setAddressToast(`"${label}" address removed`);
      setTimeout(() => setAddressToast(null), 3000);
    } catch {
      setAddressToast('Unable to delete address');
      setTimeout(() => setAddressToast(null), 3000);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleRemoveFavorite = async (e, foodItemId, foodName) => {
    try {
      await toggleFavorite(e, foodItemId, foodName);
      setRemoveToast(`"${foodName}" removed from favorites`);
      setTimeout(() => setRemoveToast(null), 3000);
    } catch {
      setRemoveToast('Failed to remove favorite. Please try again.');
      setTimeout(() => setRemoveToast(null), 3000);
    }
  };

  // Favorite dish customization modal state
  const [customizingFavItem, setCustomizingFavItem]             = useState(null);
  const [customizingFavRestaurant, setCustomizingFavRestaurant] = useState(null);

  const handleAddToCartFromFav = (e, fav) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (!requireAuth()) return;

    const foodItem = {
      id: fav.food_item_id,
      name: fav.food_name,
      price: fav.food_price,
      slug: fav.food_slug,
      category_name: fav.category_name,
      image: fav.food_image || fav.image || fav.food_image_url || fav.image_url,
      image_url: fav.food_image_url || fav.image_url || fav.food_image || fav.image,
    };
    const restaurant = {
      id: fav.restaurant_id,
      name: fav.restaurant_name,
    };

    setCustomizingFavItem(foodItem);
    setCustomizingFavRestaurant(restaurant);
  };

  const handleAddCustomizedFavToCart = ({ foodItem, restaurant, customizations }) => {
    const result = addToCart(foodItem, restaurant, customizations);
    if (result === 'conflict') {
      setConflictPending({ foodItem, restaurant, customizations });
      return;
    }
    if (result === true) {
      const portionText = customizations?.portion ? ` (${customizations.portion})` : '';
      setRemoveToast(`"${foodItem.name}"${portionText} added to cart`);
      setTimeout(() => setRemoveToast(null), 3000);
    }
  };

  const handleConflictConfirm = () => {
    if (!conflictPending) return;
    replaceCartAndAdd(conflictPending.foodItem, conflictPending.restaurant, conflictPending.customizations);
    setRemoveToast(`Cart updated — "${conflictPending.foodItem.name}" added`);
    setTimeout(() => setRemoveToast(null), 3000);
    setConflictPending(null);
  };

  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2.5rem 1.5rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Access Restricted
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            You must be logged in to access the Customer Account Center.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => navigate('/')} style={{ borderRadius: '12px' }}>
              <ArrowLeft size={18} />
              Home
            </button>
            <button className="btn btn-primary" onClick={() => openLogin('customer')} style={{ borderRadius: '12px' }}>
              <User size={18} />
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real Authenticated User Details
  const fullName = user.full_name || user.name || 'Customer';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const email = user.email || 'No email address';
  const phone = user.phone || 'No phone number';
  
  const memberSince = user.created_at || user.registeredAt
    ? (() => {
        try {
          return new Date(user.created_at || user.registeredAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
          return 'Active Customer';
        }
      })()
    : 'Active Customer';

  const initials = (() => {
    if (nameParts.length >= 2 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  })();

  const navItems = [
    { id: 'overview', label: 'Account Overview', icon: User },
    { id: 'orders', label: 'My Orders & History', icon: Package },
    { id: 'track', label: 'Track Live Order', icon: Truck },
    { id: 'favorites', label: 'Favorites & Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'overview': return 'User Profile';
      case 'orders': return 'My Orders & History';
      case 'track': return 'Track Live Order';
      case 'favorites': return 'Favorites & Wishlist';
      case 'addresses': return 'Saved Addresses';
      case 'payment': return 'Payment Methods';
      case 'notifications': return 'Notifications';
      case 'settings': return 'Account Settings';
      default: return 'Account Center';
    }
  };

  /* Render mobile-optimised menu screen on smartphones when no tab is active */
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 576;
  if (isMobile && !tabFromUrl) {
    return <MobileProfileScreen />;
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: isMobile ? '0 0 max(90px, calc(env(safe-area-inset-bottom, 0px) + 80px)) 0' : '0' }}>
      {/* ── Unified Sub-Page Header: Back ← | Title | Logout [→] ── */}
      <SubPageHeader
        title={getTabTitle(activeTab)}
        onBack={handleBackNavigation}
        showLogout={true}
        onLogout={handleLogout}
      />

      <div style={{ maxWidth: isMobile ? '100%' : '1200px', margin: '0 auto', padding: isMobile ? '12px 1rem 0 1rem' : '20px 1rem 4rem 1rem' }}>
        {/* Account Center Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 280px) 1fr', gap: '1.5rem' }} className="account-center-grid">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div style={{ display: isMobile ? 'none' : 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* User Mini Profile Card */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary) 0%, #ea580c 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'inline-block', marginBottom: '2px' }}>
                  Customer
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {fullName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email}
                </p>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '0.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? '#fff' : 'var(--text-muted)' }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '6px', paddingTop: '6px' }}>
                <button
                  onClick={handleLogout}
                  className="btn-logout-pill"
                  style={{ width: '100%' }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* TAB 1: ACCOUNT OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Welcome Card */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary) 0%, #ea580c 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                        Welcome back, {firstName}
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Manage your account details, live orders, and saved preferences.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {/* TOTAL ORDERS CARD */}
                  <div
                    className="dashboard-metric-card"
                    onClick={() => handleTabChange('orders')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTabChange('orders')}
                    aria-label="View Total Orders History"
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Orders</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{orders.length + archivedOrders.length}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{orders.length} active history</span>
                  </div>

                  {/* ACTIVE ORDERS CARD */}
                  <div
                    className="dashboard-metric-card"
                    onClick={() => handleTabChange('track')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTabChange('track')}
                    aria-label="Track Active Orders"
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Active Orders</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0369A1' }}>
                      {orders.filter((o) => o.order_status !== 'DELIVERED' && o.order_status !== 'CANCELLED').length}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In preparation/delivery</span>
                  </div>

                  {/* SAVED ADDRESSES CARD */}
                  <div
                    className="dashboard-metric-card"
                    onClick={() => handleTabChange('addresses')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTabChange('addresses')}
                    aria-label="View Saved Addresses"
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Saved Addresses</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{addresses.length}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Abraka locations</span>
                  </div>

                  {/* FAVORITES CARD */}
                  <div
                    className="dashboard-metric-card"
                    onClick={() => handleTabChange('favorites')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTabChange('favorites')}
                    aria-label="View Favorites and Wishlist"
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Favorites</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EF4444' }}>{favorites.length}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved meals</span>
                  </div>
                </div>

                {/* Account Information Card */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={18} style={{ color: 'var(--primary)' }} />
                      <span>Account Information</span>
                    </h3>

                    <button
                      type="button"
                      onClick={() => setIsEditProfileOpen(true)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--primary)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit3 size={15} />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>FULL NAME</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{fullName}</span>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>EMAIL ADDRESS</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{email}</span>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PHONE NUMBER</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{phone}</span>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>MEMBER SINCE</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Current Order Section */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <Truck size={18} style={{ color: 'var(--primary)' }} />
                    <span>Active Order Tracking</span>
                  </h3>

                  {!activeOrder ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                      <Truck size={36} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                        No active orders right now
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                        When you place an order, live tracking details will appear here.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>#{activeOrder.order_number}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{activeOrder.restaurant_name} • <span style={{ color: '#0369A1' }}>{activeOrder.order_status}</span></div>
                      </div>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/orders/${activeOrder.id}`)} style={{ borderRadius: '10px' }}>
                        Track Order Details
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: MY ORDERS & HISTORY — real backend data with archiving support */}
            {activeTab === 'orders' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>My Orders &amp; History</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      View, track, and manage your food purchase receipts.
                    </span>
                  </div>

                  {/* Sub-toggle for Active vs Archived Orders */}
                  <div style={{ display: 'flex', backgroundColor: 'var(--bg-main)', padding: '3px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => setOrderViewMode('active')}
                      style={{
                        padding: '6px 14px', borderRadius: '9px', border: 'none',
                        fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                        backgroundColor: orderViewMode === 'active' ? '#ffffff' : 'transparent',
                        color: orderViewMode === 'active' ? 'var(--primary)' : 'var(--text-muted)',
                        boxShadow: orderViewMode === 'active' ? 'var(--shadow-xs)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Active &amp; History ({orders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderViewMode('archived')}
                      style={{
                        padding: '6px 14px', borderRadius: '9px', border: 'none',
                        fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                        backgroundColor: orderViewMode === 'archived' ? '#ffffff' : 'transparent',
                        color: orderViewMode === 'archived' ? 'var(--primary)' : 'var(--text-muted)',
                        boxShadow: orderViewMode === 'archived' ? 'var(--shadow-xs)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Archived ({archivedOrders.length})
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {ordersLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600 }}>Loading order records...</span>
                  </div>
                )}

                {/* Error State */}
                {!ordersLoading && ordersError && (
                  <div style={{ padding: '1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', color: '#DC2626', fontSize: '0.88rem' }}>
                    {ordersError}
                    <button onClick={refetchOrders} style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}>
                      Try Again
                    </button>
                  </div>
                )}

                {/* ACTIVE ORDERS LIST */}
                {orderViewMode === 'active' && !ordersLoading && !ordersError && (
                  <>
                    {orders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                        <Package size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>No active orders</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                          Your completed orders will appear here. Explore partner restaurants in Abraka.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/restaurants')} style={{ borderRadius: '12px' }}>
                          <ShoppingBag size={16} />
                          Start Ordering
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map((ord) => {
                          const dateStr = ord.created_at
                            ? new Date(ord.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '';

                          return (
                            <div
                              key={ord.id}
                              style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                backgroundColor: 'var(--bg-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                                    #{ord.order_number}
                                  </span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {dateStr}</span>
                                </div>

                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: ord.payment_status === 'PAID' ? '#ECFDF5' : '#FEF3C7', color: ord.payment_status === 'PAID' ? '#047857' : '#B45309' }}>
                                    {ord.payment_status}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                                    {ord.order_status}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div>
                                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Store size={16} style={{ color: 'var(--primary)' }} /> {ord.restaurant_name}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {ord.item_count} {ord.item_count === 1 ? 'item' : 'items'} • Delivered to {ord.delivery_area || ord.delivery_city}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>₦{parseFloat(ord.total_amount).toLocaleString()}</div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                      className="btn btn-outline btn-sm"
                                      onClick={() => navigate(`/orders/${ord.id}`)}
                                      style={{ borderRadius: '10px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      View Details
                                      <ChevronRight size={14} />
                                    </button>

                                    <button
                                      className="btn btn-outline btn-sm"
                                      onClick={() => setArchiveConfirmOrder(ord)}
                                      title="Archive order from visible history view"
                                      style={{ borderRadius: '10px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}
                                    >
                                      <Archive size={14} />
                                      Archive
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* ARCHIVED ORDERS LIST */}
                {orderViewMode === 'archived' && !ordersLoading && !ordersError && (
                  <>
                    {archivedOrders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                        <Archive size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>No archived orders</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                          Orders you soft-archive will appear here. Transaction records remain permanently saved in MySQL.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {archivedOrders.map((ord) => {
                          const dateStr = ord.created_at
                            ? new Date(ord.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '';

                          return (
                            <div
                              key={ord.id}
                              style={{
                                border: '1px dashed var(--border-color)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                backgroundColor: 'var(--bg-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                opacity: 0.9,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.05rem' }}>
                                    #{ord.order_number}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '6px' }}>
                                    ARCHIVED
                                  </span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {dateStr}</span>
                                </div>

                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary)' }}>
                                  ₦{parseFloat(ord.total_amount).toLocaleString()}
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                  {ord.restaurant_name} ({ord.item_count} items)
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => navigate(`/orders/${ord.id}`)}
                                    style={{ borderRadius: '10px', fontSize: '0.82rem' }}
                                  >
                                    View Receipt
                                  </button>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={async () => {
                                      await restoreOrder(ord.id);
                                      setAddressToast('Order restored to active history');
                                      setTimeout(() => setAddressToast(null), 3000);
                                    }}
                                    style={{ borderRadius: '10px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <RotateCcw size={14} />
                                    Restore to History
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 3: TRACK LIVE ORDER */}
            {activeTab === 'track' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>Track Live Order</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Active order status timeline and updates.
                </p>

                {!activeOrder ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                    <Truck size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                      No active order to track
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                      You don't have an in-progress order right now.
                    </p>
                    <button className="btn btn-primary" onClick={() => setActiveTab('orders')} style={{ borderRadius: '12px' }}>
                      View My Orders
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>ACTIVE ORDER</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>#{activeOrder.order_number}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{activeOrder.restaurant_name}</div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/orders/${activeOrder.id}`)}
                        style={{ borderRadius: '10px' }}
                      >
                        View Full Details
                      </button>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem' }}>Current Status: <span style={{ color: 'var(--primary)' }}>{activeOrder.order_status}</span></div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Delivery Address: <strong>{activeOrder.delivery_address || activeOrder.recipient_name}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: FAVORITES & WISHLIST — real data from MySQL via PHP API */}
            {activeTab === 'favorites' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                {conflictPending && (
                  <CartConflictModal
                    existingRestaurantName={cartRestaurantName || ''}
                    newRestaurantName={conflictPending.restaurant?.name || ''}
                    onConfirm={handleConflictConfirm}
                    onCancel={() => setConflictPending(null)}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Favorites &amp; Wishlist
                  </h2>
                  {!favLoading && favorites.length > 0 && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', padding: '3px 10px', borderRadius: '12px' }}>
                      {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Saved favorite meals and restaurants.
                </p>

                {/* Loading state */}
                {favLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600 }}>Loading your favorites...</span>
                  </div>
                )}

                {/* Error state */}
                {!favLoading && favError && (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                    <Heart size={36} style={{ color: '#EF4444', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>Unable to load favorites</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{favError}</p>
                    <button className="btn btn-outline" onClick={refetchFavorites} style={{ borderRadius: '10px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <RefreshCw size={15} />
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty state — backend returned zero favorites */}
                {!favLoading && !favError && favorites.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                    <Heart size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                      No favorites yet
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                      Save your favorite meals and restaurants to find them easily later. Tap the heart icon on any food item.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/restaurants')} style={{ borderRadius: '12px' }}>
                      <UtensilsCrossed size={16} />
                      Explore Food
                    </button>
                  </div>
                )}

                {/* Favorites Grid — real data from MySQL */}
                {!favLoading && !favError && favorites.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {favorites.map((fav) => {
                      const imgSrc = getFoodItemImage(fav.food_slug, fav.food_item_id);
                      return (
                        <div
                          key={fav.favorite_id}
                          style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-main)',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {/* Food image */}
                          <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                            <ImageWithFallback
                              src={imgSrc || fav.food_image}
                              alt={fav.food_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          {/* Info */}
                          <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                              {fav.food_name}
                            </h4>
                            {fav.category_name && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {fav.category_name}
                              </span>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
                              <Store size={13} />
                              {fav.restaurant_name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
                              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                                ₦{fav.food_price ? parseFloat(fav.food_price).toLocaleString() : '---'}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ padding: '0 0.85rem 0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                              onClick={(e) => handleAddToCartFromFav(e, fav)}
                              title={`Add ${fav.food_name} to cart`}
                              aria-label={`Add ${fav.food_name} to cart`}
                            >
                              <ShoppingBag size={14} />
                              Add to Cart
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => navigate(`/restaurant/${fav.restaurant_id}`)}
                              title={`View ${fav.restaurant_name} menu`}
                            >
                              View Menu
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={(e) => handleRemoveFavorite(e, fav.food_item_id, fav.food_name)}
                              title={`Remove ${fav.food_name} from favorites`}
                              aria-label={`Remove ${fav.food_name} from favorites`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Remove toast */}
                {removeToast && (
                  <div className="cart-toast" role="status" aria-live="polite">
                    <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                    <span>{removeToast}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SAVED ADDRESSES — real persistent data from MySQL via PHP API */}
            {activeTab === 'addresses' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                <AddressFormModal
                  isOpen={isAddressModalOpen}
                  onClose={() => setIsAddressModalOpen(false)}
                  onSave={handleSaveAddress}
                  initialData={editingAddress}
                  userDefaults={user}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      Saved Addresses
                    </h2>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleOpenAddAddress}
                    style={{ borderRadius: '10px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}
                  >
                    <Plus size={16} />
                    Add New Address
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Manage delivery locations for quick checkout. Addresses are saved to your account.
                </p>

                {/* Loading state */}
                {addrLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600 }}>Loading your saved addresses...</span>
                  </div>
                )}

                {/* Error state */}
                {!addrLoading && addrError && (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                    <MapPin size={36} style={{ color: '#EF4444', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>Unable to load addresses</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{addrError}</p>
                    <button className="btn btn-outline" onClick={refetchAddresses} style={{ borderRadius: '10px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <RefreshCw size={15} />
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty state — no saved addresses yet */}
                {!addrLoading && !addrError && addresses.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                    <MapPin size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                      No saved delivery addresses
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                      Add a delivery address to make checkout faster when ordering meals.
                    </p>
                    <button className="btn btn-primary" onClick={handleOpenAddAddress} style={{ borderRadius: '12px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <Plus size={16} />
                      Add Delivery Address
                    </button>
                  </div>
                )}

                {/* Address Cards Grid */}
                {!addrLoading && !addrError && addresses.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        style={{
                          border: addr.is_default ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          backgroundColor: 'var(--bg-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          position: 'relative',
                        }}
                      >
                        {/* Header: Label + Default badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '3px 10px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                            {addr.label || 'Home'}
                          </span>
                          {addr.is_default && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#047857', padding: '2px 8px', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Check size={12} /> Default
                            </span>
                          )}
                        </div>

                        {/* Recipient info */}
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 0 0' }}>
                          {addr.recipient_name}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <Phone size={14} style={{ color: 'var(--primary)' }} />
                          <span>{addr.phone}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
                          <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px' }} />
                          <div>
                            <div>{addr.address}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {addr.area}, {addr.city}, {addr.state}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ flex: 1, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            onClick={() => handleOpenEditAddress(addr)}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => handleDeleteAddress(addr.id, addr.label)}
                            title="Delete address"
                            aria-label={`Delete ${addr.label} address`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Toast message */}
                {addressToast && (
                  <div className="cart-toast" role="status" aria-live="polite">
                    <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                    <span>{addressToast}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: PAYMENT METHODS */}
            {activeTab === 'payment' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Payment Methods</h2>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#B45309', padding: '3px 10px', borderRadius: '12px' }}>
                    Coming Soon
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Manage stored payment methods.
                </p>

                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                  <CreditCard size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                    Payment methods
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Payment options will be available when checkout and payment processing are implemented.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 7: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Notifications</h2>
                    {unreadCount > 0 && (
                      <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: '#FFF7ED', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 800 }}>
                        {unreadCount} unread
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={markAllAsRead}
                      style={{ borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <CheckCheck size={15} />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Activity notifications, status updates, and order alerts.
                </p>

                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                    <Bell size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                      No new notifications
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                      Notifications will appear here when you receive updates about your orders or account status.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notifications.map((notif) => {
                      const isUnread = !notif.is_read || notif.is_read === 0 || notif.is_read === '0';
                      const dateStr = notif.created_at
                        ? new Date(notif.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '';

                      return (
                        <div
                          key={notif.id}
                          className="animate-fade-in-up"
                          style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            backgroundColor: isUnread ? '#FFF7ED' : '#F8FAFC',
                            border: isUnread ? '1px solid #FFEDD5' : '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              backgroundColor: isUnread ? '#FFEDD5' : '#E2E8F0',
                              color: isUnread ? 'var(--primary)' : '#64748B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Bell size={20} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                                {notif.title}
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {dateStr}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                              {notif.message}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              {notif.related_order_id && (
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => {
                                    if (isUnread) markAsRead(notif.id);
                                    navigate(`/orders/${notif.related_order_id}`);
                                  }}
                                  style={{ borderRadius: '8px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}
                                >
                                  View Order #{notif.related_order_id}
                                </button>
                              )}

                              {isUnread && (
                                <button
                                  type="button"
                                  onClick={() => markAsRead(notif.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Account Settings</h2>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0369A1', padding: '3px 10px', borderRadius: '12px' }}>
                    Coming Soon
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Security and account management options.
                </p>

                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-main)' }}>
                  <Settings size={44} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                    Account settings placeholder
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Security and preference options will be available in future updates.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={(msg) => {
          setAddressToast(msg);
          setTimeout(() => setAddressToast(null), 3000);
        }}
      />

      {/* Archive Order Confirmation Modal */}
      {archiveConfirmOrder && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1200,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              padding: '1.75rem',
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div
              style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: '#FEF3C7', color: '#B45309',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <Archive size={28} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
              Archive Order #{archiveConfirmOrder.order_number}?
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              This order will be removed from your active history list, but your transaction receipt and financial record remain <strong>permanently saved</strong> in MySQL.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setArchiveConfirmOrder(null)}
                style={{ flex: 1, borderRadius: '12px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, borderRadius: '12px', backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                onClick={async () => {
                  await archiveOrder(archiveConfirmOrder.id);
                  setArchiveConfirmOrder(null);
                  setAddressToast('Order archived safely. Record remains saved.');
                  setTimeout(() => setAddressToast(null), 3000);
                }}
              >
                Archive Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorite Dish Food Customization Modal */}
      <FoodCustomizationModal
        isOpen={Boolean(customizingFavItem)}
        onClose={() => setCustomizingFavItem(null)}
        foodItem={customizingFavItem}
        restaurant={customizingFavRestaurant}
        onAddToCart={handleAddCustomizedFavToCart}
      />
    </div>
  );
}
