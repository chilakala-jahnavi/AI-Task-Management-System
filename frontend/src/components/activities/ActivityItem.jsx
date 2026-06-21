// src/components/activities/ActivityItem.jsx
import React, { useState } from 'react';
import {
  UserCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function ActivityItem({ activity, isAdmin }) {
  const [expanded, setExpanded] = useState(false);

  const getActionIcon = (action) => {
    const icons = {
      login: ArrowRightOnRectangleIcon,
      task_update: PencilSquareIcon,
      document_upload: DocumentTextIcon,
      search: MagnifyingGlassIcon,
      task_create: CheckCircleIcon
    };
    const Icon = icons[action] || ClockIcon;
    return <Icon className="h-5 w-5" />;
  };

  const getActionColor = (action) => {
    const colors = {
      login: 'bg-green-100 text-green-600',
      task_update: 'bg-blue-100 text-blue-600',
      document_upload: 'bg-purple-100 text-purple-600',
      search: 'bg-orange-100 text-orange-600',
      task_create: 'bg-emerald-100 text-emerald-600'
    };
    return colors[action] || 'bg-gray-100 text-gray-600';
  };

  const getActionLabel = (action) => {
    const labels = {
      login: 'Login',
      task_update: 'Task Updated',
      document_upload: 'Document Uploaded',
      search: 'Search Performed',
      task_create: 'Task Created'
    };
    return labels[action] || action;
  };

  const getActionEmoji = (action) => {
    const emojis = {
      login: '🔐',
      task_update: '📝',
      document_upload: '📄',
      search: '🔍',
      task_create: '✅'
    };
    return emojis[action] || '📌';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    // Full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDetailsPreview = (details) => {
    if (!details) return '';
    if (details.length > 100) {
      return details.substring(0, 100) + '...';
    }
    return details;
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg flex-shrink-0 ${getActionColor(activity.action)}`}>
          {getActionIcon(activity.action)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Action Type */}
            <span className="font-medium text-gray-800">
              {getActionEmoji(activity.action)} {getActionLabel(activity.action)}
            </span>

            {/* User (Admin only) */}
            {isAdmin && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                <UserCircleIcon className="h-3 w-3" />
                User #{activity.user_id}
              </span>
            )}

            {/* Timestamp */}
            <span className="text-xs text-gray-400">
              {formatDate(activity.created_at)}
            </span>

            {/* Expand button */}
            {activity.details && activity.details.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:text-blue-800 transition"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Details */}
          {activity.details && (
            <p className={`text-sm text-gray-600 mt-1 ${!expanded ? 'line-clamp-2' : ''}`}>
              {expanded ? activity.details : getDetailsPreview(activity.details)}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
            {activity.ip_address && (
              <span>🌐 IP: {activity.ip_address}</span>
            )}
            <span>🕐 {new Date(activity.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}