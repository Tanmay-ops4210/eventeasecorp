import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string | null;
          role: 'attendee' | 'organizer' | 'admin';
          plan: string;
          company: string | null;
          title: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          full_name?: string | null;
          role?: 'attendee' | 'organizer' | 'admin';
          plan?: string;
          company?: string | null;
          title?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string;
          username?: string;
          full_name?: string | null;
          role?: 'attendee' | 'organizer' | 'admin';
          plan?: string;
          company?: string | null;
          title?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          organizer_id: string;
          title: string;
          description: string | null;
          full_description: string | null;
          category: string;
          event_date: string;
          start_time: string;
          end_time: string | null;
          venue: string;
          venue_address: string | null;
          image_url: string | null;
          status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          visibility: 'public' | 'private' | 'unlisted';
          max_attendees: number;
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          organizer_id: string;
          title: string;
          description?: string | null;
          full_description?: string | null;
          category?: string;
          event_date: string;
          start_time: string;
          end_time?: string | null;
          venue: string;
          venue_address?: string | null;
          image_url?: string | null;
          status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          visibility?: 'public' | 'private' | 'unlisted';
          max_attendees?: number;
          capacity?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          full_description?: string | null;
          category?: string;
          event_date?: string;
          start_time?: string;
          end_time?: string | null;
          venue?: string;
          venue_address?: string | null;
          image_url?: string | null;
          status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          visibility?: 'public' | 'private' | 'unlisted';
          max_attendees?: number;
          capacity?: number;
          updated_at?: string;
        };
      };
    };
  };
}

// Authentication service using Supabase Auth
export class SupabaseAuthService {
  private static instance: SupabaseAuthService;

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, userData: {
    username: string;
    full_name: string;
    role: 'attendee' | 'organizer';
    company?: string;
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name,
            role: userData.role,
            company: userData.company
          }
        }
      });

      if (error) throw error;

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    }
  }

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password update failed' 
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return supabase.auth.getUser();
  }

  // Get current session
  getCurrentSession() {
    return supabase.auth.getSession();
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Get user profile from database
  async getUserProfile(userId?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        return { success: false, error: 'No user ID provided' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;

      return { success: true, profile: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch profile' 
      };
    }
  }

  // Update user profile
  async updateUserProfile(updates: {
    username?: string;
    full_name?: string;
    company?: string;
    title?: string;
    avatar_url?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  }
}

// Database service for CRUD operations
export class SupabaseDatabaseService {
  private static instance: SupabaseDatabaseService;

  static getInstance(): SupabaseDatabaseService {
    if (!SupabaseDatabaseService.instance) {
      SupabaseDatabaseService.instance = new SupabaseDatabaseService();
    }
    return SupabaseDatabaseService.instance;
  }

  // Events CRUD
  async createEvent(eventData: Database['public']['Tables']['events']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create event' 
      };
    }
  }

  async getEvents(filters?: {
    status?: string;
    category?: string;
    organizer_id?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!organizer_id(username, full_name, avatar_url)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.organizer_id) {
        query = query.eq('organizer_id', filters.organizer_id);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, events: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch events' 
      };
    }
  }

  async getEventById(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!organizer_id(username, full_name, avatar_url, email),
          event_speakers(
            speaker:speakers(*)
          ),
          event_sponsors(
            sponsor:sponsors(*)
          ),
          ticket_types(*),
          event_analytics(*)
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch event' 
      };
    }
  }

  async updateEvent(eventId: string, updates: Database['public']['Tables']['events']['Update']) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update event' 
      };
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete event' 
      };
    }
  }

  // User management
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, users: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      };
    }
  }

  // Real-time subscriptions
  subscribeToEvents(callback: (payload: any) => void) {
    return supabase
      .channel('events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events'
      }, callback)
      .subscribe();
  }

  subscribeToUserProfile(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, callback)
      .subscribe();
  }
}

// Export service instances
export const authService = SupabaseAuthService.getInstance();
export const dbService = SupabaseDatabaseService.getInstance();

// Export Supabase client for direct use
export { supabase as default };