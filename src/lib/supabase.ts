// TEMPORARILY REMOVED SUPABASE - Commented out for temporary removal
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true
//   }
// });

// MOCK SUPABASE CLIENT - Temporary replacement
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase temporarily disabled') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null } }),
    getSession: async () => ({ data: { session: null } })
  },
  from: () => ({
    select: () => ({
      order: () => ({ data: [], error: null }),
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null })
      })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: async () => ({ error: null })
    })
  })
};
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
    // TEMPORARILY REMOVED SUPABASE - Mock authentication
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password
    // });
    // return { data, error };
    
    // Mock admin authentication - only allow specific admin email
    if (email === 'tanmay365210@gmail.com' && password) {
      return { 
        data: { 
          user: { 
            id: 'mock-admin-id', 
            email: email,
            aud: 'authenticated',
            role: 'authenticated'
          } 
        }, 
        error: null 
      };
    }
    return { data: null, error: new Error('Invalid credentials') };
  },

  async signOut() {
    // TEMPORARILY REMOVED SUPABASE
    // const { error } = await supabase.auth.signOut();
    // return { error };
    return { error: null };
  },

  async getCurrentUser() {
    // TEMPORARILY REMOVED SUPABASE
    // const { data: { user } } = await supabase.auth.getUser();
    // return user;
    return null;
  },

  async getCurrentSession() {
    // TEMPORARILY REMOVED SUPABASE
    // const { data: { session } } = await supabase.auth.getSession();
    // return session;
    return null;
  },

  isAdmin(user: any) {
    return user?.email === 'tanmay365210@gmail.com';
  }
};

// Database functions
export const db = {
  // Users
  async getAllUsers() {
    // TEMPORARILY REMOVED SUPABASE - Return mock data
    // const { data, error } = await supabase
    //   .from('app_users')
    //   .select('*')
    //   .order('created_at', { ascending: false });
    // return { data, error };
    
    const mockUsers: AppUser[] = [
      {
        id: '1',
        email: 'user1@example.com',
        username: 'User One',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user2@example.com',
        username: 'User Two',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    return { data: mockUsers, error: null };
  },

  async createUser(userData: Partial<AppUser>) {
    // TEMPORARILY REMOVED SUPABASE
    // const { data, error } = await supabase
    //   .from('app_users')
    //   .insert([userData])
    //   .select()
    //   .single();
    // return { data, error };
    
    const mockUser: AppUser = {
      id: Date.now().toString(),
      email: userData.email || '',
      username: userData.username || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return { data: mockUser, error: null };
  },

  // Events
  async getAllEvents() {
    // TEMPORARILY REMOVED SUPABASE - Return mock data
    // const { data, error } = await supabase
    //   .from('events')
    //   .select(`
    //     *,
    //     app_users (
    //       id,
    //       email,
    //       username
    //     )
    //   `)
    //   .order('created_at', { ascending: false });
    // return { data, error };
    
    const mockEvents: Event[] = [
      {
        id: '1',
        user_id: '1',
        event_name: 'Tech Conference 2024',
        event_type: 'conference',
        expected_attendees: 200,
        event_date: '2024-03-15',
        budget: '10000-25000',
        description: 'Annual technology conference',
        location_address: 'Convention Center, City',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    return { data: mockEvents, error: null };
  },

  async getEventById(id: string) {
    // TEMPORARILY REMOVED SUPABASE
    // const { data, error } = await supabase
    //   .from('events')
    //   .select(`
    //     *,
    //     app_users (
    //       id,
    //       email,
    //       username
    //     )
    //   `)
    //   .eq('id', id)
    //   .single();
    // return { data, error };
    return { data: null, error: null };
  },

  async createEvent(eventData: Partial<Event>) {
    // TEMPORARILY REMOVED SUPABASE
    // const { data, error } = await supabase
    //   .from('events')
    //   .insert([eventData])
    //   .select()
    //   .single();
    // return { data, error };
    
    const mockEvent: Event = {
      id: Date.now().toString(),
      user_id: eventData.user_id || '',
      event_name: eventData.event_name || '',
      event_type: eventData.event_type || 'conference',
      expected_attendees: eventData.expected_attendees || 50,
      event_date: eventData.event_date,
      budget: eventData.budget,
      description: eventData.description,
      location_address: eventData.location_address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return { data: mockEvent, error: null };
  },

  async updateEvent(id: string, eventData: Partial<Event>) {
    // TEMPORARILY REMOVED SUPABASE
    // const { data, error } = await supabase
    //   .from('events')
    //   .update(eventData)
    //   .eq('id', id)
    //   .select()
    //   .single();
    // return { data, error };
    return { data: null, error: null };
  },

  async deleteEvent(id: string) {
    // TEMPORARILY REMOVED SUPABASE
    // const { error } = await supabase
    //   .from('events')
    //   .delete()
    //   .eq('id', id);
    // return { error };
    return { error: null };
  },

  async getEventsByUser(userId: string) {
    // TEMPORARILY REMOVED SUPABASE
    // const { data, error } = await supabase
    //   .from('events')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('created_at', { ascending: false });
    // return { data, error };
    return { data: [], error: null };
  }
};