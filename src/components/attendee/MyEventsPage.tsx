import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Event } from '../../types/event';
import { eventService } from '../../services/eventService';
import EventCreationWizard from '../events/EventCreationWizard';

const MyEventsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    const myEvents = await eventService.getMyEvents();
    setEvents(myEvents);
    setIsLoading(false);
  };

  useEffect(() => {
    setBreadcrumbs(['My Events']);
    fetchEvents();
  }, [setBreadcrumbs]);

  if (showWizard) {
    return <EventCreationWizard onClose={() => setShowWizard(false)} onSave={fetchEvents} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{event.summary.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {event.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(event.summary.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900"><Edit className="w-4 h-4" /></button>
                      <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;
