import { supabase } from '../lib/supabaseClient';

export interface OrganizerEvent {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export interface OrganizerTicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  sale_start: string;
  sale_end?: string;
  is_active: boolean;
  benefits: string[];
  restrictions: string[];
  created_at: string;
}

export interface OrganizerEventAnalytics {
  id: string;
  event_id: string;
  views: number;
  registrations: number;
  conversion_rate: number;
  revenue: number;
  top_referrers: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganizerAttendee {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id?: string;
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

export interface EventFormData {
  title: string;
  description?: string;
  category: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  visibility: 'public' | 'private' | 'unlisted';
}

export interface TicketFormData {
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

export interface MarketingCampaign {
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

class OrganizerCrudService {
  private static instance: OrganizerCrudService;

  static getInstance(): OrganizerCrudService {
    if (!OrganizerCrudService.instance) {
      OrganizerCrudService.instance = new OrganizerCrudService();
    }
    return OrganizerCrudService.instance;
  }

  // ==================== EVENT CRUD ====================

  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .insert([{
          ...eventData,
          organizer_id: organizerId
        }])
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: OrganizerEvent[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, events: data || [] };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }

  async getEventById(eventId: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch event: ${message}` };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to update event: ${message}` };
    }
  }

  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizer_events')
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
        .from('organizer_events')
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

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(organizerId: string): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const { data: events, error: eventsError } = await supabase
        .from('organizer_events')
        .select('id, status, event_date, capacity')
        .eq('organizer_id', organizerId);

      if (eventsError) {
        return { success: false, error: eventsError.message };
      }

      const { data: analytics, error: analyticsError } = await supabase
        .from('organizer_event_analytics')
        .select('registrations, revenue')
        .in('event_id', events?.map(e => e.id) || []);

      if (analyticsError) {
        return { success: false, error: analyticsError.message };
      }

      const totalEvents = events?.length || 0;
      const publishedEvents = events?.filter(e => e.status === 'published').length || 0;
      const draftEvents = events?.filter(e => e.status === 'draft').length || 0;
      const upcomingEvents = events?.filter(e => 
        e.status === 'published' && new Date(e.event_date) > new Date()
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

  // ==================== ANALYTICS ====================

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: OrganizerEventAnalytics; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_event_analytics')
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

  async updateEventAnalytics(eventId: string, updates: Partial<OrganizerEventAnalytics>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizer_event_analytics')
        .update(updates)
        .eq('event_id', eventId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update analytics' };
    }
  }

  // ==================== TICKETING ====================

  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: OrganizerTicketType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_ticket_types')
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

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: OrganizerTicketType[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_ticket_types')
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
        .from('organizer_ticket_types')
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
      // Check if ticket has sales
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

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket type' };
    }
  }

  // ==================== ATTENDEE MANAGEMENT ====================

  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: OrganizerAttendee[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_attendees')
        .select(`
          *,
          user:profiles!user_id(full_name, email),
          ticket_type:organizer_ticket_types!ticket_type_id(name, price)
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
        .from('organizer_attendees')
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

  // ==================== MARKETING CAMPAIGNS ====================

  async createMarketingCampaign(eventId: string, campaignData: Omit<MarketingCampaign, 'id' | 'event_id' | 'created_at' | 'open_rate' | 'click_rate'>): Promise<{ success: boolean; campaign?: MarketingCampaign; error?: string }> {
    try {
      // Since we don't have a marketing_campaigns table in the new schema,
      // we'll simulate this functionality
      const mockCampaign: MarketingCampaign = {
        id: `campaign_${Date.now()}`,
        event_id: eventId,
        ...campaignData,
        open_rate: 0,
        click_rate: 0,
        created_at: new Date().toISOString()
      };

      // In a real implementation, you would create a marketing_campaigns table
      // For now, we'll just return success
      return { success: true, campaign: mockCampaign };
    } catch (error) {
      return { success: false, error: 'Failed to create campaign' };
    }
  }

  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: MarketingCampaign[]; error?: string }> {
    try {
      // Mock campaigns data since we don't have the table
      const mockCampaigns: MarketingCampaign[] = [
        {
          id: '1',
          event_id: eventId,
          name: 'Pre-Event Announcement',
          type: 'email',
          subject: 'Don\'t miss our upcoming event!',
          content: 'Join us for an amazing event experience...',
          audience: 'all_subscribers',
          status: 'sent',
          sent_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          open_rate: 24.5,
          click_rate: 8.2,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return { success: true, campaigns: mockCampaigns };
    } catch (error) {
      return { success: false, error: 'Failed to fetch campaigns' };
    }
  }

  async updateMarketingCampaign(campaignId: string, updates: Partial<MarketingCampaign>): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock update since we don't have the table
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update campaign' };
    }
  }

  async deleteMarketingCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock delete since we don't have the table
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete campaign' };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  async incrementEventViews(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('organizer_event_analytics')
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

  // Real-time subscriptions
  subscribeToEventUpdates(organizerId: string, callback: (payload: any) => void) {
    return supabase
      .channel('organizer-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organizer_events',
          filter: `organizer_id=eq.${organizerId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToAttendeeUpdates(eventId: string, callback: (payload: any) => void) {
    return supabase
      .channel('organizer-attendees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organizer_attendees',
          filter: `event_id=eq.${eventId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToAnalyticsUpdates(eventId: string, callback: (payload: any) => void) {
    return supabase
      .channel('organizer-analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organizer_event_analytics',
          filter: `event_id=eq.${eventId}`
        },
        callback
      )
      .subscribe();
  }
}

export const organizerCrudService = OrganizerCrudService.getInstance();