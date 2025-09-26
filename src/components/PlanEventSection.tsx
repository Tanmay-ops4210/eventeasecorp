import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/NewAuthContext';
import { useApp } from '../contexts/AppContext';
import UnifiedAuthModal from './auth/UnifiedAuthModal';

interface PlanEventSectionProps {
  onEventSubmitted?: (eventData: any) => void;
}

const eventTypes = [
  { id: 'conference', name: 'Conference', icon: Users, color: 'bg-indigo-500' },
  { id: 'workshop', name: 'Workshop', icon: Star, color: 'bg-purple-500' },
  { id: 'seminar', name: 'Seminar', icon: Clock, color: 'bg-blue-500' },
  { id: 'networking', name: 'Networking', icon: MapPin, color: 'bg-teal-500' }
];

const features = [
  'Professional event planning assistance',
  'Venue selection and booking',
  'Speaker coordination and management',
  'Marketing and promotion support',
  'Registration and ticketing system',
  'Live streaming and virtual options',
  'Post-event analytics and reporting',
  'Dedicated event coordinator'
];

const PlanEventSection: React.FC<PlanEventSectionProps> = ({ onEventSubmitted }) => {
  const { isAuthenticated } = useAuth();
  const { setCurrentView } = useApp();
  const [selectedType, setSelectedType] = useState('conference');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'conference',
    expectedAttendees: '',
    eventDate: '',
    budget: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to unified dashboard to start creating the event
    setCurrentView('dashboard');
    
    setIsSubmitting(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, redirect to unified dashboard
    setCurrentView('dashboard');
  };
  return (
    <section id="plan-event" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-4">
            PLAN YOUR EVENT
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            From intimate workshops to large-scale conferences, we help you create unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Side - Event Types & Features */}
          <div className="space-y-8 lg:space-y-12">
            {/* Event Types */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 sm:mb-8">Event Types We Handle</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 touch-manipulation ${
                        selectedType === type.id
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl'
                          : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                        selectedType === type.id ? 'bg-white/20' : type.color
                      }`}>
                        <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          selectedType === type.id ? 'text-white' : 'text-white'
                        }`} />
                      </div>
                      <h4 className="font-semibold text-base sm:text-lg">{type.name}</h4>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 sm:mb-8">What We Provide</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    </div>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Planning Form */}
          <div className="relative">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl opacity-70 animate-pulse transform rotate-12 mobile-hidden" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-bounce mobile-hidden" style={{ animationDuration: '3s' }} />
              
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-4 sm:mb-6">Start Planning</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                     autoComplete="off"
                     autoComplete="off"
                     autoComplete="off"
                      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                      placeholder="Enter your event name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                    >
                      {eventTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendees</label>
                      <input
                        type="number"
                        name="expectedAttendees"
                        value={formData.expectedAttendees}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        placeholder="100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                      required
                    >
                      <option value="">Select budget range</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000-25000">$10,000 - $25,000</option>
                      <option value="25000-50000">$25,000 - $50,000</option>
                      <option value="50000+">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base resize-none"
                      placeholder="Tell us about your event vision..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span className="text-center">{isAuthenticated ? 'Start Creating Event' : 'Sign Up to Start Organizing'}</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal for Organizer Signup */}
      <UnifiedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleAuthSuccess}
        defaultRole="user"
        redirectTo="/dashboard"
      />
    </section>
  );
};

export default PlanEventSection;