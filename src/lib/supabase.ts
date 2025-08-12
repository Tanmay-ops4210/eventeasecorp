// MOCK SUPABASE CLIENT - Temporary replacement with more data
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

// Mock Data
const mockUsers: AppUser[] = [
  { id: '1', email: 'user1@example.com', username: 'Alice Johnson', created_at: '2025-07-15T10:00:00Z', updated_at: '2025-07-15T10:00:00Z' },
  { id: '2', email: 'user2@example.com', username: 'Bob Williams', created_at: '2025-07-18T11:30:00Z', updated_at: '2025-07-18T11:30:00Z' },
  { id: '3', email: 'user3@example.com', username: 'Charlie Brown', created_at: '2025-07-22T14:00:00Z', updated_at: '2025-07-22T14:00:00Z' },
];

const mockEvents: Event[] = [
  { id: 'evt1', user_id: '1', event_name: 'Tech Conference 2025', event_type: 'conference', expected_attendees: 500, event_date: '2025-10-20', budget: '50000+', description: 'Annual tech conference.', location_address: 'SF Convention Center', created_at: '2025-07-16T09:00:00Z', updated_at: '2025-07-16T09:00:00Z' },
  { id: 'evt2', user_id: '2', event_name: 'Marketing Workshop', event_type: 'workshop', expected_attendees: 50, event_date: '2025-11-05', budget: '5000-10000', description: 'Digital marketing deep dive.', location_address: 'Online', created_at: '2025-07-19T13:00:00Z', updated_at: '2025-07-19T13:00:00Z' },
  { id: 'evt3', user_id: '1', event_name: 'AI in Healthcare Seminar', event_type: 'seminar', expected_attendees: 150, event_date: '2025-11-12', budget: '10000-25000', description: 'Exploring AI applications.', location_address: 'City Hospital Auditorium', created_at: '2025-07-20T18:00:00Z', updated_at: '2025-07-20T18:00:00Z' },
  { id: 'evt4', user_id: '3', event_name: 'Startup Networking Night', event_type: 'networking', expected_attendees: 100, event_date: '2025-09-30', budget: '5000-10000', description: 'Meet and greet for startups.', location_address: 'The Innovation Hub', created_at: '2025-07-23T10:00:00Z', updated_at: '2025-07-23T10:00:00Z' },
];

// Admin authentication functions
export const adminAuth = {
  async signIn(email: string, password: string) {
    if (email === 'tanmay365210mogabbera@gmail.com' && password === 'TAM123***') {
      return { data: { user: { id: 'mock-admin-id', email: email, aud: 'authenticated', role: 'authenticated' } }, error: null };
    }
    return { data: null, error: new Error('Invalid credentials') };
  },
  async signOut() { return { error: null }; },
  async getCurrentUser() { return null; },
  async getCurrentSession() { return null; },
  isAdmin(user: any) {
    return user?.email === 'tanmay365210mogabbera@gmail.com';
  }
};

// Database functions
export const db = {
  async getAllUsers() { return { data: mockUsers, error: null }; },
  async createUser(userData: Partial<AppUser>) {
    const mockUser: AppUser = { id: Date.now().toString(), email: userData.email || '', username: userData.username || '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockUsers.push(mockUser);
    return { data: mockUser, error: null };
  },
  async getAllEvents() { return { data: mockEvents.map(e => ({...e, app_users: mockUsers.find(u => u.id === e.user_id)})), error: null }; },
  async getEventById(id: string) {
    const event = mockEvents.find(e => e.id === id);
    return { data: event ? {...event, app_users: mockUsers.find(u => u.id === event.user_id)} : null, error: null };
  },
  async createEvent(eventData: Partial<Event>) {
    const mockEvent: Event = { id: Date.now().toString(), user_id: eventData.user_id || '', event_name: eventData.event_name || '', event_type: eventData.event_type || 'conference', expected_attendees: eventData.expected_attendees || 50, event_date: eventData.event_date, budget: eventData.budget, description: eventData.description, location_address: eventData.location_address, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockEvents.push(mockEvent);
    return { data: mockEvent, error: null };
  },
  async updateEvent(id: string, eventData: Partial<Event>) { return { data: null, error: null }; },
  async deleteEvent(id: string) { return { error: null }; },
  async getEventsByUser(userId: string) {
    const userEvents = mockEvents.filter(e => e.user_id === userId);
    return { data: userEvents, error: null };
  }
};
