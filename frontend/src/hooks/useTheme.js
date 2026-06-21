// src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to use theme context
 * 
 * @returns {Object} Theme context value
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default useTheme;