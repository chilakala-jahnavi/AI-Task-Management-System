// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * ProtectedRoute Component
 * 
 * This component protects routes from unauthorized access.
 * It checks if the user is authenticated and optionally checks for admin role.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.requireAdmin - Whether admin role is required
 * @param {string} props.redirectTo - Where to redirect on failure (default: '/login')
 */
export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login' 
}) {
  const { isAuthenticated, isAdmin, loading, isInitialized } = useAuth();

  // Show loading spinner while checking authentication
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Admin role required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need administrator privileges to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render children or Outlet
  return children || <Outlet />;
}