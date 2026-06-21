// src/components/activities/ActivityLog.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { activityAPI } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';
import ActivityFilters from './ActivityFilters';
import ActivityItem from './ActivityItem';

export default function ActivityLog({ isAdmin = false }) {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    action: '',
    limit: 50
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch activities based on role
  const fetchActivities = () => {
    if (isAdmin) {
      return activityAPI.getAll(filters);
    } else {
      return activityAPI.getMy(filters);
    }
  };

  const { data: activities, loading, error, refetch } = useApi(
    fetchActivities,
    [filters, refreshKey]
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearFilters = () => {
    setFilters({ action: '', limit: 50 });
  };

  if (loading) {
    return <LoadingSpinner message="Loading activities..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Failed to load activities</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const activityData = activities || [];
  const totalActivities = activityData.length;

  // Get unique action types for filter
  const actionTypes = [...new Set(activityData.map(a => a.action))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">📝 Activity Log</h2>
            <p className="text-blue-100 mt-1">
              {isAdmin 
                ? 'Monitor all user activities across the system'
                : 'View your recent activities and actions'
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-5xl">📋</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onRefresh={handleRefresh}
        actionTypes={actionTypes}
        isAdmin={isAdmin}
        loading={loading}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
        </p>
        {isAdmin && (
          <span className="text-xs text-gray-400">
            Admin view - all users
          </span>
        )}
      </div>

      {/* Activity List */}
      {totalActivities === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No activities found</h3>
          <p className="text-gray-500">
            {filters.action 
              ? `No ${filters.action} activities recorded yet`
              : 'Start using the system to see your activity here'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {activityData.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {totalActivities > 0 && (
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Showing latest {Math.min(totalActivities, filters.limit)} activities</span>
          {totalActivities >= filters.limit && (
            <span>Showing limited results. Adjust limit in filters to see more.</span>
          )}
        </div>
      )}
    </div>
  );
}