import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

// Import all pages
import HomePage from '../pages/HomePage';
import EventDiscoveryPage from '../pages/EventDiscoveryPage';
import SpeakerDirectoryPage from '../speakers/SpeakerDirectoryPage';
import SponsorDirectoryPage from '../sponsors/SponsorDirectoryPage';
import OrganizerDirectoryPage from '../pages/OrganizerDirectoryPage';
import BlogPage from '../blog/BlogPage';
import EventDetailPage from '../events/EventDetailPage';
import ResourcesPage from '../pages/ResourcesPage';
import PressPage from '../pages/PressPage';
import AboutPage from '../pages/AboutPage';
import PricingPage from '../pages/PricingPage';
import ContactPage from '../pages/ContactPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import PasswordResetPage from '../auth/PasswordResetPage';
import AttendeeDashboard from '../attendee/AttendeeDashboard';
import MyEventsPage from '../attendee/MyEventsPage';
import MyNetworkPage from '../attendee/MyNetworkPage';
import NotificationsPage from '../attendee/NotificationsPage';
import AttendeeProfilePage from '../attendee/AttendeeProfilePage';
import AgendaBuilderPage from '../attendee/AgendaBuilderPage';
import NetworkingHubPage from '../attendee/NetworkingHubPage';
import LiveEventPage from '../attendee/LiveEventPage';
import SessionRoomPage from '../attendee/SessionRoomPage';
import ExpoHallPage from '../attendee/ExpoHallPage';
import ResourceLibraryPage from '../attendee/ResourceLibraryPage';
import OrganizerDashboard from '../organizer/OrganizerDashboard';
import EventBuilderPage from '../organizer/EventBuilderPage';
import EventSettingsPage from '../organizer/EventSettingsPage';
import LandingCustomizerPage from '../organizer/LandingCustomizerPage';
import AgendaManagerPage from '../organizer/AgendaManagerPage';
import VenueManagerPage from '../organizer/VenueManagerPage';
import TicketingPage from '../organizer/TicketingPage';
import DiscountCodesPage from '../organizer/DiscountCodesPage';
import EmailCampaignsPage from '../organizer/EmailCampaignsPage';
import AttendeeManagementPage from '../organizer/AttendeeManagementPage';
import SpeakerPortalPage from '../organizer/SpeakerPortalPage';
import StaffRolesPage from '../organizer/StaffRolesPage';
import AnalyticsPage from '../organizer/AnalyticsPage';
import OrganizerSettingsPage from '../organizer/OrganizerSettingsPage';
import SponsorDashboard from '../sponsor/SponsorDashboard';
import BoothCustomizationPage from '../sponsor/BoothCustomizationPage';
import LeadCapturePage from '../sponsor/LeadCapturePage';
import SponsorToolsPage from '../sponsor/SponsorToolsPage';
import AdminDashboard from '../admin/AdminDashboard';
import UserManagementPage from '../admin/UserManagementPage';
import EventOversightPage from '../admin/EventOversightPage';
import MonetizationPage from '../admin/MonetizationPage';
import ContentManagementPage from '../admin/ContentManagementPage';
import SystemHealthPage from '../admin/SystemHealthPage';

const AppRouter: React.FC = () => {
  const { currentView, selectedEventId } = useApp();
  const { user, isAuthenticated } = useAuth();

  const requiresRole = (component: React.ReactNode, requiredRole: UserRole) => {
    if (!isAuthenticated || user?.role !== requiredRole) {
      // Redirect to home if not authenticated or wrong role
      return <HomePage />;
    }
    return component;
  };

  switch (currentView) {
    // Public Module
    case 'home': return <HomePage />;
    case 'event-discovery': return <EventDiscoveryPage />;
    case 'speaker-directory': return <SpeakerDirectoryPage />;
    case 'sponsor-directory': return <SponsorDirectoryPage />;
    case 'organizer-directory': return <OrganizerDirectoryPage />;
    case 'blog': return <BlogPage />;
    case 'resources': return <ResourcesPage />;
    case 'press': return <PressPage />;
    case 'about': return <AboutPage />;
    case 'pricing': return <PricingPage />;
    case 'contact': return <ContactPage />;
    case 'terms': return <TermsPage />;
    case 'privacy': return <PrivacyPage />;
    case 'event-page': return <EventDetailPage eventId={selectedEventId || '1'} />;

    // Auth Pages
    case 'password-reset': return <PasswordResetPage />;

    // Attendee Module
    case 'attendee-dashboard': return requiresRole(<AttendeeDashboard />, 'attendee');
    case 'my-events': return requiresRole(<MyEventsPage />, 'attendee');
    case 'my-network': return requiresRole(<MyNetworkPage />, 'attendee');
    case 'notifications': return requiresRole(<NotificationsPage />, 'attendee');
    case 'attendee-profile': return requiresRole(<AttendeeProfilePage />, 'attendee');
    case 'agenda-builder': return requiresRole(<AgendaBuilderPage />, 'attendee');
    case 'networking-hub': return requiresRole(<NetworkingHubPage />, 'attendee');
    case 'live-event': return requiresRole(<LiveEventPage />, 'attendee');
    case 'session-room': return requiresRole(<SessionRoomPage />, 'attendee');
    case 'expo-hall': return requiresRole(<ExpoHallPage />, 'attendee');
    case 'resource-library': return requiresRole(<ResourceLibraryPage />, 'attendee');

    // Organizer Module
    case 'organizer-dashboard': return requiresRole(<OrganizerDashboard />, 'organizer');
    case 'event-builder': return requiresRole(<EventBuilderPage />, 'organizer');
    case 'analytics': return requiresRole(<AnalyticsPage />, 'organizer');
    case 'organizer-settings': return requiresRole(<OrganizerSettingsPage />, 'organizer');
    // Add other organizer pages here...

    // Sponsor Module
    case 'sponsor-dashboard': return requiresRole(<SponsorDashboard />, 'sponsor');
    // Add other sponsor pages here...

    // Admin Module
    case 'admin-dashboard': return requiresRole(<AdminDashboard />, 'admin');
    case 'user-management': return requiresRole(<UserManagementPage />, 'admin');
    case 'event-oversight': return requiresRole(<EventOversightPage />, 'admin');
    case 'monetization': return requiresRole(<MonetizationPage />, 'admin');
    case 'content-management': return requiresRole(<ContentManagementPage />, 'admin');
    case 'system-health': return requiresRole(<SystemHealthPage />, 'admin');

    default:
      return <HomePage />;
  }
};

export default AppRouter;
