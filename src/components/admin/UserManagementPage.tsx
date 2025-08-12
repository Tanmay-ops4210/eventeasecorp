import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { db, AppUser, Event } from '../../lib/supabase';
import MemberManagement from './MemberManagement';

const UserManagementPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
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
    setBreadcrumbs(['User Management']);
    fetchData();
  }, [setBreadcrumbs]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemberManagement users={users} events={events} onRefresh={fetchData} />
      </div>
    </div>
  );
};

export default UserManagementPage;
