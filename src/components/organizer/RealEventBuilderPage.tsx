import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Save, ArrowLeft, Loader2, Check } from 'lucide-react';
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
    venue: '',
    capacity: 100,
    image_url: '',
    category: 'conference',
    visibility: 'public'
  });

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
    if (!eventData.title.trim()) newErrors.title = 'Event title is required';
    if (!eventData.event_date) newErrors.event_date = 'Event date is required';
    if (!eventData.time) newErrors.time = 'Event time is required';
    if (!eventData.venue.trim()) newErrors.venue = 'Venue or location is required';
    if (eventData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setIsLoading(true);
    const result = await realEventService.createEvent(eventData, user.id);
    setIsLoading(false);

    if (result.success) {
      alert('Event created successfully! You will be redirected to the dashboard.');
      setCurrentView('dashboard'); // Redirect to see the real-time update
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <button onClick={() => setCurrentView('dashboard')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700">Event Title *</label>
                <input type="text" value={eventData.title} onChange={(e) => handleInputChange('title', e.target.value)} className={`w-full mt-1 p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select value={eventData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                </select>
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={eventData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Date *</label>
              <input type="date" value={eventData.event_date} onChange={(e) => handleInputChange('event_date', e.target.value)} className={`w-full mt-1 p-2 border ${errors.event_date ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
              {errors.event_date && <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time *</label>
              <input type="time" value={eventData.time} onChange={(e) => handleInputChange('time', e.target.value)} className={`w-full mt-1 p-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue / Location *</label>
                <input type="text" value={eventData.venue} onChange={(e) => handleInputChange('venue', e.target.value)} className={`w-full mt-1 p-2 border ${errors.venue ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity *</label>
                <input type="number" value={eventData.capacity} onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))} min="1" className={`w-full mt-1 p-2 border ${errors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
              </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEventBuilderPage;
