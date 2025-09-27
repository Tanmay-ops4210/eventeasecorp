import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Calendar, MapPin, Users, Clock, 
  Upload, X, Plus, Trash2, User, Building, Mail,
  Globe, Image as ImageIcon, Type, FileText, Star,
  AlertTriangle, CheckCircle, Loader2
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  email: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website: string;
  description: string;
}

interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  aboutEvent: string;
  category: string;
  
  // Date & Time
  eventDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Location
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isVirtual: boolean;
  virtualLink?: string;
  
  // Media
  eventImage: string;
  galleryImages: string[];
  
  // People
  speakers: Speaker[];
  sponsors: Sponsor[];
  
  // Organizer
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerBio: string;
  organizerImage: string;
  organizerCompany: string;
  organizerWebsite: string;
  
  // Settings
  capacity: number;
  visibility: 'public' | 'private' | 'unlisted';
  requireApproval: boolean;
  allowWaitlist: boolean;
}

const EventEditPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    aboutEvent: '',
    category: 'conference',
    eventDate: '',
    startTime: '',
    endTime: '',
    timezone: 'UTC',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    isVirtual: false,
    virtualLink: '',
    eventImage: '',
    galleryImages: [],
    speakers: [],
    sponsors: [],
    organizerName: user?.name || '',
    organizerEmail: user?.email || '',
    organizerPhone: '',
    organizerBio: '',
    organizerImage: '',
    organizerCompany: '',
    organizerWebsite: '',
    capacity: 100,
    visibility: 'public',
    requireApproval: false,
    allowWaitlist: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [imagePreview, setImagePreview] = useState<string>('');

  React.useEffect(() => {
    setBreadcrumbs(['Event Management', eventId ? 'Edit Event' : 'Create Event']);
    
    if (eventId) {
      loadEventData();
    }
  }, [setBreadcrumbs, eventId]);

  const loadEventData = async () => {
    setIsLoading(true);
    try {
      // Mock loading existing event data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from the API
      const mockEventData: Partial<EventFormData> = {
        title: 'Sample Event',
        description: 'Sample event description',
        aboutEvent: 'This is a comprehensive description of the sample event...',
        category: 'conference',
        eventDate: '2024-04-15',
        startTime: '09:00',
        endTime: '17:00',
        venue: 'Convention Center',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        capacity: 500,
        eventImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
      };
      
      setFormData(prev => ({ ...prev, ...mockEventData }));
      setImagePreview(mockEventData.eventImage || '');
    } catch (error) {
      console.error('Failed to load event data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ eventImage: 'Image size must be less than 5MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange('eventImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpeaker = () => {
    const newSpeaker: Speaker = {
      id: `speaker_${Date.now()}`,
      name: '',
      title: '',
      company: '',
      bio: '',
      image: '',
      email: ''
    };
    handleInputChange('speakers', [...formData.speakers, newSpeaker]);
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const updatedSpeakers = [...formData.speakers];
    updatedSpeakers[index] = { ...updatedSpeakers[index], [field]: value };
    handleInputChange('speakers', updatedSpeakers);
  };

  const removeSpeaker = (index: number) => {
    const updatedSpeakers = formData.speakers.filter((_, i) => i !== index);
    handleInputChange('speakers', updatedSpeakers);
  };

  const addSponsor = () => {
    const newSponsor: Sponsor = {
      id: `sponsor_${Date.now()}`,
      name: '',
      logo: '',
      tier: 'bronze',
      website: '',
      description: ''
    };
    handleInputChange('sponsors', [...formData.sponsors, newSponsor]);
  };

  const updateSponsor = (index: number, field: keyof Sponsor, value: string) => {
    const updatedSponsors = [...formData.sponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], [field]: value };
    handleInputChange('sponsors', updatedSponsors);
  };

  const removeSponsor = (index: number) => {
    const updatedSponsors = formData.sponsors.filter((_, i) => i !== index);
    handleInputChange('sponsors', updatedSponsors);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.aboutEvent.trim()) newErrors.aboutEvent = 'About event section is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.venue.trim() && !formData.isVirtual) newErrors.venue = 'Venue is required for physical events';
    if (!formData.virtualLink?.trim() && formData.isVirtual) newErrors.virtualLink = 'Virtual link is required for virtual events';
    if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required';
    if (!formData.organizerEmail.trim()) newErrors.organizerEmail = 'Organizer email is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';

    // Date validation
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past';
      }
    }

    // Time validation
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    // Email validation
    if (formData.organizerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizerEmail)) {
      newErrors.organizerEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Event saved successfully!');
    } catch (error) {
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to ticket pricing page
      navigate(`/organizer/event/${eventId || 'new'}/ticketing`);
    } catch (error) {
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Type },
    { id: 'datetime', label: 'Date & Time', icon: Calendar },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'speakers', label: 'Speakers', icon: User },
    { id: 'sponsors', label: 'Sponsors', icon: Star },
    { id: 'organizer', label: 'Organizer', icon: Building }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/my-events')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to My Events</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {eventId ? 'Edit Event' : 'Create New Event'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Draft</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
            >
              <span>Next: Ticket Pricing</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Completion Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Basic Information Section */}
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Type className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your event title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Brief description for event cards (2-3 sentences)"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About This Event *
                    </label>
                    <textarea
                      name="aboutEvent"
                      value={formData.aboutEvent}
                      onChange={(e) => handleInputChange('aboutEvent', e.target.value)}
                      rows={8}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.aboutEvent ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Detailed description that will appear on the event detail page. Include what attendees can expect, agenda highlights, networking opportunities, etc."
                    />
                    {errors.aboutEvent && <p className="text-red-500 text-sm mt-1">{errors.aboutEvent}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Category
                      </label>
                      <select
                        value={formData.category}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Capacity *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.capacity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Maximum attendees"
                      />
                      {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Section */}
              {activeSection === 'datetime' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Date & Time</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.eventDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.startTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.endTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Location Section */}
              {activeSection === 'location' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Location & Venue</h2>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="eventType"
                        checked={!formData.isVirtual}
                        onChange={() => handleInputChange('isVirtual', false)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-gray-900">Physical Event</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="eventType"
                        checked={formData.isVirtual}
                        onChange={() => handleInputChange('isVirtual', true)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-gray-900">Virtual Event</span>
                    </label>
                  </div>

                  {!formData.isVirtual ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Venue Name *
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={(e) => handleInputChange('venue', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                            errors.venue ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Convention Center, Hotel Name, etc."
                        />
                        {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="San Francisco"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="United States"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Virtual Event Link *
                      </label>
                      <input
                        type="url"
                        name="virtualLink"
                        value={formData.virtualLink || ''}
                        onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.virtualLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                      />
                      {errors.virtualLink && <p className="text-red-500 text-sm mt-1">{errors.virtualLink}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Media Section */}
              {activeSection === 'media' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <ImageIcon className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Event Media</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image *
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                          errors.eventImage ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
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
                      {errors.eventImage && <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>}
                      
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
                                setImagePreview('');
                                handleInputChange('eventImage', '');
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Speakers Section */}
              {activeSection === 'speakers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Event Speakers</h2>
                    </div>
                    <button
                      onClick={addSpeaker}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Speaker</span>
                    </button>
                  </div>

                  {formData.speakers.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No speakers added yet</p>
                      <button
                        onClick={addSpeaker}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Add Your First Speaker
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.speakers.map((speaker, index) => (
                        <div key={speaker.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Speaker {index + 1}</h3>
                            <button
                              onClick={() => removeSpeaker(index)}
                              className="text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={speaker.name}
                                onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Speaker name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={speaker.title}
                                onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Job title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                              <input
                                type="text"
                                value={speaker.company}
                                onChange={(e) => updateSpeaker(index, 'company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Company name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={speaker.email}
                                onChange={(e) => updateSpeaker(index, 'email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="speaker@example.com"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                              value={speaker.bio}
                              onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Speaker biography and expertise"
                            />
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                            <input
                              type="url"
                              value={speaker.image}
                              onChange={(e) => updateSpeaker(index, 'image', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="https://example.com/speaker-photo.jpg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sponsors Section */}
              {activeSection === 'sponsors' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Star className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Event Sponsors</h2>
                    </div>
                    <button
                      onClick={addSponsor}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Sponsor</span>
                    </button>
                  </div>

                  {formData.sponsors.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No sponsors added yet</p>
                      <button
                        onClick={addSponsor}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Add Your First Sponsor
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.sponsors.map((sponsor, index) => (
                        <div key={sponsor.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Sponsor {index + 1}</h3>
                            <button
                              onClick={() => removeSponsor(index)}
                              className="text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                              <input
                                type="text"
                                value={sponsor.name}
                                onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Sponsor company name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Tier</label>
                              <select
                                value={sponsor.tier}
                                onChange={(e) => updateSponsor(index, 'tier', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="platinum">Platinum</option>
                                <option value="gold">Gold</option>
                                <option value="silver">Silver</option>
                                <option value="bronze">Bronze</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                              <input
                                type="url"
                                value={sponsor.logo}
                                onChange={(e) => updateSponsor(index, 'logo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://example.com/logo.png"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                              <input
                                type="url"
                                value={sponsor.website}
                                onChange={(e) => updateSponsor(index, 'website', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://sponsor-website.com"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={sponsor.description}
                              onChange={(e) => updateSponsor(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Brief description of the sponsor"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Organizer Section */}
              {activeSection === 'organizer' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Building className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Organizer Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organizer Name *
                      </label>
                      <input
                        type="text"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={(e) => handleInputChange('organizerName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.organizerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your name or organization name"
                      />
                      {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        name="organizerEmail"
                        value={formData.organizerEmail}
                        onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                          errors.organizerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="contact@example.com"
                      />
                      {errors.organizerEmail && <p className="text-red-500 text-sm mt-1">{errors.organizerEmail}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.organizerPhone}
                        onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        value={formData.organizerCompany}
                        onChange={(e) => handleInputChange('organizerCompany', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Your company or organization"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer Bio
                    </label>
                    <textarea
                      value={formData.organizerBio}
                      onChange={(e) => handleInputChange('organizerBio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Tell attendees about yourself or your organization"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.organizerImage}
                        onChange={(e) => handleInputChange('organizerImage', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.organizerWebsite}
                        onChange={(e) => handleInputChange('organizerWebsite', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Message */}
              {Object.keys(errors).length === 0 && formData.title && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Event details look good! Ready to proceed to ticket pricing.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditPage;