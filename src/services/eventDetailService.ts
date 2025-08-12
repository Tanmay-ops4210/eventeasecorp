import { EventDetail } from '../types/eventDetail';

// Mock event detail data
const mockEventDetails: EventDetail[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders and innovators for a day of cutting-edge technology discussions, networking, and hands-on workshops.',
    fullDescription: `The Tech Innovation Summit 2024 is the premier technology conference bringing together industry leaders, innovators, and technology enthusiasts from around the world. This year's summit focuses on the latest trends in artificial intelligence, machine learning, cloud computing, and digital transformation.

Attendees will have the opportunity to learn from renowned speakers, participate in hands-on workshops, and network with peers and industry experts. The event features keynote presentations, panel discussions, technical sessions, and an innovation showcase highlighting the latest technological breakthroughs.

Whether you're a seasoned technology professional, startup founder, or someone looking to stay ahead of the curve, this summit offers valuable insights, practical knowledge, and networking opportunities that will help advance your career and business.`,
    category: 'Technology',
    date: '2024-03-15',
    time: '09:00 AM',
    endTime: '06:00 PM',
    location: 'San Francisco Convention Center',
    venue: {
      name: 'San Francisco Convention Center',
      address: '747 Howard St, San Francisco, CA 94103',
      coordinates: {
        lat: 37.7849,
        lng: -122.4094
      },
      capacity: 5000,
      amenities: [
        'High-speed WiFi',
        'Audio/Visual equipment',
        'Catering facilities',
        'Parking garage',
        'Accessibility features',
        'Live streaming capabilities'
      ]
    },
    price: {
      early: 199,
      regular: 299,
      vip: 499,
      student: 99
    },
    maxAttendees: 1000,
    currentAttendees: 745,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org1',
      name: 'TechEvents Inc.',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Leading event organizer specializing in technology conferences and innovation summits.',
      contact: 'info@techevents.com'
    },
    speakers: [
      {
        id: '1',
        name: 'Zawadi Thandwe',
        title: 'Chief Technology Officer',
        company: 'TechCorp Industries',
        image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Technology leader with 20+ years of experience in AI and enterprise software.',
        sessions: ['The Future of AI in Enterprise', 'Building Scalable Tech Teams']
      },
      {
        id: '2',
        name: 'Ejiro Rudo',
        title: 'Senior Product Manager',
        company: 'Innovation Labs',
        image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Product management expert focused on user-centered design and innovation.',
        sessions: ['Product Innovation Strategies']
      }
    ],
    sponsors: [
      {
        id: '1',
        name: 'TechCorp Industries',
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
        tier: 'platinum',
        website: 'https://techcorp.com'
      },
      {
        id: '2',
        name: 'Innovation Labs',
        logo: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
        tier: 'gold',
        website: 'https://innovationlabs.com'
      }
    ],
    schedule: [
      {
        id: '1',
        time: '09:00 AM',
        title: 'Registration & Welcome Coffee',
        description: 'Check-in and networking with fellow attendees',
        room: 'Main Lobby',
        type: 'networking'
      },
      {
        id: '2',
        time: '10:00 AM',
        title: 'Opening Keynote: The Future of AI in Enterprise',
        description: 'Exploring how AI is transforming business operations',
        speaker: 'Zawadi Thandwe',
        room: 'Main Auditorium',
        type: 'keynote'
      },
      {
        id: '3',
        time: '11:00 AM',
        title: 'Coffee Break & Networking',
        description: 'Refreshments and networking opportunities',
        room: 'Exhibition Hall',
        type: 'break'
      },
      {
        id: '4',
        time: '11:30 AM',
        title: 'Panel: Innovation in Startups',
        description: 'Industry leaders discuss innovation strategies',
        room: 'Conference Room A',
        type: 'session'
      },
      {
        id: '5',
        time: '01:00 PM',
        title: 'Lunch & Sponsor Showcase',
        description: 'Networking lunch with sponsor presentations',
        room: 'Exhibition Hall',
        type: 'networking'
      },
      {
        id: '6',
        time: '02:30 PM',
        title: 'Workshop: Building Scalable Tech Teams',
        description: 'Hands-on workshop on team building and management',
        speaker: 'Zawadi Thandwe',
        room: 'Workshop Room B',
        type: 'workshop'
      },
      {
        id: '7',
        time: '04:00 PM',
        title: 'Closing Keynote & Awards',
        description: 'Event wrap-up and innovation awards ceremony',
        room: 'Main Auditorium',
        type: 'keynote'
      },
      {
        id: '8',
        time: '05:30 PM',
        title: 'Networking Reception',
        description: 'Final networking opportunity with drinks and appetizers',
        room: 'Rooftop Terrace',
        type: 'networking'
      }
    ],
    tags: ['Technology', 'AI', 'Innovation', 'Startups', 'Enterprise'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: true,
    registrationUrl: 'https://eventease.com/register/tech-summit-2024',
    requirements: [
      'Valid photo ID for check-in',
      'Laptop for workshop sessions (optional)',
      'Business cards for networking',
      'Comfortable walking shoes'
    ],
    whatToExpect: [
      'Keynote presentations from industry leaders',
      'Interactive workshops and hands-on sessions',
      'Networking opportunities with 1000+ attendees',
      'Innovation showcase and product demos',
      'Complimentary meals and refreshments',
      'Access to event recordings and materials'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Digital Marketing Masterclass',
    description: 'Learn the latest digital marketing strategies from industry experts. Perfect for marketers looking to stay ahead of the curve.',
    fullDescription: `The Digital Marketing Masterclass is an intensive one-day workshop designed for marketing professionals who want to master the latest digital marketing strategies and tools. This hands-on event covers everything from social media marketing and content strategy to SEO, PPC advertising, and marketing automation.

Led by industry experts with proven track records, this masterclass combines theoretical knowledge with practical, actionable insights that you can implement immediately. Attendees will learn through case studies, live demonstrations, and interactive exercises.

The event is perfect for marketing managers, digital marketers, business owners, and anyone looking to enhance their digital marketing skills and drive better results for their organization.`,
    category: 'Marketing',
    date: '2024-03-20',
    time: '10:00 AM',
    endTime: '04:00 PM',
    location: 'New York Business Center',
    venue: {
      name: 'New York Business Center',
      address: '123 Business Ave, New York, NY 10001',
      coordinates: {
        lat: 40.7589,
        lng: -73.9851
      },
      capacity: 200,
      amenities: [
        'High-speed WiFi',
        'Presentation equipment',
        'Catering services',
        'Parking available',
        'Accessibility compliant'
      ]
    },
    price: {
      early: 149,
      regular: 199,
      vip: 299,
      student: 79
    },
    maxAttendees: 150,
    currentAttendees: 89,
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org2',
      name: 'Marketing Pro Events',
      avatar: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Specialized in organizing marketing and business development events.',
      contact: 'hello@marketingpro.com'
    },
    speakers: [
      {
        id: '3',
        name: 'Lisa Thompson',
        title: 'Digital Marketing Director',
        company: 'Marketing Dynamics',
        image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Digital marketing expert with 15+ years of experience in growth marketing.',
        sessions: ['Advanced Social Media Strategies', 'Marketing Automation Mastery']
      }
    ],
    sponsors: [
      {
        id: '4',
        name: 'Marketing Dynamics',
        logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
        tier: 'gold',
        website: 'https://marketingdynamics.com'
      }
    ],
    schedule: [
      {
        id: '1',
        time: '10:00 AM',
        title: 'Welcome & Introduction',
        description: 'Event overview and networking',
        room: 'Main Room',
        type: 'networking'
      },
      {
        id: '2',
        time: '10:30 AM',
        title: 'Digital Marketing Fundamentals',
        description: 'Core concepts and current landscape',
        speaker: 'Lisa Thompson',
        room: 'Main Room',
        type: 'session'
      },
      {
        id: '3',
        time: '12:00 PM',
        title: 'Lunch Break',
        description: 'Networking lunch with sponsors',
        room: 'Dining Area',
        type: 'break'
      },
      {
        id: '4',
        time: '01:00 PM',
        title: 'Advanced Social Media Strategies',
        description: 'Deep dive into social media marketing',
        speaker: 'Lisa Thompson',
        room: 'Main Room',
        type: 'workshop'
      },
      {
        id: '5',
        time: '03:00 PM',
        title: 'Q&A and Closing',
        description: 'Questions, answers, and final thoughts',
        room: 'Main Room',
        type: 'session'
      }
    ],
    tags: ['Marketing', 'Digital Strategy', 'Social Media', 'Growth'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/marketing-masterclass',
    requirements: [
      'Laptop or tablet for exercises',
      'Notebook for taking notes',
      'Business cards for networking'
    ],
    whatToExpect: [
      'Hands-on workshops and exercises',
      'Real-world case studies',
      'Networking with marketing professionals',
      'Actionable strategies you can implement',
      'Access to exclusive resources and templates'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
];

class EventDetailService {
  private static instance: EventDetailService;
  private events: EventDetail[] = mockEventDetails;

  static getInstance(): EventDetailService {
    if (!EventDetailService.instance) {
      EventDetailService.instance = new EventDetailService();
    }
    return EventDetailService.instance;
  }

  async getEventById(id: string): Promise<EventDetail | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.events.find(event => event.id === id) || null;
  }

  async getRelatedEvents(currentEventId: string, limit: number = 3): Promise<EventDetail[]> {
    const currentEvent = this.events.find(event => event.id === currentEventId);
    if (!currentEvent) return [];

    return this.events
      .filter(event => 
        event.id !== currentEventId && 
        event.category === currentEvent.category
      )
      .slice(0, limit);
  }

  async getEventsByCategory(category: string): Promise<EventDetail[]> {
    return this.events.filter(event => event.category === category);
  }

  async getFeaturedEvents(): Promise<EventDetail[]> {
    return this.events.filter(event => event.isFeatured);
  }

  async searchEvents(query: string): Promise<EventDetail[]> {
    const searchTerm = query.toLowerCase();
    
    return this.events.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

export const eventDetailService = EventDetailService.getInstance();