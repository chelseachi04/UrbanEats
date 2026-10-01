import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Store, Bike, ArrowRight, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    authMode,
    selectedRole,
    authError,
    setAuthMode,
    setSelectedRole,
    setAuthError,
    closeModal,
    loginUser,
    registerUser
  } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    restaurantName: '',
    category: 'General',
    address: 'Abraka, Delta State',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError('');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setAuthError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setAuthError('');

    try {
      if (authMode === 'login') {
        const res = await loginUser({
          email: formData.email.trim(),
          password: formData.password
        });

        if (res?.user) {
          const userRole = (res.user.role || '').toLowerCase();
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'vendor') {
            navigate('/vendor/dashboard');
          } else if (userRole === 'rider') {
            navigate('/rider/dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        const res = await registerUser({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role: selectedRole,
          restaurantName: formData.restaurantName.trim(),
          category: formData.category,
          address: formData.address,
        });

        if (selectedRole !== 'customer') {
          setSuccessMessage(
            res?.message || `Your ${selectedRole === 'vendor' ? 'Vendor' : 'Rider'} application has been submitted and is under review by Admin.`
          );
        }
      }
    } catch (err) {
      // Error handled by AuthContext state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {authMode === 'login'
              ? 'Welcome Back to UrbanEats'
              : selectedRole === 'vendor'
              ? 'Apply as Vendor Partner'
              : selectedRole === 'rider'
              ? 'Apply as Rider Partner'
              : 'Create Customer Account'}
          </h3>
          <button className="modal-close" onClick={closeModal} aria-label="Close modal" disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Role Selection Tabs (3 Public User Roles) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="form-label">Select Account Type</span>
            <div className="role-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                className={`role-option ${selectedRole === 'customer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('customer')}
              >
                <User size={18} style={{ margin: '0 auto 4px auto' }} />
                <div className="role-name" style={{ fontSize: '0.78rem' }}>Customer</div>
              </button>

              <button
                type="button"
                className={`role-option ${selectedRole === 'vendor' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('vendor')}
              >
                <Store size={18} style={{ margin: '0 auto 4px auto' }} />
                <div className="role-name" style={{ fontSize: '0.78rem' }}>Vendor</div>
              </button>

              <button
                type="button"
                className={`role-option ${selectedRole === 'rider' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('rider')}
              >
                <Bike size={18} style={{ margin: '0 auto 4px auto' }} />
                <div className="role-name" style={{ fontSize: '0.78rem' }}>Rider</div>
              </button>
            </div>
          </div>

          {/* Success / Info Message Banner */}
          {successMessage && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem', borderRadius: '12px', fontSize: '0.85rem' }}>
              <Clock size={18} style={{ flexShrink: 0 }} />
              <div>{successMessage}</div>
            </div>
          )}

          {/* Error Message Banner */}
          {authError && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem', borderRadius: '12px', fontSize: '0.85rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{authError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {authMode === 'register' && (
              <div>
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="e.g. Obinna Eze"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            {authMode === 'register' && selectedRole === 'vendor' && (
              <div>
                <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
                <input
                  id="restaurantName"
                  type="text"
                  name="restaurantName"
                  className="form-control"
                  placeholder="e.g. Obinna Buka & Grill"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                placeholder={
                  selectedRole === 'vendor'
                    ? 'delta@urbaneats.com'
                    : selectedRole === 'rider'
                    ? 'rider1@urbaneats.com'
                    : 'customer@urbaneats.com'
                }
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="e.g. 08012345678"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSubmitting}
              style={{ borderRadius: '12px', padding: '12px', fontWeight: 800, marginTop: '0.5rem' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'login'
                      ? 'Sign In'
                      : selectedRole === 'customer'
                      ? 'Create Customer Account'
                      : `Submit ${selectedRole === 'vendor' ? 'Vendor' : 'Rider'} Application`}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {authMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  style={{ color: 'var(--primary)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                    setSuccessMessage('');
                  }}
                >
                  Apply / Register
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  style={{ color: 'var(--primary)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setSuccessMessage('');
                  }}
                >
                  Sign In to Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
