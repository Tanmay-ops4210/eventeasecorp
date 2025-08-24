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
    },
    {
      id: '3',
      title: 'Sustainable Business Forum',
      description: 'Discover sustainable business practices for the future. Learn how to build environmentally responsible and profitable organizations.',
      fullDescription: 'Discover sustainable business practices for the future. Learn how to build environmentally responsible and profitable organizations that make a positive impact on the world.\n\nThis forum brings together sustainability experts, business leaders, and environmental advocates to explore practical strategies for creating sustainable business models. Topics include renewable energy adoption, circular economy principles, sustainable supply chain management, and green finance.',
      date: '2024-04-05',
      time: '09:30 AM - 05:30 PM',
      endTime: '05:30 PM',
      location: 'Green Building Seattle',
      venue: {
        name: 'Green Building Seattle',
        address: '456 Eco Way, Seattle, WA 98101',
        coordinates: {
          lat: 47.6062,
          lng: -122.3321
        },
        capacity: 200,
        amenities: ['Solar Power', 'Recycling Stations', 'Organic Catering', 'LEED Certified']
      },
      price: {
        early: 99,
        regular: 149,
        vip: 249,
        student: 79
      },
      maxAttendees: 200,
      currentAttendees: 67,
      category: 'Sustainability',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      gallery: [
        'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      organizer: {
        id: 'org3',
        name: 'EcoEvents',
        avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
        bio: 'Dedicated to promoting sustainable business practices through educational events and networking.',
        contact: 'info@ecoevents.org'
      },
      speakers: [
        {
          id: 'speaker5',
          name: 'Dr. Emma Rodriguez',
          title: 'Sustainability Director',
          company: 'Green Future Corp',
          image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Leading expert in sustainable business practices and environmental impact assessment.',
          sessions: ['Sustainable Business Models', 'Green Finance Strategies']
        }
      ],
      sponsors: [
        {
          id: 'sponsor3',
          name: 'Green Future Corp',
          logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
          tier: 'gold',
          website: 'https://greenfuture.com'
        }
      ],
      schedule: [
        {
          id: 'schedule11',
          time: '09:30 AM',
          title: 'Welcome & Sustainability Overview',
          description: 'Introduction to sustainable business practices',
          room: 'Main Hall',
          type: 'session'
        },
        {
          id: 'schedule12',
          time: '11:00 AM',
          title: 'Sustainable Business Models',
          description: 'Creating profitable and sustainable business models',
          speaker: 'Dr. Emma Rodriguez',
          room: 'Main Hall',
          type: 'keynote'
        },
        {
          id: 'schedule13',
          time: '01:00 PM',
          title: 'Networking Lunch',
          description: 'Organic lunch and networking',
          room: 'Garden Terrace',
          type: 'break'
        },
        {
          id: 'schedule14',
          time: '02:30 PM',
          title: 'Green Finance Workshop',
          description: 'Financing sustainable business initiatives',
          room: 'Workshop Room',
          type: 'workshop'
        }
      ],
      tags: ['Sustainability', 'Green Business', 'Environment', 'Finance'],
      status: 'upcoming',
      isVirtual: false,
      isFeatured: false,
      registrationUrl: 'https://example.com/register/3',
      requirements: ['Notebook', 'Calculator'],
      whatToExpect: [
        'Sustainable business strategies',
        'Environmental impact assessment',
        'Green financing options',
        'Networking with eco-conscious leaders'
      ],
      createdAt: '2024-01-25T11:00:00Z',
      updatedAt: '2024-02-10T16:45:00Z'
    },
    {
      id: '4',
      title: 'Leadership Excellence Conference',
      description: 'Develop your leadership skills with renowned speakers and interactive sessions designed for executives and managers.',
      fullDescription: 'Develop your leadership skills with renowned speakers and interactive sessions designed for executives and managers at all levels.\n\nThis comprehensive conference focuses on modern leadership challenges, team management strategies, and organizational development. Learn from successful leaders who have navigated complex business environments and built high-performing teams.',
      date: '2024-04-02',
      time: '08:00 AM - 07:00 PM',
      endTime: '07:00 PM',
      location: 'Chicago Leadership Institute',
      venue: {
        name: 'Chicago Leadership Institute',
        address: '789 Leadership Blvd, Chicago, IL 60601',
        coordinates: {
          lat: 41.8781,
          lng: -87.6298
        },
        capacity: 300,
        amenities: ['Executive Lounge', 'Business Center', 'Valet Parking', 'Fine Dining']
      },
      price: {
        early: 299,
        regular: 399,
        vip: 599,
        student: 199
      },
      maxAttendees: 300,
      currentAttendees: 178,
      category: 'Business',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      gallery: [
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      organizer: {
        id: 'org4',
        name: 'Leadership Pro',
        avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
        bio: 'Premier leadership development organization with 20+ years of experience in executive training.',
        contact: 'contact@leadershippro.com'
      },
      speakers: [
        {
          id: 'speaker6',
          name: 'Michael Thompson',
          title: 'Executive Coach',
          company: 'Leadership Excellence',
          image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Former Fortune 500 CEO turned executive coach, specializing in transformational leadership.',
          sessions: ['Transformational Leadership', 'Building High-Performance Teams']
        }
      ],
      sponsors: [
        {
          id: 'sponsor4',
          name: 'Executive Solutions',
          logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
          tier: 'platinum',
          website: 'https://executivesolutions.com'
        }
      ],
      schedule: [
        {
          id: 'schedule15',
          time: '08:00 AM',
          title: 'Executive Breakfast & Registration',
          description: 'Welcome breakfast and networking',
          room: 'Executive Lounge',
          type: 'networking'
        },
        {
          id: 'schedule16',
          time: '09:30 AM',
          title: 'Transformational Leadership Keynote',
          description: 'Leading through change and uncertainty',
          speaker: 'Michael Thompson',
          room: 'Main Auditorium',
          type: 'keynote'
        },
        {
          id: 'schedule17',
          time: '12:00 PM',
          title: 'Leadership Lunch',
          description: 'Networking lunch with industry leaders',
          room: 'Dining Hall',
          type: 'break'
        },
        {
          id: 'schedule18',
          time: '02:00 PM',
          title: 'Building High-Performance Teams',
          description: 'Workshop on team dynamics and performance',
          speaker: 'Michael Thompson',
          room: 'Workshop Room A',
          type: 'workshop'
        }
      ],
      tags: ['Leadership', 'Management', 'Executive Development', 'Team Building'],
      status: 'upcoming',
      isVirtual: false,
      isFeatured: true,
      registrationUrl: 'https://example.com/register/4',
      requirements: ['Business attire', 'Notebook', 'Business cards'],
      whatToExpected: [
        'Leadership development strategies',
        'Executive coaching insights',
        'Team building techniques',
        'Networking with senior executives'
      ],
      createdAt: '2024-01-30T13:00:00Z',
      updatedAt: '2024-02-15T10:20:00Z'
    },
    {
      id: '5',
      title: 'Creative Design Bootcamp',
      description: 'Intensive 2-day bootcamp covering the latest design trends, tools, and techniques for creative professionals.',
      fullDescription: 'Intensive 2-day bootcamp covering the latest design trends, tools, and techniques for creative professionals looking to elevate their skills and portfolio.\n\nThis hands-on bootcamp combines theoretical knowledge with practical application. Participants will work on real-world design challenges, learn industry-standard tools, and receive feedback from experienced design professionals.',
      date: '2024-04-08',
      time: '09:00 AM - 06:00 PM',
      endTime: '06:00 PM',
      location: 'Design Studio Austin',
      venue: {
        name: 'Design Studio Austin',
        address: '321 Creative Ave, Austin, TX 78701',
        coordinates: {
          lat: 30.2672,
          lng: -97.7431
        },
        capacity: 80,
        amenities: ['Design Workstations', 'High-End Monitors', 'Creative Software', 'Art Supplies']
      },
      price: {
        early: 199,
        regular: 249,
        vip: 349,
        student: 149
      },
      maxAttendees: 80,
      currentAttendees: 45,
      category: 'Design',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      gallery: [
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      organizer: {
        id: 'org5',
        name: 'Creative Academy',
        avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
        bio: 'Leading design education provider offering intensive bootcamps and workshops for creative professionals.',
        contact: 'hello@creativeacademy.com'
      },
      speakers: [
        {
          id: 'speaker7',
          name: 'Alex Rivera',
          title: 'Creative Director',
          company: 'Design Studio Pro',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Award-winning creative director with expertise in brand design and digital experiences.',
          sessions: ['Modern Design Principles', 'Portfolio Development']
        }
      ],
      sponsors: [
        {
          id: 'sponsor5',
          name: 'Adobe Creative Suite',
          logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
          tier: 'gold',
          website: 'https://adobe.com'
        }
      ],
      schedule: [
        {
          id: 'schedule19',
          time: '09:00 AM',
          title: 'Design Bootcamp Kickoff',
          description: 'Welcome and bootcamp overview',
          room: 'Studio A',
          type: 'session'
        },
        {
          id: 'schedule20',
          time: '10:30 AM',
          title: 'Modern Design Principles',
          description: 'Contemporary design theory and application',
          speaker: 'Alex Rivera',
          room: 'Studio A',
          type: 'session'
        },
        {
          id: 'schedule21',
          time: '01:00 PM',
          title: 'Creative Lunch',
          description: 'Lunch and creative discussions',
          room: 'Creative Lounge',
          type: 'break'
        },
        {
          id: 'schedule22',
          time: '02:30 PM',
          title: 'Portfolio Development Workshop',
          description: 'Building a compelling design portfolio',
          speaker: 'Alex Rivera',
          room: 'Studio B',
          type: 'workshop'
        }
      ],
      tags: ['Design', 'Creative', 'Portfolio', 'Bootcamp'],
      status: 'upcoming',
      isVirtual: false,
      isFeatured: false,
      registrationUrl: 'https://example.com/register/5',
      requirements: ['Laptop', 'Design software (provided)', 'Portfolio samples'],
      whatToExpect: [
        'Hands-on design workshops',
        'Portfolio review and feedback',
        'Industry insights and trends',
        'Networking with design professionals'
      ],
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-02-20T14:30:00Z'
    },
    {
      id: '6',
      title: 'Networking Mixer: Startup Edition',
      description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in a relaxed networking environment.',
      fullDescription: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in a relaxed networking environment designed to foster meaningful business relationships.\n\nThis exclusive networking mixer brings together the startup ecosystem including founders, investors, mentors, and service providers. Enjoy curated conversations, pitch opportunities, and valuable connections that can accelerate your startup journey.',
      date: '2024-04-12',
      time: '06:00 PM - 09:00 PM',
      endTime: '09:00 PM',
      location: 'Innovation Hub Boston',
      venue: {
        name: 'Innovation Hub Boston',
        address: '555 Innovation Dr, Boston, MA 02101',
        coordinates: {
          lat: 42.3601,
          lng: -71.0589
        },
        capacity: 150,
        amenities: ['Rooftop Terrace', 'Bar Service', 'Pitch Stage', 'Networking Zones']
      },
      price: {
        early: 39,
        regular: 49,
        vip: 99,
        student: 29
      },
      maxAttendees: 150,
      currentAttendees: 95,
      category: 'Networking',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      gallery: [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      organizer: {
        id: 'org6',
        name: 'Startup Network',
        avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
        bio: 'Community-driven organization connecting startups, investors, and entrepreneurs across the ecosystem.',
        contact: 'events@startupnetwork.com'
      },
      speakers: [
        {
          id: 'speaker8',
          name: 'Jessica Park',
          title: 'Venture Partner',
          company: 'Innovation Ventures',
          image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Experienced venture capitalist with a focus on early-stage technology startups.',
          sessions: ['Startup Pitch Session']
        }
      ],
      sponsors: [
        {
          id: 'sponsor6',
          name: 'Innovation Ventures',
          logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
          tier: 'silver',
          website: 'https://innovationventures.com'
        }
      ],
      schedule: [
        {
          id: 'schedule23',
          time: '06:00 PM',
          title: 'Welcome Reception',
          description: 'Welcome drinks and initial networking',
          room: 'Main Floor',
          type: 'networking'
        },
        {
          id: 'schedule24',
          time: '07:00 PM',
          title: 'Startup Pitch Session',
          description: '5-minute startup pitches to investors',
          speaker: 'Jessica Park',
          room: 'Pitch Stage',
          type: 'session'
        },
        {
          id: 'schedule25',
          time: '08:00 PM',
          title: 'Open Networking',
          description: 'Free-form networking and conversations',
          room: 'Rooftop Terrace',
          type: 'networking'
        }
      ],
      tags: ['Networking', 'Startups', 'Entrepreneurship', 'Investment'],
      status: 'upcoming',
      isVirtual: false,
      isFeatured: false,
      registrationUrl: 'https://example.com/register/6',
      requirements: ['Business cards', 'Elevator pitch ready'],
      whatToExpect: [
        'Startup ecosystem networking',
        'Investor connections',
        'Pitch opportunities',
        'Entrepreneurial insights'
      ],
      createdAt: '2024-02-05T16:00:00Z',
      updatedAt: '2024-02-25T11:15:00Z'
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