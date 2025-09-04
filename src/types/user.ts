export type UserRole = 'attendee' | 'organizer' | 'sponsor' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company?: string;
  avatar_url?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
