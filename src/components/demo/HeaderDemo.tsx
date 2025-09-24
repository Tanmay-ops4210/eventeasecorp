import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { AppProvider } from '../../contexts/AppContext';
import ResponsiveHeader from '../navigation/ResponsiveHeader';
import EventsPage from '../pages/EventsPage';
import SpeakerPage from '../pages/SpeakerPage';
import BlogPageNew from '../pages/BlogPageNew';
import ContactPageNew from '../pages/ContactPageNew';
import { useApp } from '../../contexts/AppContext';

const DemoContent: React.FC = () => {
  const { currentView } = useApp();

  const renderPage = () => {
    switch (currentView) {
      case 'event-discovery':
        return <EventsPage />;
      case 'speaker-directory':
        return <SpeakerPage />;
      case 'blog':
        return <BlogPageNew />;
      case 'contact':
        return <ContactPageNew />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Welcome to EventEase
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Your comprehensive platform for discovering, organizing, and managing amazing events. 
                  Connect with professionals, learn from experts, and grow your network.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Discover Events</h3>
                    <p className="text-gray-600 text-sm">Find conferences, workshops, and networking events</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎤</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Meet Speakers</h3>
                    <p className="text-gray-600 text-sm">Connect with industry experts and thought leaders</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Read Insights</h3>
                    <p className="text-gray-600 text-sm">Stay updated with industry trends and tips</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Get Support</h3>
                    <p className="text-gray-600 text-sm">Contact our team for help and guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />
      {renderPage()}
    </div>
  );
};

const HeaderDemo: React.FC = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <DemoContent />
      </AuthProvider>
    </AppProvider>
  );
};

export default HeaderDemo;