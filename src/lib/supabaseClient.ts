import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // Remove auth configuration since we're using Firebase Auth
});

// Database types
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

// Database helper functions (keeping Supabase for database operations)
export const databaseHelpers = {
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  async createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<{ data: UserProfile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    return { data, error };
  }
};
