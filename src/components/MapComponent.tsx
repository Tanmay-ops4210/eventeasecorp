import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { MapPin, Navigation, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onBack: () => void;
  onNext: () => void;
  eventData: any;
}

interface LocationMarkerProps {
  position: LatLngExpression | null;
  setPosition: (position: LatLngExpression | null) => void;
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, onLocationChange }) => {
  const map = useMapEvents({
    click(e) {
      const newPosition: LatLngExpression = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      
      // Reverse geocoding simulation (in real app, use a geocoding service)
      const address = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}, Ambernath, Thane, Maharashtra`;
      onLocationChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address
      });
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <MapPin className="w-4 h-4 mx-auto mb-2 text-indigo-600" />
          <p className="text-sm font-medium">Selected Location</p>
          <p className="text-xs text-gray-600">Click anywhere to change</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, onBack, onNext, eventData }) => {
  // Ambernath, Thane, Maharashtra coordinates
  const defaultCenter: LatLngExpression = [19.1972, 73.1567];
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<any>(null);

  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleNext = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    // Simulate API call to save location
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onNext();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos: LatLngExpression = [position.coords.latitude, position.coords.longitude];
          setPosition(newPos);
          handleLocationChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}, Current Location`
          });
          
          // Center map on current location
          if (mapRef.current) {
            mapRef.current.setView(newPos, 15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select manually on the map.');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
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
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
                  <button
                    onClick={handleCurrentLocation}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                  >
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm font-medium">Use Current Location</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Click anywhere on the map to select your event location</p>
              </div>
              
              <div className="h-96 relative">
                <MapContainer
                  center={defaultCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationChange={handleLocationChange}
                  />
                </MapContainer>
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
                      <p className="font-medium text-gray-900">Coordinates</p>
                      <p className="text-sm text-gray-600">
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
                  <p className="text-gray-600">Click on the map to select a location</p>
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