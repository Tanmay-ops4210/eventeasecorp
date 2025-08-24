import { EventDetail } from '../types/eventDetail';

export class EventDetailService {
  private static mockEventDetails: EventDetail[] = [
    {
      id: '1',
      title: 'Tech Innovation Summit 2024',
      description: 'Join industry leaders for cutting-edge discussions on technology trends, innovation strategies, and the future of digital transformation.',
      date: '2024-03-15',
      time: '09:00 AM - 06:00 PM',
      location: 'San Francisco Convention Center',
      address: '747 Howard St, San Francisco, CA 94103',
      price: 299,
      capacity: 500,
      registered: 342,
      category: 'Technology',
      organizer: 'TechEvents Inc.',
      speakers: ['Dr. Sarah Chen', 'Mark Rodriguez', 'Lisa Thompson'],
      agenda: [
        { time: '09:00 AM', title: 'Registration & Networking' },
        { time: '10:00 AM', title: 'Opening Keynote: The Future of AI' },
        { time: '11:30 AM', title: 'Panel: Digital Transformation Strategies' },
        { time: '01:00 PM', title: 'Lunch & Networking' },
        { time: '02:30 PM', title: 'Workshop: Building Scalable Systems' },
        { time: '04:00 PM', title: 'Closing Remarks' }
      ],
      tags: ['AI', 'Innovation', 'Technology', 'Networking'],
      imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg'
    },
    {
      id: '2',
      title: 'Digital Marketing Masterclass',
      description: 'Learn advanced digital marketing strategies from industry experts. Perfect for marketers looking to enhance their skills.',
      date: '2024-03-22',
      time: '10:00 AM - 04:00 PM',
      location: 'Marketing Hub NYC',
      address: '123 Broadway, New York, NY 10001',
      price: 199,
      capacity: 150,
      registered: 89,
      category: 'Marketing',
      organizer: 'Digital Marketing Pro',
      speakers: ['Jennifer Walsh', 'David Kim'],
      agenda: [
        { time: '10:00 AM', title: 'Welcome & Introduction' },
        { time: '10:30 AM', title: 'SEO Best Practices 2024' },
        { time: '12:00 PM', title: 'Lunch Break' },
        { time: '01:00 PM', title: 'Social Media Strategy Workshop' },
        { time: '03:00 PM', title: 'Q&A and Networking' }
      ],
      tags: ['Marketing', 'SEO', 'Social Media', 'Strategy'],
      imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg'
    }
  ];

  static async getEventDetail(id: string): Promise<EventDetail | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const event = this.mockEventDetails.find(event => event.id === id);
    return event || null;
  }

  static async getAllEventDetails(): Promise<EventDetail[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...this.mockEventDetails];
  }

  static async createEventDetail(eventDetail: Omit<EventDetail, 'id'>): Promise<EventDetail> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newEvent: EventDetail = {
      ...eventDetail,
      id: (this.mockEventDetails.length + 1).toString()
    };
    
    this.mockEventDetails.push(newEvent);
    return newEvent;
  }

  static async updateEventDetail(id: string, updates: Partial<EventDetail>): Promise<EventDetail | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.mockEventDetails.findIndex(event => event.id === id);
    if (index === -1) return null;
    
    this.mockEventDetails[index] = { ...this.mockEventDetails[index], ...updates };
    return this.mockEventDetails[index];
  }

  static async deleteEventDetail(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.mockEventDetails.findIndex(event => event.id === id);
    if (index === -1) return false;
    
    this.mockEventDetails.splice(index, 1);
    return true;
  }
}

// Export singleton instance
export const eventDetailService = EventDetailService;