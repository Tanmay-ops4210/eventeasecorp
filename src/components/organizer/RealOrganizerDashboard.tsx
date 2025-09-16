import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Calendar, Ticket, ArrowRight, BarChart, Loader2 } from 'lucide-react';
import { realEventService, RealEvent } from '../../services/realEventService';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
    <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const RealOrganizerDashboard: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { user } = useAuth();

  const [events, setEvents] = useState<RealEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs(['Dashboard']);
    if (!user) return;

    // Initial data fetch
    const fetchInitialData = async () => {
      setIsLoading(true);
      const result = await realEventService.getMyEvents(user.id);
      if (result.success && result.events) {
        setEvents(result.events);
      }
      setIsLoading(false);
    };

    fetchInitialData();

    // Set up the real-time subscription
    const unsubscribe = realEventService.subscribeToEvents(user.id, (updatedEvents) => {
      console.log('Real-time update received:', updatedEvents);
      setEvents(updatedEvents);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [setBreadcrumbs, user]);

  // --- Calculated Stats (derived from the real-time 'events' state) ---
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published').length;
  const upcomingEvents = events
    .filter(e => e.status === 'published' && new Date(e.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <button
            onClick={() => setCurrentView('event-builder')}
            className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Event</span>
          </button>
        </div>
        
        {/* --- Stats Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Events" value={totalEvents} icon={<Calendar className="w-6 h-6 text-indigo-600"/>} />
          <StatCard title="Published Events" value={publishedEvents} icon={<Ticket className="w-6 h-6 text-indigo-600"/>} />
          <StatCard title="Total Revenue" value="$0" icon={<BarChart className="w-6 h-6 text-indigo-600"/>} />
          <StatCard title="Tickets Sold" value="0" icon={<Users className="w-6 h-6 text-indigo-600"/>} />
        </div>

        {/* --- Upcoming Events Section --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.event_date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                  <button onClick={() => setCurrentView('my-events')} className="text-indigo-600 hover:underline flex items-center space-x-1 text-sm font-semibold">
                      <span>Manage</span>
                      <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">You have no upcoming published events.</p>
              <button onClick={() => setCurrentView('my-events')} className="mt-4 text-indigo-600 font-semibold hover:underline">
                View all events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealOrganizerDashboard;
