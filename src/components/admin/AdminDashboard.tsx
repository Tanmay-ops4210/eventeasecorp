import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { 
  Users, Calendar, FileText, BarChart3, TrendingUp, 
  Activity, AlertTriangle, CheckCircle, Clock, Eye,
  UserPlus, Plus, Settings, Shield, Bell, Lock, Loader2
} from 'lucide-react';
import UserManagementPage from './UserManagementPage';
import AdminSecurityDashboard from './AdminSecurityDashboard';

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user, profile, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalRevenue: 0,
    newUsersThisWeek: 0,
    eventsThisMonth: 0
  });
  const [users, setUsers] = useState<AppUser[]>([]);
  const [events, setEvents] = useState<DummyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'overview' | 'users' | 'events' | 'content' | 'security'>('overview');

  React.useEffect(() => {
    setBreadcrumbs(['Admin Dashboard']);
    
    if (isAuthenticated && profile?.role === 'admin') {
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [setBreadcrumbs, isAuthenticated, profile]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock stats
      setStats({
        totalUsers: 150,
        totalEvents: 25,
        activeEvents: 8,
        totalRevenue: 45000,
        newUsersThisWeek: 12,
        eventsThisMonth: 5
      });
      
      // Set mock users
      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          full_name: 'John Doe',
          role: 'attendee',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          email: 'organizer@example.com',
          full_name: 'Jane Smith',
          role: 'organizer',
          created_at: new Date().toISOString()
        }
      ]);
      
      // Set mock events
      setEvents([
        {
          id: '1',
          title: 'Tech Conference 2024',
          category: 'Technology',
          status: 'published',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Marketing Workshop',
          category: 'Marketing',
          status: 'draft',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  if (!isAuthenticated || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-6">You need admin permissions to access this dashboard.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'users') {
    return <UserManagementPage users={users} events={events} onRefresh={refreshData} />;
  }

  if (currentPage === 'security') {
    return <AdminSecurityDashboard />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Welcome, {profile?.full_name || user?.email}! Here's an overview of your platform.
          </p>
        </div>

        {/* Page Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Sections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'events', label: 'Event Oversight', icon: Calendar },
              { id: 'content', label: 'Content Management', icon: FileText },
              { id: 'security', label: 'Security Logs', icon: Lock }
            ].map((page) => {
              const IconComponent = page.icon;
              return (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id as any)}
                  className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                    currentPage === page.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <IconComponent className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{stats.newUsersThisWeek}</span>
              <span className="text-gray-500 ml-1">new this week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stats.activeEvents} active</span>
              <span className="text-gray-500 ml-2">• {stats.eventsThisMonth} this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Monthly recurring</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <button
                onClick={() => setCurrentPage('users')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {users.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.full_name || user.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
              <button
                onClick={() => setCurrentPage('events')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {events.slice(0, 5).map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'published' ? 'bg-green-100 text-green-800' :
                    event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No events found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentPage('users')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              <UserPlus className="w-5 h-5" />
              <span>Manage Users</span>
            </button>
            <button
              onClick={() => setCurrentPage('events')}
              className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>Oversee Events</span>
            </button>
            <button
              onClick={() => setCurrentPage('content')}
              className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FileText className="w-5 h-5" />
              <span>Manage Content</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;