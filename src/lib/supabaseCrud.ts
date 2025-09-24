import { supabase } from './supabaseAuth';

export interface EventData {
  id?: string;
  organizer_id: string;
  title: string;
  description?: string;
  category: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
}

export interface TicketTypeData {
  id?: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sale_start: string;
  sale_end?: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
}

class SupabaseCrudService {
  private static instance: SupabaseCrudService;

  static getInstance(): SupabaseCrudService {
    if (!SupabaseCrudService.instance) {
      SupabaseCrudService.instance = new SupabaseCrudService();
    }
    return SupabaseCrudService.instance;
  }

  // ==================== EVENTS CRUD ====================

  async createEvent(eventData: Omit<EventData, 'id'>): Promise<{ success: boolean; event?: EventData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .insert([eventData])
        .select('*')
        .single();

      if (error) throw error;

      // Create analytics record for the new event
      await supabase
        .from('organizer_event_analytics')
        .insert([{
          event_id: data.id,
          views: 0,
          registrations: 0,
          conversion_rate: 0,
          revenue: 0,
          top_referrers: []
        }]);

      return { success: true, event: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create event' 
      };
    }
  }

  async getEvents(organizerId?: string): Promise<{ success: boolean; events?: EventData[]; error?: string }> {
    try {
      let query = supabase
        .from('organizer_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (organizerId) {
        query = query.eq('organizer_id', organizerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, events: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch events' 
      };
    }
  }

  async getEventById(eventId: string): Promise<{ success: boolean; event?: EventData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch event' 
      };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventData>): Promise<{ success: boolean; event?: EventData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update event' 
      };
    }
  }

  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizer_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete event' 
      };
    }
  }

  async publishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizer_events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to publish event' 
      };
    }
  }

  // ==================== TICKET TYPES CRUD ====================

  async createTicketType(ticketData: Omit<TicketTypeData, 'id'>): Promise<{ success: boolean; ticket?: TicketTypeData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_ticket_types')
        .insert([ticketData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, ticket: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create ticket type' 
      };
    }
  }

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: TicketTypeData[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_ticket_types')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, tickets: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch ticket types' 
      };
    }
  }

  async updateTicketType(ticketId: string, updates: Partial<TicketTypeData>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizer_ticket_types')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update ticket type' 
      };
    }
  }

  async deleteTicketType(ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if ticket has sales first
      const { data: ticket } = await supabase
        .from('organizer_ticket_types')
        .select('sold')
        .eq('id', ticketId)
        .single();

      if (ticket && ticket.sold > 0) {
        return { success: false, error: 'Cannot delete ticket type with existing sales' };
      }

      const { error } = await supabase
        .from('organizer_ticket_types')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete ticket type' 
      };
    }
  }

  // ==================== SPEAKERS CRUD ====================

  async getSpeakers(): Promise<{ success: boolean; speakers?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;
      return { success: true, speakers: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch speakers' 
      };
    }
  }

  // ==================== SPONSORS CRUD ====================

  async getSponsors(): Promise<{ success: boolean; sponsors?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier', { ascending: true });

      if (error) throw error;
      return { success: true, sponsors: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch sponsors' 
      };
    }
  }

  // ==================== ANALYTICS ====================

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_event_analytics')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) throw error;
      return { success: true, analytics: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics' 
      };
    }
  }

  async incrementEventViews(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc('increment_event_views', {
        event_id: eventId
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to increment views' 
      };
    }
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(): Promise<{ success: boolean; users?: UserProfile[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, users: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      };
    }
  }

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This will cascade delete the profile due to foreign key constraint
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete user' 
      };
    }
  }
}

export const supabaseCrud = SupabaseCrudService.getInstance();