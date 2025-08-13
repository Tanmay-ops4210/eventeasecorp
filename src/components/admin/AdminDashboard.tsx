import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { db, AppUser, Event } from '../../lib/supabase'; // Import db and types
import MemberManagement from './MemberManagement';
import EventManagement from './EventManagement';

const AdminDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const usersResponse = await db.getAllUsers();
    const eventsResponse = await db.getAllEvents();
    if (usersResponse.data) setUsers(usersResponse.data);
    if (eventsResponse.data) setEvents(eventsResponse.data);
    setIsLoading(false);
  };

  useEffect(() => {
    setBreadcrumbs(['Admin Dashboard']);
    fetchData();
  }, [setBreadcrumbs]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xl text-gray-600">This is your Super Admin Dashboard.</p>
          </div>

          <MemberManagement users={users} events={events} onRefresh={fetchData} />
          <EventManagement users={users} events={events} onRefresh={fetchData} />
            
          {/* New User Events Table */}
           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-900 p-6">User Events</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event: any) => (
                                <tr key={event._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.summary?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{users.find(u => u._id === event.ownerId)?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
