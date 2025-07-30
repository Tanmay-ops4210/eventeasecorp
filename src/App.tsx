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
import './components/chart-styles.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
      
      <PlanEventSection />
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