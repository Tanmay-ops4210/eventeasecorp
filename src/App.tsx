import React, { Suspense, lazy } from 'react'; // Import Suspense and lazy
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import './index.css';
import './components/chart-styles.css';
import { Loader2 } from 'lucide-react'; // Import a loading icon

// --- Layout Components ---
import PublicNavigation from './components/layout/PublicNavigation';
import AttendeeNavigation from './components/layout/AttendeeNavigation';
import OrganizerNavigation from './components/layout/OrganizerNavigation';
import SponsorNavigation from './components/layout/SponsorNavigation';
import AdminNavigation from './components/layout/AdminNavigation';
import Breadcrumbs from './components/layout/Breadcrumbs';

// --- Lazy-loaded Page Components ---
const HomePage = lazy(() => import('./components/pages/HomePage'));
const EventDiscoveryPage = lazy(() => import('./components/pages/EventDiscoveryPage'));
const SpeakerDirectoryPage = lazy(() => import('./components/speakers/SpeakerDirectoryPage'));
const SponsorDirectoryPage = lazy(() => import('./components/sponsors/SponsorDirectoryPage'));
const OrganizerDirectoryPage = lazy(() => import('./components/pages/OrganizerDirectoryPage'));
const BlogPage = lazy(() => import('./components/blog/BlogPage'));
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
const EmailVerificationCallback = lazy(() => import('./components/auth/EmailVerificationCallback'));
const PasswordResetCallback = lazy(() => import('./components/auth/PasswordResetCallback'));
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
const OrganizerDashboard = lazy(() => import('./components/organizer/RealOrganizerDashboard'));
const EventBuilderPage = lazy(() => import('./components/organizer/RealEventBuilderPage'));
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

// Real Organizer Components
const RealMyEventsPage = lazy(() => import('./components/organizer/RealMyEventsPage'));

const SponsorDashboard = lazy(() => import('./components/sponsor/SponsorDashboard'));
const BoothCustomizationPage = lazy(() => import('./components/sponsor/BoothCustomizationPage'));
const LeadCapturePage = lazy(() => import('./components/sponsor/LeadCapturePage'));
const SponsorAnalyticsPage = lazy(() => import('./components/sponsor/SponsorAnalyticsPage'));
const SponsorToolsPage = lazy(() => import('./components/sponsor/SponsorToolsPage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard.tsx'));
const EventOversightPage = lazy(() => import('./components/admin/EventOversightPage.tsx'));
const ContentManagementPage = lazy(() => import('./components/admin/ContentManagementPage'));


// A loading spinner component to show while pages are being lazy-loaded.
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
                case 'sponsor': return <SponsorNavigation />;
                case 'admin': return <AdminNavigation />;
                default: return <PublicNavigation />;
            }
        }
        return <PublicNavigation />;
    };

    const renderPage = () => {
        const hasRole = (roles: string[]) => isAuthenticated && user && profile && roles.includes(profile.role);

        switch (currentView) {
            // --- Public Views ---
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
            case 'event-payment': return <EventPaymentPage />;
            case 'event-payment-success': return <EventPaymentSuccess />;
            case 'password-reset': return <PasswordResetPage />;
            case 'auth-callback': return <EmailVerificationCallback />;
            case 'auth-reset-password': return <PasswordResetCallback />;

            // --- Authenticated Views ---
            // Attendee
            case 'attendee-dashboard': return hasRole(['attendee']) ? <AttendeeDashboard /> : <HomePage />;
            case 'my-network': return hasRole(['attendee']) ? <MyNetworkPage /> : <HomePage />;
            case 'attendee-profile': return hasRole(['attendee']) ? <AttendeeProfilePage /> : <HomePage />;
            case 'agenda-builder': return hasRole(['attendee']) ? <AgendaBuilderPage /> : <HomePage />;
            case 'networking-hub': return hasRole(['attendee']) ? <NetworkingHubPage /> : <HomePage />;
            case 'live-event': return hasRole(['attendee']) ? <LiveEventPage /> : <HomePage />;
            case 'session-room': return hasRole(['attendee']) ? <SessionRoomPage /> : <HomePage />;
            case 'expo-hall': return hasRole(['attendee']) ? <ExpoHallPage /> : <HomePage />;
            case 'resource-library': return hasRole(['attendee']) ? <ResourceLibraryPage /> : <HomePage />;
            
            // Organizer
            case 'organizer-dashboard': return hasRole(['organizer']) ? <OrganizerDashboard /> : <HomePage />;
            case 'event-builder': return hasRole(['organizer']) ? <EventBuilderPage /> : <HomePage />;
            case 'analytics': return hasRole(['organizer']) ? <AnalyticsPage /> : <HomePage />;
            case 'organizer-settings': return hasRole(['organizer']) ? <OrganizerSettingsPage /> : <HomePage />;
            case 'event-settings': return hasRole(['organizer']) ? <EventSettingsPage /> : <HomePage />;
            case 'landing-customizer': return hasRole(['organizer']) ? <LandingCustomizerPage /> : <HomePage />;
            case 'agenda-manager': return hasRole(['organizer']) ? <AgendaManagerPage /> : <HomePage />;
            case 'venue-manager': return hasRole(['organizer']) ? <VenueManagerPage /> : <HomePage />;
            case 'ticketing': return hasRole(['organizer']) ? <TicketingPage /> : <HomePage />;
            case 'discount-codes': return hasRole(['organizer']) ? <DiscountCodesPage /> : <HomePage />;
            case 'email-campaigns': return hasRole(['organizer']) ? <EmailCampaignsPage /> : <HomePage />;
            case 'attendee-management': return hasRole(['organizer']) ? <AttendeeManagementPage /> : <HomePage />;
            case 'speaker-portal': return hasRole(['organizer']) ? <SpeakerPortalPage /> : <HomePage />;
            case 'staff-roles': return hasRole(['organizer']) ? <StaffRolesPage /> : <HomePage />;

            // Sponsor
            case 'sponsor-dashboard': return hasRole(['sponsor']) ? <SponsorDashboard /> : <HomePage />;
            case 'booth-customization': return hasRole(['sponsor']) ? <BoothCustomizationPage /> : <HomePage />;
            case 'lead-capture': return hasRole(['sponsor']) ? <LeadCapturePage /> : <HomePage />;
            case 'sponsor-analytics': return hasRole(['sponsor']) ? <SponsorAnalyticsPage /> : <HomePage />;
            case 'sponsor-tools': return hasRole(['sponsor']) ? <SponsorToolsPage /> : <HomePage />;

            // Shared (Multi-Role)
            case 'my-events': return hasRole(['organizer']) ? <RealMyEventsPage /> : <HomePage />;
            case 'notifications': return hasRole(['attendee', 'organizer', 'sponsor']) ? <NotificationsPage /> : <HomePage />;

            // Default fallback
            default:
                return <HomePage />;
        }
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
                <Suspense fallback={<LoadingFallback />}>
                    {renderPage()}
                </Suspense>
            </main>
        </div>
    );
};

function App() {
    return (
        <AppProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </AppProvider>
    );
}

export default App;