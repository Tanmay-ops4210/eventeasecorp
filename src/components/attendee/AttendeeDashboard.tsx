import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const AttendeeDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">Attendee Dashboard - Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;