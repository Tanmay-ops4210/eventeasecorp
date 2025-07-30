import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Check, ArrowLeft, ArrowRight } from 'lucide-react';

// Define a global variable for the Google Maps API key
// IMPORTANT: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key.
// You can obtain one from the Google Cloud Console.
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onBack: () => void;
  onNext: () => void;
  eventData: any;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, onBack, onNext, eventData }) => {
  // Ambernath, Thane, Maharashtra coordinates as default center
  const defaultCenter = { lat: 19.1972, lng: 73.1567 };
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null); // Ref for the map container div

  /**
   * Loads the Google Maps API script dynamically.
   */
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Script loaded, now initialize the map
        initializeMap();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script.');
        // Optionally, show an error message to the user
      };
      document.head.appendChild(script);
    } else {
      // Google Maps script is already loaded
      initializeMap();
    }

    // Cleanup function to remove the script if the component unmounts
    return () => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  /**
   * Initializes the Google Map instance.
   */
  const initializeMap = () => {
    if (mapRef.current && window.google && window.google.maps) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false, // Hide map type controls
        streetViewControl: false, // Hide street view control
        fullscreenControl: false, // Hide fullscreen control
        zoomControl: true, // Show zoom controls
      });

      setMap(googleMap);

      // Add click listener to the map
      googleMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          const newPosition = { lat, lng };

          // Update marker position
          if (marker) {
            marker.setPosition(newPosition);
          } else {
            const newMarker = new window.google.maps.Marker({
              position: newPosition,
              map: googleMap,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Custom marker icon
                scaledSize: new window.google.maps.Size(40, 40), // Adjust size if needed
              },
            });
            setMarker(newMarker);
          }

          // Simulate reverse geocoding
          const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}, Ambernath, Thane, Maharashtra`;
          handleLocationChange({ lat, lng, address });
        }
      });
    }
  };

  /**
   * Handles changes to the selected location and updates parent component.
   * @param location The selected latitude, longitude, and address.
   */
  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  /**
   * Handles the "Continue to Payment" action.
   */
  const handleNext = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    // Simulate API call to save location
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onNext();
  };

  /**
   * Attempts to get the user's current location and centers the map.
   */
  const handleCurrentLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          
          // Center map on current location
          map.setCenter(newPos);
          map.setZoom(15);

          // Update marker position
          if (marker) {
            marker.setPosition(newPos);
          } else {
            const newMarker = new window.google.maps.Marker({
              position: newPos,
              map: map,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Custom marker icon
                scaledSize: new window.google.maps.Size(40, 40), // Adjust size if needed
              },
            });
            setMarker(newMarker);
          }

          handleLocationChange({
            lat: newPos.lat,
            lng: newPos.lng,
            address: `${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}, Current Location`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Using a custom modal/message box instead of alert()
          const messageBox = document.createElement('div');
          messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
          messageBox.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
              <p class="text-lg font-semibold text-gray-800 mb-4">Location Error</p>
              <p class="text-gray-600 mb-6">Unable to get your current location. Please select manually on the map.</p>
              <button id="closeMessageBox" class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">OK</button>
            </div>
          `;
          document.body.appendChild(messageBox);
          document.getElementById('closeMessageBox')?.addEventListener('click', () => {
            document.body.removeChild(messageBox);
          });
        }
      );
    }
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
                {/* Google Map will be rendered here */}
                <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
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
