// src/types/database.ts

export interface AppUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at?: string;
  role?: string;
  status?: string;
  // Properties from your AuthContext AppUser
  full_name?: string;
  company?: string;
  avatar_url?: string;
  plan?: string;
}

export interface Event {
  id: string;
  event_name: string;
  event_type: string;
  event_date?: string;
  user_id: string;
  expected_attendees: number;
  current_attendees?: number;
  app_users?: AppUser;
}
