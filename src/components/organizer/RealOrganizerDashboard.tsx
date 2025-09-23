import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, DollarSign, TrendingUp, Eye, Plus, 
  BarChart3, Clock, CheckCircle, AlertCircle, Activity,
  Loader2, ArrowUp, ArrowDown, Ticket, Mail, Settings
} from 'lucide-react';
import { realEventService, DashboardStats, RealEvent } from '../../services/realEventService';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';

// Import the Edit icon that was missing
import { Edit } from 'lucide-react';

const RealOrganizerDashboard: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<OrganizerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
    loadDashboardData();
  }, [setBreadcrumbs, user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [statsResult, eventsResult] = await Promise.all([
        organizerCrudService.getDashboardStats(user.id),
        organizerCrudService.getMyEvents(user.id)
      ]);

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }

      if (eventsResult.success && eventsResult.events) {
        setRecentEvents(eventsResult.events.slice(0, 5)); // Show 5 most recent events
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4 text-gray-500" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ongoing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
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
            Welcome back, {profile?.full_name || user?.email}!
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
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
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
          {/* Recent Events */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
                <button
                  onClick={() => setCurrentView('my-events')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      onClick={() => setCurrentView('my-events')}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <img
                        src={event.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.event_date).toLocaleDateString()} • {event.venue}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No events created yet</p>
                    <button
                      onClick={() => setCurrentView('event-builder')}
                      className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Create your first event
                    </button>
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
                  onClick={() => setCurrentView('event-builder')}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Event</span>
                </button>
                <button
                  onClick={() => setCurrentView('my-events')}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Manage Events</span>
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Analytics</span>
                </button>
                <button
                  onClick={() => setCurrentView('ticketing')}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Manage Tickets</span>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            {stats && stats.totalEvents > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((stats.completedEvents / stats.totalEvents) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Revenue/Event</span>
                    <span className="font-semibold text-gray-900">
                      ${Math.round(stats.totalRevenue / stats.totalEvents).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Attendance</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(stats.averageAttendance)} people
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fill Rate</span>
                    <span className="font-semibold text-indigo-600">
                      {stats.totalEvents > 0 ? Math.round((stats.averageAttendance / 100) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Getting Started */}
            {(!stats || stats.totalEvents === 0) && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Getting Started</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <span>Create your first event</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <span>Set up ticket types and pricing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <span>Publish and start promoting</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('event-builder')}
                  className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Your First Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealOrganizerDashboard;