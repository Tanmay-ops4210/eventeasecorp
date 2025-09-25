import React, { useState, useEffect } from 'react';
import { 
  X, Save, Eye, Calendar, MapPin, Users, DollarSign, 
  Image, Type, Clock, Tag, Globe, Lock, Settings,
  Plus, Trash2, Upload, AlertTriangle, CheckCircle
} from 'lucide-react';

interface EventDataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  mode: 'create' | 'edit';
}

interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  
  // Date & Time
  date: string;
  time: string;
  endTime: string;
  timezone: string;
  
  // Location & Venue
  venue: {
    name: string;
    address: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
    amenities: string[];
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Visual Assets
  image: string;
  gallery: string[];
  
  // Pricing & Tickets
  ticketTypes: TicketTypeData[];
  currency: string;
  
  // Registration Settings
  maxAttendees: number;
  registrationDeadline: string;
  requireApproval: boolean;
  allowWaitlist: boolean;
  maxTicketsPerPerson: number;
  
  // Event Details
  whatToExpect: string[];
  requirements: string[];
  refundPolicy: string;
  
  // Organizer Information
  organizer: {
    name: string;
    bio: string;
    contact: string;
    avatar: string;
  };
  
  // Speakers (optional)
  speakers: SpeakerData[];
  
  // Schedule/Agenda
  schedule: ScheduleItem[];
  
  // Settings
  visibility: 'public' | 'private' | 'unlisted';
  status: 'draft' | 'published';
}

interface TicketTypeData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  saleStart: string;
  saleEnd: string;
  benefits: string[];
  restrictions: string[];
  isActive: boolean;
}

interface SpeakerData {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  sessions: string[];
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  room: string;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'networking';
}

const EventDataInputModal: React.FC<EventDataInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    fullDescription: '',
    category: 'conference',
    tags: [],
    date: '',
    time: '',
    endTime: '',
    timezone: 'UTC',
    venue: {
      name: '',
      address: '',
      capacity: 100,
      type: 'physical',
      amenities: [],
      coordinates: undefined
    },
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [],
    ticketTypes: [],
    currency: 'USD',
    maxAttendees: 100,
    registrationDeadline: '',
    requireApproval: false,
    allowWaitlist: false,
    maxTicketsPerPerson: 10,
    whatToExpect: [],
    requirements: [],
    refundPolicy: 'No refunds available',
    organizer: {
      name: '',
      bio: '',
      contact: '',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    speakers: [],
    schedule: [],
    visibility: 'public',
    status: 'draft'
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: Type, description: 'Event title, description, and category' },
    { id: 2, title: 'Date & Location', icon: Calendar, description: 'When and where your event takes place' },
    { id: 3, title: 'Tickets & Pricing', icon: DollarSign, description: 'Ticket types and pricing structure' },
    { id: 4, title: 'Event Details', icon: Settings, description: 'Additional information and requirements' },
    { id: 5, title: 'Organizer Info', icon: Users, description: 'Your information and contact details' },
    { id: 6, title: 'Review & Publish', icon: Eye, description: 'Review all information before publishing' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof EventFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTicketType = () => {
    const newTicket: TicketTypeData = {
      id: `ticket_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      quantity: 100,
      saleStart: '',
      saleEnd: '',
      benefits: [],
      restrictions: [],
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicket]
    }));
  };

  const removeTicketType = (ticketId: string) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== ticketId)
    }));
  };

  const updateTicketType = (ticketId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map(ticket =>
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addToArray = (field: string, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof EventFormData] as string[], value.trim()]
    }));
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof EventFormData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Event title is required';
        if (!formData.description.trim()) newErrors.description = 'Event description is required';
        break;
      case 2:
        if (!formData.date) newErrors.date = 'Event date is required';
        if (!formData.time) newErrors.time = 'Start time is required';
        if (!formData.venue.name.trim()) newErrors['venue.name'] = 'Venue name is required';
        if (!formData.venue.address.trim()) newErrors['venue.address'] = 'Venue address is required';
        break;
      case 3:
        if (formData.ticketTypes.length === 0) newErrors.ticketTypes = 'At least one ticket type is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async (publishNow: boolean = false) => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const finalData = {
        ...formData,
        status: publishNow ? 'published' : 'draft'
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(finalData);
      onClose();
    } catch (error) {
      alert('Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Detailed description that will appear on the event detail page"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="networking">Networking</option>
                  <option value="webinar">Webinar</option>
                  <option value="training">Training</option>
                  <option value="meetup">Meetup</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://example.com/event-image.jpg"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Tags</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('tags', index)}
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag"
                   autoComplete="off"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('tags', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addToArray('tags', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Date & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  value={formData.time}
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
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <div className="grid grid-cols-3 gap-4">
                {['physical', 'virtual', 'hybrid'].map((type) => (
                  <label key={type} className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="venueType"
                      value={type}
                      checked={formData.venue.type === type}
                      onChange={(e) => handleInputChange('venue.type', e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{type}</p>
                      <p className="text-xs text-gray-500">
                        {type === 'physical' ? 'In-person event' : 
                         type === 'virtual' ? 'Online event' : 
                         'Mix of online and in-person'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                <input
                  type="text"
                  value={formData.venue.name}
                  onChange={(e) => handleInputChange('venue.name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors['venue.name'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Convention Center, Hotel Name, etc."
                />
                {errors['venue.name'] && <p className="text-red-500 text-sm mt-1">{errors['venue.name']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.venue.capacity}
                  onChange={(e) => handleInputChange('venue.capacity', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Maximum attendees"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Address *</label>
              <textarea
                value={formData.venue.address}
                onChange={(e) => handleInputChange('venue.address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                  errors['venue.address'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Full venue address including city, state, and postal code"
              />
              {errors['venue.address'] && <p className="text-red-500 text-sm mt-1">{errors['venue.address']}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Tickets & Pricing</h2>
              <button
                type="button"
                onClick={addTicketType}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ticket Type</span>
              </button>
            </div>

            {errors.ticketTypes && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.ticketTypes}</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.ticketTypes.map((ticket, index) => (
                <div key={ticket.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ticket Type {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTicketType(ticket.id)}
                      className="text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Name</label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Early Bird, VIP, General"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <div className="flex space-x-2">
                        <select
                          value={formData.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="INR">INR</option>
                        </select>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => updateTicketType(ticket.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sale Period</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={ticket.saleStart}
                          onChange={(e) => updateTicketType(ticket.id, 'saleStart', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                          type="date"
                          value={ticket.saleEnd}
                          onChange={(e) => updateTicketType(ticket.id, 'saleEnd', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={ticket.description}
                      onChange={(e) => updateTicketType(ticket.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="What's included with this ticket?"
                    />
                  </div>
                </div>
              ))}

              {formData.ticketTypes.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No ticket types added yet</p>
                  <button
                    type="button"
                    onClick={addTicketType}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Add Your First Ticket Type
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
                <input
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* What to Expect */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What Attendees Can Expect</label>
              <div className="space-y-2">
                <div className="space-y-2">
                  {formData.whatToExpect.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="flex-1 text-gray-700">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('whatToExpect', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add what attendees can expect"
                   autoComplete="off"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('whatToExpect', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addToArray('whatToExpect', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (What to Bring)</label>
              <div className="space-y-2">
                <div className="space-y-2">
                  {formData.requirements.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="flex-1 text-gray-700">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('requirements', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a requirement"
                   autoComplete="off"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray('requirements', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addToArray('requirements', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
              <textarea
                value={formData.refundPolicy}
                onChange={(e) => handleInputChange('refundPolicy', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your refund policy"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.requireApproval}
                    onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                    className="text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Require Approval</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.allowWaitlist}
                    onChange={(e) => handleInputChange('allowWaitlist', e.target.checked)}
                    className="text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Waitlist</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Tickets per Person</label>
                <input
                  type="number"
                  value={formData.maxTicketsPerPerson}
                  onChange={(e) => handleInputChange('maxTicketsPerPerson', parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Organizer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Name</label>
                <input
                  type="text"
                  value={formData.organizer.name}
                  onChange={(e) => handleInputChange('organizer.name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your name or organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.organizer.contact}
                  onChange={(e) => handleInputChange('organizer.contact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Bio</label>
              <textarea
                value={formData.organizer.bio}
                onChange={(e) => handleInputChange('organizer.bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell attendees about yourself or your organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Avatar URL</label>
              <input
                type="url"
                value={formData.organizer.avatar}
                onChange={(e) => handleInputChange('organizer.avatar', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Visibility</label>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
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
                    checked={formData.visibility === 'private'}
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
                    checked={formData.visibility === 'unlisted'}
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
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Publish</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Title:</span> {formData.title}</p>
                    <p><span className="font-medium">Category:</span> {formData.category}</p>
                    <p><span className="font-medium">Date:</span> {formData.date}</p>
                    <p><span className="font-medium">Time:</span> {formData.time} - {formData.endTime}</p>
                    <p><span className="font-medium">Location:</span> {formData.venue.name}</p>
                    <p><span className="font-medium">Capacity:</span> {formData.maxAttendees}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ticketing</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Ticket Types:</span> {formData.ticketTypes.length}</p>
                    <p><span className="font-medium">Price Range:</span> 
                      {formData.ticketTypes.length > 0 ? 
                        `${Math.min(...formData.ticketTypes.map(t => t.price))} - ${Math.max(...formData.ticketTypes.map(t => t.price))} ${formData.currency}` : 
                        'No tickets'
                      }
                    </p>
                    <p><span className="font-medium">Total Tickets:</span> {formData.ticketTypes.reduce((sum, t) => sum + t.quantity, 0)}</p>
                    <p><span className="font-medium">Visibility:</span> {formData.visibility}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Card Preview</h3>
              <div className="max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {formData.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                        {formData.ticketTypes.length > 0 ? 
                          `$${Math.min(...formData.ticketTypes.map(t => t.price))}` : 
                          'Free'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{formData.title || 'Event Title'}</h4>
                    <p className="text-gray-600 text-sm mb-4">{formData.description || 'Event description'}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formData.date || 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{formData.venue.name || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Up to {formData.maxAttendees} attendees</span>
                      </div>
                    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h1>
            <p className="text-gray-600">Step {currentStep} of {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span>Previous</span>
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Draft</span>
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>Publish Event</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <span>Next</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDataInputModal;