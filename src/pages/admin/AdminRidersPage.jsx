import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, approveRider, performUserAction } from '../../api/adminApi';
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle, RefreshCw, Bike, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_STYLE = {
  APPROVED: { bg: '#ECFDF5', color: '#047857', icon: CheckCircle },
  PENDING:  { bg: '#FFF7ED', color: '#C2410C', icon: Clock },
  REJECTED: { bg: '#FEF2F2', color: '#DC2626', icon: XCircle },
};

export default function AdminRidersPage() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [filter, setFilter]       = useState('');
  const [actionLoading, setAL]    = useState({});
  const [toast, setToast]         = useState(null);
  const [expanded, setExpanded]   = useState(null);

  const load = async (status = filter) => {
    setLoading(true); setError(null);
    try {
      const res = await fetchAdminUsers({ role: 'rider', status: status || '' });
      setUsers(res.data || []);
    } catch (e) { setError(e.message || 'Failed to load riders.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (userId, action) => {
    setAL(p => ({ ...p, [userId]: action }));
    try {
      const res = await approveRider(userId, action);
      showToast(res.message || `Rider ${action}d.`, action === 'approve' ? 'success' : 'error');
      load();
    } catch (e) {
      showToast(e.message || 'Action failed.', 'error');
    } finally {
      setAL(p => { const n = {...p}; delete n[userId]; return n; });
    }
  };

  const handleUserStatus = async (userId, action) => {
    setAL(p => ({ ...p, [userId]: action }));
    try {
      const res = await performUserAction(userId, action);
      showToast(res.message || `Rider account ${action}d.`, action === 'activate' ? 'success' : 'error');
      load();
    } catch (e) {
      showToast(e.message || 'Status update failed.', 'error');
    } finally {
      setAL(p => { const n = {...p}; delete n[userId]; return n; });
    }
  };

  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
  const changeFilter = (val) => { setFilter(val); load(val); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Rider Management</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0' }}>Review rider applications, monitor online activity, and manage delivery partners.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[{ v: '', l: 'All' }, { v: 'PENDING', l: '⚠ Pending' }, { v: 'APPROVED', l: '✓ Approved' }, { v: 'REJECTED', l: '✗ Rejected' }].map(({ v, l }) => (
              <button key={v} onClick={() => changeFilter(v)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: filter === v ? 'var(--primary)' : '#F1F5F9', color: filter === v ? '#fff' : '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
          <button onClick={() => load()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.type === 'success' ? '#047857' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', zIndex: 9999 }}>{toast.msg}</div>}

      {loading && <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94A3B8' }}><Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} /><span>Loading riders...</span></div>}
      {error   && <div style={{ textAlign: 'center', padding: '3rem', color: '#DC2626' }}><AlertCircle size={28} style={{ marginBottom: '0.75rem' }} /><p>{error}</p></div>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No riders found.</div>}
          {users.map(u => {
            const ss = STATUS_STYLE[u.application_status] || STATUS_STYLE.PENDING;
            const StatusIcon = ss.icon;
            const isExpanded = expanded === u.id;
            return (
              <div key={u.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <div onClick={() => setExpanded(isExpanded ? null : u.id)} style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bike size={20} style={{ color: '#64748B' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>{u.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {u.email}
                      {u.rider_code && <span style={{ color: '#10B981', fontWeight: 700, marginLeft: '8px' }}>{u.rider_code}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {u.application_status === 'APPROVED' && (
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: u.is_online ? '#ECFDF5' : '#F1F5F9', color: u.is_online ? '#047857' : '#64748B' }}>
                        {u.is_online ? '● Online' : '○ Offline'}
                      </span>
                    )}
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: ss.bg, color: ss.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <StatusIcon size={13} /> {u.application_status}
                    </span>
                    {isExpanded ? <ChevronUp size={16} style={{ color: '#94A3B8' }} /> : <ChevronDown size={16} style={{ color: '#94A3B8' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', margin: '1rem 0' }}>
                      {[['Phone', u.phone], ['Rider Code', u.rider_code || '—'], ['Online Status', u.is_online ? 'Online (Ready)' : 'Offline'], ['Account Status', u.is_active ? 'Active' : 'Suspended'], ['Joined', new Date(u.created_at).toLocaleDateString()]].map(([l, v]) => (
                        <div key={l}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>{l}</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {u.application_status === 'PENDING' && <>
                        <button onClick={() => handleAction(u.id, 'approve')} disabled={actionLoading[u.id]} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: '1px solid #A7F3D0', background: '#ECFDF5', color: '#047857', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer' }}>
                          {actionLoading[u.id] === 'approve' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />} Approve Rider
                        </button>
                        <button onClick={() => handleAction(u.id, 'reject')} disabled={actionLoading[u.id]} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer' }}>
                          {actionLoading[u.id] === 'reject' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />} Reject Application
                        </button>
                      </>}
                      {u.application_status === 'APPROVED' && (
                        <button onClick={() => handleAction(u.id, 'reject')} disabled={actionLoading[u.id]} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer' }}>
                          {actionLoading[u.id] === 'reject' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />} Revoke Approval
                        </button>
                      )}
                      {u.application_status === 'REJECTED' && (
                        <button onClick={() => handleAction(u.id, 'approve')} disabled={actionLoading[u.id]} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: '1px solid #A7F3D0', background: '#ECFDF5', color: '#047857', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer' }}>
                          {actionLoading[u.id] === 'approve' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />} Re-Approve Rider
                        </button>
                      )}

                      {/* Account Suspension/Activation */}
                      {u.is_active ? (
                        <button onClick={() => handleUserStatus(u.id, 'suspend')} disabled={actionLoading[u.id]} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: '1px solid #FDE68A', background: '#FEF3C7', color: '#B45309', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer' }}>
                          {actionLoading[u.id] === 'suspend' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />} Suspend Account
                        </button>
                      ) : (
                        <button onClick={() => handleUserStatus(u.id, 'activate')} disabled={actionLoading[u.id]} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: '1px solid #A7F3D0', background: '#ECFDF5', color: '#047857', fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer' }}>
                          {actionLoading[u.id] === 'activate' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />} Activate Account
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

