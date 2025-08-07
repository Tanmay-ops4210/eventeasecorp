import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, User, Menu, X, ChevronRight } from 'lucide-react';

// Components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SpeakersSection from './components/SpeakersSection';
import ScheduleSection from './components/ScheduleSection';
import BottomSection from './components/BottomSection';
import PlanEventSection from './components/PlanEventSection';
import BlogContainer from './components/blog/BlogContainer';
import ContactSection from './components/ContactSection';
import AuthModal from './components/AuthModal';
import SpeakerContainer from './components/speakers/SpeakerContainer';
import SponsorsPartnersPage from './components/SponsorsPartnersPage';
import AttendeeDashboard from './components/attendee/AttendeeDashboard';
import EnhancedChart from './components/EnhancedChart';
import MapComponent from './components/MapComponent';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import AdminPanel from './components/AdminPanel';
import EventsSection from './components/events/EventsSection';
import BookingFlow from './components/booking/BookingFlow';
// TEMPORARILY REMOVED SUPABASE
// import { supabase, db } from './lib/supabase';
import { db } from './lib/supabase';
import './components/chart-styles.css';

type AppState = 'home' | 'blog' | 'events' | 'booking' | 'map' | 'payment' | 'success' | 'admin' | 'speakers' | 'sponsors' | 'dashboard';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState<AppState>('home');
  const [eventData, setEventData] = useState(null);
  const [locationData, setLocationData] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('eventUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    // Check if admin route is requested
    const path = window.location.pathname;
    if (path === '/admin') {
      setAppState('admin');
    }
  }, []);

  const handleLogin = async (userData) => {
    try {
      // TEMPORARILY REMOVED SUPABASE - Skip database operations
      // // Create user in Supabase if it doesn't exist
      // const { data: existingUser, error: fetchError } = await supabase
      //   .from('app_users')
      //   .select('*')
      //   .eq('email', userData.email)
      //   .single();

      // if (fetchError && fetchError.code !== 'PGRST116') {
      //   console.error('Error checking user:', fetchError);
      // }

      // if (!existingUser) {
      //   // Create new user in database
      //   const { data: newUser, error: createError } = await db.createUser({
      //     id: userData.id,
      //     email: userData.email,
      //     username: userData.name
      //   });

      //   if (createError) {
      //     console.error('Error creating user:', createError);
      //   }
      // }

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('eventUser', JSON.stringify(userData));
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Error during login:', error);
      // Still allow login even if DB operations fail
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('eventUser', JSON.stringify(userData));
      setIsAuthModalOpen(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eventUser');
  };

  const handleEventSubmitted = async (data: any) => {
    try {
      // TEMPORARILY REMOVED SUPABASE - Skip database operations
      // // Save event to database if user is authenticated
      // if (user) {
      //   const eventData = {
      //     ...data,
      //     user_id: user.id
      //   };

      //   const { data: newEvent, error } = await db.createEvent(eventData);
      //   if (error) {
      //     console.error('Error creating event:', error);
      //   } else {
      //     console.log('Event created successfully:', newEvent);
      //   }
      // }

      setEventData(data);
      setAppState('map');
    } catch (error) {
      console.error('Error saving event:', error);
      // Continue with the flow even if DB save fails
      setEventData(data);
      setAppState('map');
    }
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
    window.history.pushState({}, '', '/');
  };

  const handleShowBlog = () => {
    setAppState('blog');
  };

  const handleShowEvents = () => {
    setAppState('events');
  };

  const handleShowSpeakers = () => {
    setAppState('speakers');
  };

  const handleShowSponsors = () => {
    setAppState('sponsors');
  };

  const handleShowDashboard = () => {
    if (isAuthenticated) {
      setAppState('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleBookEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setAppState('booking');
  };

  const handleBackFromBooking = () => {
    setAppState('events');
    setSelectedEventId('');
  };

  const handleLoginRequired = () => {
    setIsAuthModalOpen(true);
  };

  // Handle admin panel access
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setAppState('admin');
      } else {
        setAppState('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin panel routing
  if (appState === 'admin') {
    return <AdminPanel />;
  }

  // Blog state
  if (appState === 'blog') {
    return <BlogContainer />;
  }

  // Speakers state
  if (appState === 'speakers') {
    return <SpeakerContainer />;
  }

  // Sponsors & Partners state
  if (appState === 'sponsors') {
    return <SponsorsPartnersPage />;
  }

  // Attendee Dashboard state
  if (appState === 'dashboard') {
    return (
      <AttendeeDashboard
        user={user}
        onLogout={() => {
          handleLogout();
          setAppState('home');
        }}
      />
    );
  }

  // Events state
  if (appState === 'events') {
    return (
      <EventsSection
        onBookEvent={handleBookEvent}
        isAuthenticated={isAuthenticated}
        onLoginRequired={handleLoginRequired}
      />
    );
  }

  // Booking flow state
  if (appState === 'booking') {
    return (
      <BookingFlow
        eventData={{ id: selectedEventId, title: 'Selected Event' }}
        onBack={handleBackFromBooking}
      />
    );
  }

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

  // Add admin access button to navigation for development
  const navigateToAdmin = () => {
    setAppState('admin');
    window.history.pushState({}, '', '/admin');
  };

  // Default home state
  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onShowBlog={handleShowBlog}
        onShowEvents={handleShowEvents}
        onShowSpeakers={handleShowSpeakers}
        onShowSponsors={handleShowSponsors}
        onShowDashboard={handleShowDashboard}
      />
      
      {/* Admin Access Button (for development) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={navigateToAdmin}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-200 text-sm"
        >
          Admin Panel
        </button>
      </div>
      
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
      <div id="blog"><BlogContainer /></div>
      <BottomSection onBookNow={() => setIsAuthModalOpen(true)} />
      <ContactSection />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Events Section */}
      <div id="events">
        <EventsSection onBookEvent={handleBookEvent} isAuthenticated={isAuthenticated} onLoginRequired={handleLoginRequired} />
      </div>
    </div>
  );
}

export default App;