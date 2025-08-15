import React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, DollarSign, TrendingUp, Eye, Plus, 
  BarChart3, Clock, CheckCircle, AlertCircle, Activity 
} from 'lucide-react';
import { DashboardStats, RecentActivity } from '../../types/organizerEvent';
import { organizerEventService } from '../../services/organizerEventService';

const OrganizerDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
    loadDashboardData();
  }, [setBreadcrumbs]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, activityData] = await Promise.all([
        organizerEventService.getDashboardStats(),
        organizerEventService.getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event_created': return <Plus className="w-4 h-4 text-blue-600" />;
      case 'event_published': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ticket_sold': return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'attendee_registered': return <Users className="w-4 h-4 text-indigo-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
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
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">Here's an overview of your events and performance</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stats.publishedEvents} published</span>
                <span className="text-gray-500 ml-2">• {stats.draftEvents} drafts</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTicketsSold.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">Avg {Math.round(stats.averageAttendance)} per event</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600 font-medium">
                  ${Math.round(stats.totalRevenue / (stats.totalEvents || 1)).toLocaleString()} avg per event
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-orange-600 font-medium">{stats.completedEvents} completed</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setBreadcrumbs(['Event Builder'])}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Event</span>
                </button>
                <button
                  onClick={() => setBreadcrumbs(['My Events'])}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Manage Events</span>
                </button>
                <button
                  onClick={() => setBreadcrumbs(['Analytics & Reports'])}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            {stats && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalEvents > 0 ? Math.round((stats.totalTicketsSold / (stats.totalEvents * 100)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Revenue/Event</span>
                    <span className="font-semibold text-gray-900">
                      ${Math.round(stats.totalRevenue / (stats.totalEvents || 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {stats.totalEvents > 0 ? Math.round((stats.completedEvents / stats.totalEvents) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;