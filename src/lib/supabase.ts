import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CLIENT INITIALIZATION ---
// Using Bolt's Supabase connection - environment variables will be provided by Bolt
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- DATABASE TYPES ---
export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: 'attendee' | 'organizer' | 'sponsor';
  avatar_url?: string;
  company?: string;
  title?: string;
  bio?: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

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


// --- MOCK AUTH (for admin panel legacy code) ---
export const adminAuth = {
  async signIn(email: string, password: string) {
    if (email === 'tanmay365210mogabeera@gmail.com') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { data: null, error };
      return { data, error: null };
    }
    await supabase.auth.signOut();
    return { data: null, error: new Error('Access denied. Admin privileges required.') };
  },
  async signOut() { return await supabase.auth.signOut(); },
  async getCurrentUser() { const { data: { user } } = await supabase.auth.getUser(); return user; },
  async getCurrentSession() { const { data: { session } } = await supabase.auth.getSession(); return session; },
  isAdmin(user: any) {
    return user?.email === 'tanmay365210mogabeera@gmail.com';
  }
};


// --- DATABASE FUNCTIONS (db object) ---
export const db = {
  // User Functions
  async getAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
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
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email || '',
      password: 'TempPassword123!',
      email_confirm: true,
      user_metadata: { full_name: userData.username || '', role: 'attendee' }
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
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return { error };
    await supabase.from('events').delete().eq('user_id', id);
    return { error: null };
  },

  // Event Functions
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*, app_users:user_profiles(id, email, full_name)')
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    const mappedEvents = data?.map(event => ({
      ...event,
      app_users: event.app_users ? {
        id: (event.app_users as any).id,
        email: (event.app_users as any).email,
        username: (event.app_users as any).full_name
      } : null
    })) || [];
    
    return { data: mappedEvents, error: null };
  },
  async deleteEvent(id: string) {
    return await supabase.from('events').delete().eq('id', id);
  }
};
