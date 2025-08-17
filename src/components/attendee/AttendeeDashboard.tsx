import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, BookOpen, Bell, ArrowRight, TrendingUp, Clock, Star } from 'lucide-react';

interface AttendeePageProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const AttendeePageNavigation: React.FC<AttendeePageProps> = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Sections</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {pages.map((page) => {
          const IconComponent = page.icon;
          return (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                currentPage === page.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <IconComponent className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{page.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const OverviewContent: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
            <p className="text-3xl font-bold text-gray-900">3</p>
          </div>
          <Calendar className="w-8 h-8 text-indigo-600" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Network Connections</p>
            <p className="text-3xl font-bold text-gray-900">47</p>
          </div>
          <Users className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Events Attended</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
          <Star className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="font-medium text-gray-900">Registered for Tech Summit 2024</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-gray-900">Connected with Sarah Johnson</p>
            <p className="text-sm text-gray-500">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EventsContent: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Events</h3>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Tech Innovation Summit 2024</h4>
        <p className="text-sm text-gray-600">March 15, 2024 • San Francisco, CA</p>
        <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Registered</span>
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Digital Marketing Conference</h4>
        <p className="text-sm text-gray-600">March 22, 2024 • New York, NY</p>
        <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Attending</span>
      </div>
    </div>
  </div>
);

const NetworkContent: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Network</h3>
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Sarah Johnson</p>
          <p className="text-sm text-gray-600">Product Manager at TechCorp</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Michael Chen</p>
          <p className="text-sm text-gray-600">Designer at Creative Studio</p>
        </div>
      </div>
    </div>
  </div>
);

const ResourcesContent: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Event Planning Guide</h4>
        <p className="text-sm text-gray-600">Complete guide to planning successful events</p>
        <button className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          Download PDF
        </button>
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Networking Best Practices</h4>
        <p className="text-sm text-gray-600">Tips for effective networking at events</p>
        <button className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          Read Article
        </button>
      </div>
    </div>
  </div>
);

const ActivityContent: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Calendar className="w-5 h-5 text-indigo-600" />
        <div>
          <p className="font-medium text-gray-900">Event registration confirmed</p>
          <p className="text-sm text-gray-500">Tech Innovation Summit 2024</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Bell className="w-5 h-5 text-blue-600" />
        <div>
          <p className="font-medium text-gray-900">New event recommendation</p>
          <p className="text-sm text-gray-500">Digital Marketing Conference</p>
        </div>
      </div>
    </div>
  </div>
);

const AttendeeDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('overview');

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
  }, [setBreadcrumbs]);

  const renderPageContent = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewContent />;
      case 'events':
        return <EventsContent />;
      case 'network':
        return <NetworkContent />;
      case 'resources':
        return <ResourcesContent />;
      case 'activity':
        return <ActivityContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">Manage your events, network, and resources</p>
        </div>
        
        <AttendeePageNavigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        
        {renderPageContent()}
      </div>
    </div>
  );
};

export default AttendeeDashboard;