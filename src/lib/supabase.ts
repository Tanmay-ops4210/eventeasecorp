import { dummyDb, DummyEvent } from './dummyDatabase';
import { dummyAuth, DummyUser } from './dummyAuth';

console.log('Dummy database service initialized');

// Database types
export type Database = any; // Dummy type for compatibility

// Dummy Database service for CRUD operations
export class DummyDatabaseService {
  private static instance: DummyDatabaseService;

  static getInstance(): DummyDatabaseService {
    if (!DummyDatabaseService.instance) {
      DummyDatabaseService.instance = new DummyDatabaseService();
    }
    return DummyDatabaseService.instance;
  }

  // Events CRUD
  async createEvent(eventData: Partial<DummyEvent>) {
    try {
      const result = await dummyDb.createEvent(eventData as any);

      if (!result.success) throw new Error(result.error);
      return { success: true, event: result.event };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create event' 
      };
    }
  }

  async getEvents(filters?: {
    status?: string;
    category?: string;
    organizer_id?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const result = await dummyDb.getEvents(filters);

      if (!result.success) throw new Error(result.error);
      return { success: true, events: result.events };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch events' 
      };
    }
  }

  async getEventById(eventId: string) {
    try {
      const result = await dummyDb.getEventById(eventId);

      if (!result.success) throw new Error(result.error);
      return { success: true, event: result.event };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch event' 
      };
    }
  }

  async updateEvent(eventId: string, updates: Partial<DummyEvent>) {
    try {
      const result = await dummyDb.updateEvent(eventId, updates);

      if (!result.success) throw new Error(result.error);
      return { success: true, event: result.event };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update event' 
      };
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const result = await dummyDb.deleteEvent(eventId);

      if (!result.success) throw new Error(result.error);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete event' 
      };
    }
  }

  // User management
  async getAllUsers() {
    try {
      const result = await dummyAuth.getAllUsersForAdmin();

      if (!result.success) throw new Error(result.error);
      return { success: true, users: result.users };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      };
    }
  }

  async deleteUser(userId: string) {
    try {
      const result = await dummyAuth.deleteUser(userId);

      if (!result.success) throw new Error(result.error);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete user' 
      };
    }
  }

  // Real-time subscriptions
  subscribeToEvents(callback: (payload: any) => void) {
    // Dummy subscription - just return a mock subscription object
    return {
      unsubscribe: () => {}
    };
  }

  subscribeToUserProfile(userId: string, callback: (payload: any) => void) {
    // Dummy subscription - just return a mock subscription object
    return {
      unsubscribe: () => {}
    };
  }
}

// Export service instances
export const dbService = DummyDatabaseService.getInstance();

// Export dummy client for compatibility
export const supabase = {
  auth: dummyAuth,
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null })
  })
};

export default supabase;