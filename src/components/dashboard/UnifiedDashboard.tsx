import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Calendar, Users, BarChart3, TrendingUp, Eye, Plus, Settings, Ticket, Mail, Twitch as Switch, Home, BookOpen, CheckCircle, Clock, AlertTriangle, Loader2, ArrowRight, Star, MapPin, DollarSign } from 'lucide-react';

type ViewMode = 'attendee' | 'organizer';

interface DashboardStats {
  attendee: {
    upcomingEvents: number;
    networkConnections: number;
    eventsAttended: number;
    savedEvents: number;
  };
  organizer: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    totalRevenue: number;
    totalAttendees: number;
  };
}

const UnifiedDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('attendee');
  const [stats, setStats] = useState<DashboardStats>({
    attendee: {
      upcomingEvents: 3,
      networkConnections: 47,
      eventsAttended: 12,
      savedEvents: 8
    },
    organizer: {
      totalEvents: 5,
      publishedEvents: 3,
      draftEvents: 2,
      totalRevenue: 25000,
      totalAttendees: 450
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
  }, [setBreadcrumbs]);

  const handleViewSwitch = () => {
    setViewMode(viewMode === 'attendee' ? 'organizer' : 'attendee');
  };

  const renderAttendeeView = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || user?.email}!</h2>
        <p className="text-indigo-100">Discover amazing events and connect with professionals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.upcomingEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Network Connections</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.networkConnections}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events Attended</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.eventsAttended}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendee.savedEvents}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium text-gray-900">Registered for Tech Summit 2024</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Connected with Sarah Johnson</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrganizerView = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Organizer Dashboard</h2>
        <p className="text-purple-100">Manage your events and track their performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.publishedEvents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.draftEvents}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.organizer.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendees</p>
              <p className="text-3xl font-bold text-gray-900">{stats.organizer.totalAttendees}</p>
            </div>
            <Users className="w-8 h-8 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/organizer/create-event'}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
          <button
            onClick={() => window.location.href = '/my-events'}
            className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5" />
            <span>My Events</span>
          </button>
          <button
            onClick={() => window.location.href = '/organizer/ticketing'}
            className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Ticket className="w-5 h-5" />
            <span>Ticketing</span>
          </button>
          <button
            onClick={() => window.location.href = '/organizer/analytics'}
            className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Events</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Tech Innovation Summit 2024</p>
              <p className="text-sm text-gray-500">March 15, 2024 • Published</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Published
            </span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Digital Marketing Workshop</p>
              <p className="text-sm text-gray-500">March 22, 2024 • Draft</p>
            </div>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              Draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with View Switcher */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {viewMode === 'attendee' ? 'My Dashboard' : 'Organizer Dashboard'}
            </h1>
            <p className="text-xl text-gray-600">
              {viewMode === 'attendee' 
                ? 'Manage your events, network, and resources' 
                : 'Manage your events and track their performance'
              }
            </p>
          </div>
          
          {/* View Switcher */}
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('attendee')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'attendee'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Attendee</span>
              </button>
              <button
                onClick={() => setViewMode('organizer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'organizer'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Organizer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {viewMode === 'attendee' ? renderAttendeeView() : renderOrganizerView()}
      </div>
    </div>
  );
};

export default UnifiedDashboard;