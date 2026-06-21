// src/components/analytics/AnalyticsDashboard.jsx
import React, { useState } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ActivityLog from '../activities/ActivityLog';

export default function AnalyticsDashboard({ stats, loading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No analytics data available</h3>
        <p className="text-gray-500">Start creating tasks and uploading documents to see analytics</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: ChartBarIcon },
    { id: 'tasks', label: '📋 Tasks', icon: DocumentTextIcon },
    { id: 'users', label: '👥 Users', icon: UserGroupIcon },
    { id: 'activities', label: '📝 Activity', icon: ClockIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">📊 Analytics Dashboard</h2>
            <p className="text-blue-100 mt-1">
              Overview of your task management system performance
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-5xl">📈</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} />
        )}
        {activeTab === 'tasks' && (
          <TasksTab stats={stats} />
        )}
        {activeTab === 'users' && (
          <UsersTab stats={stats} />
        )}
        {activeTab === 'activities' && (
          <ActivityLog isAdmin={true} />
        )}
      </div>
    </div>
  );
}

// ============================================
// OVERVIEW TAB
// ============================================
const OverviewTab = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total_tasks,
      icon: DocumentTextIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completed_tasks,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats.pending_tasks,
      icon: ExclamationTriangleIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: stats.in_progress_tasks,
      icon: ClockIcon,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: stats.completion_rate,
      icon: ArrowTrendingUpIcon,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Users',
      value: stats.user_stats?.total || 0,
      icon: UserGroupIcon,
      color: 'pink',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  // Calculate percentages for visual indicators
  const total = stats.total_tasks || 1;
  const completedPct = ((stats.completed_tasks || 0) / total * 100).toFixed(0);
  const pendingPct = ((stats.pending_tasks || 0) / total * 100).toFixed(0);
  const inProgressPct = ((stats.in_progress_tasks || 0) / total * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Task Distribution</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Completed</span>
              <span className="font-medium">{completedPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completedPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>In Progress</span>
              <span className="font-medium">{inProgressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${inProgressPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Pending</span>
              <span className="font-medium">{pendingPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${pendingPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Most Searched Queries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Most Searched Queries</h4>
        {stats.most_searched_queries?.length > 0 ? (
          <div className="space-y-2">
            {stats.most_searched_queries.map((query, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-700">{query.query}</span>
                </div>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {query.count}x
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No searches recorded yet</p>
        )}
      </div>

      {/* Recent Activities Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Activity</h4>
        {stats.recent_activities?.slice(0, 5).map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
            <div>
              <span className={`text-sm font-medium ${
                activity.action === 'login' ? 'text-green-600' :
                activity.action === 'task_update' ? 'text-blue-600' :
                activity.action === 'document_upload' ? 'text-purple-600' :
                activity.action === 'search' ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                {activity.action}
              </span>
              <span className="text-sm text-gray-500 ml-2">{activity.details}</span>
            </div>
            <span className="text-xs text-gray-400">{activity.created_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// TASKS TAB
// ============================================
const TasksTab = ({ stats }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total_tasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed_tasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending_tasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-3xl font-bold text-blue-600">{stats.completion_rate}</p>
        </div>
      </div>

      {/* Task Stats Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Task Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed_tasks}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending_tasks}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.in_progress_tasks}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// USERS TAB
// ============================================
const UsersTab = ({ stats }) => {
  const userStats = stats.user_stats || { total: 0, admins: 0, regular_users: 0 };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-gray-800">{userStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-3xl font-bold text-purple-600">{userStats.admins}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Regular Users</p>
          <p className="text-3xl font-bold text-blue-600">{userStats.regular_users}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">User Distribution</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Admins</span>
              <span className="font-medium">{userStats.total > 0 ? ((userStats.admins / userStats.total) * 100).toFixed(0) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-500 h-2.5 rounded-full" 
                style={{ width: userStats.total > 0 ? `${(userStats.admins / userStats.total) * 100}%` : '0%' }} 
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Regular Users</span>
              <span className="font-medium">{userStats.total > 0 ? ((userStats.regular_users / userStats.total) * 100).toFixed(0) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: userStats.total > 0 ? `${(userStats.regular_users / userStats.total) * 100}%` : '0%' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};