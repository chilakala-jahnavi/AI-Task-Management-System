// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Hook to debounce a value
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * 
 * @returns {any} Debounced value
 * 
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * useEffect(() => {
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};