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
    venue: '',
capacity: 100,
image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
category: 'conference',
@@ -33,7 +33,6 @@
const handleInputChange = (field: keyof EventFormData, value: string | number) => {
setEventData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
if (errors[field]) {
setErrors(prev => ({ ...prev, [field]: '' }));
}
@@ -61,8 +60,8 @@
newErrors.time = 'Event time is required';
}

    if (!eventData.location.trim()) {
      newErrors.location = 'Event location is required';
    if (!eventData.venue.trim()) {
      newErrors.venue = 'Event location is required';
}

if (eventData.capacity < 1) {
@@ -101,12 +100,11 @@
}
};

  const isFormValid = eventData.title.trim() && eventData.event_date && eventData.time && eventData.location.trim() && eventData.capacity > 0;
  const isFormValid = eventData.title.trim() && eventData.event_date && eventData.time && eventData.venue.trim() && eventData.capacity > 0;

return (
<div className="min-h-screen bg-gray-50 pt-20">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
<div className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
<button
@@ -118,10 +116,8 @@
</button>
</div>

        {/* Form */}
<div className="bg-white rounded-2xl shadow-lg p-8">
<div className="space-y-8">
            {/* Basic Information */}
<div>
<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
<Type className="w-5 h-5" />
@@ -174,7 +170,6 @@
</div>
</div>

            {/* Date & Time */}
<div>
<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
<Calendar className="w-5 h-5" />
@@ -224,7 +219,6 @@
</div>
</div>

            {/* Location & Capacity */}
<div>
<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
<MapPin className="w-5 h-5" />
@@ -233,17 +227,17 @@

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
<input
type="text"
                    value={eventData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    value={eventData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                      errors.venue ? 'border-red-500' : 'border-gray-300'
                   }`}
placeholder="Enter venue name and address"
/>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
</div>

<div>
@@ -266,7 +260,6 @@
</div>
</div>

            {/* Visual & Settings */}
<div>
<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
<Settings className="w-5 h-5" />
@@ -357,85 +350,8 @@
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
@@ -474,4 +390,4 @@
);
};

export default RealEventBuilderPage;
export default RealEventBuilderPage;
