import { EventDetail } from '../types/eventDetail';

export class EventDetailService {
  private static mockEventDetails: EventDetail[] = [
    {
      id: '1',
      title: 'Tech Innovation Summit 2024',
      description: 'Join industry leaders for cutting-edge discussions on technology trends, innovation strategies, and the future of digital transformation.',
      fullDescription: 'Join industry leaders for cutting-edge discussions on technology trends, innovation strategies, and the future of digital transformation. This comprehensive summit brings together visionaries, entrepreneurs, and technologists to explore the latest innovations shaping our digital future.\n\nDiscover breakthrough technologies, learn from successful case studies, and network with like-minded professionals. Our expert speakers will share insights on artificial intelligence, machine learning, blockchain, IoT, and emerging technologies that are revolutionizing industries worldwide.',
      date: '2024-03-15',
      time: '09:00 AM - 06:00 PM',
      endTime: '06:00 PM',
      location: 'San Francisco Convention Center',
      venue: {
        name: 'San Francisco Convention Center',
        address: '747 Howard St, San Francisco, CA 94103',
        coordinates: {
          lat: 37.7849,
          lng: -122.4094
        },
        capacity: 500,
        amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Accessibility']
      },
      price: {
        early: 199,
        regular: 299,
        vip: 499,
        student: 149
      },
      maxAttendees: 500,
      currentAttendees: 342,
      category: 'Technology',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      gallery: [
        'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'
      ],
      organizer: {
        id: 'org1',
        name: 'TechEvents Inc.',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        bio: 'Leading technology event organizer with over 10 years of experience in creating world-class conferences and summits.',
        contact: 'info@techevents.com'
      },
      speakers: [
        {
          id: 'speaker1',
          name: 'Dr. Sarah Chen',
          title: 'Chief Technology Officer',
          company: 'Innovation Labs',
          image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
          bio: 'Leading expert in AI and machine learning with 15+ years of experience.',
          sessions: ['Opening Keynote: The Future of AI']
        },
        {
          id: 'speaker2',
          name: 'Mark Rodriguez',
          title: 'Senior Software Architect',
          company: 'Tech Solutions',
          image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
          bio: 'Specialist in scalable system architecture and cloud technologies.',
          sessions: ['Workshop: Building Scalable Systems']
        }
      ],
      sponsors: [
        {
          id: 'sponsor1',
          name: 'TechCorp',
          logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
          tier: 'platinum',
          website: 'https://techcorp.com'
        }
      ],
      schedule: [
        {
          id: 'schedule1',
          time: '09:00 AM',
          title: 'Registration & Networking',
          description: 'Welcome reception and networking opportunity',
          room: 'Main Lobby',
          type: 'networking'
        },
        {
          id: 'schedule2',
          time: '10:00 AM',
          title: 'Opening Keynote: The Future of AI',
          description: 'Exploring the latest developments in artificial intelligence',
          speaker: 'Dr. Sarah Chen',
          room: 'Main Auditorium',
          type: 'keynote'
        },
        {
          id: 'schedule3',
          time: '11:30 AM',
          title: 'Panel: Digital Transformation Strategies',
          description: 'Industry leaders discuss transformation approaches',
          room: 'Conference Room A',
          type: 'session'
        },
        {
          id: 'schedule4',
          time: '01:00 PM',
          title: 'Lunch & Networking',
          description: 'Networking lunch with fellow attendees',
          room: 'Exhibition Hall',
          type: 'break'
        },
        {
          id: 'schedule5',
          time: '02:30 PM',
          title: 'Workshop: Building Scalable Systems',
          description: 'Hands-on workshop on system architecture',
          speaker: 'Mark Rodriguez',
          room: 'Workshop Room B',
          type: 'workshop'
        }
      ],
      tags: ['AI', 'Innovation', 'Technology', 'Networking'],
      status: 'upcoming',
      isVirtual: false,
      isFeatured: true,
      registrationUrl: 'https://example.com/register/1',
      requirements: ['Laptop', 'Business cards', 'Notebook'],
      whatToExpect: [
        'Cutting-edge technology insights',
        'Networking opportunities',
        'Hands-on workshops',
        'Expert panel discussions'
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-01T15:30:00Z'
    },
    {
      id: '2',
      title: 'Digital Marketing Masterclass',
      description: 'Learn advanced digital marketing strategies from industry experts. Perfect for marketers looking to enhance their skills.',
      fullDescription: 'Learn advanced digital marketing strategies from industry experts. Perfect for marketers looking to enhance their skills and stay ahead of the competition.\n\nThis comprehensive masterclass covers the latest trends in digital marketing, including SEO optimization, social media strategy, content marketing, and data analytics. Our expert instructors will provide practical insights and actionable strategies you can implement immediately.',
      date: '2024-03-22',
      time: '10:00 AM - 04:00 PM',
      endTime: '04:00 PM',
      location: 'Marketing Hub NYC',
      venue: {
        name: 'Marketing Hub NYC',
        address: '123 Broadway, New York, NY 10001',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        },
        capacity: 150,
        amenities: ['WiFi', 'Catering', 'Projectors', 'Whiteboards']
      },
      price: {
        early: 149,
        regular: 199,
        vip: 299,
        student: 99
      },
      maxAttendees: 150,
      currentAttendees: 89,
      category: 'Marketing',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
      gallery: [
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg'
      ],
      organizer: {
        id: 'org2',
        name: 'Digital Marketing Pro',
        avatar: 'https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg',
        bio: 'Premier digital marketing education company specializing in practical, results-driven training.',
        contact: 'hello@digitalmarketingpro.com'
      },
      speakers: [
        {
          id: 'speaker3',
          name: 'Jennifer Walsh',
          title: 'Digital Marketing Director',
          company: 'Marketing Excellence',
          image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
          bio: 'Award-winning digital marketer with expertise in SEO and content strategy.',
          sessions: ['SEO Best Practices 2024']
        },
        {
          id: 'speaker4',
          name: 'David Kim',
          title: 'Social Media Strategist',
          company: 'Social Impact Agency',
          image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
          bio: 'Social media expert helping brands build authentic online communities.',
          sessions: ['Social Media Strategy Workshop']
        }
      ],
      sponsors: [
        {
          id: 'sponsor2',
          name: 'MarketingTools',
          logo: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
          tier: 'gold',
          website: 'https://marketingtools.com'
        }
      ],
      schedule: [
        {
          id: 'schedule6',
          time: '10:00 AM',
          title: 'Welcome & Introduction',
          description: 'Course overview and introductions',
          room: 'Main Room',
          type: 'session'
        },
        {
          id: 'schedule7',
          time: '10:30 AM',
          title: 'SEO Best Practices 2024',
          description: 'Latest SEO strategies and techniques',
          speaker: 'Jennifer Walsh',
          room: 'Main Room',
          type: 'session'
        },
        {
          id: 'schedule8',
          time: '12:00 PM',
          title: 'Lunch Break',
          description: 'Networking lunch',
          room: 'Cafeteria',
          type: 'break'
        },
        {
          id: 'schedule9',
          time: '01:00 PM',
          title: 'Social Media Strategy Workshop',
          description: 'Hands-on social media planning',
          speaker: 'David Kim',
          room: 'Workshop Room',
          type: 'workshop'
        },
        {
          id: 'schedule10',
          time: '03:00 PM',
          title: 'Q&A and Networking',
          description: 'Questions and networking session',
          room: 'Main Room',
          type: 'networking'
        }
      ],
      tags: ['Marketing', 'SEO', 'Social Media', 'Strategy'],
      status: 'upcoming',
      isVirtual: false,
      isFeatured: false,
      registrationUrl: 'https://example.com/register/2',
      requirements: ['Laptop', 'Marketing materials for review'],
      whatToExpect: [
        'Advanced marketing strategies',
        'Practical workshops',
        'Industry insights',
        'Networking opportunities'
      ],
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-02-05T09:15:00Z'
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