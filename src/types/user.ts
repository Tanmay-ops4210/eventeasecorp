export type UserRole = 'attendee' | 'organizer' | 'sponsor' | 'admin';

export interface User {
  _id: string; // Changed from id to _id for consistency
  email: string;
  name: string;
  role: UserRole;
  plan: "FREE" | "PAID" | "PRO"; // Added plan
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Supabase specific types
export interface SupabaseUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  user_metadata: {
    full_name?: string;
    role?: UserRole;
  };
  created_at: string;
  updated_at: string;
}