import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: 'draft' | 'published' | 'live' | 'completed';
  category: string;
  revenue: number;
}

const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Innovation Summit 2024',
      date: '2024-03-15',
      time: '09:00',
      location: 'San Francisco Convention Center',
      attendees: 245,
      maxAttendees: 500,
      status: 'published',
      category: 'Technology',
      revenue: 24500
    },
    {
      id: '2',
      title: 'Digital Marketing Workshop',
      date: '2024-03-22',
      time: '14:00',
      location: 'Online',
      attendees: 89,
      maxAttendees: 100,
      status: 'live',
      category: 'Marketing',
      revenue: 8900
    },
    {
      id: '3',
      title: 'Startup Pitch Competition',
      date: '2024-04-05',
      time: '10:00',
      location: 'Innovation Hub',
      attendees: 156,
      maxAttendees: 200,
      status: 'draft',
      category: 'Business',
      revenue: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendancePercentage = (attendees: number, maxAttendees: number) => {
    return Math.round((attendees / maxAttendees) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="mt-2 text-gray-600">Manage and track your events</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, event) => sum + event.attendees, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${events.reduce((sum, event) => sum + event.revenue, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(event => event.status === 'live').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               autoComplete="off"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Events ({filteredEvents.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees}/{event.maxAttendees} attendees ({getAttendancePercentage(event.attendees, event.maxAttendees)}%)
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Revenue: </span>
                      <span className="font-semibold text-gray-900">${event.revenue.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Category: </span>
                      <span className="font-medium text-gray-900">{event.category}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === event.id ? null : event.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {showDropdown === event.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Eye className="w-4 h-4 mr-3" />
                          View Details
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4 mr-3" />
                          Edit Event
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <BarChart3 className="w-4 h-4 mr-3" />
                          View Analytics
                        </button>
                        <hr className="my-1" />
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-3" />
                          Delete Event
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first event.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;