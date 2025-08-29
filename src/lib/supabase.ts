import { supabase, UserProfile } from './supabaseClient';

// Types for our database tables
export interface AppUser {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  event_name: string;
  event_type: string;
  expected_attendees: number;
  event_date?: string;
  budget?: string;
  description?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  updated_at: string;
  app_users?: AppUser;
}

// --- MOCK DATABASE ---

// We use 'let' so the arrays can be modified by our functions
let mockUsers: AppUser[] = [
  { id: '1', email: 'user1@example.com', username: 'Alice Johnson', created_at: '2025-07-15T10:00:00Z', updated_at: '2025-07-15T10:00:00Z' },
  { id: '2', email: 'user2@example.com', username: 'Bob Williams', created_at: '2025-07-18T11:30:00Z', updated_at: '2025-07-18T11:30:00Z' },
  { id: '3', email: 'user3@example.com', username: 'Charlie Brown', created_at: '2025-07-22T14:00:00Z', updated_at: '2025-07-22T14:00:00Z' },
];

let mockEvents: Event[] = [
  { id: 'evt1', user_id: '1', event_name: 'Tech Conference 2025', event_type: 'conference', expected_attendees: 500, event_date: '2025-10-20', budget: '50000+', description: 'Annual tech conference.', location_address: 'SF Convention Center', created_at: '2025-07-16T09:00:00Z', updated_at: '2025-07-16T09:00:00Z' },
  { id: 'evt2', user_id: '2', event_name: 'Marketing Workshop', event_type: 'workshop', expected_attendees: 50, event_date: '2025-11-05', budget: '5000-10000', description: 'Digital marketing deep dive.', location_address: 'Online', created_at: '2025-07-19T13:00:00Z', updated_at: '2025-07-19T13:00:00Z' },
  { id: 'evt3', user_id: '1', event_name: 'AI in Healthcare Seminar', event_type: 'seminar', expected_attendees: 150, event_date: '2025-11-12', budget: '10000-25000', description: 'Exploring AI applications.', location_address: 'City Hospital Auditorium', created_at: '2025-07-20T18:00:00Z', updated_at: '2025-07-20T18:00:00Z' },
  { id: 'evt4', user_id: '3', event_name: 'Startup Networking Night', event_type: 'networking', expected_attendees: 100, event_date: '2025-09-30', budget: '5000-10000', description: 'Meet and greet for startups.', location_address: 'The Innovation Hub', created_at: '2025-07-23T10:00:00Z', updated_at: '2025-07-23T10:00:00Z' },
];

// --- MOCK AUTHENTICATION ---
export const adminAuth = {
  async signIn(email: string, password: string) {
    // Use real Supabase auth for admin
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { data: null, error };
    }
    
    // Check if user is admin
    if (email === 'tanmay365210@gmail.com') {
      return { data, error: null };
    } else {
      // Sign out non-admin users
      await supabase.auth.signOut();
      return { data: null, error: new Error('Access denied. Admin privileges required.') };
    }
  },
  async signOut() { 
    const { error } = await supabase.auth.signOut();
    return { error }; 
  },
  async getCurrentUser() { 
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  async getCurrentSession() { 
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  isAdmin(user: any) {
    return user?.email === 'tanmay365210mogabbera@gmail.com';
  }
};

// --- MOCK DATABASE FUNCTIONS ---
// Note: These are kept for backward compatibility with existing admin panel
// In production, you should migrate these to use Supabase directly
export const db = {
  // User Functions
  async getAllUsers() {
    // Get real users from Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    // Map to expected format for compatibility
    const mappedUsers = data?.map(profile => ({
      id: profile.id,
      email: profile.email,
      username: profile.full_name,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    })) || [];
    
    return { data: mappedUsers, error: null };
  },
  async createUser(userData: Partial<AppUser>) {
    // Create user through Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email || '',
      password: 'TempPassword123!', // Temporary password
      email_confirm: true,
      user_metadata: {
        full_name: userData.username || '',
        role: 'attendee'
      }
    });
    
    if (error) return { data: null, error };
    
    const mappedUser: AppUser = {
      id: data.user.id,
      email: data.user.email || '',
      username: userData.username || '',
      created_at: data.user.created_at,
      updated_at: data.user.updated_at || data.user.created_at
    };
    
    return { data: mappedUser, error: null };
  },
  async deleteUser(id: string) {
    // Delete user from Supabase
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) return { error };
    
    // Also delete from events table
    await supabase
      .from('events')
      .delete()
      .eq('user_id', id);
    
    return { error: null };
  },

  // Event Functions
  async getAllEvents() {
    // Get real events from Supabase
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        app_users:user_profiles(id, email, full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    // Map to expected format
    const mappedEvents = data?.map(event => ({
      ...event,
      app_users: event.app_users ? {
        id: event.app_users.id,
        email: event.app_users.email,
        username: event.app_users.full_name
      } : null
    })) || [];
    
    return { data: mappedEvents, error: null };
  },
  async createEvent(eventData: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        user_id: eventData.user_id,
        event_name: eventData.event_name || 'Unnamed Event',
        event_type: eventData.event_type || 'conference',
        expected_attendees: eventData.expected_attendees || 50,
        event_date: eventData.event_date,
        budget: eventData.budget,
        description: eventData.description,
        location_address: eventData.location_address
      }])
      .select()
      .single();
    
    return { data, error };
  },
  async updateEvent(id: string, eventData: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    return { error };
  },
  async getEventsByUser(userId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};
