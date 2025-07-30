import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, User, Menu, X, ChevronRight } from 'lucide-react';

// Components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SpeakersSection from './components/SpeakersSection';
import ScheduleSection from './components/ScheduleSection';
import BottomSection from './components/BottomSection';
import PlanEventSection from './components/PlanEventSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import AuthModal from './components/AuthModal';
import EnhancedChart from './components/EnhancedChart';
import MapComponent from './components/MapComponent';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import './components/chart-styles.css';

type AppState = 'home' | 'map' | 'payment' | 'success';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState<AppState>('home');
  const [eventData, setEventData] = useState(null);
  const [locationData, setLocationData] = useState<{ lat: number; lng: number; address: string } | null>(null);

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('eventUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('eventUser', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eventUser');
  };

  const handleEventSubmitted = (data: any) => {
    setEventData(data);
    setAppState('map');
  };

  const handleLocationSelected = (location: { lat: number; lng: number; address: string }) => {
    setLocationData(location);
  };

  const handleBackToEventForm = () => {
    setAppState('home');
  };

  const handleProceedToPayment = () => {
    setAppState('payment');
  };

  const handleBackToMap = () => {
    setAppState('map');
  };

  const handlePaymentComplete = () => {
    setAppState('success');
  };

  const handleBackToHome = () => {
    setAppState('home');
    setEventData(null);
    setLocationData(null);
  };

  // Render different states
  if (appState === 'map') {
    return (
      <MapComponent
        eventData={eventData}
        onLocationSelect={handleLocationSelected}
        onBack={handleBackToEventForm}
        onNext={handleProceedToPayment}
      />
    );
  }

  if (appState === 'payment') {
    return (
      <PaymentPage
        eventData={eventData}
        locationData={locationData}
        onBack={handleBackToMap}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  if (appState === 'success') {
    return (
      <PaymentSuccess
        eventData={eventData}
        locationData={locationData}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Default home state
  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <HeroSection onBookSpot={() => setIsAuthModalOpen(true)} />
      <SpeakersSection />
      <ScheduleSection />
      
      {/* Enhanced Chart Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
              ANALYTICS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interactive data visualization with smooth animations and pagination
            </p>
          </div>
          <EnhancedChart />
        </div>
      </section>
      
      <PlanEventSection onEventSubmitted={handleEventSubmitted} />
      <BlogSection />
      <BottomSection onBookNow={() => setIsAuthModalOpen(true)} />
      <ContactSection />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;