import { supabase } from '../lib/supabase';

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
  price?: number;
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
      console.log('Creating event with data:', eventData, 'for organizer:', organizerId);

      // Use the correct table name from the schema
      const { data, error } = await supabase
        .from('events')
        .insert([{
          organizer_id: organizerId,
          title: eventData.title,
          description: eventData.description,
          category: eventData.category || 'conference',
          event_date: eventData.event_date,
          start_time: eventData.time,
          end_time: eventData.end_time,
          venue: eventData.venue,
          capacity: eventData.capacity,
          max_attendees: eventData.capacity,
          image_url: eventData.image_url,
          status: 'draft',
          visibility: eventData.visibility || 'public'
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, error: error.message };
      }

      console.log('Event created successfully:', data);

      // Map the response to match our interface
      const mappedEvent: OrganizerEvent = {
        id: data.id,
        organizer_id: data.organizer_id,
        title: data.title,
        description: data.description,
        category: data.category,
        event_date: data.event_date,
        time: data.start_time,
        end_time: data.end_time,
        venue: data.venue,
        capacity: data.capacity,
        image_url: data.image_url,
        status: data.status,
        visibility: data.visibility,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { success: true, event: mappedEvent };
    } catch (error) {
      console.error('Create event error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: OrganizerEvent[]; error?: string }> {
    try {
      console.log('Fetching events for organizer:', organizerId);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, error: error.message };
      }

      console.log('Events fetched successfully:', data);

      // Map the response to match our interface
      const mappedEvents: OrganizerEvent[] = (data || []).map(event => ({
        id: event.id,
        organizer_id: event.organizer_id,
        title: event.title,
        description: event.description,
        category: event.category,
        event_date: event.event_date,
        time: event.start_time,
        end_time: event.end_time,
        venue: event.venue,
        capacity: event.capacity,
        image_url: event.image_url,
        status: event.status,
        visibility: event.visibility,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      return { success: true, events: mappedEvents };
    } catch (error) {
      console.error('Get events error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }

  async publishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Publishing event:', eventId);
      
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (error) {
        console.error('Publish error:', error);
        return { success: false, error: error.message };
      }

      console.log('Event published successfully');
      return { success: true };
    } catch (error) {
      console.error('Publish event error:', error);
      return { success: false, error: 'Failed to publish event' };
    }
  }

  async getEventById(eventId: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      const mappedEvent: OrganizerEvent = {
        id: data.id,
        organizer_id: data.organizer_id,
        title: data.title,
        description: data.description,
        category: data.category,
        event_date: data.event_date,
        time: data.start_time,
        end_time: data.end_time,
        venue: data.venue,
        capacity: data.capacity,
        image_url: data.image_url,
        status: data.status,
        visibility: data.visibility,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { success: true, event: mappedEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch event: ${message}` };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.event_date) dbUpdates.event_date = updates.event_date;
      if (updates.time) dbUpdates.start_time = updates.time;
      if (updates.end_time) dbUpdates.end_time = updates.end_time;
      if (updates.venue) dbUpdates.venue = updates.venue;
      if (updates.capacity) {
        dbUpdates.capacity = updates.capacity;
        dbUpdates.max_attendees = updates.capacity;
      }
      if (updates.image_url) dbUpdates.image_url = updates.image_url;
      if (updates.visibility) dbUpdates.visibility = updates.visibility;

      const { data, error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      const mappedEvent: OrganizerEvent = {
        id: data.id,
        organizer_id: data.organizer_id,
        title: data.title,
        description: data.description,
        category: data.category,
        event_date: data.event_date,
        time: data.start_time,
        end_time: data.end_time,
        venue: data.venue,
        capacity: data.capacity,
        image_url: data.image_url,
        status: data.status,
        visibility: data.visibility,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { success: true, event: mappedEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to update event: ${message}` };
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

  // ==================== ANALYTICS ====================

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: OrganizerEventAnalytics; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_event_analytics')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) {
        // If no analytics record exists, create a default one
        if (error.code === 'PGRST116') {
          const defaultAnalytics: Partial<OrganizerEventAnalytics> = {
            event_id: eventId,
            views: 0,
            registrations: 0,
            conversion_rate: 0,
            revenue: 0,
            top_referrers: []
          };

          const { data: newData, error: insertError } = await supabase
            .from('organizer_event_analytics')
            .insert([defaultAnalytics])
            .select()
            .single();

          if (insertError) {
            return { success: false, error: insertError.message };
          }

          return { success: true, analytics: newData };
        }
        return { success: false, error: error.message };
      }

      return { success: true, analytics: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  // ==================== TICKETING ====================

  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: OrganizerTicketType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('organizer_ticket_types')
        .insert([{
          ...ticketData,
          event_id: eventId,
          sold: 0
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
      // Create mock campaign since table doesn't exist in schema
      const mockCampaign: MarketingCampaign = {
        id: `campaign_${Date.now()}`,
        event_id: eventId,
        ...campaignData,
        open_rate: 0,
        click_rate: 0,
        created_at: new Date().toISOString()
      };

      return { success: true, campaign: mockCampaign };
    } catch (error) {
      return { success: false, error: 'Failed to create campaign' };
    }
  }

  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: MarketingCampaign[]; error?: string }> {
    try {
      // Return mock campaigns since table doesn't exist
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
      // Mock update since table doesn't exist
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update campaign' };
    }
  }

  async deleteMarketingCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock delete since table doesn't exist
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete campaign' };
    }
  }
}

export const organizerCrudService = OrganizerCrudService.getInstance();