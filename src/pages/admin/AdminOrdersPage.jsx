/**
 * AdminOrdersPage — View all orders across the platform & Delivery Monitoring
 */
import React, { useEffect, useState, useCallback } from 'react';
import { fetchAdminOrders, fetchOrderDetails, fetchDeliveriesMonitoring, assignRiderToOrder } from '../../api/adminApi';
import { Loader2, AlertCircle, RefreshCw, Search, ShoppingBag, Bike, Eye, MapPin, UserCheck, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const STATUS_COLORS = {
  DELIVERED:          { bg: '#ECFDF5', color: '#047857' },
  CONFIRMED:          { bg: '#EFF6FF', color: '#1D4ED8' },
  PROCESSING:         { bg: '#FFF7ED', color: '#C2410C' },
  READY_FOR_DELIVERY: { bg: '#F5F3FF', color: '#7C3AED' },
  OUT_FOR_DELIVERY:   { bg: '#FEF9C3', color: '#A16207' },
  CANCELLED:          { bg: '#FEF2F2', color: '#DC2626' },
  PENDING_PAYMENT:    { bg: '#F8FAFC', color: '#64748B' },
};

const ALL_STATUSES = ['PENDING_PAYMENT','CONFIRMED','PROCESSING','READY_FOR_DELIVERY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'deliveries'
  const [orders, setOrders]       = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [statusFilter, setSF]     = useState('');
  const [search, setSearch]       = useState('');
  const [searchInput, setSI]      = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [deliveriesData, setDeliveriesData] = useState(null);
  const [toast, setToast]         = useState(null);
  const [assigningOrder, setAssigningOrder] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (activeTab === 'orders') {
        const res = await fetchAdminOrders({ status: statusFilter, search });
        setOrders(res.data || []);
        setTotal(res.total || 0);
      } else {
        const res = await fetchDeliveriesMonitoring();
        setDeliveriesData(res.data || null);
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [statusFilter, search, activeTab]);

  useEffect(() => { load(); }, [load]);

  const handleInspectOrder = async (orderId) => {
    try {
      const res = await fetchOrderDetails(orderId);
      if (res.data) {
        setSelectedOrderDetails(res.data);
      }
    } catch (e) {
      showToast(e.message || 'Failed to fetch order details.', 'error');
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    try {
      const res = await assignRiderToOrder(orderId, riderId);
      showToast(res.message || 'Rider assigned successfully!', 'success');
      setAssigningOrder(null);
      if (selectedOrderDetails && selectedOrderDetails.order.id === orderId) {
        handleInspectOrder(orderId);
      }
      load();
    } catch (e) {
      showToast(e.message || 'Failed to assign rider.', 'error');
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Order &amp; Delivery Management</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0' }}>Track order status, inspect line items, assign riders, and monitor live deliveries.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: 'none',
                background: activeTab === 'orders' ? '#fff' : 'transparent',
                color: activeTab === 'orders' ? '#1E293B' : '#64748B',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
              }}
            >
              All Orders ({total})
            </button>
            <button
              onClick={() => setActiveTab('deliveries')}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: 'none',
                background: activeTab === 'deliveries' ? '#fff' : 'transparent',
                color: activeTab === 'deliveries' ? '#1E293B' : '#64748B',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Bike size={15} />
              <span>Delivery &amp; Rider Monitoring</span>
            </button>
          </div>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.type === 'success' ? '#047857' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', zIndex: 9999 }}>{toast.msg}</div>}

      {/* TAB 1: ALL ORDERS LIST */}
      {activeTab === 'orders' && (
        <>
          {/* Search + Status filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '220px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input type="text" placeholder="Search order #, customer, restaurant..." value={searchInput} onChange={e => setSI(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ padding: '9px 16px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Search</button>
              {search && <button type="button" onClick={() => { setSearch(''); setSI(''); }} style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', color: '#475569' }}>Clear</button>}
            </form>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button onClick={() => setSF('')} style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: statusFilter === '' ? 'var(--primary)' : '#F1F5F9', color: statusFilter === '' ? '#fff' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>All</button>
              {ALL_STATUSES.map(s => (
                <button key={s} onClick={() => setSF(s)} style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: statusFilter === s ? 'var(--primary)' : '#F1F5F9', color: statusFilter === s ? '#fff' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94A3B8' }}><Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} /><span>Loading orders...</span></div>}
          {error   && <div style={{ textAlign: 'center', padding: '3rem', color: '#DC2626' }}><AlertCircle size={28} style={{ marginBottom: '0.75rem' }} /><p>{error}</p></div>}

          {!loading && !error && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Order #', 'Customer', 'Restaurant', 'Address', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                        <ShoppingBag size={32} style={{ display: 'block', margin: '0 auto 0.75rem', opacity: 0.4 }} />No orders found.
                      </td></tr>
                    )}
                    {orders.map((o, i) => {
                      const sc = STATUS_COLORS[o.order_status] || { bg: '#F8FAFC', color: '#64748B' };
                      return (
                        <tr key={o.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap' }}>{o.order_number}</td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>
                            <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{o.customer_email}</div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{o.restaurant_name}</td>
                          <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '0.78rem', maxWidth: '180px' }}>{o.delivery_area}, {o.delivery_city}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>₦{Number(o.total_amount).toLocaleString()}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: o.payment_status === 'PAID' ? '#ECFDF5' : '#FFF7ED', color: o.payment_status === 'PAID' ? '#047857' : '#C2410C' }}>{o.payment_status}</span>
                          </td>
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color }}>{o.order_status?.replace(/_/g, ' ')}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button
                              onClick={() => handleInspectOrder(o.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', color: '#334155' }}
                            >
                              <Eye size={13} /> Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: DELIVERY & RIDER MONITORING */}
      {activeTab === 'deliveries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading && <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} /></div>}

          {!loading && deliveriesData && (
            <>
              {/* TOP METRICS SUMMARY */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>ACTIVE DELIVERIES</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>{deliveriesData.metrics.active_delivery_count}</div>
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #FEF3C7' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>UNASSIGNED ORDERS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>{deliveriesData.metrics.unassigned_count}</div>
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #ECFDF5' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>ONLINE RIDERS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{deliveriesData.metrics.online_rider_count}</div>
                </div>
              </div>

              {/* UNASSIGNED ORDERS SECTION */}
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #FEF3C7' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400E', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} /> Unassigned Deliveries ({deliveriesData.unassigned_orders.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {deliveriesData.unassigned_orders.length === 0 && <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No unassigned orders right now.</div>}
                  {deliveriesData.unassigned_orders.map(uo => (
                    <div key={uo.order_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{uo.order_number} — {uo.restaurant_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Recipient: {uo.recipient_name} ({uo.recipient_phone}) • Address: {uo.delivery_address}, {uo.delivery_area}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>₦{uo.total_amount.toLocaleString()}</div>
                        <button onClick={() => setAssigningOrder(uo)} style={{ padding: '6px 14px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                          Assign Rider
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE ACTIVE DELIVERIES */}
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bike size={18} /> Active Deliveries ({deliveriesData.active_deliveries.length})
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC' }}>
                        {['Order #', 'Restaurant', 'Recipient', 'Assigned Rider', 'Rider Code', 'Status'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {deliveriesData.active_deliveries.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No active deliveries right now.</td></tr>
                      )}
                      {deliveriesData.active_deliveries.map(ad => (
                        <tr key={ad.assignment_id} style={{ borderTop: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1E293B' }}>{ad.order_number}</td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{ad.restaurant_name}</td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{ad.recipient_name} ({ad.recipient_phone})</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1E293B' }}>{ad.rider_name}</td>
                          <td style={{ padding: '12px 14px' }}><code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.78rem' }}>{ad.rider_code}</code></td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, background: '#EFF6FF', color: '#1D4ED8' }}>
                              {ad.delivery_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* FULL ORDER INSPECTION MODAL */}
      {selectedOrderDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '650px', width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Order Details — #{selectedOrderDetails.order.order_number}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Placed on {new Date(selectedOrderDetails.order.created_at).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>

            {/* ORDER STATUS & PAYMENT SUMMARY */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>ORDER STATUS</div><div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedOrderDetails.order.order_status}</div></div>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>PAYMENT</div><div style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedOrderDetails.order.payment_status === 'PAID' ? '#047857' : '#C2410C' }}>{selectedOrderDetails.order.payment_status} ({selectedOrderDetails.order.payment_method})</div></div>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL AMOUNT</div><div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>₦{selectedOrderDetails.order.total_amount.toLocaleString()}</div></div>
            </div>

            {/* CUSTOMER & VENDOR INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Customer</h5>
                <div style={{ fontWeight: 700, color: '#1E293B' }}>{selectedOrderDetails.order.customer_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedOrderDetails.order.customer_email}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedOrderDetails.order.recipient_phone}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>📍 {selectedOrderDetails.order.delivery_address}, {selectedOrderDetails.order.delivery_area}</div>
              </div>

              <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Vendor &amp; Rider</h5>
                <div style={{ fontWeight: 700, color: '#1E293B' }}>Restaurant: {selectedOrderDetails.order.restaurant_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px' }}>
                  Assigned Rider: {selectedOrderDetails.order.rider_name ? <strong>{selectedOrderDetails.order.rider_name} ({selectedOrderDetails.order.rider_code})</strong> : <span style={{ color: '#D97706' }}>Unassigned</span>}
                </div>
              </div>
            </div>

            {/* LINE ITEMS */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>Purchased Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
              {selectedOrderDetails.items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#1E293B' }}>{item.quantity}x </span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{item.food_name}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: '#1E293B' }}>₦{item.subtotal.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RIDER ASSIGNMENT MODAL */}
      {assigningOrder && deliveriesData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 9995, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: '0 0 6px 0' }}>
              Assign Rider — #{assigningOrder.order_number}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
              Select an available rider for {assigningOrder.restaurant_name} delivery to {assigningOrder.recipient_name}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {deliveriesData.available_riders.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>{r.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Code: {r.rider_code || 'N/A'} • {r.is_online ? <span style={{ color: '#10B981', fontWeight: 700 }}>● Online</span> : <span style={{ color: '#94A3B8' }}>○ Offline</span>}
                    </div>
                  </div>
                  <button onClick={() => handleAssignRider(assigningOrder.order_id, r.id)} style={{ padding: '6px 14px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setAssigningOrder(null)} style={{ marginTop: '1rem', width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

