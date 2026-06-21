// src/hooks/usePagination.js
import { useState, useCallback, useMemo } from 'react';

/**
 * Hook for managing pagination state
 * 
 * @param {Object} options - Pagination options
 * @param {number} options.initialPage - Initial page (default: 1)
 * @param {number} options.initialLimit - Items per page (default: 10)
 * @param {number} options.totalItems - Total number of items
 * 
 * @returns {Object} Pagination state and controls
 * 
 * @example
 * const pagination = usePagination({ totalItems: 100 });
 * <Pagination {...pagination} />
 */
export const usePagination = (options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    totalItems = 0
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / limit) || 1;
  }, [totalItems, limit]);

  const nextPage = useCallback(() => {
    setPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((pageNum) => {
    setPage(Math.min(Math.max(pageNum, 1), totalPages));
  }, [totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  const offset = useMemo(() => {
    return (page - 1) * limit;
  }, [page, limit]);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    offset,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
    setPage,
    setLimit
  };
};