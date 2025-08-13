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
