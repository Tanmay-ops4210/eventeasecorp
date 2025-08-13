import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import EventCreationWizard from '../events/EventCreationWizard';
import { PlusCircle } from 'lucide-react';

const EventBuilderPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  React.useEffect(() => {
    setBreadcrumbs(['Event Builder']);
  }, [setBreadcrumbs]);

  const handleEventCreated = () => {
    setIsCreatingEvent(false);
    // Here you might want to refresh a list of events if they were displayed on this page
  };

  if (isCreatingEvent) {
    return <EventCreationWizard onClose={() => setIsCreatingEvent(false)} onSave={handleEventCreated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Builder</h1>
          <p className="text-xl text-gray-600 mb-8">Create your next amazing event with our guided builder.</p>
          <button
            onClick={() => setIsCreatingEvent(true)}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-6 h-6 mr-3" />
            <span>Create a New Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventBuilderPage;
