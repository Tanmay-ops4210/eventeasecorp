import { OrganizerEvent, TicketType, Attendee, EventFormData, DashboardStats, RecentActivity } from '../types/organizerEvent';

// Mock data storage
let organizerEvents: OrganizerEvent[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders for cutting-edge technology discussions and networking.',
    category: 'Technology',
    date: '2024-03-15',
    time: '09:00',
    endTime: '18:00',
    venue: {
      name: 'San Francisco Convention Center',
      address: '747 Howard St, San Francisco, CA 94103',
      capacity: 1000,
      type: 'physical'
    },
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    status: 'published',
    visibility: 'public',
    ticketTypes: [
      {
        id: '1',
        name: 'Early Bird',
        description: 'Limited time early bird pricing',
        price: 199,
        currency: 'USD',
        quantity: 100,
        sold: 85,
        available: 15,
        saleStart: '2024-01-01T00:00:00Z',
        saleEnd: '2024-02-15T23:59:59Z',
        isActive: true,
        benefits: ['Early access to sessions', 'Welcome kit', 'Networking dinner'],
        restrictions: ['Non-refundable', 'Non-transferable']
      },
      {
        id: '2',
        name: 'Regular',
        description: 'Standard conference ticket',
        price: 299,
        currency: 'USD',
        quantity: 500,
        sold: 245,
        available: 255,
        saleStart: '2024-02-16T00:00:00Z',
        saleEnd: '2024-03-10T23:59:59Z',
        isActive: true,
        benefits: ['Access to all sessions', 'Welcome kit'],
        restrictions: ['Refundable until 7 days before event']
      }
    ],
    totalTickets: 600,
    soldTickets: 330,
    revenue: 89565,
    attendees: [],
    tags: ['Technology', 'Innovation', 'Networking'],
    organizer: {
      id: 'org1',
      name: 'TechEvents Inc.',
      email: 'organizer@techevents.com'
    },
    settings: {
      allowWaitlist: true,
      requireApproval: false,
      maxTicketsPerPerson: 5,
      refundPolicy: 'Refunds available up to 7 days before the event'
    },
    analytics: {
      views: 2450,
      registrations: 330,
      conversionRate: 13.5,
      topReferrers: ['Direct', 'Social Media', 'Email Campaign']
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

let recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'ticket_sold',
    message: 'New ticket sold for Tech Innovation Summit 2024',
    timestamp: '2024-01-15T14:30:00Z',
    eventId: '1',
    eventTitle: 'Tech Innovation Summit 2024'
  },
  {
    id: '2',
    type: 'event_published',
    message: 'Tech Innovation Summit 2024 has been published',
    timestamp: '2024-01-15T10:00:00Z',
    eventId: '1',
    eventTitle: 'Tech Innovation Summit 2024'
  }
];

class OrganizerEventService {
  private static instance: OrganizerEventService;

  static getInstance(): OrganizerEventService {
    if (!OrganizerEventService.instance) {
      OrganizerEventService.instance = new OrganizerEventService();
    }
    return OrganizerEventService.instance;
  }

  // Dashboard functions
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalEvents = organizerEvents.length;
    const publishedEvents = organizerEvents.filter(e => e.status === 'published').length;
    const draftEvents = organizerEvents.filter(e => e.status === 'draft').length;
    const upcomingEvents = organizerEvents.filter(e => 
      e.status === 'published' && new Date(e.date) > new Date()
    ).length;
    const completedEvents = organizerEvents.filter(e => e.status === 'completed').length;
    
    const totalTicketsSold = organizerEvents.reduce((sum, event) => sum + event.soldTickets, 0);
    const totalRevenue = organizerEvents.reduce((sum, event) => sum + event.revenue, 0);
    const averageAttendance = totalEvents > 0 ? totalTicketsSold / totalEvents : 0;

    return {
      totalEvents,
      publishedEvents,
      draftEvents,
      totalTicketsSold,
      totalRevenue,
      upcomingEvents,
      completedEvents,
      averageAttendance
    };
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...recentActivities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);
  }

  // Event CRUD operations
  async getMyEvents(): Promise<OrganizerEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...organizerEvents].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getEventById(id: string): Promise<OrganizerEvent | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return organizerEvents.find(event => event.id === id) || null;
  }

  async createEvent(eventData: EventFormData): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newEvent: OrganizerEvent = {
        id: `evt_${Date.now()}`,
        ...eventData,
        status: 'draft',
        ticketTypes: [],
        totalTickets: 0,
        soldTickets: 0,
        revenue: 0,
        attendees: [],
        organizer: {
          id: 'current_user_id',
          name: 'Current User',
          email: 'user@example.com'
        },
        analytics: {
          views: 0,
          registrations: 0,
          conversionRate: 0,
          topReferrers: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      organizerEvents.push(newEvent);
      
      // Add activity
      recentActivities.push({
        id: `activity_${Date.now()}`,
        type: 'event_created',
        message: `Event "${eventData.title}" has been created`,
        timestamp: new Date().toISOString(),
        eventId: newEvent.id,
        eventTitle: newEvent.title
      });

      return { success: true, event: newEvent };
    } catch (error) {
      return { success: false, error: 'Failed to create event' };
    }
  }

  async updateEvent(id: string, eventData: Partial<EventFormData>): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const eventIndex = organizerEvents.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      organizerEvents[eventIndex] = {
        ...organizerEvents[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString()
      };

      return { success: true, event: organizerEvents[eventIndex] };
    } catch (error) {
      return { success: false, error: 'Failed to update event' };
    }
  }

  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const eventIndex = organizerEvents.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const event = organizerEvents[eventIndex];
      organizerEvents.splice(eventIndex, 1);

      // Add activity
      recentActivities.push({
        id: `activity_${Date.now()}`,
        type: 'event_created',
        message: `Event "${event.title}" has been deleted`,
        timestamp: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete event' };
    }
  }

  async duplicateEvent(id: string): Promise<{ success: boolean; event?: OrganizerEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const originalEvent = organizerEvents.find(event => event.id === id);
      if (!originalEvent) {
        return { success: false, error: 'Event not found' };
      }

      const duplicatedEvent: OrganizerEvent = {
        ...originalEvent,
        id: `evt_${Date.now()}`,
        title: `${originalEvent.title} (Copy)`,
        status: 'draft',
        soldTickets: 0,
        revenue: 0,
        attendees: [],
        analytics: {
          views: 0,
          registrations: 0,
          conversionRate: 0,
          topReferrers: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      organizerEvents.push(duplicatedEvent);

      return { success: true, event: duplicatedEvent };
    } catch (error) {
      return { success: false, error: 'Failed to duplicate event' };
    }
  }

  async publishEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const eventIndex = organizerEvents.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const event = organizerEvents[eventIndex];
      
      // Validation
      if (!event.title || !event.date || !event.venue.name) {
        return { success: false, error: 'Please complete all required fields before publishing' };
      }

      if (event.ticketTypes.length === 0) {
        return { success: false, error: 'Please add at least one ticket type before publishing' };
      }

      organizerEvents[eventIndex] = {
        ...event,
        status: 'published',
        updatedAt: new Date().toISOString()
      };

      // Add activity
      recentActivities.push({
        id: `activity_${Date.now()}`,
        type: 'event_published',
        message: `Event "${event.title}" has been published`,
        timestamp: new Date().toISOString(),
        eventId: event.id,
        eventTitle: event.title
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to publish event' };
    }
  }

  // Ticket management functions
  async createTicketType(eventId: string, ticketData: Omit<TicketType, 'id' | 'sold' | 'available'>): Promise<{ success: boolean; ticket?: TicketType; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const eventIndex = organizerEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const newTicket: TicketType = {
        ...ticketData,
        id: `ticket_${Date.now()}`,
        sold: 0,
        available: ticketData.quantity
      };

      organizerEvents[eventIndex].ticketTypes.push(newTicket);
      organizerEvents[eventIndex].totalTickets += ticketData.quantity;
      organizerEvents[eventIndex].updatedAt = new Date().toISOString();

      return { success: true, ticket: newTicket };
    } catch (error) {
      return { success: false, error: 'Failed to create ticket type' };
    }
  }

  async updateTicketType(eventId: string, ticketId: string, ticketData: Partial<TicketType>): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const eventIndex = organizerEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const ticketIndex = organizerEvents[eventIndex].ticketTypes.findIndex(ticket => ticket.id === ticketId);
      if (ticketIndex === -1) {
        return { success: false, error: 'Ticket type not found' };
      }

      const oldQuantity = organizerEvents[eventIndex].ticketTypes[ticketIndex].quantity;
      organizerEvents[eventIndex].ticketTypes[ticketIndex] = {
        ...organizerEvents[eventIndex].ticketTypes[ticketIndex],
        ...ticketData,
        available: (ticketData.quantity || oldQuantity) - organizerEvents[eventIndex].ticketTypes[ticketIndex].sold
      };

      // Update total tickets
      const quantityDiff = (ticketData.quantity || oldQuantity) - oldQuantity;
      organizerEvents[eventIndex].totalTickets += quantityDiff;
      organizerEvents[eventIndex].updatedAt = new Date().toISOString();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update ticket type' };
    }
  }

  async deleteTicketType(eventId: string, ticketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const eventIndex = organizerEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const ticketIndex = organizerEvents[eventIndex].ticketTypes.findIndex(ticket => ticket.id === ticketId);
      if (ticketIndex === -1) {
        return { success: false, error: 'Ticket type not found' };
      }

      const ticket = organizerEvents[eventIndex].ticketTypes[ticketIndex];
      
      if (ticket.sold > 0) {
        return { success: false, error: 'Cannot delete ticket type with existing sales' };
      }

      organizerEvents[eventIndex].ticketTypes.splice(ticketIndex, 1);
      organizerEvents[eventIndex].totalTickets -= ticket.quantity;
      organizerEvents[eventIndex].updatedAt = new Date().toISOString();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete ticket type' };
    }
  }

  // Attendee management
  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const event = organizerEvents.find(e => e.id === eventId);
    return event?.attendees || [];
  }

  async updateAttendeeStatus(eventId: string, attendeeId: string, status: 'pending' | 'checked-in' | 'no-show'): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const eventIndex = organizerEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event not found' };
      }

      const attendeeIndex = organizerEvents[eventIndex].attendees.findIndex(attendee => attendee.id === attendeeId);
      if (attendeeIndex === -1) {
        return { success: false, error: 'Attendee not found' };
      }

      organizerEvents[eventIndex].attendees[attendeeIndex].checkInStatus = status;
      organizerEvents[eventIndex].updatedAt = new Date().toISOString();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update attendee status' };
    }
  }

  // Bulk operations
  async bulkUpdateEventStatus(eventIds: string[], status: OrganizerEvent['status']): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      eventIds.forEach(id => {
        const eventIndex = organizerEvents.findIndex(event => event.id === id);
        if (eventIndex !== -1) {
          organizerEvents[eventIndex].status = status;
          organizerEvents[eventIndex].updatedAt = new Date().toISOString();
        }
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update events' };
    }
  }

  async bulkDeleteEvents(eventIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      organizerEvents = organizerEvents.filter(event => !eventIds.includes(event.id));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete events' };
    }
  }

  // Image upload simulation
  async uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate image upload - in real app, this would upload to cloud storage
      const mockImageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800`;
      
      return { success: true, url: mockImageUrl };
    } catch (error) {
      return { success: false, error: 'Failed to upload image' };
    }
  }

  // Analytics
  async getEventAnalytics(eventId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const event = organizerEvents.find(e => e.id === eventId);
    if (!event) return null;

    return {
      ...event.analytics,
      ticketSales: event.ticketTypes.map(ticket => ({
        name: ticket.name,
        sold: ticket.sold,
        revenue: ticket.sold * ticket.price
      })),
      dailyRegistrations: this.generateMockDailyData(),
      attendeeGeography: this.generateMockGeographyData()
    };
  }

  private generateMockDailyData() {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        registrations: Math.floor(Math.random() * 20) + 1
      });
    }
    return data;
  }

  private generateMockGeographyData() {
    return [
      { country: 'United States', attendees: 45 },
      { country: 'Canada', attendees: 12 },
      { country: 'United Kingdom', attendees: 8 },
      { country: 'Germany', attendees: 6 },
      { country: 'Australia', attendees: 4 }
    ];
  }
}

export const organizerEventService = OrganizerEventService.getInstance();