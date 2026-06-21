// src/components/common/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false,
  variant = 'primary'
}) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const variants = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      <div className="relative">
        <div className={`animate-spin rounded-full border-4 border-t-transparent ${variants[variant]} ${sizes[size]}`}></div>
        {message && (
          <p className="mt-4 text-sm text-gray-500 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Skeleton Loader Component
export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const renderSkeleton = () => {
    switch(type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex gap-2 mt-3">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        );
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};