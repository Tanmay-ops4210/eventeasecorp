import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, DollarSign, TrendingUp, Eye, Plus, 
  BarChart3, Clock, CheckCircle, AlertCircle, Activity,
  Loader2, ArrowUp, ArrowDown, Ticket, Mail, Settings,
  Edit, Check, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const OrganizerDashboard: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setBreadcrumbs(['Organizer Dashboard']);
    loadEvents();
  }, [setBreadcrumbs, user]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('organizer_events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch events:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('organizer_events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (!error) {
        await loadEvents();
        alert('Event published successfully!');
      } else {
        alert('Failed to publish event');
      }
    } catch (error) {
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
          <p className="text-xl text-gray-600">Manage your events and track their performance</p>
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
              onClick={() => setCurrentView('analytics')}
              className="flex items-center space-x-3 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
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
            <h2 className="text-xl font-bold text-gray-900">Events & Status</h2>
            <button
              onClick={() => setCurrentView('event-builder')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
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
                          title="Edit Event"
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

export default OrganizerDashboard;