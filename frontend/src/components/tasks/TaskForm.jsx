// src/components/tasks/TaskForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMutation } from '../../hooks/useApi';
import { taskAPI } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TaskForm({ onTaskCreated, initialData = null, isEditing = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assigned_to: initialData?.assigned_to || 1,
    priority: initialData?.priority || 'medium'
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const { mutate: createTask, loading: creating } = useMutation(taskAPI.create, {
    onSuccess: () => {
      setSuccess('Task created successfully!');
      setTimeout(() => {
        if (onTaskCreated) onTaskCreated();
        navigate('/dashboard/tasks');
      }, 1500);
    }
  });

  const { mutate: updateTask, loading: updating } = useMutation(
    (data) => taskAPI.update(initialData?.id, data),
    {
      onSuccess: () => {
        setSuccess('Task updated successfully!');
        setTimeout(() => {
          if (onTaskCreated) onTaskCreated();
          navigate('/dashboard/tasks');
        }, 1500);
      }
    }
  );

  const isLoading = creating || updating;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Task title must be less than 200 characters';
    }
    if (!formData.assigned_to || formData.assigned_to < 1) {
      newErrors.assigned_to = 'Please assign to a valid user';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assigned_to: parseInt(formData.assigned_to),
      priority: formData.priority
    };

    if (isEditing && initialData) {
      await updateTask(taskData);
    } else {
      await createTask(taskData);
    }
  };

  const priorities = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🔴 High' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? '✏️ Edit Task' : '➕ Create New Task'}
      </h2>

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Task Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            placeholder="Enter task title"
            disabled={isLoading}
            maxLength="200"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {formData.title.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter task description (optional)"
            disabled={isLoading}
          />
        </div>

        {/* Assign To */}
        <div>
          <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
            Assign To (User ID)
          </label>
          <input
            id="assigned_to"
            name="assigned_to"
            type="number"
            value={formData.assigned_to}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.assigned_to ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            placeholder="Enter user ID (e.g., 1)"
            disabled={isLoading}
            min="1"
          />
          {errors.assigned_to && (
            <p className="mt-1 text-sm text-red-600">{errors.assigned_to}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Enter the ID of the user this task should be assigned to
          </p>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" message={isEditing ? 'Updating...' : 'Creating...'} />
            ) : (
              isEditing ? '✏️ Update Task' : '📝 Create Task'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard/tasks')}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}