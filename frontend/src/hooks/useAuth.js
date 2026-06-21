// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to use authentication context
 * 
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * const { user, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;