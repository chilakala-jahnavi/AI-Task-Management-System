// src/components/dashboard/AdminDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  FolderIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AdminDashboard({ tasks, stats, loading, onUpdate }) {
  const [showRecentTasks, setShowRecentTasks] = useState(true);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Calculate additional stats
  const totalTasks = stats?.total_tasks || 0;
  const completedTasks = stats?.completed_tasks || 0;
  const pendingTasks = stats?.pending_tasks || 0;
  const inProgressTasks = stats?.in_progress_tasks || 0;
  const completionRate = stats?.completion_rate || '0%';
  const totalUsers = stats?.user_stats?.total || 0;
  const adminUsers = stats?.user_stats?.admins || 0;
  const regularUsers = stats?.user_stats?.regular_users || 0;

  // Get recent tasks (last 5)
  const recentTasks = tasks?.slice(0, 5) || [];

  // Stat cards configuration
  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: DocumentTextIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/dashboard/tasks'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/dashboard/tasks?status=completed'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: ExclamationTriangleIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      link: '/dashboard/tasks?status=pending'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: PencilSquareIcon,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/dashboard/tasks?status=in_progress'
    },
    {
      title: 'Completion Rate',
      value: completionRate,
      icon: ArrowTrendingUpIcon,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      link: '/dashboard/analytics'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: UserGroupIcon,
      color: 'pink',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      link: '/dashboard/users'
    },
  ];

  // Quick action buttons
  const quickActions = [
    { label: 'Create Task', icon: PlusCircleIcon, color: 'blue', link: '/dashboard/create' },
    { label: 'Upload Document', icon: FolderIcon, color: 'green', link: '/dashboard/upload' },
    { label: 'Search', icon: MagnifyingGlassIcon, color: 'purple', link: '/dashboard/search' },
    { label: 'View Analytics', icon: ChartBarIcon, color: 'indigo', link: '/dashboard/analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">👋 Welcome back, Admin!</h1>
            <p className="text-blue-100 mt-1">
              Here's what's happening with your tasks today
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-5xl">📋</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className={`flex items-center gap-2 px-4 py-2 bg-${action.color}-50 text-${action.color}-700 rounded-lg hover:bg-${action.color}-100 transition`}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Recent Tasks
          </h3>
          <Link
            to="/dashboard/tasks"
            className="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            View All →
          </Link>
        </div>
        
        {recentTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500">No tasks created yet</p>
            <Link
              to="/dashboard/create"
              className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Create your first task →
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Assigned to User #{task.assigned_to}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}