import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { UserRole } from './types/user';
import './index.css';
import './components/chart-styles.css';

// --- Layout Components ---
// These components handle the main structure and navigation of the app.
import PublicNavigation from './components/layout/PublicNavigation';
import AttendeeNavigation from './components/layout/AttendeeNavigation';
import OrganizerNavigation from './components/layout/OrganizerNavigation';
import SponsorNavigation from './components/layout/SponsorNavigation';
import AdminNavigation from './components/layout/AdminNavigation';
import Breadcrumbs from './components/layout/Breadcrumbs';

// --- Page Components ---
// These are the individual pages of your application.
// For simplicity and to ensure functionality, we are importing them directly.
import HomePage from './components/pages/HomePage';
import EventDiscoveryPage from './components/pages/EventDiscoveryPage';
import SpeakerDirectoryPage from './components/speakers/SpeakerDirectoryPage';
import SponsorDirectoryPage from './components/sponsors/SponsorDirectoryPage';
import OrganizerDirectoryPage from './components/pages/OrganizerDirectoryPage';
import BlogPage from './components/blog/BlogPage';
import EventDetailPage from './components/events/EventDetailPage';
import EventPaymentPage from './components/events/EventPaymentPage';
import EventPaymentSuccess from './components/events/EventPaymentSuccess';
import ResourcesPage from './components/pages/ResourcesPage';
import PressPage from './components/pages/PressPage';
import AboutPage from './components/pages/AboutPage';
import PricingPage from './components/pages/PricingPage';
import ContactPage from './components/pages/ContactPage';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import PasswordResetPage from './components/auth/PasswordResetPage';
import AttendeeDashboard from './components/attendee/AttendeeDashboard';
import MyEventsPage from './components/attendee/MyEventsPage';
import MyNetworkPage from './components/attendee/MyNetworkPage';
import NotificationsPage from './components/attendee/NotificationsPage';
import AttendeeProfilePage from './components/attendee/AttendeeProfilePage';
import AgendaBuilderPage from './components/attendee/AgendaBuilderPage';
import NetworkingHubPage from './components/attendee/NetworkingHubPage';
import LiveEventPage from './components/attendee/LiveEventPage';
import SessionRoomPage from './components/attendee/SessionRoomPage';
import ExpoHallPage from './components/attendee/ExpoHallPage';
import ResourceLibraryPage from './components/attendee/ResourceLibraryPage';
import OrganizerDashboard from './components/organizer/OrganizerDashboard';
import EventBuilderPage from './components/organizer/EventBuilderPage';
import EventSettingsPage from './components/organizer/EventSettingsPage';
import LandingCustomizerPage from './components/organizer/LandingCustomizerPage';
import AgendaManagerPage from './components/organizer/AgendaManagerPage';
import VenueManagerPage from './components/organizer/VenueManagerPage';
import TicketingPage from './components/organizer/TicketingPage';
import DiscountCodesPage from './components/organizer/DiscountCodesPage';
import EmailCampaignsPage from './components/organizer/EmailCampaignsPage';
import AttendeeManagementPage from './components/organizer/AttendeeManagementPage';
import SpeakerPortalPage from './components/organizer/SpeakerPortalPage';
import StaffRolesPage from './components/organizer/StaffRolesPage';
import AnalyticsPage from './components/organizer/AnalyticsPage';
import OrganizerSettingsPage from './components/organizer/OrganizerSettingsPage';
import SponsorDashboard from './components/sponsor/SponsorDashboard';
import BoothCustomizationPage from './components/sponsor/BoothCustomizationPage';
import LeadCapturePage from './components/sponsor/LeadCapturePage';
import SponsorAnalyticsPage from './components/sponsor/SponsorAnalyticsPage';
import SponsorToolsPage from './components/sponsor/SponsorToolsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagementPage from './components/admin/UserManagementPage';
import EventOversightPage from './components/admin/EventOversightPage';
import ContentManagementPage from './components/admin/ContentManagementPage';

/**
 * AppContent Component
 * This component is the core of the application's UI. It determines which
 * navigation bar and which page to display based on the user's authentication
 * status and the current view selected in the application's state.
 */
const AppContent: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { currentView, selectedEventId } = useApp();

    /**
     * Renders the appropriate navigation component based on the user's role.
     * @returns {React.ReactNode} The navigation component.
     */
    const renderNavigation = () => {
        if (isAuthenticated && user) {
            switch (user.role) {
                case 'attendee': return <AttendeeNavigation />;
                case 'organizer': return <OrganizerNavigation />;
                case 'sponsor': return <SponsorNavigation />;
                case 'admin': return <AdminNavigation />;
                default: return <PublicNavigation />;
            }
        }
        return <PublicNavigation />;
    };

    /**
     * Determines which page component to render based on the currentView state.
     * It also handles role-based access control for protected routes.
     * @returns {React.ReactNode} The page component to render.
     */
    const renderPage = () => {
        const hasRole = (roles: UserRole[]) => isAuthenticated && user && roles.includes(user.role);

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

            // Admin
            case 'admin-dashboard': return hasRole(['admin']) ? <AdminDashboard /> : <HomePage />;
            case 'user-management': return hasRole(['admin']) ? <UserManagementPage /> : <HomePage />;
            case 'event-oversight': return hasRole(['admin']) ? <EventOversightPage /> : <HomePage />;
            case 'content-management': return hasRole(['admin']) ? <ContentManagementPage /> : <HomePage />;

            // Shared (Multi-Role)
            case 'my-events': return hasRole(['attendee', 'organizer']) ? <MyEventsPage /> : <HomePage />;
            case 'notifications': return hasRole(['attendee', 'organizer', 'sponsor', 'admin']) ? <NotificationsPage /> : <HomePage />;

            // Default fallback
            default:
                return <HomePage />;
        }
    };

    // Determines if the current view is a public page to decide whether to show breadcrumbs.
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
                {renderPage()}
            </main>
        </div>
    );
};

/**
 * App Component (Root)
 * This is the main entry point of the application. It wraps the entire
 * app with the necessary context providers for state management.
 */
function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
