import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { db, AppUser, Event } from '../../lib/supabase';
import { 
  Users, Calendar, FileText, TrendingUp, Activity, 
  ArrowUp, ArrowDown, BarChart3, Shield, Menu, X 
} from 'lucide-react';
import AdminNavigation from '../layout/AdminNavigation';
import MemberManagement from './MemberManagement';
import EventManagement from './EventManagement';
import '../../styles/admin-panel.css';

const AdminDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events'>('overview');

  const fetchData = async () => {
    setIsLoading(true);
    const usersResponse = await db.getAllUsers();
    const eventsResponse = await db.getAllEvents();
    if (usersResponse.data) setUsers(usersResponse.data);
    if (eventsResponse.data) setEvents(eventsResponse.data as Event[]);
    setIsLoading(false);
  };

  useEffect(() => {
    setBreadcrumbs(['Admin Dashboard']);
    fetchData();
  }, [setBreadcrumbs]);

  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    activeEvents: events.filter(e => new Date(e.event_date || '') > new Date()).length,
    recentSignups: users.filter(u => {
      const signupDate = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return signupDate > weekAgo;
    }).length
  };

  if (isLoading) {
    return (
      <div className="admin-layout">
        <AdminNavigation 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="admin-main">
          <div className="admin-content">
            <div className="admin-loading">
              <div className="admin-spinner"></div>
              <span>Loading dashboard data...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Mobile Toggle Button */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Admin Navigation Sidebar */}
      <AdminNavigation 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-content">
          {/* Header */}
          <div className="admin-header">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's what's happening with your platform today.</p>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card admin-fade-in">
              <div className="admin-stat-header">
                <div className="admin-stat-icon">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="admin-stat-value">{stats.totalUsers}</div>
              <div className="admin-stat-label">Total Users</div>
              <div className="admin-stat-change positive">
                <ArrowUp className="w-3 h-3" />
                <span>+{stats.recentSignups} this week</span>
              </div>
            </div>

            <div className="admin-stat-card admin-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="admin-stat-header">
                <div className="admin-stat-icon">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="admin-stat-value">{stats.totalEvents}</div>
              <div className="admin-stat-label">Total Events</div>
              <div className="admin-stat-change positive">
                <ArrowUp className="w-3 h-3" />
                <span>{stats.activeEvents} active</span>
              </div>
            </div>

            <div className="admin-stat-card admin-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="admin-stat-header">
                <div className="admin-stat-icon">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="admin-stat-value">{Math.round((stats.activeEvents / Math.max(stats.totalEvents, 1)) * 100)}%</div>
              <div className="admin-stat-label">Active Rate</div>
              <div className="admin-stat-change positive">
                <ArrowUp className="w-3 h-3" />
                <span>Healthy growth</span>
              </div>
            </div>

            <div className="admin-stat-card admin-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="admin-stat-header">
                <div className="admin-stat-icon">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="admin-stat-value">{stats.recentSignups}</div>
              <div className="admin-stat-label">New This Week</div>
              <div className="admin-stat-change positive">
                <ArrowUp className="w-3 h-3" />
                <span>Growing community</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="admin-card mb-8">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <BarChart3 className="w-5 h-5" />
                Management Dashboard
              </h2>
              <p className="admin-card-subtitle">Manage users, events, and platform content</p>
            </div>
            <div className="admin-card-body">
              {/* Tab Buttons */}
              <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === 'users'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  User Management
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === 'events'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Event Management
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="admin-chart-card">
                      <h3 className="admin-chart-title">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {users.slice(0, 5).map((user, index) => (
                          <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{user.username} joined</p>
                              <p className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="admin-chart-card">
                      <h3 className="admin-chart-title">
                        <BarChart3 className="w-5 h-5" />
                        Platform Health
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">User Growth</span>
                          <span className="font-semibold text-green-600">+{stats.recentSignups} this week</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Event Activity</span>
                          <span className="font-semibold text-purple-600">{stats.activeEvents} active</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Platform Status</span>
                          <span className="font-semibold text-green-600">Healthy</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">System Load</span>
                          <span className="font-semibold text-blue-600">Normal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Events Summary Table */}
                  <div className="admin-table-container">
                    <div className="admin-card-header">
                      <h3 className="admin-card-title">
                        <Calendar className="w-5 h-5" />
                        Recent Events Overview
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Event Name</th>
                            <th>Organizer</th>
                            <th>Type</th>
                            <th>Attendees</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.slice(0, 8).map((event) => (
                            <tr key={event.id}>
                              <td>
                                <div className="font-medium">{event.event_name}</div>
                              </td>
                              <td>{event.app_users?.username || 'Unknown'}</td>
                              <td>
                                <span className="admin-badge-status admin-badge-info">
                                  {event.event_type}
                                </span>
                              </td>
                              <td>{event.current_attendees || 0} / {event.expected_attendees}</td>
                              <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="admin-card">
                  <div className="admin-card-body">
                    <MemberManagement users={users} events={events} onRefresh={fetchData} />
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="admin-card">
                  <div className="admin-card-body">
                    <EventManagement users={users} events={events} onRefresh={fetchData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
