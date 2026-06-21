// src/components/tasks/TaskList.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { taskAPI } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';
import TaskFilters from './TaskFilters';
import TaskCard from './TaskCard';

export default function TaskList({ tasks: propTasks, isAdmin, onUpdate, loading: propLoading }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filters, setFilters] = useState({
    status: '',
    assigned_to: '',
    search: ''
  });
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Use props if provided, otherwise fetch
  const { data: fetchedTasks, loading, refetch } = useApi(
    () => taskAPI.getAll(filters),
    [filters],
    { enabled: !propTasks }
  );

  const tasks = propTasks || fetchedTasks || [];
  const isLoading = propLoading || loading;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', assigned_to: '', search: '' });
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No tasks found</h3>
        <p className="text-gray-500 mb-4">
          {isAdmin 
            ? 'Create your first task to get started!' 
            : 'You don\'t have any tasks assigned yet.'}
        </p>
        {isAdmin && (
          <button
            onClick={() => navigate('/dashboard/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            + Create Task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <TaskFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        isAdmin={isAdmin}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </p>
        {isAdmin && (
          <button
            onClick={() => navigate('/dashboard/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <span>+</span> Create Task
          </button>
        )}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isAdmin={isAdmin}
            onUpdate={onUpdate || refetch}
            onView={handleViewTask}
          />
        ))}
      </div>

      {/* Task Details Modal */}
      {showDetails && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isAdmin={isAdmin}
          onClose={handleCloseDetails}
          onUpdate={onUpdate || refetch}
        />
      )}
    </div>
  );
}

// Task Details Modal Component
const TaskDetailsModal = ({ task, isAdmin, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);

  const canUpdate = isAdmin || task.assigned_to === user?.id;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await taskAPI.updateStatus(task.id, newStatus);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
    setUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {task.description && (
          <p className="text-gray-600 mb-4">{task.description}</p>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {task.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Assigned to:</span>
            <span className="text-sm">User #{task.assigned_to}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Created:</span>
            <span className="text-sm text-gray-600">
              {new Date(task.created_at).toLocaleString()}
            </span>
          </div>

          {task.updated_at && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Updated:</span>
              <span className="text-sm text-gray-600">
                {new Date(task.updated_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {canUpdate && (
          <div className="mt-6 flex flex-wrap gap-3">
            {task.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                ✅ Mark Complete
              </button>
            )}
            {task.status === 'pending' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                ▶️ Start Task
              </button>
            )}
            {task.status !== 'pending' && (
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={updating}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                🔄 Reset to Pending
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};