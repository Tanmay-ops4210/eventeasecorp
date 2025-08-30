import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// UserProfile interface based on the Supabase profiles table schema
export interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'attendee' | 'organizer' | 'sponsor' | 'admin';
  plan: string;
  company: string | null;
  title: string | null;
  updated_at: string;
  created_at?: string;
}