import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { db, AppUser, Event } from '../../lib/supabase';
import { 
    Users, Calendar, FileText, TrendingUp, Activity, 
    ArrowUp, BarChart3, Menu, X, LogOut, Loader2 
} from 'lucide-react';

// Import all necessary components
import AdminNavigation from '../layout/AdminNavigation';
import MemberManagement from './MemberManagement';
import EventManagement from './EventManagement';
import EventOversightPage from './EventOversightPage';
import ContentManagementPage from './ContentManagementPage';
import '../../styles/admin-panel.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const { setBreadcrumbs } = useApp();
    const { user } = useAuth();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // This state now controls which full page is shown.
    const [currentView, setCurrentView] = useState('dashboard');

    const fetchData = async () => {
        setIsLoading(true);
        const usersResponse = await db.getAllUsers();
        const eventsResponse = await db.getAllEvents(); // Using the reliable db helper
        if (usersResponse.data) setUsers(usersResponse.data);
        if (eventsResponse.data) setEvents(eventsResponse.data);
        setIsLoading(false);
    };

    useEffect(() => {
        setBreadcrumbs(['Admin Panel']);
        fetchData();
    }, [setBreadcrumbs]);

    const stats = {
        totalUsers: users.length,
        totalEvents: events.length,
        activeEvents: events.filter(e => new Date(e.event_date || '') > new Date()).length,
        recentSignups: users.filter(u => {
            const signupDate = new Date(u.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return signupDate > weekAgo;
        }).length
    };
    
    const handleLogout = async () => {
        // In a real app with Supabase auth, you would call signOut here
        onLogout();
    };

    // Component to render the detailed dashboard overview
    const DashboardOverview = () => (
        <>
            <div className="admin-stats-grid">
                <div className="admin-stat-card admin-fade-in">
                    <div className="admin-stat-icon"><Users className="w-6 h-6" /></div>
                    <div className="admin-stat-value">{stats.totalUsers}</div>
                    <div className="admin-stat-label">Total Users</div>
                    <div className="admin-stat-change positive">
                        <ArrowUp className="w-3 h-3" />
                        <span>+{stats.recentSignups} this week</span>
                    </div>
                </div>
                <div className="admin-stat-card admin-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="admin-stat-icon"><Calendar className="w-6 h-6" /></div>
                    <div className="admin-stat-value">{stats.totalEvents}</div>
                    <div className="admin-stat-label">Total Events</div>
                    <div className="admin-stat-change positive">
                        <ArrowUp className="w-3 h-3" />
                        <span>{stats.activeEvents} active</span>
                    </div>
                </div>
                <div className="admin-stat-card admin-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="admin-stat-icon"><TrendingUp className="w-6 h-6" /></div>
                    <div className="admin-stat-value">{Math.round((stats.activeEvents / Math.max(stats.totalEvents, 1)) * 100)}%</div>
                    <div className="admin-stat-label">Active Rate</div>
                    <div className="admin-stat-change positive">
                         <ArrowUp className="w-3 h-3" />
                        <span>Healthy growth</span>
                    </div>
                </div>
                <div className="admin-stat-card admin-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="admin-stat-icon"><Activity className="w-6 h-6" /></div>
                    <div className="admin-stat-value">{stats.recentSignups}</div>
                    <div className="admin-stat-label">New This Week</div>
                    <div className="admin-stat-change positive">
                         <ArrowUp className="w-3 h-3" />
                        <span>Growing community</span>
                    </div>
                </div>
            </div>
             <div className="admin-table-container mt-8">
                <div className="admin-card-header">
                    <h3 className="admin-card-title"><Calendar className="w-5 h-5" /> Recent Events Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Owner</th>
                                <th>Attendees</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.slice(0, 5).map((event) => (
                                <tr key={event.id}>
                                    <td><div className="font-medium">{event.event_name}</div></td>
                                    <td>{users.find(u => u.id === event.user_id)?.username || 'Unknown'}</td>
                                    <td>{event.expected_attendees}</td>
                                    <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    // This function now renders the correct full page based on the currentView state
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="admin-loading">
                    <div className="admin-spinner"></div>
                    <span>Loading dashboard data...</span>
                </div>
            );
        }

        switch (currentView) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'user-management':
                return <MemberManagement users={users} events={events} onRefresh={fetchData} />;
            case 'event-management':
                return <EventManagement users={users} events={events} onRefresh={fetchData} />;
            case 'event-oversight':
                return <EventOversightPage />;
            case 'content-management':
                return <ContentManagementPage />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="admin-layout">
            <button
                className="admin-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <AdminNavigation
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                currentView={currentView}
                setCurrentView={setCurrentView} // Pass state handlers to navigation
            />

            <main className="admin-main">
                <header className="admin-header-sticky">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                           {currentView === 'dashboard' ? `Welcome back, ${user?.name || 'Admin'}!` : currentView.replace('-', ' ')}
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                           {currentView === 'dashboard' ? "Here's what's happening with your platform today." : `Manage all platform ${currentView.replace('-', ' ')}.`}
                        </p>
                    </div>
                    <button onClick={handleLogout} className="admin-btn admin-btn-secondary">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </header>

                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
