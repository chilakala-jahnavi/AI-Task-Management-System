// src/context/ToastContext.jsx
import React, { createContext, useState, useCallback, useMemo } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, duration) => {
    addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    addToast(message, 'warning', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    addToast(message, 'info', duration);
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }), [toasts, addToast, removeToast, success, error, warning, info, clearAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col items-end max-w-md w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: '✅',
      text: 'text-green-800',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: '❌',
      text: 'text-red-800',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      icon: '⚠️',
      text: 'text-yellow-800',
      progress: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: 'ℹ️',
      text: 'text-blue-800',
      progress: 'bg-blue-500'
    }
  };

  const style = types[type] || types.info;

  return (
    <div 
      className={`${style.bg} ${style.border} border-l-4 rounded-lg shadow-lg mb-3 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3 min-w-[320px] max-w-md">
        <span className="text-xl flex-shrink-0">{style.icon}</span>
        <span className={`flex-1 text-sm ${style.text}`}>{message}</span>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};