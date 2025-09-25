import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Calendar, Users, DollarSign, TrendingUp, Eye, Plus, BarChart3, Clock, CheckCircle, AlertCircle, Activity, Loader2, ArrowUp, ArrowDown, Ticket, Settings, CreditCard as Edit, Check, ExternalLink, RefreshCw, MapPin } from 'lucide-react';
import { organizerCrudService } from '../../services/organizerCrudService';

const RealOrganizerDashboard: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    totalAttendees: 0
  });

  React.useEffect(() => {
    setBreadcrumbs(['Organizer Dashboard']);
    
    if (user?.id) {
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [setBreadcrumbs, user]);

  const loadDashboardData = async () => {
    if (!user?.id) {
      setError('User authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading dashboard data for user:', user.id);
      
      const result = await organizerCrudService.getMyEvents(user.id);
      
      if (result.success && result.events) {
        console.log('Events loaded successfully:', result.events);
        setEvents(result.events);
        
        // Calculate stats
        const totalEvents = result.events.length;
        const publishedEvents = result.events.filter(e => e.status === 'published').length;
        const draftEvents = result.events.filter(e => e.status === 'draft').length;
        const totalAttendees = result.events.reduce((sum, event) => sum + (event.capacity || 0), 0);
        
        setStats({
          totalEvents,
          publishedEvents,
          draftEvents,
          totalAttendees
        });
      } else {
        console.error('Failed to fetch events:', result.error);
        // Don't set error for empty events list
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Don't set error for network issues, just show empty state
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      console.log('Publishing event from dashboard:', eventId);
      
      const result = await organizerCrudService.publishEvent(eventId);
      
      if (result.success) {
        await loadDashboardData();
        alert('Event published successfully!');
      } else {
        alert(result.error || 'Failed to publish event');
      }
    } catch (error) {
      console.error('Publish event error:', error);
      alert('Failed to publish event');
    }
  };

  const getEventStatus = (event: any) => {
    // Check if event has all required fields
    const hasTitle = event.title && event.title.trim().length > 0;
    const hasDescription = event.description && event.description.trim().length > 0;
    const hasVenue = event.venue && event.venue.trim().length > 0;
    const hasDate = event.event_date;
    const hasTime = event.time;
    const hasImage = event.image_url;

    if (hasTitle && hasDescription && hasVenue && hasDate && hasTime && hasImage) {
      return 'complete';
    }
    return 'incomplete';
  };

  const getStatusIcon = (event: any) => {
    if (event.status === 'published') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    const status = getEventStatus(event);
    if (status === 'complete') {
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
    return <Edit className="w-5 h-5 text-orange-500" />;
  };

  const getStatusText = (event: any) => {
    if (event.status === 'published') {
      return 'Published';
    }
    
    const status = getEventStatus(event);
    return status === 'complete' ? 'Complete' : 'Incomplete';
  };

  const getStatusColor = (event: any) => {
    if (event.status === 'published') {
      return 'bg-green-100 text-green-800';
    }
    
    const status = getEventStatus(event);
    if (status === 'complete') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-orange-100 text-orange-800';
  };

  // Access denied view
  if (error === 'Access denied. Organizer permissions required.') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-6">You need organizer permissions to access this dashboard.</p>
              <div className="space-x-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => setCurrentView('pricing')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Upgrade to Organizer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  if (error && error !== 'Access denied. Organizer permissions required.') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadDashboardData}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">Please log in to access the organizer dashboard</p>
              <button
                onClick={() => setCurrentView('home')}
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-xl text-gray-600">Manage your events and track their performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">{stats.publishedEvents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">Live events</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.draftEvents}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-600 font-medium">In progress</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Max attendees</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setCurrentView('event-builder')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
            <button
              onClick={() => setCurrentView('my-events')}
              className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>My Events</span>
            </button>
            <button
              onClick={() => setCurrentView('ticketing')}
              className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Ticket className="w-5 h-5" />
              <span>Ticketing</span>
            </button>
            <button
              onClick={() => setCurrentView('organizer-settings')}
              className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Events Dashboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
            <div className="flex space-x-4">
              <button
                onClick={loadDashboardData}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setCurrentView('event-builder')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>
          </div>
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Event Image */}
                  <div className="relative mb-4">
                    <img
                      src={event.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event)}`}>
                        {getStatusText(event)}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description || 'No description provided'}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      <span>at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Up to {event.capacity} attendees</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(event)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(event)}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {event.status !== 'published' && getEventStatus(event) === 'incomplete' && (
                        <button
                          onClick={() => {
                            // Navigate to edit event with this event's data
                            setCurrentView('event-builder');
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-200"
                          title="Complete Event Setup"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-xs">Incomplete</span>
                        </button>
                      )}

                      {event.status !== 'published' && getEventStatus(event) === 'complete' && (
                        <button
                          onClick={() => handlePublishEvent(event.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          title="Publish Event"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-xs">Publish</span>
                        </button>
                      )}

                      {event.status === 'published' && (
                        <button
                          onClick={() => setCurrentView('my-events')}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="View in My Events"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">View</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Create your first event to get started</p>
              <button
                onClick={() => setCurrentView('event-builder')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Your First Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealOrganizerDashboard;