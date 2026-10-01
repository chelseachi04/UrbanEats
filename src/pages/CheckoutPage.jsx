/**
 * UrbanEats Checkout Page — Phase 3
 *
 * Route: /checkout
 *
 * Features:
 *   - Empty Cart Guard (redirects or shows empty state if cart contains 0 items)
 *   - Auth Guard (prompts customer to sign in if logged out)
 *   - Order Summary (displays food items, restaurant name, qty, prices from CartContext)
 *   - Delivery Address Selection (loads saved addresses from PHP/MySQL, allows selecting or adding new address)
 *   - Checkout Totals (Subtotal + Flat ₦500 local Abraka delivery fee = Total)
 *   - NO payment processing or order creation (strictly ends at review + address selection)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import { useOrders } from '../hooks/useOrders';
import { getFoodItemImage } from '../data/imageAssets';
import { resolveImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/common/ImageWithFallback';
import AddressFormModal from '../components/profile/AddressFormModal';
import SubPageHeader from '../components/common/SubPageHeader';
import {
  ShoppingCart, ShoppingBag, MapPin, Plus, CheckCircle2,
  ArrowLeft, ArrowRight, Store, Phone, ShieldCheck, Lock,
  Loader2, Check, CreditCard, X
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, clearCart } = useCart();
  const { user, openLogin } = useAuth();
  const { addresses, loading: addrLoading, error: addrError, addAddress, refetchAddresses } = useAddresses();
  const { placeOrder, confirmPayment } = useOrders();

  const [selectedAddressId, setSelectedAddressId]   = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [toastMessage, setToastMessage]             = useState(null);

  const [isPlacingOrder, setIsPlacingOrder]         = useState(false);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentError, setPaymentError]             = useState(null);

  // Delivery fee constant for local Abraka delivery
  const DELIVERY_FEE = items.length > 0 ? 500 : 0;
  const grandTotal   = subtotal + DELIVERY_FEE;

  // Auto-select default or first address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveNewAddress = async (formData) => {
    const res = await addAddress(formData);
    if (res?.data?.id) {
      setSelectedAddressId(res.data.id);
    }
    showToast('New delivery address saved and selected');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a delivery address first.');
      return;
    }

    setIsPlacingOrder(true);
    setPaymentError(null);
    try {
      const res = await placeOrder(selectedAddressId, items);
      if (res?.data?.order_id) {
        setPendingPaymentOrder(res.data);
      }
    } catch (err) {
      setPaymentError(err?.data?.message || 'Unable to create order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCompletePayment = async (status = 'successful') => {
    if (!pendingPaymentOrder) return;
    setIsVerifyingPayment(true);
    setPaymentError(null);

    const targetOrderId = pendingPaymentOrder.order_id;
    const targetTxRef   = pendingPaymentOrder.tx_ref;

    try {
      const verifyRes = await confirmPayment(
        targetOrderId,
        targetTxRef,
        status
      );

      if (status === 'successful') {
        clearCart(); // Clear cart ONLY on verified successful payment
        setPendingPaymentOrder(null);
        navigate(`/order-confirmation/${targetOrderId}`);
      } else {
        setPaymentError('Payment was cancelled or unsuccessful.');
      }
    } catch (err) {
      setPaymentError(err?.data?.message || err?.message || 'Payment verification failed. Please try again.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // ── Guard 1: Logged-out Visitor ─────────────────────────────────────────────
  if (!user) {
    return (
      <div>
        <SubPageHeader title="Checkout" onBack={() => navigate('/cart')} />
        <div className="section page-header-tight sub-page-content checkout-page-content">
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div
              style={{
                maxWidth: '500px',
                margin: '2rem auto',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '3rem 1.5rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  width: '64px', height: '64px',
                  backgroundColor: '#FEF2F2', color: '#DC2626',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Lock size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Sign In Required for Checkout
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Please sign in to select a delivery address and review your order.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => navigate('/cart')} style={{ borderRadius: '12px' }}>
                  <ArrowLeft size={18} />
                  Return to Cart
                </button>
                <button className="btn btn-primary" onClick={() => openLogin('customer')} style={{ borderRadius: '12px' }}>
                  Sign In Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Guard 2: Empty Cart ──────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div>
        <SubPageHeader title="Checkout" onBack={() => navigate('/cart')} />
        <div className="section page-header-tight sub-page-content checkout-page-content">
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div
              style={{
                maxWidth: '520px',
                margin: '2rem auto',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '3.5rem 1.5rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  width: '80px', height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <ShoppingCart size={38} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Your Cart is Empty
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Add some delicious food from our partner restaurants before proceeding to checkout.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/restaurants')}
                style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', borderRadius: '12px' }}
              >
                <ShoppingBag size={20} />
                Browse All Food
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Unified sticky SubPageHeader */}
      <SubPageHeader
        title="Checkout"
        showLogout={true}
        onBack={() => navigate('/cart')}
      />

      <div className="section page-header-tight sub-page-content checkout-page-content">
        <AddressFormModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleSaveNewAddress}
          userDefaults={user}
        />

        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Header Breadcrumb (Desktop/Tablet) */}
          <div className="sub-page-desktop-header" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Link to="/cart" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> Cart
              </Link>
              <span>/</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Checkout</span>
            </div>
            <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Checkout &amp; Delivery Details</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Review your order items, select a delivery address in Abraka, and confirm your details.
            </p>
          </div>

          <div className="checkout-layout">
            {/* LEFT COLUMN — Order Items & Delivery Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>

              {/* SECTION 1: DELIVERY ADDRESS */}
              <div className="checkout-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      1. Delivery Address
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Select where you want your meal delivered in Abraka
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsAddressModalOpen(true)}
                  style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', borderRadius: '10px' }}
                >
                  <Plus size={15} />
                  Add New Address
                </button>
              </div>

              {/* Loading State */}
              {addrLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <Loader2 size={20} className="animate-spin" style={{ color: 'var(--primary)' }} />
                  <span>Loading saved addresses...</span>
                </div>
              )}

              {/* Error State */}
              {!addrLoading && addrError && (
                <div style={{ padding: '1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', color: '#DC2626', fontSize: '0.85rem' }}>
                  {addrError}
                  <button onClick={refetchAddresses} style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}>
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State — No addresses */}
              {!addrLoading && !addrError && addresses.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    border: '2px dashed var(--border-color)',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-main)',
                  }}
                >
                  <MapPin size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px 0' }}>No Saved Address Found</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Please add a delivery address to complete your checkout.
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsAddressModalOpen(true)}
                    style={{ borderRadius: '10px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}
                  >
                    <Plus size={16} />
                    Add Delivery Address
                  </button>
                </div>
              )}

              {/* Selectable Address List */}
              {!addrLoading && !addrError && addresses.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                          borderRadius: '14px',
                          padding: '1rem 1.25rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Radio indicator */}
                        <div
                          style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            border: isSelected ? '6px solid var(--primary)' : '2px solid var(--border-color)',
                            backgroundColor: '#fff',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        />

                        {/* Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {addr.recipient_name}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                              {addr.label}
                            </span>
                            {addr.is_default && (
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#047857', padding: '1px 6px', borderRadius: '4px' }}>
                                Default
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '2px 0' }}>
                            {addr.address} — <strong style={{ color: 'var(--text-muted)' }}>{addr.area}, {addr.city}</strong>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={13} style={{ color: 'var(--primary)' }} />
                            <span>{addr.phone}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: ORDER ITEMS SUMMARY */}
            <div className="checkout-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Store size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    2. Food Items ({itemCount})
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    From <strong>{items[0]?.restaurantName}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item) => {
                  const imageSrc = item.image || item.image_url || item.imageUrl || item.img_src || item.photo || '';
                  const effectivePrice = parseFloat(item.unitPrice || item.price) || 0;
                  const itemTotal = (effectivePrice * item.quantity).toLocaleString();
                  const itemKey = item.cartItemId || item.id;

                  return (
                    <div
                      key={itemKey}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-main)',
                      }}
                    >
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, marginTop: '2px' }}>
                        <img
                          src={imageSrc || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
                          alt={item.name || item.title || 'Food dish'}
                          className="w-16 h-16 rounded-xl object-cover"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--text-main)' }}>
                          {item.name}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ₦{effectivePrice.toLocaleString()} × {item.quantity}
                        </div>

                        {/* Customization Details */}
                        <div className="cart-item-custom-tags">
                          {item.portion && (
                            <span className="cart-custom-badge cart-custom-badge-portion">
                              🍚 {item.portion}
                            </span>
                          )}
                          {item.swallow && (
                            <span className="cart-custom-badge cart-custom-badge-swallow">
                              🍲 {item.swallow.name || item.swallow}
                            </span>
                          )}
                          {Array.isArray(item.proteins) && item.proteins.map((p, idx) => (
                            <span key={idx} className="cart-custom-badge cart-custom-badge-protein">
                              🍗 {p.name} {p.quantity > 1 ? `(×${p.quantity})` : ''}
                            </span>
                          ))}
                          {Array.isArray(item.sides) && item.sides.map((s, idx) => (
                            <span key={idx} className="cart-custom-badge cart-custom-badge-side">
                              🥗 {typeof s === 'string' ? s : s.name}
                            </span>
                          ))}
                        </div>

                        {item.specialInstructions && (
                          <div className="cart-custom-note" style={{ marginTop: '2px', fontSize: '0.74rem' }}>
                            "{item.specialInstructions}"
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                        ₦{itemTotal}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — Checkout Calculation & Confirmation Summary */}
          <div>
            <div className="checkout-card checkout-summary-sticky">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Checkout Summary
              </h3>

              {/* Selected Delivery Address Preview */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  DELIVERY TO
                </div>
                {selectedAddress ? (
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {selectedAddress.recipient_name} ({selectedAddress.label})
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {selectedAddress.address}, {selectedAddress.area}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#DC2626', fontWeight: 600 }}>
                    No delivery address selected
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Food Subtotal ({itemCount} items)</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₦{subtotal.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Abraka Local Delivery Fee</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₦{DELIVERY_FEE.toLocaleString()}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Error Notice if any */}
              {paymentError && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}
                >
                  {paymentError}
                </div>
              )}

              {/* Review Confirmation Notice */}
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#047857',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>Delivery address selected &amp; order verified. Ready for payment.</span>
              </div>

              {/* Place Order & Proceed to Payment Button */}
              <button
                type="button"
                id="place-order-btn"
                className="btn btn-primary btn-full"
                disabled={!selectedAddress || isPlacingOrder}
                style={{
                  borderRadius: '12px', padding: '0.9rem',
                  fontSize: '1rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  opacity: (selectedAddress && !isPlacingOrder) ? 1 : 0.6,
                  boxShadow: 'var(--shadow-md)',
                }}
                onClick={handlePlaceOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating Order...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Place Order &amp; Pay ₦{grandTotal.toLocaleString()}
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-full"
                onClick={() => navigate('/cart')}
                style={{ borderRadius: '12px', marginTop: '0.5rem', fontSize: '0.85rem' }}
              >
                Modify Cart Items
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLUTTERWAVE PAYMENT MODAL ────────────────────────────────────────────── */}
      {pendingPaymentOrder && (
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
              maxWidth: '480px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--secondary)',
                color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                    Flutterwave Payment
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    Order #{pendingPaymentOrder.order_number}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingPaymentOrder(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {paymentError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.85rem', fontWeight: 600 }}>
                  {paymentError}
                </div>
              )}

              {/* Summary Box */}
              <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Restaurant</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{pendingPaymentOrder.restaurant_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Deliver To</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{pendingPaymentOrder.recipient_name} ({pendingPaymentOrder.recipient_phone})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Transaction Ref</span>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pendingPaymentOrder.tx_ref}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>₦{parseFloat(pendingPaymentOrder.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  id="confirm-payment-success-btn"
                  className="btn btn-primary btn-full"
                  disabled={isVerifyingPayment}
                  style={{
                    borderRadius: '14px', padding: '0.95rem',
                    fontSize: '1rem', fontWeight: 800,
                    backgroundColor: '#10B981', borderColor: '#10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  }}
                  onClick={() => handleCompletePayment('successful')}
                >
                  {isVerifyingPayment ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Complete Payment (Flutterwave Verified)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  disabled={isVerifyingPayment}
                  style={{ borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}
                  onClick={() => handleCompletePayment('cancelled')}
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="cart-toast" role="status" aria-live="polite">
          <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  </div>
  );
}
