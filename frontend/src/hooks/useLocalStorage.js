// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Hook to sync state with localStorage
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value
 * 
 * @returns {Array} [storedValue, setValue]
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export const useLocalStorage = (key, initialValue) => {
  // Get stored value
  const readValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Sync with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};