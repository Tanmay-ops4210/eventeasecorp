import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

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

// Admin authentication functions
export const adminAuth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
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
    return user?.email === 'tanmay365210@gmail.com';
  }
};

// Database functions
export const db = {
  // Users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createUser(userData: Partial<AppUser>) {
    const { data, error } = await supabase
      .from('app_users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  // Events
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        app_users (
          id,
          email,
          username
        )
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        app_users (
          id,
          email,
          username
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createEvent(eventData: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
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