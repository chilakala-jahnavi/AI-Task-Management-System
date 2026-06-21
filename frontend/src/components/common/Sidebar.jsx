// src/components/common/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  FolderIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge, to }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
        active
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 text-sm">{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default function Sidebar({ tabs, activeTab, setActiveTab, isAdmin = false }) {
  const location = useLocation();

  // Default tabs if not provided
  const defaultTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
    { id: 'tasks', label: 'Tasks', icon: DocumentTextIcon, to: '/dashboard/tasks' },
    { id: 'search', label: 'Search', icon: MagnifyingGlassIcon, to: '/dashboard/search' },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, to: '/dashboard/analytics' },
    { id: 'activities', label: 'Activity Log', icon: ClockIcon, to: '/dashboard/activities' },
  ];

  const adminTabs = [
    { id: 'users', label: 'Users', icon: UserGroupIcon, to: '/dashboard/users' },
    { id: 'settings', label: 'Settings', icon: CogIcon, to: '/dashboard/settings' },
  ];

  const allTabs = tabs || defaultTabs;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 sticky top-20">
      <div className="space-y-0.5">
        {allTabs.map((tab) => (
          <SidebarItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id || location.pathname === tab.to}
            onClick={() => setActiveTab && setActiveTab(tab.id)}
            to={tab.to}
            badge={tab.badge}
          />
        ))}
        
        {/* Admin Only Tabs */}
        {isAdmin && adminTabs.map((tab) => (
          <SidebarItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id || location.pathname === tab.to}
            onClick={() => setActiveTab && setActiveTab(tab.id)}
            to={tab.to}
          />
        ))}
      </div>
    </div>
  );
}