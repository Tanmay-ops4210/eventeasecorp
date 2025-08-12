import React, { useState } from 'react';
import { 
  Home, Calendar, Users, Bell, User, Settings, Menu, X,
  Ticket, BookOpen
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const AttendeeNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setCurrentView } = useApp();
  const { user } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', view: 'attendee-dashboard' as const, icon: Home },
    { label: 'My Events', view: 'my-events' as const, icon: Calendar },
    { label: 'My Network', view: 'my-network' as const, icon: Users },
    { label: 'Discover Events', view: 'event-discovery' as const, icon: Ticket },
    { label: 'Resources', view: 'resource-library' as const, icon: BookOpen },
  ];

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => handleNavigation('attendee-dashboard')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-900 font-bold text-xl">EventEase</span>
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
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-indigo-50 rounded-lg"
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
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={() => handleNavigation('attendee-profile')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Profile Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavigation(item.view)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <button
                onClick={() => handleNavigation('notifications')}
                className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-indigo-50 transition-colors duration-200"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => handleNavigation('attendee-profile')}
                className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-indigo-50 transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Profile & Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AttendeeNavigation;
