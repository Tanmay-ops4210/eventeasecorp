import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import PublicNavigation from './PublicNavigation';
import AttendeeNavigation from './AttendeeNavigation';
import OrganizerNavigation from './OrganizerNavigation';
import AdminNavigation from './AdminNavigation';
import Breadcrumbs from './Breadcrumbs';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { currentView } = useApp();

  const renderNavigation = () => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'attendee':
          return <AttendeeNavigation />;
        case 'organizer':
          return <OrganizerNavigation />;
        case 'admin':
          return <AdminNavigation />;
        default:
          return <PublicNavigation />;
      }
    }
    return <PublicNavigation />;
  };

  const isPublicView = [
    'home', 'event-discovery', 'speaker-directory', 'sponsor-directory',
    'organizer-directory', 'blog', 'resources', 'press', 'about',
    'pricing', 'contact', 'terms', 'privacy', 'password-reset', 'event-page'
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {!isPublicView && <Breadcrumbs />}
      <main>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
