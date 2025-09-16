import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Save, Calendar, MapPin, Users, DollarSign, Image, Type,
  ArrowLeft, ArrowRight, Check, AlertTriangle, Loader2,
  Eye, Globe, Lock, Settings
} from 'lucide-react';
import { realEventService, EventFormData } from '../../services/realEventService';

const RealEventBuilderPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [eventData, setEventData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    time: '',
    end_time: '',
    location: '',
    capacity: 100,
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'conference',
    visibility: 'public'
  });

  React.useEffect(() => {
    setBreadcrumbs(['Create Event']);
  }, [setBreadcrumbs]);

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!eventData.event_date) {
      newErrors.event_date = 'Event date is required';
    } else {
      const eventDate = new Date(eventData.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.event_date = 'Event date cannot be in the past';
      }
    }

    if (!eventData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!eventData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (eventData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (eventData.end_time && eventData.time && eventData.end_time <= eventData.time) {
      newErrors.end_time = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!validateForm() || !user) return;

    setIsLoading(true);
    try {
      const result = await realEventService.createEvent(eventData, user.id);

      if (result.success) {
        if (status === 'published' && result.event) {
          await realEventService.publishEvent(result.event.id);
        }
        
        alert(`Event ${status === 'draft' ? 'saved as draft' : 'created and published'} successfully!`);
        setCurrentView('my-events');
      } else {
        alert(result.error || 'Failed to create event');
      }
    } catch (error) {
      alert('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = eventData.title.trim() && eventData.event_date && eventData.time && eventData.location.trim() && eventData.capacity > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <button
            onClick={() => setCurrentView('my-events')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Type className="w-5 h-5" />
                <span>Basic Information</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your event title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Describe your event, what attendees can expect, and key highlights"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={eventData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  >
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking Event</option>
                    <option value="webinar">Webinar</option>
                    <option value="training">Training</option>
                    <option value="meetup">Meetup</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Date & Time</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={eventData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.event_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.event_date && <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <input
                    type="time"
                    value={eventData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={eventData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.end_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                </div>
              </div>
            </div>

            {/* Location & Capacity */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location & Capacity</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={eventData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter venue name and address"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={eventData.capacity}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                      min="1"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.capacity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Maximum attendees"
                    />
                  </div>
                  {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                </div>
              </div>
            </div>

            {/* Visual & Settings */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Visual & Settings</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Image URL</label>
                  <input
                    type="url"
                    value={eventData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="https://example.com/event-image.jpg"
                  />
                  {eventData.image_url && (
                    <div className="mt-4">
                      <img
                        src={eventData.image_url}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Visibility</label>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={eventData.visibility === 'public'}
                        onChange={(e) => handleInputChange('visibility', e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Public</p>
                          <p className="text-xs text-gray-500">Visible to everyone</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={eventData.visibility === 'private'}
                        onChange={(e) => handleInputChange('visibility', e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">Private</p>
                          <p className="text-xs text-gray-500">Invitation only</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="unlisted"
                        checked={eventData.visibility === 'unlisted'}
                        onChange={(e) => handleInputChange('visibility', e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">Unlisted</p>
                          <p className="text-xs text-gray-500">Link access only</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Preview */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Event Preview</span>
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
                  <img
                    src={eventData.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={eventData.title || 'Event preview'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {eventData.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        eventData.visibility === 'public' ? 'bg-green-100 text-green-600' :
                        eventData.visibility === 'private' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {eventData.visibility}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {eventData.title || 'Event Title'}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {eventData.description || 'Event description will appear here'}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {eventData.event_date ? new Date(eventData.event_date).toLocaleDateString() : 'Date TBD'}
                          {eventData.time && ` at ${eventData.time}`}
                          {eventData.end_time && ` - ${eventData.end_time}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{eventData.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Up to {eventData.capacity} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {isFormValid ? (
                <span className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Ready to save</span>
                </span>
              ) : (
                <span>Please complete all required fields</span>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSave('draft')}
                disabled={isLoading || !eventData.title.trim()}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save as Draft</span>
              </button>

              <button
                onClick={() => handleSave('published')}
                disabled={isLoading || !isFormValid}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Create & Publish Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEventBuilderPage;