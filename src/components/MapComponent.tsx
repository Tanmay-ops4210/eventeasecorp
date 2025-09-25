import React, { useState } from 'react';
import { MapPin, Navigation, Check, ArrowLeft, ArrowRight } from 'lucide-react';

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onBack: () => void;
  onNext: () => void;
  eventData: any;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, onBack, onNext, eventData }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  const predefinedLocations = [
    { name: 'Ambernath Convention Center', lat: 19.1972, lng: 73.1567, address: 'Ambernath Convention Center, Thane, Maharashtra' },
    { name: 'Thane Event Hall', lat: 19.2183, lng: 72.9781, address: 'Thane Event Hall, Thane, Maharashtra' },
    { name: 'Mumbai Conference Center', lat: 19.0760, lng: 72.8777, address: 'Mumbai Conference Center, Mumbai, Maharashtra' },
    { name: 'Kalyan Community Hall', lat: 19.2437, lng: 73.1355, address: 'Kalyan Community Hall, Kalyan, Maharashtra' }
  ];

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleCustomLocation = () => {
    if (customAddress.trim()) {
      const customLocation = {
        lat: 19.1972 + (Math.random() - 0.5) * 0.1,
        lng: 73.1567 + (Math.random() - 0.5) * 0.1,
        address: customAddress
      };
      handleLocationSelect(customLocation);
    }
  };

  const handleNext = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    // Simulate API call to save location
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Event Details</span>
            </div>
            <div className="w-16 h-0.5 bg-indigo-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">Location</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">3</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Select Event Location</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect location for "{eventData?.eventName}" in Ambernath, Thane, Maharashtra
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Available Locations</h3>
                <p className="text-sm text-gray-600 mt-2">Select from our recommended venues or add a custom location</p>
              </div>
              
              <div className="p-6">
                {/* Predefined Locations */}
                <div className="space-y-4 mb-8">
                  {predefinedLocations.map((location, index) => (
                    <div
                      key={index}
                      onClick={() => handleLocationSelect(location)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedLocation?.address === location.address
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <MapPin className={`w-5 h-5 mt-0.5 ${
                          selectedLocation?.address === location.address ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{location.name}</h4>
                          <p className="text-sm text-gray-600">{location.address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </p>
                        </div>
                        {selectedLocation?.address === location.address && (
                          <Check className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Location */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Custom Location</h4>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Enter custom address..."
                     autoComplete="street-address"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={handleCustomLocation}
                      disabled={!customAddress.trim()}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details & Controls */}
          <div className="space-y-6">
            {/* Event Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Event Name:</span>
                  <p className="font-medium text-gray-900">{eventData?.eventName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <p className="font-medium text-gray-900 capitalize">{eventData?.eventType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Expected Attendees:</span>
                  <p className="font-medium text-gray-900">{eventData?.expectedAttendees}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <p className="font-medium text-gray-900">
                    {eventData?.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Location</h3>
              {selectedLocation ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location Confirmed</p>
                      <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <Check className="w-4 h-4 inline mr-1" />
                      Location selected successfully!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Select a location from the list above</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onBack}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedLocation || isLoading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;