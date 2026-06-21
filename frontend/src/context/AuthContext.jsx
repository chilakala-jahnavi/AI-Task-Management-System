import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../api/endpoints';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('user_role');
      const username = localStorage.getItem('username');
      
      if (token && role) {
        setUser({ role, username, token });
        try {
          const response = await authAPI.getMe();
          setUser({ 
            ...response.data, 
            role, 
            username,
            token 
          });
        } catch (err) {
          console.error('Auth initialization failed:', err);
          logout();
        }
      }
      setLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ username, password });
      const { access_token, role } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_role', role);
      localStorage.setItem('username', username);
      
      setUser({ 
        role, 
        username, 
        token: access_token,
        id: response.data.id 
      });
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register
  }), [user, loading, error, isInitialized, login, logout, register]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
