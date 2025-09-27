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

let mockEvents: RealEvent[] = [];

class RealEventService {
  private static instance: RealEventService;
  private eventListeners: ((events: any[]) => void)[] = [];

  static getInstance(): RealEventService {
    if (!RealEventService.instance) {
      RealEventService.instance = new RealEventService();
    }
    return RealEventService.instance;
  }

  // Add event listener for real-time updates
  addEventListener(callback: (events: any[]) => void) {
    this.eventListeners.push(callback);
  }

  removeEventListener(callback: (events: any[]) => void) {
    this.eventListeners = this.eventListeners.filter(listener => listener !== callback);
  }

  private notifyEventListeners() {
    this.eventListeners.forEach(callback => callback([...mockEvents]));
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
      // Mock event creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEvent: RealEvent = {
        id: `evt_${Date.now()}`,
        organizer_id: organizerId,
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.event_date,
        time: eventData.time,
        end_time: eventData.end_time,
        venue: eventData.venue,
        capacity: eventData.capacity,
        image_url: eventData.image_url,
        category: eventData.category,
        status: 'draft',
        visibility: eventData.visibility,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store the event in mock storage
      mockEvents.push(newEvent);

      // Notify listeners of the change
      this.notifyEventListeners();

      return { success: true, event: newEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to create event: ${message}` };
    }
  }

  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: RealEvent[]; error?: string }> {
    try {
      // Mock events fetch
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Filter events by organizer
      const organizerEvents = mockEvents.filter(event => event.organizer_id === organizerId);

      return { success: true, events: organizerEvents };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch events: ${message}` };
    }
  }
  
  async getEventById(eventId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      // Mock event fetch
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockEvent: RealEvent = {
        id: eventId,
        organizer_id: 'org_1',
        title: 'Sample Event',
        description: 'Sample event description',
        event_date: '2024-03-15',
        time: '09:00',
        venue: 'Sample Venue',
        capacity: 100,
        category: 'conference',
        status: 'published',
        visibility: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return { success: true, event: mockEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: `Failed to fetch event: ${message}` };
    }
  }

  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const updatedEvent: RealEvent = {
        id: eventId,
        organizer_id: 'org_1',
        title: updates.title || 'Updated Event',
        description: updates.description,
        event_date: updates.event_date || '2024-03-15',
        time: updates.time || '09:00',
        end_time: updates.end_time,
        venue: updates.venue || 'Updated Venue',
        capacity: updates.capacity || 100,
        image_url: updates.image_url,
        category: updates.category || 'conference',
        status: 'draft',
        visibility: updates.visibility || 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return { success: true, event: updatedEvent };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return { success: false, error: `Failed to update event: ${message}` };
    }
  }
  
  async getDashboardStats(organizerId: string): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      // Mock dashboard stats
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const stats: DashboardStats = {
        totalEvents: 5,
        publishedEvents: 3,
        draftEvents: 2,
        totalTicketsSold: 150,
        totalRevenue: 15000,
        upcomingEvents: 2,
        completedEvents: 1,
        averageAttendance: 30
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
      // Mock delete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find and remove the event from mock storage
      const eventIndex = mockEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }
      
      mockEvents.splice(eventIndex, 1);

      // Notify listeners of the change
      this.notifyEventListeners();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete event' };
    }
  }

  async publishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock publish
      await new Promise(resolve => setTimeout(resolve, 300));

      // Find and update the event in mock storage
      const eventIndex = mockEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }
      
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        status: 'published',
        updated_at: new Date().toISOString()
      };

      // Notify listeners of the change
      this.notifyEventListeners();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to publish event' };
    }
  }

  async hideEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock hide
      await new Promise(resolve => setTimeout(resolve, 200));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to hide event' };
    }
  }

  async showEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock show
      await new Promise(resolve => setTimeout(resolve, 200));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to show event' };
    }
  }
  
  async createTicketType(eventId: string, ticketData: TicketFormData): Promise<{ success: boolean; ticket?: RealTicketType; error?: string }> {
    try {
      // Mock ticket creation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newTicket: RealTicketType = {
        id: `ticket_${Date.now()}`,
        event_id: eventId,
        ...ticketData,
        sold: 0,
        created_at: new Date().toISOString()
      };

      return { success: true, ticket: newTicket };
    } catch (error) {
      return { success: false, error: 'Failed to create ticket type' };
    }
  }

  async getTicketTypes(eventId: string): Promise<{ success: boolean; tickets?: RealTicketType[]; error?: string }> {
    try {
      // Mock ticket types
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockTickets: RealTicketType[] = [
        {
          id: 'ticket_1',
          event_id: eventId,
          name: 'General Admission',
          price: 50,
          currency: 'USD',
          quantity: 100,
          sold: 25,
          sale_start: new Date().toISOString(),
          sale_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          benefits: [],
          restrictions: [],
          created_at: new Date().toISOString()
        }
      ];

      return { success: true, tickets: mockTickets };
    } catch (error) {
      return { success: false, error: 'Failed to fetch ticket types' };
    }
  }

  async updateTicketType(ticketId: string, updates: Partial<TicketFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 300));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update ticket type' };
    }
  }

  async deleteTicketType(ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock delete
      await new Promise(resolve => setTimeout(resolve, 300));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket type' };
    }
  }

  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: RealAttendee[]; error?: string }> {
    try {
      // Mock attendees
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockAttendees: RealAttendee[] = [
        {
          id: 'attendee_1',
          event_id: eventId,
          user_id: 'user_1',
          ticket_type_id: 'ticket_1',
          registration_date: new Date().toISOString(),
          check_in_status: 'pending',
          payment_status: 'completed',
          additional_info: {},
          user: {
            full_name: 'John Doe',
            email: 'john@example.com'
          },
          ticket_type: {
            name: 'General Admission',
            price: 50
          }
        }
      ];

      return { success: true, attendees: mockAttendees };
    } catch (error) {
      return { success: false, error: 'Failed to fetch attendees' };
    }
  }

  async updateAttendeeStatus(attendeeId: string, checkInStatus: 'pending' | 'checked-in' | 'no-show'): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock status update
      await new Promise(resolve => setTimeout(resolve, 200));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update attendee status' };
    }
  }

  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: RealEventAnalytics; error?: string }> {
    try {
      // Mock analytics
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockAnalytics: RealEventAnalytics = {
        id: 'analytics_1',
        event_id: eventId,
        views: 1250,
        registrations: 85,
        conversion_rate: 6.8,
        revenue: 4250,
        top_referrers: ['Direct', 'Social Media', 'Email'],
        updated_at: new Date().toISOString()
      };

      return { success: true, analytics: mockAnalytics };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  async incrementEventViews(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock view increment
      console.log(`Views incremented for event: ${eventId}`);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to increment views' };
    }
  }

  async createMarketingCampaign(eventId: string, campaignData: Omit<RealMarketingCampaign, 'id' | 'event_id' | 'created_at' | 'open_rate' | 'click_rate'>): Promise<{ success: boolean; campaign?: RealMarketingCampaign; error?: string }> {
    try {
      // Mock campaign creation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newCampaign: RealMarketingCampaign = {
        id: `campaign_${Date.now()}`,
        event_id: eventId,
        ...campaignData,
        open_rate: Math.random() * 30 + 10,
        click_rate: Math.random() * 10 + 2,
        created_at: new Date().toISOString()
      };

      return { success: true, campaign: newCampaign };
    } catch (error) {
      return { success: false, error: 'Failed to create campaign' };
    }
  }

  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: RealMarketingCampaign[]; error?: string }> {
    try {
      // Mock campaigns
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockCampaigns: RealMarketingCampaign[] = [
        {
          id: 'campaign_1',
          event_id: eventId,
          name: 'Pre-Event Announcement',
          type: 'email',
          subject: 'Don\'t miss our event!',
          status: 'sent',
          open_rate: 24.5,
          click_rate: 8.2,
          created_at: new Date().toISOString()
        }
      ];

      return { success: true, campaigns: mockCampaigns };
    } catch (error) {
      return { success: false, error: 'Failed to fetch campaigns' };
    }
  }

  async updateMarketingCampaign(campaignId: string, updates: Partial<RealMarketingCampaign>): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 300));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update campaign' };
    }
  }

  async deleteMarketingCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock delete
      await new Promise(resolve => setTimeout(resolve, 300));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete campaign' };
    }
  }

  subscribeToEventUpdates(organizerId: string, callback: (payload: any) => void) {
    // Mock subscription
    return {
      unsubscribe: () => {}
    };
  }

  subscribeToAttendeeUpdates(eventId: string, callback: (payload: any) => void) {
    // Mock subscription
    return {
      unsubscribe: () => {}
    };
  }

  subscribeToAnalyticsUpdates(eventId: string, callback: (payload: any) => void) {
    // Mock subscription
    return {
      unsubscribe: () => {}
    };
  }
}

export const realEventService = RealEventService.getInstance();