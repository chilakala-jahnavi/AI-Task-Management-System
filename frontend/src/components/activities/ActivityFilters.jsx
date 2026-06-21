// src/components/activities/ActivityFilters.jsx
import React from 'react';

export default function ActivityFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onRefresh,
  actionTypes,
  isAdmin,
  loading
}) {
  const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'login', label: '🔐 Login' },
    { value: 'task_update', label: '📝 Task Update' },
    { value: 'document_upload', label: '📄 Document Upload' },
    { value: 'search', label: '🔍 Search' },
    { value: 'task_create', label: '✅ Task Create' }
  ];

  const limitOptions = [
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 200, label: '200' }
  ];

  // Filter out empty action types
  const availableActions = actionTypes?.filter(a => a) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Action Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Action Type
          </label>
          <select
            value={filters.action || ''}
            onChange={(e) => onFilterChange('action', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {actionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Limit Filter */}
        <div className="w-32">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Limit
          </label>
          <select
            value={filters.limit || 50}
            onChange={(e) => onFilterChange('limit', parseInt(e.target.value))}
            disabled={loading}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {limitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          {(filters.action || filters.limit !== 50) && (
            <button
              onClick={onClearFilters}
              className="px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              ✕ Clear
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span>
                Loading...
              </>
            ) : (
              <>
                🔄 Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {filters.action && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-gray-500">Active filter:</span>
          <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {actionOptions.find(o => o.value === filters.action)?.label || filters.action}
          </span>
        </div>
      )}
    </div>
  );
}