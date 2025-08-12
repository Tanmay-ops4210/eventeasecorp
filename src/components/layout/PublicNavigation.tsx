import React, { useState } from 'react';
import { Menu, X, Calendar, Users, Building, BookOpen, Info, Phone, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const PublicNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { setCurrentView } = useApp();
  const { isAuthenticated, user, logout } = useAuth();

  React.useEffect(() => {
    const handlePasswordResetNavigation = () => {
      setCurrentView('password-reset');
    };

    window.addEventListener('navigate-to-password-reset', handlePasswordResetNavigation);
    return () => window.removeEventListener('navigate-to-password-reset', handlePasswordResetNavigation);
  }, [setCurrentView]);

  const navigationItems = [
    { label: 'Events', view: 'event-discovery' as const, icon: Calendar },
    { label: 'Speakers', view: 'speaker-directory' as const, icon: Users },
    { label: 'Sponsors', view: 'sponsor-directory' as const, icon: Building },
    { label: 'Blog', view: 'blog' as const, icon: BookOpen },
    { label: 'About', view: 'about' as const, icon: Info },
    { label: 'Contact', view: 'contact' as const, icon: Phone },
  ];

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'attendee':
          setCurrentView('attendee-dashboard');
          break;
        case 'organizer':
          setCurrentView('organizer-dashboard');
          break;
        case 'sponsor':
          setCurrentView('sponsor-dashboard');
          break;
        case 'admin':
          setCurrentView('admin-dashboard');
          break;
        default:
          setCurrentView('attendee-dashboard');
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md bg-opacity-90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleNavigation('home')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-white font-bold text-xl">EventEase</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNavigation(item.view)}
                      className="flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('pricing')}
                className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-white/10 rounded-lg"
              >
                Pricing
              </button>
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={handleAuthAction}
                    className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-white/10 rounded-lg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-white/10 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-white text-indigo-600 hover:bg-gray-100 text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-indigo-200 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-700 bg-opacity-50 backdrop-blur-md rounded-lg mt-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavigation(item.view)}
                    className="flex items-center space-x-3 text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="border-t border-indigo-500 pt-3 mt-3">
                <button
                  onClick={() => handleNavigation('pricing')}
                  className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  Pricing
                </button>
                <button
                  onClick={handleAuthAction}
                  className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </button>
                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default PublicNavigation;
