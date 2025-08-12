import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Users, Calendar, DollarSign, FileText, Activity, Settings, 
  LogOut, Menu, X, User, Bell, Shield
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
    { label: 'Monetization', view: 'monetization' as const, icon: DollarSign },
    { label: 'Content Management', view: 'content-management' as const, icon: FileText },
    { label: 'System Health', view: 'system-health' as const, icon: Activity },
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
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
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
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-left">
                  <p className="font-medium text-white">{user?.name}</p>
                  <p className="text-red-200 capitalize">{user?.role}</p>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleNavigation('organizer-settings')}
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-red-200 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-red-700 bg-opacity-50 backdrop-blur-md rounded-lg mt-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavigation(item.view)}
                  className="flex items-center space-x-3 text-white hover:text-red-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="border-t border-red-500 pt-3 mt-3">
              <button
                onClick={() => handleNavigation('organizer-settings')}
                className="flex items-center space-x-3 text-white hover:text-red-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-white hover:text-red-200 block px-3 py-2 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200"
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
