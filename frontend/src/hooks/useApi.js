// src/hooks/useApi.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for making API calls with loading and error states
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies for useEffect
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to call immediately (default: true)
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * 
 * @returns {Object} { data, loading, error, status, execute, reset }
 * 
 * @example
 * const { data, loading, error, refetch } = useApi(
 *   () => taskAPI.getAll(),
 *   []
 * );
 */
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const {
    immediate = true,
    onSuccess,
    onError,
    enabled = true
  } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    if (!mounted.current) return;
    
    setLoading(true);
    setStatus('loading');
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      if (mounted.current) {
        setData(response.data);
        setStatus('success');
        if (onSuccess) onSuccess(response.data);
      }
      return { success: true, data: response.data };
    } catch (err) {
      if (mounted.current) {
        const message = err.response?.data?.detail || err.message || 'An error occurred';
        setError(message);
        setStatus('error');
        if (onError) onError(message);
      }
      return { success: false, error: err };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate && enabled) {
      execute();
    }
  }, [...dependencies]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus('idle');
    setLoading(false);
  }, []);

  const refetch = useCallback((...args) => {
    return execute(...args);
  }, [execute]);

  return { 
    data, 
    loading, 
    error, 
    status, 
    execute, 
    reset,
    refetch,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
};

/**
 * Hook for mutations (POST, PUT, DELETE)
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * 
 * @returns {Object} { mutate, loading, error, data }
 * 
 * @example
 * const { mutate, loading } = useMutation(
 *   (data) => taskAPI.create(data),
 *   { onSuccess: () => refetch() }
 * );
 */
export const useMutation = (apiFunction, options = {}) => {
  const { onSuccess, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(payload);
      setData(response.data);
      if (onSuccess) onSuccess(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'An error occurred';
      setError(message);
      if (onError) onError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  return { mutate, loading, error, data };
};