import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('urbaneats_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'vendor' | 'rider' | 'admin'
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Check active PHP session on application startup
  useEffect(() => {
    async function checkSession() {
      try {
        setIsAuthLoading(true);
        const data = await apiClient.get('/auth/me.php');
        if (data.authenticated && data.user) {
          setUser(data.user);
          try {
            localStorage.setItem('urbaneats_user', JSON.stringify(data.user));
          } catch (e) {}
        } else {
          setUser(null);
          try {
            localStorage.removeItem('urbaneats_user');
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Session check failed or user unauthenticated:', err.message);
        setUser(null);
        try {
          localStorage.removeItem('urbaneats_user');
        } catch (e) {}
      } finally {
        setIsAuthLoading(false);
      }
    }

    checkSession();
  }, []);

  const openLogin = (role = 'customer') => {
    setSelectedRole(role);
    setAuthMode('login');
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const openRegister = (role = 'customer') => {
    if (role === 'admin') {
      role = 'customer';
    }
    setSelectedRole(role);
    setAuthMode('register');
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  const loginUser = async ({ email, password }) => {
    setAuthError('');
    try {
      const data = await apiClient.post('/auth/login.php', { email, password });
      if (data.status === 'success' && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem('urbaneats_user', JSON.stringify(data.user));
        } catch (e) {}
        closeModal();
        return data;
      } else {
        throw new Error(data.message || 'Login failed.');
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Invalid email address or password.';
      setAuthError(msg);
      throw err;
    }
  };

  const registerUser = async ({ fullName, email, phone, password, role = 'customer', restaurantName, category, address }) => {
    setAuthError('');
    try {
      const data = await apiClient.post('/auth/register.php', {
        fullName,
        email,
        phone,
        password,
        role,
        restaurantName,
        category,
        address
      });
      if (data.status === 'success' && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem('urbaneats_user', JSON.stringify(data.user));
        } catch (e) {}
        if (role === 'customer') {
          closeModal();
        }
        return data;
      } else {
        throw new Error(data.message || 'Registration failed.');
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed.';
      setAuthError(msg);
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await apiClient.post('/auth/logout.php');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('urbaneats_user');
      } catch (e) {}
    }
  };

  const updateUserProfile = async ({ fullName, phone }) => {
    setAuthError('');
    try {
      const data = await apiClient.post('/auth/update_profile.php', {
        full_name: fullName,
        phone: phone,
      });
      if (data.status === 'success' && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem('urbaneats_user', JSON.stringify(data.user));
        } catch (e) {}
        return data;
      } else {
        throw new Error(data.message || 'Profile update failed.');
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Unable to update profile.';
      setAuthError(msg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        isAuthModalOpen,
        authMode,
        selectedRole,
        authError,
        setAuthMode,
        setSelectedRole,
        setAuthError,
        openLogin,
        openRegister,
        closeModal,
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        logout: logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
