// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import { auth } from './firebaseConfig';
// NEW: Import types from their dedicated file to break the circular dependency.
import type { AppUser, Event } from '../types/database';

// ✅ Correct way for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Enhanced safety check with better error handling
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase configuration missing:",
    {
      url: supabaseUrl ? "✓ Present" : "✗ Missing VITE_SUPABASE_URL",
      key: supabaseKey ? "✓ Present" : "✗ Missing VITE_SUPABASE_ANON_KEY"
    }
  );
  console.error(
    "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Vercel environment variables."
  );
}

// ✅ Export client with fallback values to prevent initialization errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      // Configure Supabase to work with Firebase Auth
      persistSession: false, // Don't persist Supabase sessions since we use Firebase
      autoRefreshToken: false, // Don't auto-refresh Supabase tokens
    },
    global: {
      headers: {
        // Add Firebase ID token to requests when available
        get Authorization() {
          if (auth?.currentUser) {
            return `Bearer ${auth.currentUser.accessToken || ''}`;
          }
          return '';
        }
      }
    }
  }
);

// ✅ Add a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Helper function to set Firebase token for Supabase requests
export const setSupabaseAuth = async (firebaseUser: any) => {
  if (!firebaseUser) {
    // Clear any existing auth
    await supabase.auth.signOut();
    return;
  }

  try {
    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    // Set the token for Supabase requests
    supabase.auth.setSession({
      access_token: idToken,
      refresh_token: '',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        user_metadata: {
          full_name: firebaseUser.displayName
        }
      }
    });
  } catch (error) {
    console.error('Failed to set Supabase auth:', error);
  }
};

// ----------------------
// Database Operations (Unchanged)
// ----------------------
export const db = {
  // ---------------- Users ----------------
  async getAllUsers(): Promise<{ data: AppUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      return {
        data:
          data?.map((profile) => ({
            id: profile.id,
            username: profile.username || profile.full_name || 'Unknown',
            email: profile.email || '',
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            role: profile.role,
            status: 'active',
          })) || null,
        error,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserById(id: string): Promise<{ data: AppUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return { data: null, error };

      return {
        data: data
          ? {
              id: data.id,
              username: data.username || data.full_name || 'Unknown',
              email: data.email || '',
              created_at: data.created_at,
              updated_at: data.updated_at,
              role: data.role,
              status: 'active',
            }
          : null,
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createUser(userData: {
    username: string;
    email: string;
  }): Promise<{ data: AppUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            username: userData.username,
            email: userData.email,
            full_name: userData.username,
            role: 'attendee',
            plan: 'free',
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: data
          ? {
              id: data.id,
              username: data.username,
              email: data.email,
              created_at: data.created_at,
              updated_at: data.updated_at,
              role: data.role,
              status: 'active',
            }
          : null,
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUser(
    id: string,
    updates: Partial<AppUser>
  ): Promise<{ data: AppUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          email: updates.email,
          full_name: updates.username,
          role: updates.role,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: data
          ? {
              id: data.id,
              username: data.username,
              email: data.email,
              created_at: data.created_at,
              updated_at: data.updated_at,
              role: data.role,
              status: 'active',
            }
          : null,
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteUser(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // ---------------- Events ----------------
  async getAllEvents(): Promise<{ data: Event[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`*, app_users:profiles(username, email)`)
        .order('created_at', { ascending: false });

      return {
        data:
          data?.map((event) => ({
            id: event.id,
            event_name: event.title || event.name || 'Untitled Event',
            event_type: event.type || 'conference',
            event_date: event.date || event.start_date,
            user_id: event.organizer_id || event.user_id,
            expected_attendees: event.max_attendees || 100,
            current_attendees: event.current_attendees || 0,
            app_users: event.app_users
              ? {
                  id: event.organizer_id || event.user_id,
                  username: event.app_users.username,
                  email: event.app_users.email,
                  created_at: new Date().toISOString(),
                }
              : undefined,
          })) || null,
        error,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getEventById(
    id: string
  ): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`*, app_users:profiles(username, email)`)
        .eq('id', id)
        .single();

      if (error) return { data: null, error };

      return {
        data: data
          ? {
              id: data.id,
              event_name: data.title || data.name || 'Untitled Event',
              event_type: data.type || 'conference',
              event_date: data.date || data.start_date,
              user_id: data.organizer_id || data.user_id,
              expected_attendees: data.max_attendees || 100,
              current_attendees: data.current_attendees || 0,
              app_users: data.app_users
                ? {
                    id: data.organizer_id || data.user_id,
                    username: data.app_users.username,
                    email: data.app_users.email,
                    created_at: new Date().toISOString(),
                  }
                : undefined,
            }
          : null,
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createEvent(
    eventData: Partial<Event>
  ): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: eventData.event_name,
            type: eventData.event_type,
            date: eventData.event_date,
            organizer_id: eventData.user_id,
            max_attendees: eventData.expected_attendees,
          },
        ])
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: data
          ? {
              id: data.id,
              event_name: data.title,
              event_type: data.type,
              event_date: data.date,
              user_id: data.organizer_id,
              expected_attendees: data.max_attendees,
              current_attendees: 0,
            }
          : null,
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateEvent(
    id: string,
    updates: Partial<Event>
  ): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: updates.event_name,
          type: updates.event_type,
          date: updates.event_date,
          max_attendees: updates.expected_attendees,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error };

      return {
        data: data
          ? {
              id: data.id,
              event_name: data.title,
              event_type: data.type,
              event_date: data.date,
              user_id: data.organizer_id,
              expected_attendees: data.max_attendees,
              current_attendees: data.current_attendees || 0,
            }
          : null,
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteEvent(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      return { error };
    } catch (error) {
      return { error };
    }
  },
};

// ----------------------
// Admin Authentication (Unchanged)
// ----------------------
export const adminAuth = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  isAdmin(user: any): boolean {
    return user?.email === 'tanmay365210mogabeera@gmail.com';
  },
};
