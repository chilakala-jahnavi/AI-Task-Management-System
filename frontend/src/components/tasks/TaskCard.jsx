// src/components/tasks/TaskCard.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMutation } from '../../hooks/useApi';
import { taskAPI } from '../../api/endpoints';

export default function TaskCard({ task, isAdmin, onUpdate, onView }) {
  const { user } = useAuth();

  const { mutate: updateStatus, loading } = useMutation(taskAPI.updateStatus, {
    onSuccess: () => {
      if (onUpdate) onUpdate();
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-orange-600',
      low: 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const canUpdate = isAdmin || task.assigned_to === user?.id;

  const handleStatusChange = async (newStatus) => {
    await updateStatus(task.id, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 
            className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer truncate"
            onClick={() => onView && onView(task)}
          >
            {task.title}
          </h3>
          
          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            
            {task.priority && (
              <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            )}
            
            <span className="text-xs text-gray-500">
              👤 User #{task.assigned_to}
            </span>
            
            <span className="text-xs text-gray-400">
              📅 {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        {canUpdate && (
          <div className="flex flex-col gap-1 ml-3">
            {task.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={loading}
                className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition disabled:opacity-50 whitespace-nowrap"
              >
                ✅ Done
              </button>
            )}
            {task.status === 'pending' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={loading}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition disabled:opacity-50 whitespace-nowrap"
              >
                ▶️ Start
              </button>
            )}
            {task.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={loading}
                className="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs transition disabled:opacity-50 whitespace-nowrap"
              >
                ⏸️ Pause
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}