// src/api/endpoints.js
import api from './axiosConfig';

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================
export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise} - { access_token, token_type, role }
   */
  login: (credentials) => api.post('/auth/login', credentials),
  
  /**
   * Register new user
   * @param {Object} userData - { username, email, password, role }
   * @returns {Promise} - { message, user_id, role }
   */
  register: (userData) => api.post('/auth/register', userData),
  
  /**
   * Get current user info
   * @returns {Promise} - User object
   */
  getMe: () => api.get('/auth/me'),
  
  /**
   * Logout user (client side)
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
  }
};

// ============================================
// TASK ENDPOINTS
// ============================================
export const taskAPI = {
  /**
   * Get all tasks with optional filters
   * @param {Object} params - { status, assigned_to, search }
   * @returns {Promise} - Array of tasks
   */
  getAll: (params) => api.get('/tasks', { params }),
  
  /**
   * Get task by ID
   * @param {number} id - Task ID
   * @returns {Promise} - Task object
   */
  getById: (id) => api.get(`/tasks/${id}`),
  
  /**
   * Create new task
   * @param {Object} data - { title, description, assigned_to }
   * @returns {Promise} - Created task
   */
  create: (data) => api.post('/tasks', data),
  
  /**
   * Update task
   * @param {number} id - Task ID
   * @param {Object} data - { title, description, assigned_to }
   * @returns {Promise} - Updated task
   */
  update: (id, data) => api.put(`/tasks/${id}`, data),
  
  /**
   * Update task status
   * @param {number} id - Task ID
   * @param {string} status - pending, in_progress, completed
   * @returns {Promise} - Updated task
   */
  updateStatus: (id, status) => api.patch(`/tasks/${id}`, { status }),
  
  /**
   * Delete task
   * @param {number} id - Task ID
   * @returns {Promise} - Success message
   */
  delete: (id) => api.delete(`/tasks/${id}`),
  
  /**
   * Get tasks by status (filter helper)
   * @param {string} status - pending, in_progress, completed
   * @returns {Promise} - Array of tasks
   */
  getByStatus: (status) => api.get('/tasks', { params: { status } }),
  
  /**
   * Get tasks assigned to specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of tasks
   */
  getByUser: (userId) => api.get('/tasks', { params: { assigned_to: userId } })
};

// ============================================
// DOCUMENT ENDPOINTS
// ============================================
export const documentAPI = {
  /**
   * Upload document
   * @param {File} file - File object
   * @returns {Promise} - { message, document_id, filename, chunks_processed }
   */
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  /**
   * Get all documents
   * @returns {Promise} - Array of documents
   */
  getAll: () => api.get('/documents'),
  
  /**
   * Get document by ID
   * @param {number} id - Document ID
   * @returns {Promise} - Document object
   */
  getById: (id) => api.get(`/documents/${id}`),
  
  /**
   * Delete document
   * @param {number} id - Document ID
   * @returns {Promise} - Success message
   */
  delete: (id) => api.delete(`/documents/${id}`),
  
  /**
   * Get documents by user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of documents
   */
  getByUser: (userId) => api.get('/documents', { params: { user_id: userId } })
};

// ============================================
// SEARCH ENDPOINTS
// ============================================
export const searchAPI = {
  /**
   * Perform semantic search
   * @param {string} query - Search query
   * @param {number} topK - Number of results (default: 5)
   * @returns {Promise} - { query, results_count, results }
   */
  semantic: (query, topK = 5) => 
    api.get('/search', { params: { q: query, top_k: topK } }),
  
  /**
   * Search with filters
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} - Search results
   */
  searchWithFilters: (query, filters = {}) => 
    api.get('/search', { params: { q: query, ...filters } })
};

// ============================================
// ANALYTICS ENDPOINTS
// ============================================
export const analyticsAPI = {
  /**
   * Get dashboard analytics
   * @returns {Promise} - { total_tasks, completed_tasks, pending_tasks, 
   *                       in_progress_tasks, completion_rate, most_searched_queries,
   *                       user_stats, recent_activities }
   */
  getDashboard: () => api.get('/analytics/dashboard'),
  
  /**
   * Get task statistics
   * @returns {Promise} - Task statistics
   */
  getTaskStats: () => api.get('/analytics/tasks'),
  
  /**
   * Get user statistics (Admin only)
   * @returns {Promise} - User statistics
   */
  getUserStats: () => api.get('/analytics/users')
};

// ============================================
// ACTIVITY ENDPOINTS
// ============================================
export const activityAPI = {
  /**
   * Get all activities (Admin only)
   * @param {Object} params - { limit, action }
   * @returns {Promise} - Array of activities
   */
  getAll: (params) => api.get('/activities', { params }),
  
  /**
   * Get current user's activities
   * @param {Object} params - { limit }
   * @returns {Promise} - Array of activities
   */
  getMy: (params) => api.get('/activities/me', { params }),
  
  /**
   * Get activities by action type (Admin only)
   * @param {string} action - login, task_update, document_upload, search
   * @param {number} limit - Number of results
   * @returns {Promise} - Array of activities
   */
  getByAction: (action, limit = 50) => 
    api.get('/activities', { params: { action, limit } }),
  
  /**
   * Get activities by user (Admin only)
   * @param {number} userId - User ID
   * @param {number} limit - Number of results
   * @returns {Promise} - Array of activities
   */
  getByUser: (userId, limit = 50) => 
    api.get('/activities', { params: { user_id: userId, limit } })
};

// ============================================
// EXPORT ALL ENDPOINTS
// ============================================
const apiEndpoints = {
  auth: authAPI,
  tasks: taskAPI,
  documents: documentAPI,
  search: searchAPI,
  analytics: analyticsAPI,
  activities: activityAPI
};

export default apiEndpoints;