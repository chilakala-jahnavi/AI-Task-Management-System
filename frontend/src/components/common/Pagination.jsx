// src/components/common/Pagination.jsx
import React, { useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  showPageNumbers = true,
  siblingCount = 1,
  boundaryCount = 1,
  className = ''
}) {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - (boundaryCount + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = boundaryCount * 2 + siblingCount * 2 + 3;
      return [...range(1, leftItemCount), '...', ...range(totalPages - boundaryCount + 1, totalPages)];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaryCount * 2 + siblingCount * 2 + 3;
      return [...range(1, boundaryCount), '...', ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        ...range(1, boundaryCount),
        '...',
        ...middleRange,
        '...',
        ...range(totalPages - boundaryCount + 1, totalPages)
      ];
    }
  }, [totalPages, currentPage, siblingCount, boundaryCount]);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* First Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span className="text-sm">⟪</span>
        </button>
      )}

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      {showPageNumbers && paginationRange?.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
              …
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      {/* Last Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span className="text-sm">⟫</span>
        </button>
      )}

      {/* Page Info */}
      <span className="ml-4 text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}