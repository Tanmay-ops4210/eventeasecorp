// Dummy Database Service
// Replaces Supabase database operations with local storage simulation

export interface DummyEvent {
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
  price?: number;
  currency?: string;
}

export interface DummyTicketType {
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

export interface DummyAttendee {
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

export interface DummyEventAnalytics {
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

export interface DummyMarketingCampaign {
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

class DummyDatabaseService {
  private static instance: DummyDatabaseService;

  static getInstance(): DummyDatabaseService {
    if (!DummyDatabaseService.instance) {
      DummyDatabaseService.instance = new DummyDatabaseService();
    }
    return DummyDatabaseService.instance;
  }

  // Initialize with default data
  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize events if not exists
    if (!localStorage.getItem('dummy_events')) {
      const defaultEvents: DummyEvent[] = [
        {
          id: 'evt_1',
          organizer_id: 'organizer_user_1',
          title: 'Tech Innovation Summit 2024',
          description: 'Join industry leaders for cutting-edge technology discussions and networking.',
          category: 'technology',
          event_date: '2024-03-15',
          time: '09:00',
          end_time: '18:00',
          venue: 'San Francisco Convention Center',
          capacity: 500,
          image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          status: 'published',
          visibility: 'public',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: new Date().toISOString(),
          price: 299,
          currency: 'USD'
        },
        {
          id: 'evt_2',
          organizer_id: 'organizer_user_1',
          title: 'Digital Marketing Workshop',
          description: 'Learn the latest digital marketing strategies from industry experts.',
          category: 'marketing',
          event_date: '2024-03-22',
          time: '10:00',
          end_time: '16:00',
          venue: 'New York Business Center',
          capacity: 150,
          image_url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
          status: 'draft',
          visibility: 'public',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: new Date().toISOString(),
          price: 199,
          currency: 'USD'
        }
      ];
      localStorage.setItem('dummy_events', JSON.stringify(defaultEvents));
    }

    // Initialize ticket types if not exists
    if (!localStorage.getItem('dummy_ticket_types')) {
      const defaultTicketTypes: DummyTicketType[] = [
        {
          id: 'ticket_1',
          event_id: 'evt_1',
          name: 'Early Bird',
          description: 'Limited time early bird pricing',
          price: 199,
          currency: 'USD',
          quantity: 100,
          sold: 85,
          sale_start: '2024-01-01T00:00:00Z',
          sale_end: '2024-02-15T23:59:59Z',
          is_active: true,
          benefits: ['Early access', 'Welcome kit'],
          restrictions: ['Non-refundable'],
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'ticket_2',
          event_id: 'evt_1',
          name: 'Regular',
          description: 'Standard conference ticket',
          price: 299,
          currency: 'USD',
          quantity: 400,
          sold: 245,
          sale_start: '2024-02-16T00:00:00Z',
          sale_end: '2024-03-10T23:59:59Z',
          is_active: true,
          benefits: ['Access to all sessions'],
          restrictions: ['Refundable until 7 days before'],
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
      localStorage.setItem('dummy_ticket_types', JSON.stringify(defaultTicketTypes));
    }

    // Initialize analytics if not exists
    if (!localStorage.getItem('dummy_analytics')) {
      const defaultAnalytics: DummyEventAnalytics[] = [
        {
          id: 'analytics_1',
          event_id: 'evt_1',
          views: 2450,
          registrations: 330,
          conversion_rate: 13.5,
          revenue: 89565,
          top_referrers: ['Direct', 'Social Media', 'Email Campaign'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('dummy_analytics', JSON.stringify(defaultAnalytics));
    }
  }

  // Event CRUD operations
  async createEvent(eventData: Omit<DummyEvent, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; event?: DummyEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const events = this.getEvents();
      const newEvent: DummyEvent = {
        ...eventData,
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      events.push(newEvent);
      localStorage.setItem('dummy_events', JSON.stringify(events));

      // Create analytics record
      const analytics = this.getAnalytics();
      analytics.push({
        id: `analytics_${Date.now()}`,
        event_id: newEvent.id,
        views: 0,
        registrations: 0,
        conversion_rate: 0,
        revenue: 0,
        top_referrers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localStorage.setItem('dummy_analytics', JSON.stringify(analytics));

      return { success: true, event: newEvent };
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
  }): Promise<{ success: boolean; events?: DummyEvent[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let events = this.getEventsFromStorage();

      if (filters?.status) {
        events = events.filter(e => e.status === filters.status);
      }
      if (filters?.category) {
        events = events.filter(e => e.category === filters.category);
      }
      if (filters?.organizer_id) {
        events = events.filter(e => e.organizer_id === filters.organizer_id);
      }
      if (filters?.offset && filters?.limit) {
        events = events.slice(filters.offset, filters.offset + filters.limit);
      } else if (filters?.limit) {
        events = events.slice(0, filters.limit);
      }

      return { success: true, events };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch events' 
      };
    }
  }

  async getEventById(eventId: string): Promise<{ success: boolean; event?: DummyEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const events = this.getEventsFromStorage();
      const event = events.find(e => e.id === eventId);

      if (!event) {
        return { success: false, error: 'Event not found' };
      }

      return { success: true, event };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch event' 
      };
    }
  }

  async updateEvent(eventId: string, updates: Partial<DummyEvent>): Promise<{ success: boolean; event?: DummyEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const events = this.getEventsFromStorage();
      const eventIndex = events.findIndex(e => e.id === eventId);

      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      events[eventIndex] = {
        ...events[eventIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem('dummy_events', JSON.stringify(events));
      return { success: true, event: events[eventIndex] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update event' 
      };
    }
  }

  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const events = this.getEventsFromStorage();
      const filteredEvents = events.filter(e => e.id !== eventId);
      localStorage.setItem('dummy_events', JSON.stringify(filteredEvents));

      // Also delete related data
      this.deleteRelatedData(eventId);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete event' 
      };
    }
  }

  // Ticket type operations
  async createTicketType(ticketData: Omit<DummyTicketType, 'id' | 'created_at'>): Promise<{ success: boolean; ticket?: DummyTicketType; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const ticketTypes = this.getTicketTypes();
      const newTicket: DummyTicketType = {
        ...ticketData,
        id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };

      ticketTypes.push(newTicket);
      localStorage.setItem('dummy_ticket_types', JSON.stringify(ticketTypes));

      return { success: true, ticket: newTicket };
    } catch (error) {
      return { success: false, error: 'Failed to create ticket type' };
    }
  }

  async getTicketTypesByEvent(eventId: string): Promise<{ success: boolean; tickets?: DummyTicketType[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const ticketTypes = this.getTicketTypes();
      const eventTickets = ticketTypes.filter(t => t.event_id === eventId);

      return { success: true, tickets: eventTickets };
    } catch (error) {
      return { success: false, error: 'Failed to fetch ticket types' };
    }
  }

  async updateTicketType(ticketId: string, updates: Partial<DummyTicketType>): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const ticketTypes = this.getTicketTypes();
      const ticketIndex = ticketTypes.findIndex(t => t.id === ticketId);

      if (ticketIndex === -1) {
        return { success: false, error: 'Ticket type not found' };
      }

      ticketTypes[ticketIndex] = {
        ...ticketTypes[ticketIndex],
        ...updates
      };

      localStorage.setItem('dummy_ticket_types', JSON.stringify(ticketTypes));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update ticket type' };
    }
  }

  async deleteTicketType(ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const ticketTypes = this.getTicketTypes();
      const ticket = ticketTypes.find(t => t.id === ticketId);

      if (ticket && ticket.sold > 0) {
        return { success: false, error: 'Cannot delete ticket type with existing sales' };
      }

      const filteredTickets = ticketTypes.filter(t => t.id !== ticketId);
      localStorage.setItem('dummy_ticket_types', JSON.stringify(filteredTickets));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket type' };
    }
  }

  // Analytics operations
  async getEventAnalytics(eventId: string): Promise<{ success: boolean; analytics?: DummyEventAnalytics; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const analytics = this.getAnalytics();
      let eventAnalytics = analytics.find(a => a.event_id === eventId);

      if (!eventAnalytics) {
        // Create default analytics if not exists
        eventAnalytics = {
          id: `analytics_${Date.now()}`,
          event_id: eventId,
          views: Math.floor(Math.random() * 1000) + 100,
          registrations: Math.floor(Math.random() * 50) + 10,
          conversion_rate: Math.random() * 15 + 5,
          revenue: Math.floor(Math.random() * 10000) + 1000,
          top_referrers: ['Direct', 'Social Media', 'Email Campaign'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        analytics.push(eventAnalytics);
        localStorage.setItem('dummy_analytics', JSON.stringify(analytics));
      }

      return { success: true, analytics: eventAnalytics };
    } catch (error) {
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }

  // Attendee operations
  async getEventAttendees(eventId: string): Promise<{ success: boolean; attendees?: DummyAttendee[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const attendees = this.getAttendees();
      const eventAttendees = attendees.filter(a => a.event_id === eventId);

      return { success: true, attendees: eventAttendees };
    } catch (error) {
      return { success: false, error: 'Failed to fetch attendees' };
    }
  }

  async updateAttendeeStatus(attendeeId: string, checkInStatus: 'pending' | 'checked-in' | 'no-show'): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const attendees = this.getAttendees();
      const attendeeIndex = attendees.findIndex(a => a.id === attendeeId);

      if (attendeeIndex === -1) {
        return { success: false, error: 'Attendee not found' };
      }

      attendees[attendeeIndex].check_in_status = checkInStatus;
      localStorage.setItem('dummy_attendees', JSON.stringify(attendees));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update attendee status' };
    }
  }

  // Marketing campaigns
  async getMarketingCampaigns(eventId: string): Promise<{ success: boolean; campaigns?: DummyMarketingCampaign[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const campaigns = this.getCampaigns();
      const eventCampaigns = campaigns.filter(c => c.event_id === eventId);

      return { success: true, campaigns: eventCampaigns };
    } catch (error) {
      return { success: false, error: 'Failed to fetch campaigns' };
    }
  }

  async createMarketingCampaign(eventId: string, campaignData: Omit<DummyMarketingCampaign, 'id' | 'event_id' | 'created_at' | 'open_rate' | 'click_rate'>): Promise<{ success: boolean; campaign?: DummyMarketingCampaign; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const campaigns = this.getCampaigns();
      const newCampaign: DummyMarketingCampaign = {
        ...campaignData,
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        event_id: eventId,
        open_rate: Math.random() * 30 + 10,
        click_rate: Math.random() * 10 + 2,
        created_at: new Date().toISOString()
      };

      campaigns.push(newCampaign);
      localStorage.setItem('dummy_campaigns', JSON.stringify(campaigns));

      return { success: true, campaign: newCampaign };
    } catch (error) {
      return { success: false, error: 'Failed to create campaign' };
    }
  }

  async updateMarketingCampaign(campaignId: string, updates: Partial<DummyMarketingCampaign>): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const campaigns = this.getCampaigns();
      const campaignIndex = campaigns.findIndex(c => c.id === campaignId);

      if (campaignIndex === -1) {
        return { success: false, error: 'Campaign not found' };
      }

      campaigns[campaignIndex] = {
        ...campaigns[campaignIndex],
        ...updates
      };

      localStorage.setItem('dummy_campaigns', JSON.stringify(campaigns));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update campaign' };
    }
  }

  async deleteMarketingCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const campaigns = this.getCampaigns();
      const filteredCampaigns = campaigns.filter(c => c.id !== campaignId);
      localStorage.setItem('dummy_campaigns', JSON.stringify(filteredCampaigns));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete campaign' };
    }
  }

  // Helper methods to get data from localStorage
  private getEventsFromStorage(): DummyEvent[] {
    try {
      const eventsData = localStorage.getItem('dummy_events');
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      return [];
    }
  }

  private getTicketTypes(): DummyTicketType[] {
    try {
      const ticketsData = localStorage.getItem('dummy_ticket_types');
      return ticketsData ? JSON.parse(ticketsData) : [];
    } catch (error) {
      return [];
    }
  }

  private getAttendees(): DummyAttendee[] {
    try {
      const attendeesData = localStorage.getItem('dummy_attendees');
      return attendeesData ? JSON.parse(attendeesData) : this.getDefaultAttendees();
    } catch (error) {
      return this.getDefaultAttendees();
    }
  }

  private getAnalytics(): DummyEventAnalytics[] {
    try {
      const analyticsData = localStorage.getItem('dummy_analytics');
      return analyticsData ? JSON.parse(analyticsData) : [];
    } catch (error) {
      return [];
    }
  }

  private getCampaigns(): DummyMarketingCampaign[] {
    try {
      const campaignsData = localStorage.getItem('dummy_campaigns');
      return campaignsData ? JSON.parse(campaignsData) : this.getDefaultCampaigns();
    } catch (error) {
      return this.getDefaultCampaigns();
    }
  }

  private getDefaultAttendees(): DummyAttendee[] {
    const defaultAttendees: DummyAttendee[] = [
      {
        id: 'attendee_1',
        event_id: 'evt_1',
        user_id: 'attendee_user_1',
        ticket_type_id: 'ticket_1',
        registration_date: '2024-01-15T10:00:00Z',
        check_in_status: 'pending',
        payment_status: 'completed',
        additional_info: {},
        user: {
          full_name: 'John Doe',
          email: 'attendee@example.com'
        },
        ticket_type: {
          name: 'Early Bird',
          price: 199
        }
      }
    ];

    localStorage.setItem('dummy_attendees', JSON.stringify(defaultAttendees));
    return defaultAttendees;
  }

  private getDefaultCampaigns(): DummyMarketingCampaign[] {
    const defaultCampaigns: DummyMarketingCampaign[] = [
      {
        id: 'campaign_1',
        event_id: 'evt_1',
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

    localStorage.setItem('dummy_campaigns', JSON.stringify(defaultCampaigns));
    return defaultCampaigns;
  }

  private deleteRelatedData(eventId: string) {
    // Delete ticket types
    const ticketTypes = this.getTicketTypes();
    const filteredTickets = ticketTypes.filter(t => t.event_id !== eventId);
    localStorage.setItem('dummy_ticket_types', JSON.stringify(filteredTickets));

    // Delete attendees
    const attendees = this.getAttendees();
    const filteredAttendees = attendees.filter(a => a.event_id !== eventId);
    localStorage.setItem('dummy_attendees', JSON.stringify(filteredAttendees));

    // Delete analytics
    const analytics = this.getAnalytics();
    const filteredAnalytics = analytics.filter(a => a.event_id !== eventId);
    localStorage.setItem('dummy_analytics', JSON.stringify(filteredAnalytics));

    // Delete campaigns
    const campaigns = this.getCampaigns();
    const filteredCampaigns = campaigns.filter(c => c.event_id !== eventId);
    localStorage.setItem('dummy_campaigns', JSON.stringify(filteredCampaigns));
  }

  // Alias method for compatibility
  getEvents = this.getEventsFromStorage;
}

export const dummyDb = DummyDatabaseService.getInstance();