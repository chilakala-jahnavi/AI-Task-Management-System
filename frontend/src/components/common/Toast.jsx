// src/components/common/Toast.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const Toast = ({ id, message, type, onClose }) => {
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

// Toast Container
export default function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col items-end max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}