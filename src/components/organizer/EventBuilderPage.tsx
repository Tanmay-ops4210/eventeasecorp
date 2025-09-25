import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import {
  Save, Calendar, MapPin, Users, DollarSign, Image as ImageIcon, Type,
  ArrowLeft, Check, AlertTriangle, Loader2, Upload, IndianRupee
} from 'lucide-react';
import { organizerCrudService } from '../../services/organizerCrudService';

interface EventFormData {
  title: string;
  description?: string;
  category: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  visibility: 'public' | 'private' | 'unlisted';
}

const EventBuilderPage: React.FC = () => {
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
    venue: '',
    capacity: 100,
    image_url: '',
    category: 'conference',
    visibility: 'public'
  });
  const [price, setPrice] = useState<number>(0);

  React.useEffect(() => {
    setBreadcrumbs(['Create Event']);
  }, [setBreadcrumbs]);

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!eventData.description?.trim()) {
      newErrors.description = 'Event description is required';
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

    if (!eventData.venue.trim()) {
      newErrors.venue = 'Event venue is required';
    }

    if (eventData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!eventData.image_url?.trim()) {
      newErrors.image_url = 'Event image is required';
    }

    if (price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (markComplete: boolean = false) => {
    if (!user) return;

    // For incomplete save, only require title
    if (!markComplete && !eventData.title.trim()) {
      setErrors({ title: 'Event title is required to save' });
      return;
    }

    // For complete/publish, validate all fields
    if (markComplete && !validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const eventDataWithPrice = {
        ...eventData,
        price: price
      };
      
      const result = await organizerCrudService.createEvent(eventDataWithPrice, user.id);

      if (result.success) {
        if (markComplete) {
          // If marking complete, also publish the event
          const publishResult = await organizerCrudService.publishEvent(result.event!.id);
          if (publishResult.success) {
            alert('Event created and published successfully!');
          } else {
            alert('Event created but failed to publish: ' + publishResult.error);
          }
        } else {
          alert('Event saved as draft successfully!');
        }
        alert(`Event ${markComplete ? 'created and marked complete' : 'saved as draft'} successfully!`);
        setCurrentView('organizer-dashboard');
      } else {
        alert(result.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Event creation error:', error);
      alert('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm() || !user) return;

    setIsLoading(true);
    try {
      const eventDataWithPrice = {
        ...eventData,
        price: price
      };
      
      const result = await organizerCrudService.createEvent(eventDataWithPrice, user.id);

      if (result.success && result.event) {
        const publishResult = await organizerCrudService.publishEvent(result.event.id);
        if (publishResult.success) {
          alert('Event created and published successfully!');
          setCurrentView('my-events');
        } else {
          alert(publishResult.error || 'Failed to publish event');
        }
      } else {
        alert('Event created and published successfully!');
        setCurrentView('my-events');
        alert(result.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Event publish error:', error);
      alert('Failed to create and publish event');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = eventData.title.trim() && 
                     eventData.description?.trim() &&
                     eventData.event_date && 
                     eventData.time && 
                     eventData.venue.trim() && 
                     eventData.image_url?.trim() &&
                     eventData.capacity > 0 &&
                     Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <button
            onClick={() => setCurrentView('organizer-dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Type className="w-5 h-5" />
                <span>Event Information</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={eventData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your event, what attendees can expect, and key highlights"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Image URL *</label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={eventData.image_url || ''}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.image_url ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/event-image.jpg"
                    />
                    {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>}
                    
                    {eventData.image_url && (
                      <div className="mt-3">
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
                    value={eventData.end_time || ''}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                  <input
                    type="text"
                    value={eventData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.venue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter venue name and address"
                  />
                  {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
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

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <IndianRupee className="w-5 h-5" />
                <span>Pricing</span>
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                <p className="text-sm text-gray-500 mt-1">Set to 0 for free events</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {eventData.title.trim() ? (
                <span className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Ready to save</span>
                </span>
              ) : (
                <span>Enter a title to save as draft</span>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSave(false)}
                disabled={isLoading || !eventData.title.trim()}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Draft</span>
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={isLoading || !isFormValid}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Mark Complete</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isLoading || !isFormValid}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Publish Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBuilderPage;
