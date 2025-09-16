import { supabase } from '../lib/supabaseClient';

export interface RealEvent {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  time: string;
  end_time?: string;
  location: string;
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
  location: string;
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

  // Event CRUD operations
  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          organizer_id: organizerId
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error) {
      return { success: false, error: 'Failed to create event' };
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

      return { success: true, events: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch events' };
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

      return { success: true, event: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch event' };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error) {
      return { success: false, error: 'Failed to update event' };
    }
  }

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

  // Ticket management
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
      // Check if any tickets have been sold
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

  // Attendee management
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

  // Analytics
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

  // Dashboard stats
  async getDashboardStats(organizerId: string): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, status, created_at')
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
        e.status === 'published' && new Date(e.event_date) > new Date()
      const upcomingEvents = events?.filter(e => e.status === 'published').length || 0;
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
      return { success: false, error: 'Failed to fetch dashboard stats' };
    }
  }

  // Marketing campaigns
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

  // Real-time subscriptions
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