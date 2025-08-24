import { EventDetail } from '../types/eventDetail';

export class EventDetailService {
  async getEventDetail(eventId: string): Promise<EventDetail> {
    // Mock event detail data - replace with actual API call
    return {
      id: eventId,
      title: 'Sample Event',
      description: 'This is a sample event description',
      date: new Date().toISOString(),
      location: 'Sample Location',
      organizer: 'Sample Organizer',
      capacity: 100,
      registeredCount: 45,
      price: 99.99,
      currency: 'USD',
      status: 'active',
      tags: ['conference', 'technology'],
      imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      agenda: [
        {
          time: '09:00',
          title: 'Opening Keynote',
          speaker: 'John Doe',
          duration: 60
        },
        {
          time: '10:30',
          title: 'Panel Discussion',
          speaker: 'Various Speakers',
          duration: 90
        }
      ]
    };
  }
}

export const eventDetailService = new EventDetailService();