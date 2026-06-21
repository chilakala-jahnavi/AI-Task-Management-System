// src/hooks/useToast.js
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Custom hook to use toast notifications
 * 
 * @returns {Object} Toast context value
 * @throws {Error} If used outside of ToastProvider
 * 
 * @example
 * const { success, error, info, warning } = useToast();
 * success('Task created successfully!');
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default useToast;