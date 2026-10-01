/**
 * AdminUsersPage — View and search all users across all roles, manage customer accounts, and account controls
 */
import React, { useEffect, useState, useCallback } from 'react';
import { fetchAdminUsers, performUserAction, fetchAdminOrders } from '../../api/adminApi';
import { Loader2, AlertCircle, RefreshCw, Search, Users, Trash2, Power, Eye, ShoppingBag } from 'lucide-react';

const ROLE_STYLE = {
  admin:    { bg: '#F5F3FF', color: '#7C3AED' },
  vendor:   { bg: '#FFF7ED', color: '#C2410C' },
  rider:    { bg: '#ECFDF5', color: '#047857' },
  customer: { bg: '#EFF6FF', color: '#1D4ED8' },
};

export default function AdminUsersPage() {
  const [users, setUsers]               = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [roleFilter, setRole]           = useState('');
  const [search, setSearch]             = useState('');
  const [searchInput, setSI]            = useState('');
  const [toast, setToast]               = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [inspectUser, setInspectUser]   = useState(null);
  const [userOrders, setUserOrders]     = useState([]);
  const [ordersLoading, setOL]          = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetchAdminUsers({ role: roleFilter, search });
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [roleFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

  const handleUserStatus = async (userId, action) => {
    try {
      const res = await performUserAction(userId, action);
      showToast(res.message || `User account ${action}d.`, action === 'activate' ? 'success' : 'error');
      load();
    } catch (e) {
      showToast(e.message || 'Action failed.', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const res = await performUserAction(deletingUser.id, 'delete');
      showToast(res.message || 'User account deleted.', 'success');
      setDeletingUser(null);
      load();
    } catch (e) {
      showToast(e.message || 'Failed to delete user.', 'error');
    }
  };

  const handleInspectUserHistory = async (user) => {
    setInspectUser(user);
    setOL(true);
    try {
      const res = await fetchAdminOrders({ search: user.email });
      setUserOrders(res.data || []);
    } catch (e) {
      setUserOrders([]);
    } finally {
      setOL(false);
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
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>User &amp; Customer Management</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0' }}>
            {total} user{total !== 1 ? 's' : ''} total across all roles. Manage customer accounts, suspend/activate access, and inspect history.
          </p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.type === 'success' ? '#047857' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', zIndex: 9999 }}>{toast.msg}</div>}

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '220px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchInput}
              onChange={e => setSI(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '9px 16px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); setSI(''); }} style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', color: '#475569' }}>Clear</button>}
        </form>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ v: '', l: 'All Roles' }, { v: 'customer', l: 'Customers' }, { v: 'vendor', l: 'Vendors' }, { v: 'rider', l: 'Riders' }, { v: 'admin', l: 'Admins' }].map(({ v, l }) => (
            <button key={v} onClick={() => setRole(v)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: roleFilter === v ? 'var(--primary)' : '#F1F5F9', color: roleFilter === v ? '#fff' : '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94A3B8' }}><Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} /><span>Loading users...</span></div>}
      {error   && <div style={{ textAlign: 'center', padding: '3rem', color: '#DC2626' }}><AlertCircle size={28} style={{ marginBottom: '0.75rem' }} /><p>{error}</p></div>}

      {!loading && !error && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Name', 'Email', 'Phone', 'Role', 'Account Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}><Users size={32} style={{ display: 'block', margin: '0 auto 0.75rem', opacity: 0.4 }} />No users found.</td></tr>}
                {users.map((u, i) => {
                  const rs = ROLE_STYLE[u.role] || ROLE_STYLE.customer;
                  return (
                    <tr key={u.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: rs.bg, color: rs.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                            {u.full_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          {u.full_name}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{u.phone}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: rs.bg, color: rs.color }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: u.is_active ? '#ECFDF5' : '#FEF2F2', color: u.is_active ? '#047857' : '#DC2626' }}>
                          {u.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button onClick={() => handleInspectUserHistory(u)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Eye size={12} /> Orders
                          </button>
                          {u.is_active ? (
                            <button onClick={() => handleUserStatus(u.id, 'suspend')} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FDE68A', background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                              Suspend
                            </button>
                          ) : (
                            <button onClick={() => handleUserStatus(u.id, 'activate')} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #A7F3D0', background: '#ECFDF5', color: '#047857', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                              Activate
                            </button>
                          )}
                          <button onClick={() => setDeletingUser(u)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMER ORDER HISTORY INSPECTION MODAL */}
      {inspectUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Customer Profile — {inspectUser.full_name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{inspectUser.email} • {inspectUser.phone}</span>
              </div>
              <button onClick={() => setInspectUser(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>Order History</h4>
            {ordersLoading && <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /></div>}
            {!ordersLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userOrders.length === 0 && <div style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}><ShoppingBag size={28} style={{ display: 'block', margin: '0 auto 6px', opacity: 0.4 }} />No order history for this user.</div>}
                {userOrders.map(o => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.85rem' }}>{o.order_number} — {o.restaurant_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(o.created_at).toLocaleDateString()} • {o.order_status}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#1E293B' }}>₦{Number(o.total_amount).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PERMANENT ACCOUNT DELETION SAFEGUARD CONFIRMATION MODAL */}
      {deletingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 9995, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#DC2626', margin: '0 0 8px 0' }}>
              Confirm Permanent Deletion
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Are you sure you want to delete <strong>{deletingUser.full_name}</strong> ({deletingUser.email})?
              If this account has historical order records, it will be safely deactivated and archived to preserve financial records.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingUser(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#fff', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
                Cancel
              </button>
              <button onClick={handleDeleteUser} style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: '#DC2626', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

