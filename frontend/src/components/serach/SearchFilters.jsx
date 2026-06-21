// src/components/search/SearchFilters.jsx
import React from 'react';

export default function SearchFilters({ filters, onFilterChange, disabled }) {
  const topKOptions = [
    { value: 3, label: '3 results' },
    { value: 5, label: '5 results' },
    { value: 10, label: '10 results' },
    { value: 20, label: '20 results' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Results Count
          </label>
          <select
            value={filters.topK || 5}
            onChange={(e) => onFilterChange('topK', parseInt(e.target.value))}
            disabled={disabled}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {topKOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Min Relevance Score
          </label>
          <select
            value={filters.minScore || 0}
            onChange={(e) => onFilterChange('minScore', parseFloat(e.target.value))}
            disabled={disabled}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value={0}>All scores</option>
            <option value={0.3}>30%+</option>
            <option value={0.5}>50%+</option>
            <option value={0.7}>70%+</option>
          </select>
        </div>

        <div className="flex-1"></div>

        <div className="text-xs text-gray-400">
          💡 Higher score = better match
        </div>
      </div>
    </div>
  );
}