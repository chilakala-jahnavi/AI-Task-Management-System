// src/api/axiosConfig.js
import axios from 'axios';

// Base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status}:`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear expired token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('username');
      
      // Redirect to login
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Forbidden: You don\'t have permission for this action');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('[API] Not Found: The requested resource does not exist');
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('[API] Server Error:', error.response?.data);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('[API] Network Error:', error.message);
    }
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Response Error:', error.response?.status, error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('access_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('access_token');
  }
};

// Remove auth token
export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('username');
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('user_role');
};

// Get username
export const getUsername = () => {
  return localStorage.getItem('username');
};

export default api;