import { supabase } from '../lib/supabaseClient';

export interface RealEvent {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string; // Corrected from 'location' in the previous fix
  capacity: number;
  image_url?: string;
  category: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
  created_at: string;
  updated_at: string;
}

export interface RealTicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
  created_at: string;
}

export interface RealAttendee {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id: string;
  registration_date: string;
  check_in_status: 'pending' | 'checked-in' | 'no-show';
  payment_status: 'pending' | 'completed' | 'refunded';
  additional_info: any;
  user?: {
    full_name: string;
    email: string;
  };
  ticket_type?: {
    name: string;
    price: number;
  };
}

export interface RealEventAnalytics {
  id: string;
  event_id: string;
  views: number;
  registrations: number;
  conversion_rate: number;
  revenue: number;
  top_referrers: string[];
  updated_at: string;
}

export interface RealMarketingCampaign {
  id: string;
  event_id: string;
  name: string;
  type: 'email' | 'social' | 'sms' | 'push';
  subject?: string;
  content?: string;
  audience?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  sent_date?: string;
  open_rate: number;
  click_rate: number;
  created_at: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string; // Corrected from 'location' in the previous fix
  capacity: number;
  image_url?: string;
  category: string;
  visibility: 'public' | 'private' | 'unlisted';
}

export interface TicketFormData {
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
  completedEvents: number;
  averageAttendance: number;
}

class RealEventService {
  private static instance: RealEventService;

  static getInstance(): RealEventService {
    if (!RealEventService.instance) {
      RealEventService.instance = new RealEventService();
    }
    return RealEventService.instance;
  }

  /**
   * Maps a database event object (with start_date) to the frontend RealEvent object (with date and time).
   * @param dbEvent - The event object from the Supabase database.
   * @returns A RealEvent object formatted for the frontend.
   */
  private mapDbEventToRealEvent(dbEvent: any): RealEvent {
    // Handle both old schema (start_date/end_date) and new schema (date/time)
    let eventDate: string;
    let eventTime: string;
    let endTime: string | undefined;

    if (dbEvent.start_date) {
      // Old schema with start_date/end_date
      const startDate = new Date(dbEvent.start_date);
      const endDate = dbEvent.end_date ? new Date(dbEvent.end_date) : null;
      
      eventDate = startDate.toISOString().split('T')[0];
      eventTime = this.formatTime(startDate);
      endTime = endDate ? this.formatTime(endDate) : undefined;
    } else {
      // New schema with separate date and time columns
      eventDate = dbEvent.date || new Date().toISOString().split('T')[0];
      eventTime = dbEvent.time || '09:00';
      endTime = dbEvent.end_time;
    }

    return {
      id: dbEvent.id,
      organizer_id: dbEvent.organizer_id,
      title: dbEvent.title,
      description: dbEvent.description,
      event_date: eventDate,
      time: eventTime,
      end_time: endTime,
      venue: dbEvent.venue || dbEvent.location, // Handle both 'venue' and 'location' for compatibility
      capacity: dbEvent.capacity || 100, // Default value if not in schema
      image_url: dbEvent.image_url,
      category: dbEvent.category || 'conference', // Default value if not in schema
      status: dbEvent.status,
      visibility: dbEvent.visibility || 'public', // Default value if not in schema
      created_at: dbEvent.created_at,
      updated_at: dbEvent.updated_at,
    };
  }
  
  /**
   * Helper method to format time from Date object
   */
  private formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
  }

  /**
   * Maps frontend EventFormData to a database-compatible object.
   * @param eventData - The form data from the frontend.
   * @param organizerId - The ID of the organizer.
   * @returns An object ready for insertion into the Supabase 'events' table.
   */
  private mapEventFormToDb(eventData: Partial<EventFormData>, organizerId?: string) {
      const { event_date, time, end_time, title, description, venue, image_url, category, visibility, capacity } = eventData;
      const dbData: any = {};

      if(organizerId) dbData.organizer_id = organizerId;
      if(title) dbData.title = title;
      if(description) dbData.description = description;
      if(venue) dbData.venue = venue;
      if(image_url) dbData.image_url = image_url;
      if(category) dbData.category = category;
      if(visibility) dbData.visibility = visibility;
      if(capacity) dbData.capacity = capacity;

      // Use the new schema column names
      if (event_date) dbData.date = event_date;
      if (time) dbData.time = time;
      if (end_time) dbData.end_time = end_time;

      return dbData;
  }

  // Event CRUD operations
  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const dbData = this.mapEventFormToDb(eventData, organizerId);

      const { data, error } = await supabase
        .from('events')
        .insert([dbData])
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: this.mapDbEventToRealEvent(data) };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: RealEvent[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const mappedEvents = (data || []).map(dbEvent => this.mapDbEventToRealEvent(dbEvent));
      return { success: true, events: mappedEvents };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }
  
  async getEventById(eventId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: this.mapDbEventToRealEvent(data) };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch event: ${message}` };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const dbUpdates = this.mapEventFormToDb(updates);
      
      const { data, error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: this.mapDbEventToRealEvent(data) };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return { success: false, error: `Failed to update event: ${message}` };
    }
  }
  
  async getDashboardStats(organizerId: string): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, status, start_date, capacity') // Use start_date
        .eq('organizer_id', organizerId);
  
      if (eventsError) {
        return { success: false, error: eventsError.message };
      }
  
      const { data: analytics, error: analyticsError } = await supabase
        .from('event_analytics')
        .select('registrations, revenue')
        .in('event_id', events?.map(e => e.id) || []);
  
      if (analyticsError) {
        return { success: false, error: analyticsError.message };
      }
  
      const totalEvents = events?.length || 0;
      const publishedEvents = events?.filter(e => e.status === 'published').length || 0;
      const draftEvents = events?.filter(e => e.status === 'draft').length || 0;
      const upcomingEvents = events?.filter(e => 
        e.status === 'published' && new Date(e.start_date) > new Date() // Use start_date
      ).length || 0;
      const completedEvents = events?.filter(e => e.status === 'completed').length || 0;
      
      const totalTicketsSold = analytics?.reduce((sum, a) => sum + (a.registrations || 0), 0) || 0;
      const totalRevenue = analytics?.reduce((sum, a) => sum + (a.revenue || 0), 0) || 0;
      const averageAttendance = totalEvents > 0 ? totalTicketsSold / totalEvents : 0;
  
      const stats: DashboardStats = {
        totalEvents,
        publishedEvents,
        draftEvents,
        totalTicketsSold,
        totalRevenue,
        upcomingEvents,
        completedEvents,
        averageAttendance
      };
  
      return { success: true, stats };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch dashboard stats: ${message}` };
    }
  }
  
  // Omitted other methods for brevity as they don't relate to the error...
  // (deleteEvent, publishEvent, hideEvent, showEvent, ticket methods, etc.)
  
  // --- [Original methods that don't need changes can go here] ---

  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete event' };
    }
  }

  async publishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to publish event' };
    }
  }

  async hideEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ visibility: 'private' })
        .eq('id', eventId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to hide event' };
    }
  }

  async showEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ visibility: 'public' })
        .eq('id', eventId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to show event' };
    }
  }
  
  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: RealTicketType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .insert([{
          ...ticketData,
          event_id: eventId
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, ticket: data };
    } catch (error) {
      return { success: false, error: 'Failed to create ticket type' };
    }
  }

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: RealTicketType[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, tickets: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch ticket types' };
    }
  }

  async updateTicketType(ticketId: string, updates: Partial<TicketFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('ticket_types')
        .update(updates)
        .eq('id', ticketId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update ticket type' };
    }
  }

  async deleteTicketType(ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: soldTickets } = await supabase
        .from('ticket_types')
        .select('sold')
        .eq('id', ticketId)
        .single();

      if (soldTickets && soldTickets.sold > 0) {
        return { success: false, error: 'Cannot delete ticket type with existing sales' };
      }

      const { error } = await supabase
        .from('ticket_types')
        .delete()
        .eq('id', ticketId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket type' };
    }
  }

  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: RealAttendee[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          user:app_users!user_id(full_name, email),
          ticket_type:ticket_types!ticket_type_id(name, price)
        `)
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, attendees: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch attendees' };
    }
  }

  async updateAttendeeStatus(attendeeId: string, checkInStatus: 'pending' | 'checked-in' | 'no-show'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('event_attendees')
        .update({ check_in_status: checkInStatus })
        .eq('id', attendeeId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update attendee status' };
    }
  }

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: RealEventAnalytics; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_analytics')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, analytics: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  async incrementEventViews(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('event_analytics')
        .update({ 
          views: supabase.sql`views + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('event_id', eventId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to increment views' };
    }
  }

  async createMarketingCampaign(eventId: string, campaignData: Omit<RealMarketingCampaign, 'id' | 'event_id' | 'created_at' | 'open_rate' | 'click_rate'>): Promise<{ success: boolean; campaign?: RealMarketingCampaign; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert([{
          ...campaignData,
          event_id: eventId
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, campaign: data };
    } catch (error) {
      return { success: false, error: 'Failed to create campaign' };
    }
  }

  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: RealMarketingCampaign[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, campaigns: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch campaigns' };
    }
  }

  async updateMarketingCampaign(campaignId: string, updates: Partial<RealMarketingCampaign>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .update(updates)
        .eq('id', campaignId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update campaign' };
    }
  }

  async deleteMarketingCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete campaign' };
    }
  }

  subscribeToEventUpdates(organizerId: string, callback: (payload: any) => void) {
    return supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `organizer_id=eq.${organizerId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToAttendeeUpdates(eventId: string, callback: (payload: any) => void) {
    return supabase
      .channel('attendees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendees',
          filter: `event_id=eq.${eventId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToAnalyticsUpdates(eventId: string, callback: (payload: any) => void) {
    return supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_analytics',
          filter: `event_id=eq.${eventId}`
        },
        callback
      )
      .subscribe();
  }
}

export const realEventService = RealEventService.getInstance();
