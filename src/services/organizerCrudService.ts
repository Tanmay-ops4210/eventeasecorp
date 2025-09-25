import { dummyDb, DummyEvent, DummyTicketType, DummyAttendee, DummyEventAnalytics, DummyMarketingCampaign } from '../lib/dummyDatabase';
import { dummyAuth } from '../lib/dummyAuth';

export type OrganizerEvent = DummyEvent;

export type OrganizerTicketType = DummyTicketType;

export type OrganizerEventAnalytics = DummyEventAnalytics;

export type OrganizerAttendee = DummyAttendee;

export type MarketingCampaign = DummyMarketingCampaign;
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
  currency?: string;
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

  // Check if user is authenticated and has organizer role
  private async checkOrganizerAccess(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: userError } = await dummyAuth.getCurrentUser();
      
      if (userError || !user) {
        console.error('User authentication error:', userError);
        return { success: false, error: 'Authentication required' };
      }

      console.log('Checking organizer access for user:', user.id);

      const profile = await dummyAuth.getUserProfile(user.id);

      if (!profile) {
        console.error('Profile not found');
        return { success: false, error: 'Failed to verify user permissions' };
      }

      console.log('User profile role:', profile.role);

      if (profile.role !== 'organizer' && profile.role !== 'admin') {
        return { success: false, error: 'Organizer permissions required' };
      }

      return { success: true };
    } catch (error) {
      console.error('Access check error:', error);
      return { success: false, error: 'Authentication check failed' };
    }
  }

  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      console.log('Creating event with data:', eventData, 'for organizer:', organizerId);

      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        console.error('Access check failed:', accessCheck.error);
        return { success: false, error: accessCheck.error };
      }

      // Validate required fields
      if (!eventData.title || !eventData.venue || !eventData.event_date || !eventData.time) {
        return { success: false, error: 'Missing required fields: title, venue, date, and time are required' };
      }

      const result = await dummyDb.createEvent({
        organizer_id: organizerId,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category || 'conference',
        event_date: eventData.event_date,
        time: eventData.time,
        end_time: eventData.end_time,
        venue: eventData.venue,
        capacity: eventData.capacity,
        image_url: eventData.image_url,
        status: 'draft',
        visibility: eventData.visibility || 'public',
        price: eventData.price || 0,
        currency: eventData.currency || 'INR'
      });

      if (!result.success) {
        console.error('Database insert error:', result.error);
        return { success: false, error: result.error };
      }

      console.log('Event created successfully:', result.event);
      return { success: true, event: result.event };
    } catch (error) {
      console.error('Create event error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: OrganizerEvent[]; error?: string }> {
    try {
      console.log('Fetching events for organizer:', organizerId);

      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        console.error('Access check failed for getMyEvents:', accessCheck.error);
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.getEvents({
        organizer_id: organizerId
      });

      if (!result.success) {
        console.error('Database select error:', result.error);
        return { success: false, error: result.error };
      }

      console.log('Events fetched successfully:', result.events?.length || 0, 'events');
      return { success: true, events: result.events || [] };
    } catch (error) {
      console.error('Get events error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }

  async publishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Publishing event:', eventId);
      
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }
      
      const result = await dummyDb.updateEvent(eventId, { status: 'published' });

      if (!result.success) {
        console.error('Publish error:', result.error);
        return { success: false, error: result.error };
      }

      console.log('Event published successfully');
      return { success: true };
    } catch (error) {
      console.error('Publish event error:', error);
      return { success: false, error: 'Failed to publish event' };
    }
  }

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: OrganizerEventAnalytics; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.getEventAnalytics(eventId);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, analytics: result.analytics };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: OrganizerTicketType; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.createTicketType({
        ...ticketData,
        event_id: eventId,
        sold: 0
      });

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, ticket: result.ticket };
    } catch (error) {
      return { success: false, error: 'Failed to create ticket type' };
    }
  }

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: OrganizerTicketType[]; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.getTicketTypesByEvent(eventId);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, tickets: result.tickets || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch ticket types' };
    }
  }

  async updateTicketType(ticketId: string, updates: Partial<TicketFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.updateTicketType(ticketId, updates);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update ticket type' };
    }
  }

  async deleteTicketType(ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.deleteTicketType(ticketId);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket type' };
    }
  }

  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: OrganizerAttendee[]; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.getEventAttendees(eventId);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, attendees: result.attendees || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch attendees' };
    }
  }

  async updateAttendeeStatus(attendeeId: string, checkInStatus: 'pending' | 'checked-in' | 'no-show'): Promise<{ success: boolean; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.updateAttendeeStatus(attendeeId, checkInStatus);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update attendee status' };
    }
  }

  async createMarketingCampaign(eventId: string, campaignData: Omit<MarketingCampaign, 'id' | 'event_id' | 'created_at' | 'open_rate' | 'click_rate'>): Promise<{ success: boolean; campaign?: MarketingCampaign; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.createMarketingCampaign(eventId, campaignData);

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to create campaign' };
    }
  }

  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: MarketingCampaign[]; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.getMarketingCampaigns(eventId);

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to fetch campaigns' };
    }
  }

  async updateMarketingCampaign(campaignId: string, updates: Partial<MarketingCampaign>): Promise<{ success: boolean; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.updateMarketingCampaign(campaignId, updates);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to update campaign' };
    }
  }

  async deleteMarketingCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check organizer access
      const accessCheck = await this.checkOrganizerAccess();
      if (!accessCheck.success) {
        return { success: false, error: accessCheck.error };
      }

      const result = await dummyDb.deleteMarketingCampaign(campaignId);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to delete campaign' };
    }
  }
}

export const organizerCrudService = OrganizerCrudService.getInstance();