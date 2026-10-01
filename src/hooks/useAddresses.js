/**
 * useAddresses — UrbanEats Saved Addresses Hook
 *
 * Single source of truth for the authenticated user's saved delivery addresses.
 *
 * Features:
 *   - Fetches saved addresses from PHP/MySQL backend when user is authenticated
 *   - Provides createAddress, editAddress, removeAddress functions
 *   - Updates state optimistically and handles loading / error states
 *   - Automatically resets when user logs out
 *   - Strict user isolation powered by PHP $_SESSION['user_id']
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAddresses,
  createAddress as apiCreateAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
} from '../api/addressesApi';

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const items = await fetchAddresses();
      setAddresses(items);
    } catch (err) {
      setError('Unable to load saved addresses.');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(async (addressData) => {
    try {
      const res = await apiCreateAddress(addressData);
      await loadAddresses();
      return res;
    } catch (err) {
      throw err;
    }
  }, [loadAddresses]);

  const editAddress = useCallback(async (id, addressData) => {
    try {
      const res = await apiUpdateAddress(id, addressData);
      await loadAddresses();
      return res;
    } catch (err) {
      throw err;
    }
  }, [loadAddresses]);

  const removeAddress = useCallback(async (id) => {
    try {
      const res = await apiDeleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return res;
    } catch (err) {
      await loadAddresses();
      throw err;
    }
  }, [loadAddresses]);

  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0] || null;

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    addAddress,
    editAddress,
    removeAddress,
    refetchAddresses: loadAddresses,
  };
}
