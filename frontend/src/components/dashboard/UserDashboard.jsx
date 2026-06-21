// src/components/dashboard/UserDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

export default function UserDashboard({ tasks, loading, onUpdate }) {
  if (loading) {
    return <LoadingSpinner message="Loading your tasks..." />;
  }

  // Calculate task stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get pending tasks (urgent)
  const pendingTasksList = tasks?.filter(t => t.status === 'pending').slice(0, 3) || [];

  // Stat cards
  const statCards = [
    {
      title: 'My Tasks',
      value: totalTasks,
      icon: DocumentTextIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: ExclamationTriangleIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: PencilSquareIcon,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">👋 Welcome back, User!</h1>
            <p className="text-blue-100 mt-1">
              Here's your task overview
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-5xl">👤</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold text-gray-800 mt-1">
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

      {/* Completion Rate */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Task Completion Rate</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{completionRate}%</p>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            ⚠️ Pending Tasks
          </h3>
          <Link
            to="/dashboard/tasks?status=pending"
            className="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            View All →
          </Link>
        </div>
        
        {pendingTasksList.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-gray-500">No pending tasks! Great job!</p>
          </div>
        ) : (
          <div className="divide-y">
            {pendingTasksList.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/dashboard/tasks"
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                  >
                    Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/search"
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="bg-purple-50 p-3 rounded-lg">
            <MagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Search Documents</h4>
            <p className="text-sm text-gray-500">Find answers using AI</p>
          </div>
        </Link>
        
        <Link
          to="/dashboard/activities"
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="bg-orange-50 p-3 rounded-lg">
            <ClockIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">My Activity</h4>
            <p className="text-sm text-gray-500">View your recent actions</p>
          </div>
        </Link>
      </div>
    </div>
  );
}