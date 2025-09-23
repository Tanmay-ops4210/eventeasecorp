import React, { useState } from 'react';
import { 
  Home, Store, Users, BarChart3, MessageCircle, Settings, 
  LogOut, Menu, X, User, Bell, ChevronDown
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const SponsorNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { setCurrentView } = useApp();
  const { user, profile, logout } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', view: 'sponsor-dashboard' as const, icon: Home },
    { label: 'Virtual Booth', view: 'booth-customization' as const, icon: Store },
    { label: 'Lead Capture', view: 'lead-capture' as const, icon: Users },
    { label: 'Analytics', view: 'sponsor-analytics' as const, icon: BarChart3 },
    { label: 'Attendee Tools', view: 'sponsor-tools' as const, icon: MessageCircle },
  ];

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer md:order-1"
            onClick={() => handleNavigation('sponsor-dashboard')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-900 font-bold text-xl">EventEase</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                Sponsor
              </span>
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
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-purple-50 rounded-lg"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('notifications')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{profile?.full_name || user?.email}</p>
                  <p className="text-gray-500 capitalize">{profile?.role || 'sponsor'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in border border-gray-200">
                  <button
                    onClick={() => handleNavigation('organizer-settings')}
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-purple-600 p-3 rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-xl mt-2 shadow-xl border border-gray-200">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavigation(item.view)}
                  className="mobile-nav-item flex items-center space-x-3 text-gray-700 hover:text-purple-600 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="mobile-nav-item flex items-center space-x-2 text-gray-700 px-4 py-3">
                <User className="w-4 h-4" />
               <span className="text-base font-medium">{profile?.full_name || user?.email}</span>
              </div>
              <button
                onClick={() => handleNavigation('notifications')}
                className="mobile-nav-item flex items-center space-x-3 text-gray-700 hover:text-purple-600 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => handleNavigation('organizer-settings')}
                className="mobile-nav-item flex items-center space-x-3 text-gray-700 hover:text-purple-600 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="mobile-nav-item flex items-center space-x-3 text-red-600 hover:text-red-700 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SponsorNavigation;