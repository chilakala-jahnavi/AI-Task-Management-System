// src/utils/constants.js

// ============================================
// API Constants
// ============================================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// ============================================
// Route Paths
// ============================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TASKS: '/dashboard/tasks',
  CREATE_TASK: '/dashboard/create',
  UPLOAD: '/dashboard/upload',
  SEARCH: '/dashboard/search',
  ANALYTICS: '/dashboard/analytics',
  ACTIVITIES: '/dashboard/activities',
  PROFILE: '/dashboard/profile',
  USERS: '/dashboard/users',
  SETTINGS: '/dashboard/settings'
};

// ============================================
// Task Status Constants
// ============================================
export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
];

// ============================================
// User Role Constants
// ============================================
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// ============================================
// Activity Types
// ============================================
export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  TASK_UPDATE: 'task_update',
  TASK_CREATE: 'task_create',
  DOCUMENT_UPLOAD: 'document_upload',
  SEARCH: 'search'
};

export const ACTIVITY_ICONS = {
  login: '🔐',
  task_update: '📝',
  task_create: '✅',
  document_upload: '📄',
  search: '🔍'
};

// ============================================
// Storage Keys
// ============================================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_ROLE: 'user_role',
  USERNAME: 'username',
  THEME: 'theme'
};

// ============================================
// File Upload Constants
// ============================================
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_EXTENSIONS = ['.txt', '.pdf'];