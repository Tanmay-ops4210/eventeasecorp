import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Plus, Save, Eye, Settings, Calendar, MapPin, Users,
  DollarSign, Image, Type, Palette, Layout, Clock,
  ArrowLeft, ArrowRight, Check, X, Upload, Link,
  Loader2, AlertTriangle
} from 'lucide-react';
import { OrganizerEvent } from '../../types/organizerEvent';
import { organizerEventService } from '../../services/organizerEventService';

const EventBuilderPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<Partial<OrganizerEvent>>({
    title: '',
    description: '',
    category: 'conference',
    date: '',
    time: '',
    venue: { name: '', address: '', capacity: 100, type: 'physical' },
    image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
    status: 'draft',
    ticketTypes: [],
    totalTickets: 0,
    soldTickets: 0,
    revenue: 0,
    attendees: [],
    tags: [],
    organizer: { id: '', name: '', email: '' },
    settings: {
      allowWaitlist: false,
      requireApproval: false,
      maxTicketsPerPerson: 10,
      refundPolicy: 'No refunds',
    },
    analytics: {
      views: 0,
      registrations: 0,
      conversionRate: 0,
      topReferrers: [],
    },
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: Type },
    { id: 2, title: 'Details', icon: Settings },
    { id: 3, title: 'Tickets', icon: DollarSign },
    { id: 4, title: 'Design', icon: Palette },
    { id: 5, title: 'Review', icon: Eye }
  ];

  useEffect(() => {
    setBreadcrumbs(['Event Builder']);
  }, [setBreadcrumbs]);

  const handleInputChange = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleVenueChange = (field: string, value: any) => {
    setEventData(prev => ({
      ...prev,
      venue: { ...prev.venue, [field]: value } as OrganizerEvent['venue'],
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setIsLoading(true);
    try {
      // Construct a valid OrganizerEvent object from the partial eventData
      const finalEventData: OrganizerEvent = {
        id: '', // The service will generate an ID
        title: eventData.title || '',
        description: eventData.description || '',
        category: eventData.category || 'other',
        date: eventData.date || '',
        time: eventData.time || '',
        endTime: '', // Add a default or handle this field in your form
        venue: eventData.venue || { name: '', address: '', capacity: 0, type: 'physical' },
        image: eventData.image || '',
        gallery: [],
        status: status,
        visibility: 'public', // Add a default or handle this field in your form
        ticketTypes: eventData.ticketTypes || [],
        totalTickets: eventData.totalTickets || 0,
        soldTickets: eventData.soldTickets || 0,
        revenue: eventData.revenue || 0,
        attendees: eventData.attendees || [],
        tags: eventData.tags || [],
        organizer: eventData.organizer || { id: '', name: '', email: '' },
        settings: eventData.settings || { allowWaitlist: false, requireApproval: false, maxTicketsPerPerson: 10, refundPolicy: '' },
        analytics: eventData.analytics || { views: 0, registrations: 0, conversionRate: 0, topReferrers: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await organizerEventService.createEvent(finalEventData);

      if (result.success) {
        alert(`Event ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
        setCurrentView('my-events');
      } else {
        alert(result.error || 'Failed to save event');
      }
    } catch (error) {
      alert('Failed to save event');
    }
    setIsLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your event title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={eventData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your event"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={eventData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="networking">Networking</option>
                <option value="webinar">Webinar</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={eventData.venue?.name}
                onChange={(e) => handleVenueChange('name', e.target.value)}
                placeholder="Enter event location"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Image URL</label>
              <input
                type="url"
                value={eventData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {eventData.image && (
                <div className="mt-4">
                  <img
                    src={eventData.image}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ticketing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Tickets</label>
                <input
                  type="number"
                  value={eventData.totalTickets}
                  onChange={(e) => handleInputChange('totalTickets', parseInt(e.target.value, 10) || 0)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Tickets:</span>
                  <span className="font-medium">{eventData.totalTickets}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Ticket:</span>
                  <span className="font-medium">${eventData.ticketTypes?.[0]?.price || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Potential Revenue:</span>
                  <span className="font-bold text-indigo-600">
                    ${((eventData.totalTickets || 0) * (eventData.ticketTypes?.[0]?.price || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Design & Branding</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Preview</h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={eventData.image}
                  alt={eventData.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{eventData.title || 'Event Title'}</h4>
                  <p className="text-gray-600 mb-4">{eventData.description || 'Event description will appear here'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{eventData.date || 'Date TBD'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{eventData.venue?.name || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${eventData.ticketTypes?.[0]?.price || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Publish</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Title:</span> {eventData.title}</p>
                    <p><span className="font-medium">Category:</span> {eventData.category}</p>
                    <p><span className="font-medium">Date:</span> {eventData.date}</p>
                    <p><span className="font-medium">Time:</span> {eventData.time}</p>
                    <p><span className="font-medium">Location:</span> {eventData.venue?.name}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ticketing</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Total Tickets:</span> {eventData.totalTickets}</p>
                    <p><span className="font-medium">Price:</span> ${eventData.ticketTypes?.[0]?.price || 0}</p>
                    <p><span className="font-medium">Potential Revenue:</span> ${((eventData.totalTickets || 0) * (eventData.ticketTypes?.[0]?.price || 0)).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Ready to publish?</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Once published, your event will be visible to attendees and they can start registering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Builder</h1>
          <button
            onClick={() => setCurrentView('my-events')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => handleSave('draft')}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Draft</span>
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={() => handleSave('published')}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Publish Event</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBuilderPage;
