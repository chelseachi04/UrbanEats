/**
 * AdminVendorsPage — Manage vendor applications and approved vendors
 */
import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, approveVendor, performUserAction, fetchVendorDetails } from '../../api/adminApi';
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle, RefreshCw, Store, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react';

const STATUS_STYLE = {
  APPROVED: { bg: '#ECFDF5', color: '#047857', icon: CheckCircle },
  PENDING:  { bg: '#FFF7ED', color: '#C2410C', icon: Clock },
  REJECTED: { bg: '#FEF2F2', color: '#DC2626', icon: XCircle },
};

export default function AdminVendorsPage() {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [filter, setFilter]             = useState('');
  const [actionLoading, setAL]          = useState({});
  const [toast, setToast]               = useState(null);
  const [expanded, setExpanded]         = useState(null);
  const [selectedVendorData, setSelectedVendorData] = useState(null);

  const load = async (status = filter) => {
    setLoading(true); setError(null);
    try {
      const res = await fetchAdminUsers({ role: 'vendor', status: status || '' });
      setUsers(res.data || []);
    } catch (e) { setError(e.message || 'Failed to load vendors.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (userId, action, name) => {
    setAL(p => ({ ...p, [userId]: action }));
    try {
      const res = await approveVendor(userId, action);
      showToast(res.message || `Vendor ${action}d successfully.`, action === 'approve' ? 'success' : 'error');
      load();
    } catch (e) {
      showToast(e.message || 'Action failed.', 'error');
    } finally {
      setAL(p => { const n = {...p}; delete n[userId]; return n; });
    }
  };

  const handleUserStatus = async (userId, action, name) => {
    setAL(p => ({ ...p, [userId]: action }));
    try {
      const res = await performUserAction(userId, action);
      showToast(res.message || `User ${action}d.`, action === 'activate' ? 'success' : 'error');
      load();
    } catch (e) {
      showToast(e.message || 'Status action failed.', 'error');
    } finally {
      setAL(p => { const n = {...p}; delete n[userId]; return n; });
    }
  };

  const handleViewVendorDetails = async (vendorId) => {
    try {
      const res = await fetchVendorDetails({ vendor_id: vendorId });
      if (res.data) {
        setSelectedVendorData(res.data);
      }
    } catch (e) {
      showToast(e.message || 'Failed to fetch vendor menu.', 'error');
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const changeFilter = (val) => { setFilter(val); load(val); };

  return (
    <div>
      <PageHeader title="Vendor Management" subtitle="Review applications and manage vendor partners." onRefresh={() => load()}>
        <FilterBar filter={filter} onChange={changeFilter} options={[
          { value: '', label: 'All Vendors' },
          { value: 'PENDING',  label: '⚠ Pending' },
          { value: 'APPROVED', label: '✓ Approved' },
          { value: 'REJECTED', label: '✗ Rejected' },
        ]} />
      </PageHeader>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {loading && <Loader />}
      {error   && <ErrBlock msg={error} onRetry={load} />}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.length === 0 && <Empty label="No vendors found." />}
          {users.map(u => {
            const ss = STATUS_STYLE[u.application_status] || STATUS_STYLE.PENDING;
            const StatusIcon = ss.icon;
            const isExpanded = expanded === u.id;
            return (
              <div key={u.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div
                  onClick={() => setExpanded(isExpanded ? null : u.id)}
                  style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Store size={20} style={{ color: '#64748B' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>{u.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{u.email} {u.restaurant_name && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>• {u.restaurant_name}</span>}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: ss.bg, color: ss.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <StatusIcon size={13} /> {u.application_status}
                    </span>
                    {isExpanded ? <ChevronUp size={16} style={{ color: '#94A3B8' }} /> : <ChevronDown size={16} style={{ color: '#94A3B8' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', margin: '1rem 0' }}>
                      <Info label="Phone" value={u.phone} />
                      <Info label="Restaurant" value={u.restaurant_name || '—'} />
                      <Info label="Vendor Code" value={u.vendor_code || '—'} />
                      <Info label="Account Status" value={u.is_active ? 'Active' : 'Suspended'} />
                      <Info label="Joined" value={new Date(u.created_at).toLocaleDateString()} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {u.restaurant_id && (
                        <button
                          onClick={() => handleViewVendorDetails(u.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '10px',
                            border: '1px solid var(--primary)', background: '#FFF5F1',
                            color: 'var(--primary)', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer',
                          }}
                        >
                          <UtensilsCrossed size={14} />
                          <span>View Restaurant &amp; Menu</span>
                        </button>
                      )}

                      {/* Approval Actions */}
                      {u.application_status === 'PENDING' && (
                        <>
                          <ActionBtn
                            label="Approve Vendor"
                            onClick={() => handleAction(u.id, 'approve', u.full_name)}
                            loading={actionLoading[u.id] === 'approve'}
                            color="#047857" bg="#ECFDF5" borderColor="#A7F3D0"
                          />
                          <ActionBtn
                            label="Reject Application"
                            onClick={() => handleAction(u.id, 'reject', u.full_name)}
                            loading={actionLoading[u.id] === 'reject'}
                            color="#DC2626" bg="#FEF2F2" borderColor="#FECACA"
                          />
                        </>
                      )}
                      {u.application_status === 'APPROVED' && (
                        <ActionBtn
                          label="Revoke Approval"
                          onClick={() => handleAction(u.id, 'reject', u.full_name)}
                          loading={actionLoading[u.id] === 'reject'}
                          color="#DC2626" bg="#FEF2F2" borderColor="#FECACA"
                        />
                      )}
                      {u.application_status === 'REJECTED' && (
                        <ActionBtn
                          label="Re-Approve Vendor"
                          onClick={() => handleAction(u.id, 'approve', u.full_name)}
                          loading={actionLoading[u.id] === 'approve'}
                          color="#047857" bg="#ECFDF5" borderColor="#A7F3D0"
                        />
                      )}

                      {/* Separate Account Suspension/Activation */}
                      {u.is_active ? (
                        <ActionBtn
                          label="Suspend Account"
                          onClick={() => handleUserStatus(u.id, 'suspend', u.full_name)}
                          loading={actionLoading[u.id] === 'suspend'}
                          color="#B45309" bg="#FEF3C7" borderColor="#FDE68A"
                        />
                      ) : (
                        <ActionBtn
                          label="Activate Account"
                          onClick={() => handleUserStatus(u.id, 'activate', u.full_name)}
                          loading={actionLoading[u.id] === 'activate'}
                          color="#047857" bg="#ECFDF5" borderColor="#A7F3D0"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VENDOR DETAILS & MENU MODAL */}
      {selectedVendorData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  {selectedVendorData.restaurant.restaurant_name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Owner: {selectedVendorData.restaurant.vendor_name} ({selectedVendorData.restaurant.vendor_code})
                </span>
              </div>
              <button onClick={() => setSelectedVendorData(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>LOCATION</div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedVendorData.restaurant.location || 'Abraka'}</div></div>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL ORDERS</div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedVendorData.restaurant.total_orders} orders</div></div>
              <div><div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>REVENUE</div><div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>₦{selectedVendorData.restaurant.total_revenue.toLocaleString()}</div></div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>
              Menu Items ({selectedVendorData.menu_count})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedVendorData.menu.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.category_name || 'General'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₦{item.price.toLocaleString()}</div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: item.is_available ? '#ECFDF5' : '#FEF2F2', color: item.is_available ? '#047857' : '#DC2626', fontWeight: 700 }}>
                      {item.is_available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              ))}
              {selectedVendorData.menu.length === 0 && <div style={{ color: '#94A3B8', textAlign: 'center', padding: '1.5rem' }}>No menu items listed yet.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function PageHeader({ title, subtitle, onRefresh, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        {children}
        <button onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
    </div>
  );
}

function FilterBar({ filter, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map(({ value, label }) => (
        <button key={value} onClick={() => onChange(value)} style={{
          padding: '6px 14px', borderRadius: '20px', border: 'none',
          background: filter === value ? 'var(--primary)' : '#F1F5F9',
          color: filter === value ? '#fff' : '#475569',
          fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
        }}>{label}</button>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{value}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, loading, color, bg, borderColor }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '8px 18px', borderRadius: '10px',
      border: `1px solid ${borderColor}`, background: bg,
      color, fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer',
      opacity: loading ? 0.7 : 1,
    }}>
      {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {label}
    </button>
  );
}

function Loader() { return <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} /><span>Loading...</span></div>; }
function ErrBlock({ msg, onRetry }) { return <div style={{ textAlign: 'center', padding: '3rem', color: '#DC2626' }}><AlertCircle size={28} style={{ marginBottom: '0.75rem' }} /><p style={{ marginBottom: '1rem' }}>{msg}</p><button onClick={onRetry} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Retry</button></div>; }
function Empty({ label }) { return <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>{label}</div>; }
function Toast({ msg, type }) { return <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: type === 'success' ? '#047857' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', zIndex: 9999 }}>{msg}</div>; }
