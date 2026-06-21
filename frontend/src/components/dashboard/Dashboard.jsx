import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { taskAPI, analyticsAPI } from '../../api/endpoints';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';
import DocumentUpload from '../documents/DocumentUpload';
import SemanticSearch from '../search/SemanticSearch';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import ActivityLog from '../activities/ActivityLog';
import { getNavigationItems } from '../../routes';

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  const navItems = getNavigationItems(user?.role);
  const activeTab = navItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const { data: tasks, loading: tasksLoading, refetch: refetchTasks } = useApi(
    () => taskAPI.getAll(),
    [refreshKey]
  );

  const { data: stats, loading: statsLoading } = useApi(
    () => analyticsAPI.getDashboard(),
    [refreshKey],
    { enabled: user?.role === 'admin' }
  );

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
    refetchTasks();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <Sidebar
              tabs={navItems}
              activeTab={activeTab}
              setActiveTab={(tabId) => {
                const item = navItems.find(i => i.id === tabId);
                if (item) navigate(item.path);
              }}
              isAdmin={user?.role === 'admin'}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Routes>
              <Route 
                path="/" 
                element={
                  user?.role === 'admin' ? (
                    <AdminDashboard 
                      tasks={tasks || []} 
                      stats={stats} 
                      loading={tasksLoading || statsLoading}
                      onUpdate={handleDataChange}
                    />
                  ) : (
                    <UserDashboard 
                      tasks={tasks || []} 
                      loading={tasksLoading}
                      onUpdate={handleDataChange}
                    />
                  )
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <TaskList 
                    tasks={tasks || []} 
                    isAdmin={user?.role === 'admin'} 
                    onUpdate={handleDataChange}
                    loading={tasksLoading}
                  />
                } 
              />
              <Route 
                path="/create" 
                element={
                  user?.role === 'admin' ? (
                    <TaskForm onTaskCreated={handleDataChange} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                } 
              />
              <Route 
                path="/upload" 
                element={
                  user?.role === 'admin' ? (
                    <DocumentUpload onUpload={handleDataChange} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                } 
              />
              <Route path="/search" element={<SemanticSearch />} />
              <Route 
                path="/analytics" 
                element={
                  user?.role === 'admin' ? (
                    <AnalyticsDashboard stats={stats} loading={statsLoading} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                } 
              />
              <Route 
                path="/activities" 
                element={
                  <ActivityLog isAdmin={user?.role === 'admin'} />
                } 
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
