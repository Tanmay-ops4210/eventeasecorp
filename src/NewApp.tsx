import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/NewAuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import './index.css';
import './components/chart-styles.css';
import { Loader2 } from 'lucide-react';

// --- Layout Components ---
import NewPublicNavigation from './components/layout/NewPublicNavigation';
import AttendeeNavigation from './components/layout/AttendeeNavigation';
import OrganizerNavigation from './components/layout/OrganizerNavigation';
import AdminNavigation from './components/layout/AdminNavigation';
import Breadcrumbs from './components/layout/Breadcrumbs';

// --- Lazy-loaded Page Components ---
const NewHomePage = lazy(() => import('./components/pages/NewHomePage'));
const EventDiscoveryPage = lazy(() => import('./components/pages/EventDiscoveryPage'));
const SpeakerDirectoryPage = lazy(() => import('./components/speakers/SpeakerDirectoryPage'));
const OrganizerDirectoryPage = lazy(() => import('./components/pages/OrganizerDirectoryPage'));
const BlogPage = lazy(() => import('./components/blog/BlogContainer'));
const EventDetailPage = lazy(() => import('./components/events/EventDetailPage'));
const EventPaymentPage = lazy(() => import('./components/events/EventPaymentPage'));
const EventPaymentSuccess = lazy(() => import('./components/events/EventPaymentSuccess'));
const ResourcesPage = lazy(() => import('./components/pages/ResourcesPage'));
const PressPage = lazy(() => import('./components/pages/PressPage'));
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const PricingPage = lazy(() => import('./components/pages/PricingPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const TermsPage = lazy(() => import('./components/pages/TermsPage'));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage'));
const PasswordResetPage = lazy(() => import('./components/auth/PasswordResetPage'));
const SimplePasswordReset = lazy(() => import('./components/auth/SimplePasswordReset'));

// Attendee Components
const AttendeeDashboard = lazy(() => import('./components/attendee/AttendeeDashboard'));
const MyEventsPage = lazy(() => import('./components/attendee/MyEventsPage'));
const MyNetworkPage = lazy(() => import('./components/attendee/MyNetworkPage'));
const NotificationsPage = lazy(() => import('./components/attendee/NotificationsPage'));
const AttendeeProfilePage = lazy(() => import('./components/attendee/AttendeeProfilePage'));
const AgendaBuilderPage = lazy(() => import('./components/attendee/AgendaBuilderPage'));
const NetworkingHubPage = lazy(() => import('./components/attendee/NetworkingHubPage'));
const LiveEventPage = lazy(() => import('./components/attendee/LiveEventPage'));
const SessionRoomPage = lazy(() => import('./components/attendee/SessionRoomPage'));
const ExpoHallPage = lazy(() => import('./components/attendee/ExpoHallPage'));
const ResourceLibraryPage = lazy(() => import('./components/attendee/ResourceLibraryPage'));

// Organizer Components
const OrganizerDashboard = lazy(() => import('./components/organizer/OrganizerDashboard'));
const EventBuilderPage = lazy(() => import('./components/organizer/EventBuilderPage'));
const EventSettingsPage = lazy(() => import('./components/organizer/EventSettingsPage'));
const LandingCustomizerPage = lazy(() => import('./components/organizer/LandingCustomizerPage'));
const AgendaManagerPage = lazy(() => import('./components/organizer/AgendaManagerPage'));
const VenueManagerPage = lazy(() => import('./components/organizer/VenueManagerPage'));
const TicketingPage = lazy(() => import('./components/organizer/RealTicketingPage'));
const DiscountCodesPage = lazy(() => import('./components/organizer/DiscountCodesPage'));
const EmailCampaignsPage = lazy(() => import('./components/organizer/RealEmailCampaignsPage'));
const AttendeeManagementPage = lazy(() => import('./components/organizer/RealAttendeeManagementPage'));
const SpeakerPortalPage = lazy(() => import('./components/organizer/SpeakerPortalPage'));
const StaffRolesPage = lazy(() => import('./components/organizer/StaffRolesPage'));
const AnalyticsPage = lazy(() => import('./components/organizer/RealAnalyticsPage'));
const OrganizerSettingsPage = lazy(() => import('./components/organizer/OrganizerSettingsPage'));
const RealMyEventsPage = lazy(() => import('./components/organizer/MyEventsPage'));

// Admin Components
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const EventOversightPage = lazy(() => import('./components/admin/EventOversightPage'));
const ContentManagementPage = lazy(() => import('./components/admin/ContentManagementPage'));

// Simple Pages
const SimplePricingPage = lazy(() => import('./components/pages/SimplePricingPage'));

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { currentView, selectedEventId } = useApp();

  const renderNavigation = () => {
    if (isAuthenticated && user && profile) {
      switch (profile.role) {
        case 'attendee': return <AttendeeNavigation />;
        case 'organizer': return <OrganizerNavigation />;
        case 'admin': return <AdminNavigation />;
        default: return <NewPublicNavigation />;
      }
    }
    return <NewPublicNavigation />;
  };

  const renderPage = () => {
    const hasRole = (roles: string[]) => isAuthenticated && user && profile && roles.includes(profile.role || 'attendee');

    switch (currentView) {
      // --- Public Views ---
      case 'home': return <NewHomePage />;
      case 'event-discovery': return <EventDiscoveryPage />;
      case 'speaker-directory': return <SpeakerDirectoryPage />;
      case 'organizer-directory': return <OrganizerDirectoryPage />;
      case 'blog': return <BlogPage isStandalone={true} />;
      case 'resources': return <ResourcesPage />;
      case 'press': return <PressPage />;
      case 'about': return <AboutPage />;
      case 'pricing': return <SimplePricingPage />;
      case 'contact': return <ContactPage />;
      case 'terms': return <TermsPage />;
      case 'privacy': return <PrivacyPage />;
      case 'event-page': return <EventDetailPage eventId={selectedEventId || '1'} />;
      case 'event-payment': return <EventPaymentPage />;
      case 'event-payment-success': return <EventPaymentSuccess />;
      case 'password-reset': return <SimplePasswordReset />;

      // --- Authenticated Views ---
      // Attendee
      case 'attendee-dashboard': return hasRole(['attendee']) ? <AttendeeDashboard /> : <NewHomePage />;
      case 'my-network': return hasRole(['attendee']) ? <MyNetworkPage /> : <NewHomePage />;
      case 'attendee-profile': return hasRole(['attendee']) ? <AttendeeProfilePage /> : <NewHomePage />;
      case 'agenda-builder': return hasRole(['attendee']) ? <AgendaBuilderPage /> : <NewHomePage />;
      case 'networking-hub': return hasRole(['attendee']) ? <NetworkingHubPage /> : <NewHomePage />;
      case 'live-event': return hasRole(['attendee']) ? <LiveEventPage /> : <NewHomePage />;
      case 'session-room': return hasRole(['attendee']) ? <SessionRoomPage /> : <NewHomePage />;
      case 'expo-hall': return hasRole(['attendee']) ? <ExpoHallPage /> : <NewHomePage />;
      case 'resource-library': return hasRole(['attendee']) ? <ResourceLibraryPage /> : <NewHomePage />;
      
      // Organizer
      case 'organizer-dashboard': return hasRole(['organizer']) ? <OrganizerDashboard /> : <NewHomePage />;
      case 'event-builder': return hasRole(['organizer']) ? <EventBuilderPage /> : <NewHomePage />;
      case 'analytics': return hasRole(['organizer']) ? <AnalyticsPage /> : <NewHomePage />;
      case 'organizer-settings': return hasRole(['organizer']) ? <OrganizerSettingsPage /> : <NewHomePage />;
      case 'event-settings': return hasRole(['organizer']) ? <EventSettingsPage /> : <NewHomePage />;
      case 'landing-customizer': return hasRole(['organizer']) ? <LandingCustomizerPage /> : <NewHomePage />;
      case 'agenda-manager': return hasRole(['organizer']) ? <AgendaManagerPage /> : <NewHomePage />;
      case 'venue-manager': return hasRole(['organizer']) ? <VenueManagerPage /> : <NewHomePage />;
      case 'ticketing': return hasRole(['organizer']) ? <TicketingPage /> : <NewHomePage />;
      case 'discount-codes': return hasRole(['organizer']) ? <DiscountCodesPage /> : <NewHomePage />;
      case 'email-campaigns': return hasRole(['organizer']) ? <EmailCampaignsPage /> : <NewHomePage />;
      case 'attendee-management': return hasRole(['organizer']) ? <AttendeeManagementPage /> : <NewHomePage />;
      case 'speaker-portal': return hasRole(['organizer']) ? <SpeakerPortalPage /> : <NewHomePage />;
      case 'staff-roles': return hasRole(['organizer']) ? <StaffRolesPage /> : <NewHomePage />;

      // Admin
      case 'admin-dashboard': return hasRole(['admin']) ? <AdminDashboard /> : <NewHomePage />;
      case 'user-management': return hasRole(['admin']) ? <AdminDashboard /> : <NewHomePage />;
      case 'event-oversight': return hasRole(['admin']) ? <EventOversightPage /> : <NewHomePage />;
      case 'content-management': return hasRole(['admin']) ? <ContentManagementPage /> : <NewHomePage />;

      // Shared (Multi-Role)
      case 'my-events': return hasRole(['organizer']) ? <RealMyEventsPage /> : <NewHomePage />;
      case 'notifications': return hasRole(['attendee', 'organizer']) ? <NotificationsPage /> : <NewHomePage />;

      // Default fallback
      default:
        return <NewHomePage />;
    }
  };

  const isPublicView = [
    'home', 'event-discovery', 'speaker-directory', 'organizer-directory', 
    'blog', 'resources', 'press', 'about', 'pricing', 'contact', 'terms', 
    'privacy', 'password-reset', 'event-page'
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {!isPublicView && <Breadcrumbs />}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
};

function NewApp() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default NewApp;
