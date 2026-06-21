// src/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './utils/constants';

// ============================================
// LAZY LOAD COMPONENTS (Optional - for code splitting)
// ============================================
// Uncomment these if you want to use lazy loading
// const Login = React.lazy(() => import('./components/auth/Login'));
// const Register = React.lazy(() => import('./components/auth/Register'));
// const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
// const TaskList = React.lazy(() => import('./components/tasks/TaskList'));
// const TaskForm = React.lazy(() => import('./components/tasks/TaskForm'));
// const DocumentUpload = React.lazy(() => import('./components/documents/DocumentUpload'));
// const SemanticSearch = React.lazy(() => import('./components/search/SemanticSearch'));
// const AnalyticsDashboard = React.lazy(() => import('./components/analytics/AnalyticsDashboard'));
// const ActivityLog = React.lazy(() => import('./components/activities/ActivityLog'));

// ============================================
// ROUTE CONFIGURATION
// ============================================

/**
 * Public routes configuration
 * These routes are accessible without authentication
 */
export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    name: 'Login',
    component: 'Login',
    exact: true,
    title: 'Login - Task Management',
  },
  {
    path: ROUTES.REGISTER,
    name: 'Register',
    component: 'Register',
    exact: true,
    title: 'Register - Task Management',
  },
];

/**
 * Protected routes configuration
 * These routes require authentication
 */
export const protectedRoutes = [
  {
    path: ROUTES.DASHBOARD,
    name: 'Dashboard',
    component: 'Dashboard',
    exact: false,
    icon: '📊',
    title: 'Dashboard - Task Management',
  },
  {
    path: ROUTES.TASKS,
    name: 'Tasks',
    component: 'TaskList',
    exact: false,
    icon: '📋',
    title: 'Tasks - Task Management',
  },
  {
    path: ROUTES.CREATE_TASK,
    name: 'Create Task',
    component: 'TaskForm',
    exact: false,
    icon: '➕',
    adminOnly: true,
    title: 'Create Task - Task Management',
  },
  {
    path: ROUTES.UPLOAD,
    name: 'Upload Document',
    component: 'DocumentUpload',
    exact: false,
    icon: '📤',
    adminOnly: true,
    title: 'Upload Document - Task Management',
  },
  {
    path: ROUTES.SEARCH,
    name: 'Search',
    component: 'SemanticSearch',
    exact: false,
    icon: '🔍',
    title: 'Search - Task Management',
  },
  {
    path: ROUTES.ANALYTICS,
    name: 'Analytics',
    component: 'AnalyticsDashboard',
    exact: false,
    icon: '📈',
    adminOnly: true,
    title: 'Analytics - Task Management',
  },
  {
    path: ROUTES.ACTIVITIES,
    name: 'Activity Log',
    component: 'ActivityLog',
    exact: false,
    icon: '📝',
    title: 'Activity Log - Task Management',
  },
  {
    path: ROUTES.PROFILE,
    name: 'Profile',
    component: 'Profile',
    exact: false,
    icon: '👤',
    title: 'Profile - Task Management',
  },
  {
    path: ROUTES.USERS,
    name: 'Users',
    component: 'Users',
    exact: false,
    icon: '👥',
    adminOnly: true,
    title: 'Users - Task Management',
  },
  {
    path: ROUTES.SETTINGS,
    name: 'Settings',
    component: 'Settings',
    exact: false,
    icon: '⚙️',
    title: 'Settings - Task Management',
  },
];

// ============================================
// NAVIGATION HELPERS
// ============================================

/**
 * Get navigation items for sidebar
 * @param {string} userRole - User role ('admin' or 'user')
 * @param {Object} options - Additional options
 * @param {number} options.taskCount - Number of tasks (for badge)
 * @returns {Array} Navigation items
 */
export const getNavigationItems = (userRole = 'user', options = {}) => {
  const { taskCount = 0 } = options;

  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: ROUTES.DASHBOARD,
      description: 'View your dashboard',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '📋',
      path: ROUTES.TASKS,
      description: 'Manage your tasks',
      badge: taskCount > 0 ? taskCount : null,
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      path: ROUTES.SEARCH,
      description: 'Search your documents',
    },
    {
      id: 'activities',
      label: 'Activity Log',
      icon: '📝',
      path: ROUTES.ACTIVITIES,
      description: 'View your activity',
    },
  ];

  // Admin only items
  if (userRole === 'admin') {
    items.push(
      {
        id: 'create',
        label: 'Create Task',
        icon: '➕',
        path: ROUTES.CREATE_TASK,
        description: 'Create a new task',
      },
      {
        id: 'upload',
        label: 'Upload',
        icon: '📤',
        path: ROUTES.UPLOAD,
        description: 'Upload documents',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        path: ROUTES.ANALYTICS,
        description: 'View analytics',
      },
      {
        id: 'users',
        label: 'Users',
        icon: '👥',
        path: ROUTES.USERS,
        description: 'Manage users',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        path: ROUTES.SETTINGS,
        description: 'System settings',
      }
    );
  }

  return items;
};

/**
 * Get sidebar navigation groups
 * @param {string} userRole - User role
 * @returns {Array} Navigation groups
 */
export const getNavigationGroups = (userRole = 'user') => {
  const groups = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: ROUTES.DASHBOARD },
        { id: 'tasks', label: 'Tasks', icon: '📋', path: ROUTES.TASKS },
        { id: 'search', label: 'Search', icon: '🔍', path: ROUTES.SEARCH },
      ],
    },
    {
      id: 'activity',
      label: 'Activity',
      items: [
        { id: 'activities', label: 'Activity Log', icon: '📝', path: ROUTES.ACTIVITIES },
      ],
    },
  ];

  // Admin groups
  if (userRole === 'admin') {
    groups.push({
      id: 'admin',
      label: 'Admin',
      items: [
        { id: 'create', label: 'Create Task', icon: '➕', path: ROUTES.CREATE_TASK },
        { id: 'upload', label: 'Upload', icon: '📤', path: ROUTES.UPLOAD },
        { id: 'analytics', label: 'Analytics', icon: '📈', path: ROUTES.ANALYTICS },
        { id: 'users', label: 'Users', icon: '👥', path: ROUTES.USERS },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: ROUTES.SETTINGS },
      ],
    });
  }

  return groups;
};

// ============================================
// BREADCRUMB HELPERS
// ============================================

/**
 * Get breadcrumb items for current path
 * @param {string} pathname - Current path
 * @param {string} userRole - User role
 * @returns {Array} Breadcrumb items
 */
export const getBreadcrumbs = (pathname, userRole = 'user') => {
  const navItems = getNavigationItems(userRole);
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: '🏠', path: ROUTES.DASHBOARD, isHome: true }
  ];

  let currentPath = '';
  pathParts.forEach((part, index) => {
    currentPath += `/${part}`;
    const matchedItem = navItems.find(item => item.path === currentPath);
    if (matchedItem) {
      breadcrumbs.push({
        label: matchedItem.label,
        path: currentPath,
        icon: matchedItem.icon,
        isLast: index === pathParts.length - 1,
      });
    } else {
      // For dynamic routes (e.g., /tasks/123)
      breadcrumbs.push({
        label: part.charAt(0).toUpperCase() + part.slice(1),
        path: currentPath,
        isLast: index === pathParts.length - 1,
        isDynamic: true,
      });
    }
  });

  return breadcrumbs;
};

// ============================================
// ROUTE GUARDS
// ============================================

/**
 * Check if route requires authentication
 * @param {string} path - Route path
 * @returns {boolean} True if requires authentication
 */
export const isProtectedRoute = (path) => {
  return protectedRoutes.some(route => {
    if (route.path === path) return true;
    // Handle nested routes
    if (route.path.endsWith('/*') && path.startsWith(route.path.replace('/*', ''))) {
      return true;
    }
    return false;
  });
};

/**
 * Check if route requires admin access
 * @param {string} path - Route path
 * @returns {boolean} True if admin only
 */
export const isAdminRoute = (path) => {
  const route = protectedRoutes.find(r => r.path === path);
  return route?.adminOnly || false;
};

/**
 * Check if route is accessible for user role
 * @param {string} path - Route path
 * @param {string} userRole - User role
 * @returns {boolean} True if accessible
 */
export const isRouteAccessible = (path, userRole = 'user') => {
  if (isAdminRoute(path)) {
    return userRole === 'admin';
  }
  return true;
};

/**
 * Get redirect path for unauthorized access
 * @param {string} path - Current path
 * @param {string} userRole - User role
 * @returns {string} Redirect path
 */
export const getRedirectPath = (path, userRole = 'user') => {
  if (!isRouteAccessible(path, userRole)) {
    return ROUTES.DASHBOARD;
  }
  return null;
};

// ============================================
// ROUTE HELPERS
// ============================================

/**
 * Get route title
 * @param {string} path - Route path
 * @returns {string} Route title
 */
export const getRouteTitle = (path) => {
  const route = protectedRoutes.find(r => r.path === path);
  return route?.title || route?.name || 'Task Management';
};

/**
 * Get route icon
 * @param {string} path - Route path
 * @returns {string} Route icon
 */
export const getRouteIcon = (path) => {
  const route = protectedRoutes.find(r => r.path === path);
  return route?.icon || '📋';
};

/**
 * Get route component name
 * @param {string} path - Route path
 * @returns {string} Component name
 */
export const getRouteComponent = (path) => {
  const route = protectedRoutes.find(r => r.path === path);
  return route?.component || 'Dashboard';
};

// ============================================
// NAVBAR LINKS
// ============================================

/**
 * Navigation links for navbar
 */
export const navLinks = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
  { label: 'Tasks', path: ROUTES.TASKS, icon: '📋' },
  { label: 'Search', path: ROUTES.SEARCH, icon: '🔍' },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: '📈', adminOnly: true },
];

/**
 * User menu items
 */
export const userMenuItems = [
  { label: '👤 Profile', path: ROUTES.PROFILE },
  { label: '⚙️ Settings', path: ROUTES.SETTINGS },
  { label: '📋 My Tasks', path: ROUTES.TASKS },
  { label: '📝 Activity Log', path: ROUTES.ACTIVITIES },
];

/**
 * Admin menu items
 */
export const adminMenuItems = [
  { label: '👥 Manage Users', path: ROUTES.USERS },
  { label: '📊 Analytics', path: ROUTES.ANALYTICS },
  { label: '📤 Upload Documents', path: ROUTES.UPLOAD },
  { label: '⚙️ System Settings', path: ROUTES.SETTINGS },
];

// ============================================
// FOOTER LINKS
// ============================================

export const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', path: '#' },
      { label: 'Pricing', path: '#' },
      { label: 'Documentation', path: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '#' },
      { label: 'Blog', path: '#' },
      { label: 'Careers', path: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', path: '#' },
      { label: 'Contact', path: '#' },
      { label: 'Privacy Policy', path: '#' },
    ],
  },
];

// ============================================
// DEFAULT EXPORT
// ============================================

const routes = {
  publicRoutes,
  protectedRoutes,
  getNavigationItems,
  getNavigationGroups,
  getBreadcrumbs,
  isProtectedRoute,
  isAdminRoute,
  isRouteAccessible,
  getRedirectPath,
  getRouteTitle,
  getRouteIcon,
  getRouteComponent,
  navLinks,
  userMenuItems,
  adminMenuItems,
  footerLinks,
};

export default routes;