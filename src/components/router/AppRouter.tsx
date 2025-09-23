import React, { Suspense, lazy } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { ShieldX, Loader2 } from 'lucide-react';

// --- Lazy-loaded Page Components ---
// This technique, called lazy loading, splits your code into smaller chunks.
// Pages are only downloaded by the user's browser when they are actually needed,
// which can significantly speed up the initial load time of your application.

// Public Module
const HomePage = lazy(() => import('../pages/HomePage'));
const EventDiscoveryPage = lazy(() => import('../pages/EventDiscoveryPage'));
const SpeakerDirectoryPage = lazy(() => import('../speakers/SpeakerDirectoryPage'));
const SponsorDirectoryPage = lazy(() => import('../sponsors/SponsorDirectoryPage'));
const OrganizerDirectoryPage = lazy(() => import('../pages/OrganizerDirectoryPage'));
const BlogPage = lazy(() => import('../blog/BlogPage'));
const EventDetailPage = lazy(() => import('../events/EventDetailPage'));
const ResourcesPage = lazy(() => import('../pages/ResourcesPage'));
const PressPage = lazy(() => import('../pages/PressPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));

// Auth Module
const PasswordResetPage = lazy(() => import('../auth/PasswordResetPage'));

// Attendee Module
const AttendeeDashboard = lazy(() => import('../attendee/AttendeeDashboard'));
const MyEventsPage = lazy(() => import('../attendee/MyEventsPage'));
const MyNetworkPage = lazy(() => import('../attendee/MyNetworkPage'));
const NotificationsPage = lazy(() => import('../attendee/NotificationsPage'));
const AttendeeProfilePage = lazy(() => import('../attendee/AttendeeProfilePage'));
const AgendaBuilderPage = lazy(() => import('../attendee/AgendaBuilderPage'));
const NetworkingHubPage = lazy(() => import('../attendee/NetworkingHubPage'));
const LiveEventPage = lazy(() => import('../attendee/LiveEventPage'));
const SessionRoomPage = lazy(() => import('../attendee/SessionRoomPage'));
const ExpoHallPage = lazy(() => import('../attendee/ExpoHallPage'));
const ResourceLibraryPage = lazy(() => import('../attendee/ResourceLibraryPage'));

// Organizer Module
const OrganizerDashboard = lazy(() => import('../organizer/RealOrganizerDashboard'));
const EventBuilderPage = lazy(() => import('../organizer/RealEventBuilderPage'));
const EventSettingsPage = lazy(() => import('../organizer/EventSettingsPage'));
const LandingCustomizerPage = lazy(() => import('../organizer/LandingCustomizerPage'));
const AgendaManagerPage = lazy(() => import('../organizer/AgendaManagerPage'));
const VenueManagerPage = lazy(() => import('../organizer/VenueManagerPage'));
const RealTicketingPage = lazy(() => import('../organizer/RealTicketingPage'));
const DiscountCodesPage = lazy(() => import('../organizer/DiscountCodesPage'));
const EmailCampaignsPage = lazy(() => import('../organizer/RealEmailCampaignsPage'));
const AttendeeManagementPage = lazy(() => import('../organizer/RealAttendeeManagementPage'));
const SpeakerPortalPage = lazy(() => import('../organizer/SpeakerPortalPage'));
const StaffRolesPage = lazy(() => import('../organizer/StaffRolesPage'));
const AnalyticsPage = lazy(() => import('../organizer/AnalyticsPage'));
const OrganizerSettingsPage = lazy(() => import('../organizer/OrganizerSettingsPage'));

// Sponsor Module
const SponsorDashboard = lazy(() => import('../sponsor/SponsorDashboard'));
const BoothCustomizationPage = lazy(() => import('../sponsor/BoothCustomizationPage'));
const LeadCapturePage = lazy(() => import('../sponsor/LeadCapturePage'));
const SponsorAnalyticsPage = lazy(() => import('../sponsor/SponsorAnalyticsPage'));
const SponsorToolsPage = lazy(() => import('../sponsor/SponsorToolsPage'));

// Admin Module
const AdminDashboard = lazy(() => import('../admin/AdminDashboard'));
const UserManagementPage = lazy(() => import('../admin/UserManagementPage'));
const EventOversightPage = lazy(() => import('../admin/EventOversightPage'));
const ContentManagementPage = lazy(() => import('../admin/ContentManagementPage'));


// --- Route Configuration ---
// Centralizing route definitions makes the router cleaner and easier to manage.
// Each object defines a route's path, the component to render, and access control rules.
const routes = [
  // Public Routes
  { path: 'home', component: HomePage, isPublic: true },
  { path: 'event-discovery', component: EventDiscoveryPage, isPublic: true },
  { path: 'speaker-directory', component: SpeakerDirectoryPage, isPublic: true },
  { path: 'sponsor-directory', component: SponsorDirectoryPage, isPublic: true },
  { path: 'organizer-directory', component: OrganizerDirectoryPage, isPublic: true },
  { path: 'blog', component: BlogPage, isPublic: true },
  { path: 'resources', component: ResourcesPage, isPublic: true },
  { path: 'press', component: PressPage, isPublic: true },
  { path: 'about', component: AboutPage, isPublic: true },
  { path: 'pricing', component: PricingPage, isPublic: true },
  { path: 'contact', component: ContactPage, isPublic: true },
  { path: 'terms', component: TermsPage, isPublic: true },
  { path: 'privacy', component: PrivacyPage, isPublic: true },
  { path: 'event-page', component: EventDetailPage, isPublic: true, requiresId: true },
  { path: 'password-reset', component: PasswordResetPage, isPublic: true },

  // Attendee Routes
  { path: 'attendee-dashboard', component: AttendeeDashboard, requiredRoles: ['attendee'] },
  { path: 'my-network', component: MyNetworkPage, requiredRoles: ['attendee'] },
  { path: 'attendee-profile', component: AttendeeProfilePage, requiredRoles: ['attendee'] },
  { path: 'agenda-builder', component: AgendaBuilderPage, requiredRoles: ['attendee'] },
  { path: 'networking-hub', component: NetworkingHubPage, requiredRoles: ['attendee'] },
  { path: 'live-event', component: LiveEventPage, requiredRoles: ['attendee'] },
  { path: 'session-room', component: SessionRoomPage, requiredRoles: ['attendee'] },
  { path: 'expo-hall', component: ExpoHallPage, requiredRoles: ['attendee'] },
  { path: 'resource-library', component: ResourceLibraryPage, requiredRoles: ['attendee'] },

  // Organizer Routes
  { path: 'organizer-dashboard', component: OrganizerDashboard, requiredRoles: ['organizer'] },
  { path: 'event-builder', component: EventBuilderPage, requiredRoles: ['organizer'] },
  { path: 'analytics', component: AnalyticsPage, requiredRoles: ['organizer'] },
  { path: 'organizer-settings', component: OrganizerSettingsPage, requiredRoles: ['organizer'] },
  { path: 'event-settings', component: EventSettingsPage, requiredRoles: ['organizer'] },
  { path: 'landing-customizer', component: LandingCustomizerPage, requiredRoles: ['organizer'] },
  { path: 'agenda-manager', component: AgendaManagerPage, requiredRoles: ['organizer'] },
  { path: 'venue-manager', component: VenueManagerPage, requiredRoles: ['organizer'] },
  { path: 'ticketing', component: RealTicketingPage, requiredRoles: ['organizer'] },
  { path: 'discount-codes', component: DiscountCodesPage, requiredRoles: ['organizer'] },
  { path: 'email-campaigns', component: EmailCampaignsPage, requiredRoles: ['organizer'] },
  { path: 'attendee-management', component: AttendeeManagementPage, requiredRoles: ['organizer'] },
  { path: 'speaker-portal', component: SpeakerPortalPage, requiredRoles: ['organizer'] },
  { path: 'staff-roles', component: StaffRolesPage, requiredRoles: ['organizer'] },

  // Sponsor Routes
  { path: 'sponsor-dashboard', component: SponsorDashboard, requiredRoles: ['sponsor'] },
  { path: 'booth-customization', component: BoothCustomizationPage, requiredRoles: ['sponsor'] },
  { path: 'lead-capture', component: LeadCapturePage, requiredRoles: ['sponsor'] },
  { path: 'sponsor-analytics', component: SponsorAnalyticsPage, requiredRoles: ['sponsor'] },
  { path: 'sponsor-tools', component: SponsorToolsPage, requiredRoles: ['sponsor'] },

  // Admin Routes
  { path: 'admin-dashboard', component: AdminDashboard, requiredRoles: ['admin'] },
  { path: 'user-management', component: UserManagementPage, requiredRoles: ['admin'] },
  { path: 'event-oversight', component: EventOversightPage, requiredRoles: ['admin'] },
  { path: 'content-management', component: ContentManagementPage, requiredRoles: ['admin'] },

  // Shared Routes (accessible by multiple roles)
  { path: 'my-events', component: MyEventsPage, requiredRoles: ['organizer', 'attendee'] },
  { path: 'notifications', component: NotificationsPage, requiredRoles: ['attendee', 'organizer', 'sponsor', 'admin'] },
];

// --- Helper Components ---

// A loading spinner component to show while pages are being lazy-loaded.
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
      <p className="text-lg text-gray-600">Loading Page...</p>
    </div>
  </div>
);

// A component to render when a user does not have the required role for a page.
const AccessDenied: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
      <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
    </div>
  </div>
);

// --- Main Router Component ---
const AppRouter: React.FC = () => {
  const { currentView, selectedEventId } = useApp();
  const { user, isAuthenticated } = useAuth();

  // Find the configuration for the current view
  const currentRoute = routes.find(route => route.path === currentView);

  // Determine the default dashboard based on user role
  const getDefaultDashboard = (role: UserRole) => {
    switch (role) {
      case 'attendee': return <AttendeeDashboard />;
      case 'organizer': return <OrganizerDashboard />;
      case 'sponsor': return <SponsorDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <HomePage />;
    }
  };

  // Render the appropriate component based on the route configuration
  const renderComponent = () => {
    if (!currentRoute) {
      return <HomePage />; // Fallback for unknown routes
    }

    const { component: Component, isPublic, requiredRoles, requiresId } = currentRoute;

    // Handle public routes
    if (isPublic) {
      return requiresId ? <Component eventId={selectedEventId || '1'} /> : <Component />;
    }

    // Handle protected routes
    if (!isAuthenticated || !user) {
      return <HomePage />; // Redirect unauthenticated users to home
    }

    // Check for role-based access
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      // If the user's role is not permitted, show an access denied message
      // or redirect to their default dashboard.
      return <AccessDenied />;
    }

    // Render the component for authenticated users with the correct role
    return <Component />;
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderComponent()}
    </Suspense>
  );
};

export default AppRouter;
