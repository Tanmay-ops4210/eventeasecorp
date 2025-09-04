import { createClient } from '@supabase/supabase-js';

// Handle environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Check if we're in development and show helpful message
if (supabaseUrl === 'https://placeholder-url.supabase.co' || supabaseKey === 'placeholder-key') {
  console.info('Supabase configuration: Using placeholder values. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.');
}

// Unified user interface for all roles
export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: 'attendee' | 'organizer' | 'sponsor';
  company?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Event interface
export interface Event {
  id: string;
  title: string;
  description?: string;
  category?: string;
  date?: string;
  time?: string;
  organizer_id: string;
  max_attendees?: number;
  current_attendees?: number;
  status?: string;
  created_at: string;
  updated_at: string;
  app_users?: AppUser;
}

// Unified database operations
export const db = {
  // User operations for all roles
  async getAllUsers(): Promise<{ data: AppUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserById(id: string): Promise<{ data: AppUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUsersByRole(role: 'attendee' | 'organizer' | 'sponsor'): Promise<{ data: AppUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createUser(userData: Partial<AppUser>): Promise<{ data: AppUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .insert([userData])
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUser(id: string, updates: Partial<AppUser>): Promise<{ data: AppUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteUser(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', id);
      
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Event operations
  async getAllEvents(): Promise<{ data: Event[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          app_users:app_users!organizer_id(*)
        `)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getEventById(id: string): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          app_users:app_users!organizer_id(*)
        `)
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createEvent(eventData: Partial<Event>): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteEvent(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      return { error };
    } catch (error) {
      return { error };
    }
  }
};

// Session management
export const sessionManager = {
  setUser(user: AppUser) {
    localStorage.setItem('eventease_user', JSON.stringify(user));
    localStorage.setItem('eventease_session', JSON.stringify({
      userId: user.id,
      role: user.role,
      loginTime: new Date().toISOString()
    }));
  },

  getUser(): AppUser | null {
    try {
      const userStr = localStorage.getItem('eventease_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getSession(): { userId: string; role: string; loginTime: string } | null {
    try {
      const sessionStr = localStorage.getItem('eventease_session');
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem('eventease_user');
    localStorage.removeItem('eventease_session');
  },

  isValidSession(): boolean {
    const session = this.getSession();
    if (!session) return false;

    // Check if session is less than 24 hours old
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff < 24;
  }
};