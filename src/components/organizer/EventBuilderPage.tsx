import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Save, Eye, Upload, Calendar, MapPin, Users, DollarSign, 
  Tag, Globe, Settings, Image, FileText, Clock, AlertCircle,
  CheckCircle, Loader2
} from 'lucide-react';
import { EventFormData } from '../../types/organizerEvent';
import { organizerEventService } from '../../services/organizerEventService';

const EventBuilderPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: 'conference',
    date: '',
    time: '09:00',
    endTime: '17:00',
    venue: {
      name: '',
      address: '',
      capacity: 100,
      type: 'physical'
    },
    image: '',
    gallery: [],
    tags: [],
    visibility: 'public',
    settings: {
      allowWaitlist: true,
      requireApproval: false,
      maxTicketsPerPerson: 5,
      refundPolicy: 'Refunds available up to 7 days before the event'
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  React.useEffect(() => {
  }, [setBreadcrumbs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof EventFormData],
          [child]: type === 'number' ? parseInt(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    const [parent, child] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof EventFormData],
        [child]: checked
      }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await organizerEventService.uploadImage(file);
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image: result.url! }));
      } else {
        setErrors(prev => ({ ...prev, image: result.error || 'Upload failed' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Upload failed' }));
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.venue.name.trim()) newErrors['venue.name'] = 'Venue name is required';
    if (!formData.venue.address.trim()) newErrors['venue.address'] = 'Venue address is required';
    if (formData.venue.capacity < 1) newErrors['venue.capacity'] = 'Venue capacity must be at least 1';
    if (!formData.image) newErrors.image = 'Event image is required';

    // Date validation
    if (formData.date && new Date(formData.date) <= new Date()) {
      newErrors.date = 'Event date must be in the future';
    }

    // Time validation
    if (formData.time && formData.endTime && formData.time >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const result = await organizerEventService.createEvent(formData);
      if (result.success) {
        alert('Event saved as draft successfully!');
        setCurrentView('my-events');
      } else {
        alert(result.error || 'Failed to save event');
      }
    } catch (error) {
      alert('Failed to save event');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const createResult = await organizerEventService.createEvent(formData);
      if (createResult.success && createResult.event) {
        const publishResult = await organizerEventService.publishEvent(createResult.event.id);
        if (publishResult.success) {
          alert('Event published successfully!');
          setCurrentView('my-events');
        } else {
          alert(publishResult.error || 'Failed to publish event');
        }
      } else {
        alert(createResult.error || 'Failed to create event');
      }
    } catch (error) {
      alert('Failed to publish event');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'conference', 'workshop', 'seminar', 'networking', 'webinar',
    'training', 'exhibition', 'festival', 'meetup', 'other'
  ];

  const venueTypes = [
    { value: 'physical', label: 'Physical Location' },
    { value: 'virtual', label: 'Virtual Event' },
    { value: 'hybrid', label: 'Hybrid Event' }
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can find and register' },
    { value: 'private', label: 'Private', description: 'Invitation only' },
    { value: 'unlisted', label: 'Unlisted', description: 'Only those with link can register' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Builder</h1>
          <p className="text-xl text-gray-600">Create and customize your event with our comprehensive builder</p>
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
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
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your event..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        {categories.map(category => (
                          <option key={category} value={category} className="capitalize">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                      <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        {visibilityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Date & Time</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.endTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                  </div>
                </div>
              </div>

              {/* Venue Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Venue Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type</label>
                    <div className="grid grid-cols-3 gap-4">
                      {venueTypes.map(type => (
                        <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="venue.type"
                            value={type.value}
                            checked={formData.venue.type === type.value}
                            onChange={handleInputChange}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium text-gray-700">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                      <input
                        type="text"
                        name="venue.name"
                        value={formData.venue.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors['venue.name'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter venue name"
                      />
                      {errors['venue.name'] && <p className="text-red-500 text-sm mt-1">{errors['venue.name']}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                      <input
                        type="number"
                        name="venue.capacity"
                        value={formData.venue.capacity}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors['venue.capacity'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Maximum attendees"
                      />
                      {errors['venue.capacity'] && <p className="text-red-500 text-sm mt-1">{errors['venue.capacity']}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="venue.address"
                      value={formData.venue.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors['venue.address'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter venue address"
                    />
                    {errors['venue.address'] && <p className="text-red-500 text-sm mt-1">{errors['venue.address']}</p>}
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Image className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Event Media</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Image *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-200">
                      {formData.image ? (
                        <div className="relative">
                          <img
                            src={formData.image}
                            alt="Event preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Upload event image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className={`inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer ${
                              isUploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Choose Image</span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Tag className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Tags & Categories</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Tags</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter a tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-indigo-400 hover:text-indigo-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <p className="font-medium text-gray-900">{formData.title || 'Untitled Event'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium text-gray-900">
                      {formData.date ? new Date(formData.date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium text-gray-900">{formData.time} - {formData.endTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Venue:</span>
                    <p className="font-medium text-gray-900">{formData.venue.name || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Capacity:</span>
                    <p className="font-medium text-gray-900">{formData.venue.capacity} attendees</p>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-900">Event Settings</h3>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowWaitlist}
                      onChange={(e) => handleCheckboxChange('settings.allowWaitlist', e.target.checked)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Allow waitlist when sold out</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.requireApproval}
                      onChange={(e) => handleCheckboxChange('settings.requireApproval', e.target.checked)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Require approval for registration</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max tickets per person</label>
                    <input
                      type="number"
                      name="settings.maxTicketsPerPerson"
                      value={formData.settings.maxTicketsPerPerson}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save as Draft</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Publish Event</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default EventBuilderPage;
