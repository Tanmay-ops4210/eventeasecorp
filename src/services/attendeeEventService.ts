import { AttendeeEvent, RegistrationData } from '../types/attendeeEvent';

// Mock storage for attendee events
let attendeeEvents: AttendeeEvent[] = [];

class AttendeeEventService {
  private static instance: AttendeeEventService;

  static getInstance(): AttendeeEventService {
    if (!AttendeeEventService.instance) {
      AttendeeEventService.instance = new AttendeeEventService();
    }
    return AttendeeEventService.instance;
  }

  async getMyEvents(userId: string): Promise<AttendeeEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter events for current user (in real app, this would be server-side)
    return attendeeEvents.filter(event => 
      event.status === 'registered' && 
      event.id.includes(userId.slice(-3)) // Simple mock user association
    ).sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
  }

  async registerForEvent(registrationData: RegistrationData, eventDetails: any): Promise<{ success: boolean; event?: AttendeeEvent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const currentUser = JSON.parse(localStorage.getItem('eventease_user') || '{}');
      
      const newAttendeeEvent: AttendeeEvent = {
        id: `attendee_evt_${Date.now()}`,
        eventId: registrationData.eventId,
        title: eventDetails.title,
        description: eventDetails.description,
        date: eventDetails.date,
        time: eventDetails.time,
        location: eventDetails.location,
        image: eventDetails.image,
        category: eventDetails.category,
        ticketType: registrationData.ticketType,
        price: registrationData.price,
        registrationDate: new Date().toISOString(),
        status: 'registered',
        paymentStatus: 'completed'
      };

      attendeeEvents.push(newAttendeeEvent);
      
      return { success: true, event: newAttendeeEvent };
    } catch (error) {
      return { success: false, error: 'Failed to register for event' };
    }
  }

  async cancelRegistration(eventId: string): Promise<{ success: boolean; refundAmount?: number; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const eventIndex = attendeeEvents.findIndex(event => event.id === eventId);
      if (eventIndex === -1) {
        return { success: false, error: 'Event registration not found' };
      }

      const event = attendeeEvents[eventIndex];
      const refundAmount = event.price * 0.9; // 90% refund (10% processing fee)

      attendeeEvents[eventIndex] = {
        ...event,
        status: 'cancelled',
        cancellationDate: new Date().toISOString(),
        refundAmount,
        paymentStatus: 'refunded'
      };

      return { success: true, refundAmount };
    } catch (error) {
      return { success: false, error: 'Failed to cancel registration' };
    }
  }

  async getEventById(eventId: string): Promise<AttendeeEvent | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendeeEvents.find(event => event.id === eventId) || null;
  }
}

export const attendeeEventService = AttendeeEventService.getInstance();