import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Users, Calendar, FileText, Settings,
  LogOut, Menu, X, User, Bell, Shield, ChevronDown, BarChart3
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/admin-panel.css';

interface AdminNavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarExpanded: boolean;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarExpanded
}) => {
  const { setCurrentView } = useApp();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      label: 'Dashboard',
      view: 'admin-dashboard' as const,
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      label: 'User Management',
      view: 'user-management' as const,
      icon: Users,
      description: 'Manage Users & Roles'
    },
    {
      label: 'Event Oversight',
      view: 'event-oversight' as const,
      icon: Calendar,
      description: 'Monitor Events'
    },
    {
      label: 'Content Management',
      view: 'content-management' as const,
      icon: FileText,
      description: 'Site Content & Pages'
    },
  ];

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`admin-sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarExpanded ? 'expanded' : ''}`}>
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          <div className="admin-logo-container">
            <div className="admin-logo">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="admin-logo-text">EventEase</div>
              <div className="admin-badge">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-title">Main Navigation</div>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavigation(item.view)}
                  className="admin-nav-item w-full text-left"
                >
                  <IconComponent className="admin-nav-icon" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="admin-nav-section">
            <div className="admin-nav-title">System</div>
            <button
              onClick={() => handleNavigation('notifications')}
              className="admin-nav-item w-full text-left"
            >
              <div className="relative">
                <Bell className="admin-nav-icon" />
                <div className="admin-notification-dot"></div>
              </div>
              <div>
                <div>Notifications</div>
                <div className="text-xs opacity-75">System Alerts</div>
              </div>
            </button>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="admin-user-profile">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <User className="w-5 h-5" />
            </div>
            <div className="admin-user-details">
              <h4>{user?.name}</h4>
              <p>{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="admin-btn admin-btn-secondary w-full mt-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminNavigation;
