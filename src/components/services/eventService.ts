import { Event } from '../types/event';
import { User } from '../types/user';

// Mock database for events
let myEvents: Event[] = [];

// Mock user data for plan checking
const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    plan: "FREE",
    createdAt: new Date()
};

const getPlanConstraints = (plan: "FREE" | "PAID" | "PRO") => {
    switch (plan) {
        case 'FREE':
            return { maxActiveEvents: 1, maxTicketTypes: 2, maxCapacity: 200, allowPaidTickets: false };
        default:
            return { maxActiveEvents: Infinity, maxTicketTypes: Infinity, maxCapacity: Infinity, allowPaidTickets: true };
    }
};

export const eventService = {
  // GET /api/events/mine
  async getMyEvents(): Promise<Event[]> {
    await new Promise(res => setTimeout(res, 500)); // Simulate API delay
    return JSON.parse(JSON.stringify(myEvents));
  },

  // POST /api/events
  async createEvent(eventData: Event): Promise<{ ok: boolean, message: string, data?: Event }> {
    await new Promise(res => setTimeout(res, 500));
    const constraints = getPlanConstraints(mockUser.plan);

    if (mockUser.plan === 'FREE' && myEvents.filter(e => e.status === 'PUBLISHED').length >= constraints.maxActiveEvents) {
        return { ok: false, message: 'Upgrade required' };
    }
    
    const newEvent: Event = {
      ...eventData,
      _id: `evt_${Date.now()}`,
      ownerId: mockUser._id,
      planSnapshot: {
          tier: mockUser.plan,
          constraints
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    myEvents.push(newEvent);
    return { ok: true, message: 'Event saved as draft.', data: newEvent };
  },

  // POST /api/events/:id/publish
  async publishEvent(eventId: string): Promise<{ ok: boolean, message: string }> {
     await new Promise(res => setTimeout(res, 500));
     const eventIndex = myEvents.findIndex(e => e._id === eventId);
     if (eventIndex === -1) {
         return { ok: false, message: 'Event not found.' };
     }
     
     const event = myEvents[eventIndex];
     const constraints = getPlanConstraints(event.planSnapshot.tier);

     // Validation Checks
     if (!event.waterfall.requirements.title || !event.implementation.capacity) {
         return { ok: false, message: 'Title and Capacity are required to publish.'};
     }
     if (event.planSnapshot.tier === 'FREE') {
         if (event.implementation.capacity > constraints.maxCapacity) {
             return { ok: false, message: 'Upgrade required' };
         }
         if (event.summary.isPaid) {
            return { ok: false, message: 'Upgrade required' };
         }
     }

     myEvents[eventIndex] = { ...event, status: 'PUBLISHED', updatedAt: new Date() };
     return { ok: true, message: 'Event published successfully!' };
  }
};