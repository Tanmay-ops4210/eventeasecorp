export type UserRole = 'attendee' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company?: string;
  avatar_url?: string;
  is_active: boolean;
  plan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  role: UserRole;
  plan?: string;
  company?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}