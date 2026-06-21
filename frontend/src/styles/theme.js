// src/styles/theme.js
export const theme = {
  colors: {
    primary: {
      light: '#60a5fa',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
    },
    secondary: {
      light: '#94a3b8',
      DEFAULT: '#64748b',
      dark: '#475569',
    },
    success: {
      light: '#4ade80',
      DEFAULT: '#22c55e',
      dark: '#16a34a',
    },
    warning: {
      light: '#facc15',
      DEFAULT: '#eab308',
      dark: '#ca8a04',
    },
    danger: {
      light: '#f87171',
      DEFAULT: '#ef4444',
      dark: '#dc2626',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
};