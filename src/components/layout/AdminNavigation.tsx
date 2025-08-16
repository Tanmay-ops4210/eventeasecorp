import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Users, Calendar, FileText, Settings,
  LogOut, Menu, X, User, Bell, Shield, ChevronDown
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setCurrentView } = useApp();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { label: 'Dashboard', view: 'admin-dashboard' as const, icon: Home },
    { label: 'User Management', view: 'user-management' as const, icon: Users },
    { label: 'Event Oversight', view: 'event-oversight' as const, icon: Calendar },
    { label: 'Content Management', view: 'content-management' as const, icon: FileText },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer order-1"
            onClick={() => handleNavigation('admin-dashboard')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-white font-bold text-xl">EventEase</span>
              <span className="text-xs bg-red-800 text-white px-2 py-1 rounded-full font-medium">
                Admin
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
                    className="flex items-center space-x-2 text-white hover:text-red-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Section with Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('notifications')}
              className="p-2 text-white hover:text-red-200 transition-colors duration-200 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-left">
                  <p className="font-medium text-white">{user?.name}</p>
                  <p className="text-red-200 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-red-200" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
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
          <div className="md:hidden order-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-red-200 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 touch-manipulation"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-red-700/80 backdrop-blur-md rounded-xl mt-2 shadow-xl border border-white/10">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavigation(item.view)}
                  className="mobile-nav-item flex items-center space-x-3 text-white hover:text-red-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="border-t border-red-500 pt-3 mt-3">
              <div className="mobile-nav-item flex items-center space-x-2 text-white px-4 py-3">
                <User className="w-4 h-4" />
                <span className="text-base font-medium">{user?.name}</span>
              </div>
              <button
                onClick={() => handleNavigation('notifications')}
                className="mobile-nav-item flex items-center space-x-3 text-white hover:text-red-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => handleNavigation('organizer-settings')}
                className="mobile-nav-item flex items-center space-x-3 text-white hover:text-red-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="mobile-nav-item flex items-center space-x-3 text-white hover:text-red-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 touch-manipulation"
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

export default AdminNavigation;
