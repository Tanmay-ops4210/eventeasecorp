import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Users, Building, BookOpen, Info, Phone, User, LogOut, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const PublicNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { setCurrentView } = useApp();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleDashboardNavigation = (event: CustomEvent) => {
      setCurrentView(event.detail);
    };

    const handlePasswordResetNavigation = () => {
      setCurrentView('password-reset');
    };

    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      
      if (type === 'recovery') {
        setCurrentView('auth-reset-password');
      } else {
        setCurrentView('auth-callback');
      }
    };

    window.addEventListener('navigate-to-dashboard', handleDashboardNavigation as EventListener);
    window.addEventListener('navigate-to-password-reset', handlePasswordResetNavigation);
    
    // Check for auth callback on page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') && (urlParams.get('type') === 'email' || urlParams.get('type') === 'recovery')) {
      handleAuthCallback();
    }

    return () => {
      window.removeEventListener('navigate-to-dashboard', handleDashboardNavigation as EventListener);
      window.removeEventListener('navigate-to-password-reset', handlePasswordResetNavigation);
    };
  }, [setCurrentView]);

  const navigationItems = [
    { label: 'Events', view: 'event-discovery' as const, icon: Calendar },
    { label: 'Speakers', view: 'speaker-directory' as const, icon: Users },
    { label: 'Sponsors', view: 'sponsor-directory' as const, icon: Award },
    { label: 'Blog', view: 'blog' as const, icon: BookOpen },
    { label: 'About', view: 'about' as const, icon: Info },
    { label: 'Contact', view: 'contact' as const, icon: Phone },
  ];

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated && user) {
      switch (profile?.role) {
        case 'attendee':
          setCurrentView('attendee-dashboard');
          break;
        case 'organizer':
          setCurrentView('organizer-dashboard');
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

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
  };
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md bg-opacity-90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer md:order-1"
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
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.name}</span>
                  </button>
                  
                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                      <button
                        onClick={handleAuthAction}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
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
                onClick={toggleMobileMenu}
                className="text-white hover:text-indigo-200 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100 transform translate-y-0'
              : 'max-h-0 opacity-0 overflow-hidden transform -translate-y-2'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-700 bg-opacity-80 backdrop-blur-md rounded-xl mt-2 shadow-xl border border-white/10">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavigation(item.view)}
                    className="mobile-nav-item flex items-center space-x-3 text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="border-t border-indigo-500 pt-3 mt-3">
                <button
                  onClick={() => handleNavigation('pricing')}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                >
                  Pricing
                </button>
                {isAuthenticated && user ? (
                  <>
                    <div className="mobile-nav-item flex items-center space-x-2 text-white px-4 py-3">
                      <User className="w-4 h-4" />
                      <span className="text-base font-medium">{profile?.full_name || user?.email}</span>
                    </div>
                    <button
                      onClick={handleAuthAction}
                      className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="mobile-nav-item flex items-center space-x-3 text-white hover:text-red-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-red-500/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuthAction}
                    className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                  >
                    Sign In
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
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default PublicNavigation;