import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Save, Calendar, MapPin, Users, DollarSign, Type, ArrowLeft, Check, AlertTriangle, Loader2, Upload, X, Fish as Publish } from 'lucide-react';
import { organizerCrudService, OrganizerEvent } from '../../services/organizerCrudService';

const EventEditPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  }, [setBreadcrumbs]);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      
      try {
        setIsLoadingEvent(true);
        const result = await organizerCrudService.getEventById(eventId);
        
        if (result.success && result.event) {
          setEvent(result.event);
          setEventData({
            title: result.event.title,
            description: result.event.description || '',
            venue: result.event.venue,
            capacity: result.event.capacity,
            category: result.event.category
          });
          setImagePreview(result.event.image_url || '');
          setPrice(result.event.price || 0);
        } else {
          setErrors({ general: result.error || 'Failed to load event' });
        }
      } catch (error) {
        setErrors({ general: 'Failed to load event' });
      } finally {
        setIsLoadingEvent(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const handleInputChange = (field: string, value: string | number) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: 'Image size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ image: 'Please select a valid image file' });
        return;
      }
      
      // Revoke previous object URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
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

    if (!eventData.venue.trim()) {
      newErrors.venue = 'Event venue is required';
    }

    if (eventData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!imagePreview && !selectedImage) {
      newErrors.image = 'Event image is required';
    }

    if (price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !eventId) return;

    setIsLoading(true);
    try {
      // Upload image if selected
      let imageUrl = imagePreview;
      if (selectedImage) {
        // In a real app, this would upload to a storage service
        // For mock purposes, simulate a persistent URL
        const mockImageUrls = [
          'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800'
        ];
        imageUrl = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
      }

      const updateData = {
        ...eventData,
        image_url: imageUrl,
        price: price
      };

      const result = await organizerCrudService.updateEvent(eventId, updateData);
      if (result.success) {
        // Update local state to reflect the saved image URL
        setImagePreview(imageUrl);
        setSelectedImage(null);
        alert('Event updated successfully!');
      } else {
        alert(result.error || 'Failed to update event');
      }
    } catch (error) {
      alert('Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm() || !eventId) return;

    setIsLoading(true);
    try {
      // First save the event
      await handleSave();
      
      // Then navigate to ticketing setup
      navigate(`/organizer/event/${eventId}/ticketing`);
    } catch (error) {
      alert('Failed to proceed to ticketing');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="text-center py-20">
          <p className="text-gray-600">Event not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <button
            onClick={() => navigate('/dashboard')}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Image *</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                        errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Event preview"
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Revoke object URL if it exists
                              if (imagePreview && imagePreview.startsWith('blob:')) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              setSelectedImage(null);
                              setImagePreview('');
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {selectedImage && (
                          <p className="text-sm text-gray-500 mt-2">
                            File: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
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
                <DollarSign className="w-5 h-5" />
                <span>Pricing</span>
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
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
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              {eventData.title.trim() ? (
                <span className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Ready to save</span>
                </span>
              ) : (
                <span>Enter details to save</span>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={isLoading || !eventData.title.trim()}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isLoading || !validateForm()}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Publish className="w-4 h-4" />}
                <span>Publish Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage;