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

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
