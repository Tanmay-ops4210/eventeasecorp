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
  },
  {
    id: '3',
    title: 'Sustainable Business Workshop',
    description: 'Discover how to build sustainable business practices that benefit both your company and the environment.',
    fullDescription: `The Sustainable Business Workshop is designed for business leaders, entrepreneurs, and sustainability professionals who want to integrate environmental responsibility into their business operations. This comprehensive workshop covers sustainable business models, green supply chain management, and environmental impact measurement.

Participants will learn practical strategies for reducing environmental footprint while maintaining profitability. The workshop includes case studies from successful sustainable businesses, hands-on exercises, and networking opportunities with like-minded professionals.

Whether you're looking to make your existing business more sustainable or starting a new venture with sustainability at its core, this workshop provides the knowledge and tools you need to succeed in the green economy.`,
    category: 'Sustainability',
    date: '2024-03-25',
    time: '09:30 AM',
    endTime: '05:30 PM',
    location: 'Green Building, Seattle, WA',
    venue: {
      name: 'Green Building',
      address: '456 Eco Way, Seattle, WA 98101',
      coordinates: {
        lat: 47.6062,
        lng: -122.3321
      },
      capacity: 150,
      amenities: [
        'LEED Platinum certified',
        'Solar-powered facility',
        'Organic catering',
        'Recycling stations',
        'Electric vehicle charging'
      ]
    },
    price: {
      early: 99,
      regular: 149,
      vip: 249,
      student: 59
    },
    maxAttendees: 100,
    currentAttendees: 67,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org3',
      name: 'EcoEvents',
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Specialized in organizing sustainability-focused events and workshops.',
      contact: 'info@ecoevents.com'
    },
    speakers: [
      {
        id: '6',
        name: 'Emma Rodriguez',
        title: 'Sustainability Expert',
        company: 'Green Future Corp',
        image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Passionate about creating sustainable business practices.',
        sessions: ['Sustainable Business Models', 'Green Supply Chain']
      }
    ],
    sponsors: [
      {
        id: '6',
        name: 'Green Future Corp',
        logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
        tier: 'gold',
        website: 'https://greenfuture.com'
      }
    ],
    schedule: [
      {
        id: '1',
        time: '09:30 AM',
        title: 'Welcome & Sustainability Overview',
        description: 'Introduction to sustainable business practices',
        room: 'Main Workshop Room',
        type: 'session'
      },
      {
        id: '2',
        time: '11:00 AM',
        title: 'Sustainable Business Models',
        description: 'Exploring profitable green business strategies',
        speaker: 'Emma Rodriguez',
        room: 'Main Workshop Room',
        type: 'workshop'
      },
      {
        id: '3',
        time: '01:00 PM',
        title: 'Networking Lunch',
        description: 'Organic lunch and networking',
        room: 'Eco Café',
        type: 'networking'
      },
      {
        id: '4',
        time: '02:30 PM',
        title: 'Green Supply Chain Workshop',
        description: 'Hands-on supply chain sustainability',
        speaker: 'Emma Rodriguez',
        room: 'Workshop Room B',
        type: 'workshop'
      }
    ],
    tags: ['Sustainability', 'Green Business', 'Environment', 'Workshop'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/sustainable-business-workshop',
    requirements: [
      'Notebook for workshop exercises',
      'Business cards for networking',
      'Reusable water bottle'
    ],
    whatToExpected: [
      'Hands-on sustainability workshops',
      'Case studies from green businesses',
      'Networking with sustainability professionals',
      'Practical tools and frameworks',
      'Organic refreshments and meals'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '4',
    title: 'Leadership Excellence Conference',
    description: 'Develop your leadership skills with renowned speakers and interactive sessions designed for executives and managers.',
    fullDescription: `The Leadership Excellence Conference brings together top executives, managers, and emerging leaders for an intensive day of leadership development. This premier conference features keynote presentations from Fortune 500 CEOs, interactive workshops, and peer networking opportunities.

Attendees will explore the latest leadership theories, practical management techniques, and strategies for building high-performing teams. The conference covers topics including emotional intelligence, change management, strategic thinking, and inclusive leadership.

This event is perfect for current leaders looking to enhance their skills, emerging leaders preparing for greater responsibilities, and anyone interested in developing their leadership potential.`,
    category: 'Business',
    date: '2024-04-02',
    time: '08:00 AM',
    endTime: '07:00 PM',
    location: 'Chicago Leadership Institute, IL',
    venue: {
      name: 'Chicago Leadership Institute',
      address: '789 Leadership Blvd, Chicago, IL 60601',
      coordinates: {
        lat: 41.8781,
        lng: -87.6298
      },
      capacity: 300,
      amenities: [
        'Executive meeting rooms',
        'High-tech presentation equipment',
        'Gourmet catering',
        'Valet parking',
        'Concierge services'
      ]
    },
    price: {
      early: 299,
      regular: 399,
      vip: 599,
      student: 199
    },
    maxAttendees: 200,
    currentAttendees: 178,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org4',
      name: 'Leadership Pro',
      avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Premier leadership development organization.',
      contact: 'info@leadershippro.com'
    },
    speakers: [
      {
        id: '4',
        name: 'David Park',
        title: 'Executive Leadership Coach',
        company: 'Leadership Pro',
        image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Executive coach with 25+ years of leadership experience.',
        sessions: ['Strategic Leadership', 'Building High-Performance Teams']
      }
    ],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '08:00 AM',
        title: 'Executive Breakfast & Registration',
        description: 'Networking breakfast for attendees',
        room: 'Executive Lounge',
        type: 'networking'
      },
      {
        id: '2',
        time: '09:00 AM',
        title: 'Opening Keynote: Strategic Leadership',
        description: 'Leadership in the modern business environment',
        speaker: 'David Park',
        room: 'Main Auditorium',
        type: 'keynote'
      }
    ],
    tags: ['Leadership', 'Management', 'Business', 'Executive'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: true,
    registrationUrl: 'https://eventease.com/register/leadership-excellence',
    requirements: [
      'Business attire required',
      'Notebook for exercises',
      'Business cards for networking'
    ],
    whatToExpect: [
      'Keynote from Fortune 500 CEOs',
      'Interactive leadership workshops',
      'Executive networking opportunities',
      'Leadership assessment tools',
      'Gourmet meals and refreshments'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    title: 'Creative Design Bootcamp',
    description: 'Intensive 2-day bootcamp covering the latest design trends, tools, and techniques for creative professionals.',
    fullDescription: `The Creative Design Bootcamp is an intensive two-day program designed for designers, creative professionals, and anyone looking to enhance their design skills. This hands-on bootcamp covers the latest design trends, industry-standard tools, and proven techniques used by top creative agencies.

Participants will work on real-world projects, receive feedback from industry experts, and build a portfolio piece during the bootcamp. The program includes sessions on user experience design, visual identity, digital design tools, and creative problem-solving methodologies.

This bootcamp is perfect for graphic designers, UX/UI designers, brand managers, and creative professionals looking to stay current with industry trends and enhance their skill set.`,
    category: 'Design',
    date: '2024-04-08',
    time: '09:00 AM',
    endTime: '06:00 PM',
    location: 'Design Studio, Austin, TX',
    venue: {
      name: 'Design Studio',
      address: '321 Creative Ave, Austin, TX 78701',
      coordinates: {
        lat: 30.2672,
        lng: -97.7431
      },
      capacity: 75,
      amenities: [
        'Mac workstations',
        'Design software licenses',
        'High-resolution displays',
        'Creative workspace',
        'Inspiration library'
      ]
    },
    price: {
      early: 199,
      regular: 249,
      vip: 349,
      student: 149
    },
    maxAttendees: 50,
    currentAttendees: 45,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org5',
      name: 'Creative Academy',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Leading design education and training organization.',
      contact: 'hello@creativeacademy.com'
    },
    speakers: [
      {
        id: '3',
        name: 'Daniel Saoirse',
        title: 'Creative Director',
        company: 'Design Studio Pro',
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Award-winning creative director with 15+ years of experience.',
        sessions: ['Design Thinking Workshop', 'Brand Identity Masterclass']
      }
    ],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '09:00 AM',
        title: 'Design Thinking Workshop',
        description: 'Introduction to design thinking methodology',
        speaker: 'Daniel Saoirse',
        room: 'Main Studio',
        type: 'workshop'
      }
    ],
    tags: ['Design', 'Creative', 'Bootcamp', 'Skills'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/design-bootcamp',
    requirements: [
      'Laptop with design software',
      'Portfolio samples',
      'Notebook for sketching'
    ],
    whatToExpect: [
      'Hands-on design workshops',
      'Portfolio review sessions',
      'Industry expert feedback',
      'Design tool training',
      'Creative networking'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '6',
    title: 'Networking Mixer: Startup Edition',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in a relaxed networking environment.',
    fullDescription: `The Networking Mixer: Startup Edition is designed specifically for entrepreneurs, startup founders, investors, and anyone involved in the startup ecosystem. This relaxed evening event provides the perfect opportunity to make meaningful connections, share ideas, and explore potential collaborations.

The mixer features structured networking activities, pitch opportunities for early-stage startups, and informal conversations over drinks and appetizers. Attendees will have the chance to meet like-minded individuals, potential co-founders, investors, and mentors.

Whether you're launching your first startup, looking for your next investment opportunity, or simply want to be part of the vibrant startup community, this mixer offers valuable networking in a comfortable, welcoming environment.`,
    category: 'Networking',
    date: '2024-04-12',
    time: '06:00 PM',
    endTime: '09:00 PM',
    location: 'Innovation Hub, Boston, MA',
    venue: {
      name: 'Innovation Hub',
      address: '123 Startup St, Boston, MA 02101',
      coordinates: {
        lat: 42.3601,
        lng: -71.0589
      },
      capacity: 150,
      amenities: [
        'Open networking space',
        'Bar and catering',
        'Presentation area',
        'Startup showcase displays',
        'Parking available'
      ]
    },
    price: {
      early: 39,
      regular: 49,
      vip: 79,
      student: 25
    },
    maxAttendees: 120,
    currentAttendees: 95,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org6',
      name: 'Startup Network',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Connecting entrepreneurs and fostering startup growth.',
      contact: 'events@startupnetwork.com'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '06:00 PM',
        title: 'Welcome Reception',
        description: 'Check-in and welcome drinks',
        room: 'Main Floor',
        type: 'networking'
      },
      {
        id: '2',
        time: '07:00 PM',
        title: 'Startup Pitch Session',
        description: '60-second startup pitches',
        room: 'Presentation Area',
        type: 'session'
      }
    ],
    tags: ['Networking', 'Startups', 'Entrepreneurs', 'Investors'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/startup-mixer',
    requirements: [
      'Business cards',
      'Elevator pitch prepared',
      'Professional attire'
    ],
    whatToExpect: [
      'Structured networking activities',
      'Startup pitch opportunities',
      'Investor meetups',
      'Drinks and appetizers',
      'Startup showcase displays'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '7',
    title: 'Mumbai Grand Wedding Exhibition',
    description: 'Discover the latest wedding trends, vendors, and services. Connect with top wedding planners and designers in Maharashtra.',
    fullDescription: `The Mumbai Grand Wedding Exhibition is Maharashtra's largest wedding showcase, bringing together the finest wedding vendors, planners, and service providers under one roof. This comprehensive exhibition features everything needed to plan the perfect wedding, from traditional to contemporary styles.

Visitors will discover the latest wedding trends, meet top vendors, and get exclusive deals on wedding services. The exhibition includes fashion shows, live demonstrations, tasting sessions, and expert consultations with renowned wedding planners.

Whether you're planning a traditional Indian wedding, a modern celebration, or a fusion event, this exhibition provides inspiration, resources, and connections to make your special day unforgettable.`,
    category: 'Wedding',
    date: '2024-03-28',
    time: '10:00 AM',
    endTime: '08:00 PM',
    location: 'Bombay Exhibition Centre, Mumbai, Maharashtra',
    venue: {
      name: 'Bombay Exhibition Centre',
      address: 'Goregaon East, Mumbai, Maharashtra 400063',
      coordinates: {
        lat: 19.1646,
        lng: 72.8493
      },
      capacity: 8000,
      amenities: [
        'Multiple exhibition halls',
        'Fashion show runway',
        'Food court',
        'Parking facilities',
        'Air conditioning'
      ]
    },
    price: {
      early: 100,
      regular: 150,
      vip: 300,
      student: 75
    },
    maxAttendees: 5000,
    currentAttendees: 2800,
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org7',
      name: 'Maharashtra Wedding Planners Association',
      avatar: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Leading wedding planning association in Maharashtra.',
      contact: 'info@mwpa.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '10:00 AM',
        title: 'Exhibition Opening',
        description: 'Grand opening ceremony',
        room: 'Main Hall',
        type: 'session'
      },
      {
        id: '2',
        time: '02:00 PM',
        title: 'Bridal Fashion Show',
        description: 'Latest bridal fashion trends',
        room: 'Fashion Runway',
        type: 'session'
      }
    ],
    tags: ['Wedding', 'Exhibition', 'Maharashtra', 'Vendors'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/mumbai-wedding-expo',
    requirements: [
      'Valid ID for entry',
      'Comfortable walking shoes',
      'Wedding planning checklist'
    ],
    whatToExpect: [
      'Wedding vendor exhibitions',
      'Fashion shows and demonstrations',
      'Expert consultations',
      'Exclusive vendor discounts',
      'Wedding planning resources'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '8',
    title: 'Pune Corporate Leadership Summit',
    description: 'Annual leadership conference featuring industry experts and networking opportunities for business professionals.',
    fullDescription: `The Pune Corporate Leadership Summit is an annual gathering of business leaders, executives, and professionals from across Maharashtra and India. This prestigious summit focuses on leadership excellence, corporate strategy, and business innovation in the modern economy.

The summit features keynote presentations from successful business leaders, panel discussions on current industry challenges, and workshops on leadership development. Attendees will gain insights into effective leadership strategies, corporate governance, and sustainable business practices.

This event is ideal for CEOs, senior executives, middle management, and emerging leaders who want to enhance their leadership capabilities and expand their professional network.`,
    category: 'Business',
    date: '2024-04-12',
    time: '09:00 AM',
    endTime: '06:00 PM',
    location: 'Pune International Centre, Pune, Maharashtra',
    venue: {
      name: 'Pune International Centre',
      address: 'Senapati Bapat Road, Pune, Maharashtra 411016',
      coordinates: {
        lat: 18.5314,
        lng: 73.8447
      },
      capacity: 1200,
      amenities: [
        'Modern conference facilities',
        'High-speed internet',
        'Professional catering',
        'Ample parking',
        'Business center'
      ]
    },
    price: {
      early: 1999,
      regular: 2500,
      vip: 3500,
      student: 999
    },
    maxAttendees: 800,
    currentAttendees: 450,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org8',
      name: 'Pune Business Council',
      avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Premier business organization in Pune promoting corporate excellence.',
      contact: 'events@punebusiness.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '09:00 AM',
        title: 'Registration & Welcome',
        description: 'Check-in and networking breakfast',
        room: 'Main Lobby',
        type: 'networking'
      },
      {
        id: '2',
        time: '10:00 AM',
        title: 'Leadership in Digital Age',
        description: 'Keynote on modern leadership challenges',
        room: 'Main Auditorium',
        type: 'keynote'
      }
    ],
    tags: ['Leadership', 'Corporate', 'Business', 'Maharashtra'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/pune-leadership-summit',
    requirements: [
      'Business formal attire',
      'Business cards',
      'Government ID'
    ],
    whatToExpect: [
      'Industry expert keynotes',
      'Leadership workshops',
      'Corporate networking',
      'Business strategy sessions',
      'Professional development'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '9',
    title: 'Ganesh Festival Cultural Celebration',
    description: 'Join the grand celebration of Lord Ganesh with traditional music, dance, and cultural performances.',
    fullDescription: `The Ganesh Festival Cultural Celebration is one of Mumbai's most significant cultural events, bringing together thousands of devotees and cultural enthusiasts to celebrate Lord Ganesh. This grand celebration features traditional music, classical dance performances, and cultural programs that showcase Maharashtra's rich heritage.

The festival includes elaborate decorations, traditional food stalls, cultural exhibitions, and community activities. Visitors can participate in traditional rituals, enjoy classical performances, and experience the vibrant culture of Maharashtra.

This celebration is perfect for families, cultural enthusiasts, and anyone interested in experiencing authentic Indian traditions and community spirit.`,
    category: 'Cultural',
    date: '2024-09-07',
    time: '06:00 AM',
    endTime: '10:00 PM',
    location: 'Shivaji Park, Mumbai, Maharashtra',
    venue: {
      name: 'Shivaji Park',
      address: 'Shivaji Park, Dadar, Mumbai, Maharashtra 400028',
      coordinates: {
        lat: 19.0330,
        lng: 72.8397
      },
      capacity: 20000,
      amenities: [
        'Open ground space',
        'Cultural performance stages',
        'Food and beverage stalls',
        'Parking arrangements',
        'Security and medical facilities'
      ]
    },
    price: {
      early: 0,
      regular: 0,
      vip: 0,
      student: 0
    },
    maxAttendees: 15000,
    currentAttendees: 12000,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org9',
      name: 'Mumbai Cultural Society',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Preserving and promoting Maharashtra\'s cultural heritage.',
      contact: 'info@mumbaikultur.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '06:00 AM',
        title: 'Morning Prayers',
        description: 'Traditional morning prayers and rituals',
        room: 'Main Stage',
        type: 'session'
      },
      {
        id: '2',
        time: '07:00 PM',
        title: 'Cultural Performances',
        description: 'Traditional dance and music performances',
        room: 'Cultural Stage',
        type: 'session'
      }
    ],
    tags: ['Cultural', 'Festival', 'Ganesh', 'Mumbai', 'Traditional'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: true,
    registrationUrl: 'https://eventease.com/register/ganesh-festival',
    requirements: [
      'Comfortable clothing',
      'Respectful attire for religious venue',
      'Sun protection'
    ],
    whatToExpect: [
      'Traditional cultural performances',
      'Religious ceremonies',
      'Community participation',
      'Traditional food and sweets',
      'Cultural exhibitions'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '10',
    title: 'Nashik Wine Festival 2024',
    description: 'Experience the finest wines from Maharashtra vineyards with tastings, food pairings, and live entertainment.',
    fullDescription: `The Nashik Wine Festival 2024 celebrates Maharashtra's thriving wine industry with a weekend of wine tastings, gourmet food pairings, and live entertainment. This premium event showcases the best wines from Nashik's renowned vineyards and offers visitors an opportunity to meet winemakers and learn about wine production.

The festival features guided wine tastings, educational sessions about viticulture, gourmet food pairings, and live music performances. Attendees can explore different wine varieties, learn about the winemaking process, and enjoy the beautiful vineyard setting.

This event is perfect for wine enthusiasts, food lovers, and anyone interested in experiencing Maharashtra's wine culture in a beautiful vineyard setting.`,
    category: 'Entertainment',
    date: '2024-04-20',
    time: '04:00 PM',
    endTime: '11:00 PM',
    location: 'Sula Vineyards, Nashik, Maharashtra',
    venue: {
      name: 'Sula Vineyards',
      address: 'Govardhan, Nashik, Maharashtra 422222',
      coordinates: {
        lat: 19.9975,
        lng: 73.7898
      },
      capacity: 2000,
      amenities: [
        'Vineyard tours',
        'Wine tasting rooms',
        'Outdoor event space',
        'Gourmet restaurant',
        'Gift shop'
      ]
    },
    price: {
      early: 999,
      regular: 1200,
      vip: 1800,
      student: 699
    },
    maxAttendees: 1500,
    currentAttendees: 890,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org10',
      name: 'Maharashtra Wine Association',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Promoting Maharashtra\'s wine industry and culture.',
      contact: 'events@maharashtrawine.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '04:00 PM',
        title: 'Welcome & Vineyard Tour',
        description: 'Guided tour of the vineyard and winery',
        room: 'Vineyard',
        type: 'session'
      },
      {
        id: '2',
        time: '06:00 PM',
        title: 'Wine Tasting Session',
        description: 'Guided tasting of premium wines',
        room: 'Tasting Room',
        type: 'session'
      }
    ],
    tags: ['Wine', 'Festival', 'Maharashtra', 'Entertainment', 'Tasting'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/nashik-wine-festival',
    requirements: [
      'Valid ID (21+ only)',
      'Comfortable walking shoes',
      'Designated driver or transportation'
    ],
    whatToExpect: [
      'Premium wine tastings',
      'Vineyard tours',
      'Gourmet food pairings',
      'Live entertainment',
      'Meet the winemakers'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '11',
    title: 'Nagpur Education Technology Conference',
    description: 'Explore the future of education with technology integration, digital learning, and innovative teaching methods.',
    fullDescription: `The Nagpur Education Technology Conference brings together educators, administrators, technology professionals, and policy makers to explore the future of education through technology integration. This comprehensive conference covers digital learning platforms, innovative teaching methods, and educational technology trends.

Attendees will learn about the latest educational technologies, participate in hands-on workshops, and network with fellow educators and technology professionals. The conference features presentations on online learning, educational apps, virtual classrooms, and digital assessment tools.

This event is essential for teachers, school administrators, education technology professionals, and anyone involved in shaping the future of education.`,
    category: 'Education',
    date: '2024-05-15',
    time: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Nagpur University Convention Hall, Nagpur, Maharashtra',
    venue: {
      name: 'Nagpur University Convention Hall',
      address: 'Nagpur University Campus, Nagpur, Maharashtra 440033',
      coordinates: {
        lat: 21.1458,
        lng: 79.0882
      },
      capacity: 800,
      amenities: [
        'Modern AV equipment',
        'Computer lab access',
        'High-speed internet',
        'Cafeteria',
        'Library access'
      ]
    },
    price: {
      early: 599,
      regular: 800,
      vip: 1200,
      student: 299
    },
    maxAttendees: 500,
    currentAttendees: 320,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org11',
      name: 'Maharashtra Education Board',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Advancing education through technology and innovation.',
      contact: 'tech@maharashtraedu.gov.in'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '09:00 AM',
        title: 'Digital Learning Trends',
        description: 'Overview of current educational technology trends',
        room: 'Main Hall',
        type: 'keynote'
      },
      {
        id: '2',
        time: '11:00 AM',
        title: 'EdTech Tools Workshop',
        description: 'Hands-on session with educational technology tools',
        room: 'Computer Lab',
        type: 'workshop'
      }
    ],
    tags: ['Education', 'Technology', 'EdTech', 'Digital Learning'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/nagpur-edtech-conference',
    requirements: [
      'Laptop or tablet',
      'Educational background preferred',
      'Note-taking materials'
    ],
    whatToExpect: [
      'Educational technology demonstrations',
      'Hands-on workshops',
      'Networking with educators',
      'Latest EdTech trends',
      'Implementation strategies'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '12',
    title: 'Aurangabad Art & Craft Exhibition',
    description: 'Showcase of traditional and contemporary art from local artists. Features paintings, sculptures, and handicrafts.',
    fullDescription: `The Aurangabad Art & Craft Exhibition is a celebration of artistic talent and cultural heritage, featuring works from local and regional artists. This comprehensive exhibition showcases traditional and contemporary art forms including paintings, sculptures, handicrafts, and mixed media installations.

Visitors can explore diverse art forms, meet artists, and purchase original artworks. The exhibition includes live art demonstrations, artist talks, and workshops for art enthusiasts of all ages.

This event is perfect for art lovers, collectors, cultural enthusiasts, and families looking to experience the rich artistic heritage of Maharashtra.`,
    category: 'Art',
    date: '2024-04-25',
    time: '10:00 AM',
    endTime: '07:00 PM',
    location: 'Aurangabad Cultural Centre, Aurangabad, Maharashtra',
    venue: {
      name: 'Aurangabad Cultural Centre',
      address: 'Cultural Complex, Aurangabad, Maharashtra 431001',
      coordinates: {
        lat: 19.8762,
        lng: 75.3433
      },
      capacity: 1500,
      amenities: [
        'Multiple exhibition halls',
        'Art workshop spaces',
        'Sculpture garden',
        'Café and gift shop',
        'Parking facilities'
      ]
    },
    price: {
      early: 75,
      regular: 100,
      vip: 200,
      student: 50
    },
    maxAttendees: 1000,
    currentAttendees: 650,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org12',
      name: 'Aurangabad Artists Guild',
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Supporting and promoting local artists and cultural heritage.',
      contact: 'info@aurangabadart.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '10:00 AM',
        title: 'Exhibition Opening',
        description: 'Grand opening ceremony',
        room: 'Main Gallery',
        type: 'session'
      },
      {
        id: '2',
        time: '02:00 PM',
        title: 'Artist Meet & Greet',
        description: 'Meet the featured artists',
        room: 'Artist Lounge',
        type: 'networking'
      }
    ],
    tags: ['Art', 'Culture', 'Exhibition', 'Maharashtra', 'Handicrafts'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/aurangabad-art-exhibition',
    requirements: [
      'Comfortable walking shoes',
      'Camera for photography (where permitted)',
      'Art appreciation interest'
    ],
    whatToExpect: [
      'Diverse art exhibitions',
      'Live art demonstrations',
      'Artist interactions',
      'Art purchase opportunities',
      'Cultural workshops'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '13',
    title: 'Kolhapur Sports Championship',
    description: 'Annual multi-sport championship featuring cricket, football, kabaddi, and traditional Maharashtrian sports.',
    fullDescription: `The Kolhapur Sports Championship is an annual multi-sport event celebrating athletic excellence and traditional Maharashtrian sports. This championship features competitions in cricket, football, kabaddi, wrestling, and other traditional sports, bringing together athletes from across the state.

The championship promotes sports culture, physical fitness, and healthy competition while preserving traditional sporting heritage. Spectators can enjoy exciting matches, meet athletes, and participate in sports-related activities and exhibitions.

This event is ideal for sports enthusiasts, families, athletes, and anyone interested in experiencing Maharashtra's rich sporting culture.`,
    category: 'Sports',
    date: '2024-05-10',
    time: '07:00 AM',
    endTime: '08:00 PM',
    location: 'Kolhapur Sports Complex, Kolhapur, Maharashtra',
    venue: {
      name: 'Kolhapur Sports Complex',
      address: 'Sports Complex Road, Kolhapur, Maharashtra 416001',
      coordinates: {
        lat: 16.7050,
        lng: 74.2433
      },
      capacity: 3000,
      amenities: [
        'Multiple sports fields',
        'Stadium seating',
        'Sports equipment',
        'Medical facilities',
        'Food courts'
      ]
    },
    price: {
      early: 150,
      regular: 200,
      vip: 400,
      student: 100
    },
    maxAttendees: 2000,
    currentAttendees: 1200,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org13',
      name: 'Maharashtra Sports Authority',
      avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Promoting sports and athletic excellence in Maharashtra.',
      contact: 'events@maharashtrasports.gov.in'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '07:00 AM',
        title: 'Opening Ceremony',
        description: 'Championship opening and athlete parade',
        room: 'Main Stadium',
        type: 'session'
      },
      {
        id: '2',
        time: '09:00 AM',
        title: 'Cricket Matches',
        description: 'Inter-district cricket competitions',
        room: 'Cricket Ground',
        type: 'session'
      }
    ],
    tags: ['Sports', 'Championship', 'Maharashtra', 'Traditional Sports'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/kolhapur-sports-championship',
    requirements: [
      'Comfortable seating cushion',
      'Sun protection',
      'Sports enthusiasm'
    ],
    whatToExpect: [
      'Multi-sport competitions',
      'Traditional Maharashtrian sports',
      'Athletic performances',
      'Sports exhibitions',
      'Family-friendly activities'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '14',
    title: 'Thane Birthday Party Planning Workshop',
    description: 'Learn creative birthday party planning ideas, decoration techniques, and entertainment options for memorable celebrations.',
    fullDescription: `The Thane Birthday Party Planning Workshop is designed for parents, event planners, and anyone interested in creating memorable birthday celebrations. This hands-on workshop covers creative party planning ideas, decoration techniques, entertainment options, and budget-friendly solutions.

Participants will learn about theme selection, decoration crafting, entertainment planning, and party logistics. The workshop includes practical exercises, demonstration sessions, and take-home resources for planning future celebrations.

This workshop is perfect for parents planning children's parties, aspiring party planners, and anyone who wants to create special celebrations for their loved ones.`,
    category: 'Workshop',
    date: '2024-04-08',
    time: '02:00 PM',
    endTime: '06:00 PM',
    location: 'Thane Community Hall, Thane, Maharashtra',
    venue: {
      name: 'Thane Community Hall',
      address: 'Community Center, Thane West, Maharashtra 400601',
      coordinates: {
        lat: 19.2183,
        lng: 72.9781
      },
      capacity: 150,
      amenities: [
        'Workshop space',
        'Craft supplies',
        'Demonstration area',
        'Refreshment area',
        'Parking available'
      ]
    },
    price: {
      early: 399,
      regular: 500,
      vip: 750,
      student: 299
    },
    maxAttendees: 120,
    currentAttendees: 85,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org14',
      name: 'Party Planners Maharashtra',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Creative party planning and event management specialists.',
      contact: 'workshops@partyplanners.in'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '02:00 PM',
        title: 'Party Planning Basics',
        description: 'Introduction to party planning fundamentals',
        room: 'Main Workshop',
        type: 'session'
      },
      {
        id: '2',
        time: '04:00 PM',
        title: 'Decoration Workshop',
        description: 'Hands-on decoration crafting session',
        room: 'Craft Area',
        type: 'workshop'
      }
    ],
    tags: ['Workshop', 'Party Planning', 'Birthday', 'Celebrations'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/birthday-party-workshop',
    requirements: [
      'Notebook for ideas',
      'Comfortable clothing for crafting',
      'Creative mindset'
    ],
    whatToExpect: [
      'Creative party planning techniques',
      'Hands-on decoration crafting',
      'Entertainment planning tips',
      'Budget-friendly solutions',
      'Take-home party planning kit'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '15',
    title: 'Solapur Classical Music Concert',
    description: 'Evening of classical Indian music featuring renowned artists performing ragas and traditional compositions.',
    fullDescription: `The Solapur Classical Music Concert is a prestigious evening celebrating the rich tradition of Indian classical music. This concert features renowned artists performing traditional ragas, classical compositions, and devotional music in an intimate auditorium setting.

The concert showcases both vocal and instrumental performances, including tabla, sitar, harmonium, and other traditional instruments. Attendees will experience the depth and beauty of Indian classical music while learning about its history and cultural significance.

This event is perfect for music lovers, cultural enthusiasts, students of Indian classical music, and anyone interested in experiencing authentic Indian musical traditions.`,
    category: 'Music',
    date: '2024-05-18',
    time: '07:00 PM',
    endTime: '10:00 PM',
    location: 'Solapur Cultural Auditorium, Solapur, Maharashtra',
    venue: {
      name: 'Solapur Cultural Auditorium',
      address: 'Cultural Complex, Solapur, Maharashtra 413001',
      coordinates: {
        lat: 17.6599,
        lng: 75.9064
      },
      capacity: 800,
      amenities: [
        'Acoustic-optimized auditorium',
        'Traditional stage setup',
        'Premium sound system',
        'Comfortable seating',
        'Refreshment area'
      ]
    },
    price: {
      early: 199,
      regular: 300,
      vip: 500,
      student: 150
    },
    maxAttendees: 600,
    currentAttendees: 420,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org15',
      name: 'Solapur Music Society',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Preserving and promoting Indian classical music traditions.',
      contact: 'concerts@solapurmusic.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '07:00 PM',
        title: 'Vocal Classical Performance',
        description: 'Traditional raga performances',
        room: 'Main Auditorium',
        type: 'session'
      },
      {
        id: '2',
        time: '08:30 PM',
        title: 'Instrumental Ensemble',
        description: 'Sitar, tabla, and harmonium performance',
        room: 'Main Auditorium',
        type: 'session'
      }
    ],
    tags: ['Music', 'Classical', 'Indian', 'Traditional', 'Concert'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/solapur-classical-concert',
    requirements: [
      'Respectful silence during performances',
      'Traditional attire appreciated',
      'Music appreciation interest'
    ],
    whatToExpect: [
      'Authentic classical music performances',
      'Traditional instrument demonstrations',
      'Cultural education',
      'Peaceful, meditative atmosphere',
      'Meet renowned musicians'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '16',
    title: 'Satara School Annual Function',
    description: 'Celebrating academic achievements with cultural performances, award ceremonies, and parent-teacher interactions.',
    fullDescription: `The Satara School Annual Function is a celebration of academic achievements, student talents, and school community spirit. This special event features cultural performances by students, academic award ceremonies, and opportunities for parent-teacher interactions.

The function includes dance performances, musical presentations, drama productions, and recognition ceremonies for outstanding students. Parents, teachers, and community members come together to celebrate the school's achievements and student accomplishments.

This event is perfect for families, educators, and community members who want to support student achievements and celebrate educational excellence.`,
    category: 'Education',
    date: '2024-04-30',
    time: '04:00 PM',
    endTime: '08:00 PM',
    location: 'Satara Public School Auditorium, Satara, Maharashtra',
    venue: {
      name: 'Satara Public School Auditorium',
      address: 'School Campus, Satara, Maharashtra 415001',
      coordinates: {
        lat: 17.6868,
        lng: 74.0183
      },
      capacity: 1200,
      amenities: [
        'School auditorium',
        'Stage and sound system',
        'Seating for families',
        'Refreshment area',
        'Parking on campus'
      ]
    },
    price: {
      early: 0,
      regular: 0,
      vip: 0,
      student: 0
    },
    maxAttendees: 1000,
    currentAttendees: 800,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org16',
      name: 'Satara Public School',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Committed to academic excellence and student development.',
      contact: 'principal@satarapublic.edu.in'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '04:00 PM',
        title: 'Welcome & Opening',
        description: 'Welcome address and function opening',
        room: 'Main Auditorium',
        type: 'session'
      },
      {
        id: '2',
        time: '05:00 PM',
        title: 'Student Performances',
        description: 'Cultural performances by students',
        room: 'Main Auditorium',
        type: 'session'
      },
      {
        id: '3',
        time: '07:00 PM',
        title: 'Award Ceremony',
        description: 'Recognition of academic achievements',
        room: 'Main Auditorium',
        type: 'session'
      }
    ],
    tags: ['Education', 'School', 'Annual Function', 'Students'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/satara-school-function',
    requirements: [
      'School community member or guest',
      'Family-friendly attire',
      'Camera for memories'
    ],
    whatToExpect: [
      'Student cultural performances',
      'Academic award ceremonies',
      'Parent-teacher interactions',
      'School community celebration',
      'Refreshments and snacks'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '17',
    title: 'Akola Religious Discourse & Prayer Meet',
    description: 'Spiritual gathering featuring religious discourse, community prayers, and cultural programs for spiritual enlightenment.',
    fullDescription: `The Akola Religious Discourse & Prayer Meet is a spiritual gathering that brings together devotees and spiritual seekers for religious discourse, community prayers, and cultural programs. This peaceful event focuses on spiritual enlightenment, community bonding, and religious education.

The gathering features religious speakers, community prayers, devotional music, and spiritual discussions. Attendees can participate in prayer sessions, listen to religious teachings, and connect with fellow devotees in a serene, spiritual environment.

This event is perfect for spiritual seekers, religious community members, and anyone interested in exploring spiritual teachings and community worship.`,
    category: 'Religious',
    date: '2024-05-25',
    time: '06:00 AM',
    endTime: '12:00 PM',
    location: 'Akola Temple Complex, Akola, Maharashtra',
    venue: {
      name: 'Akola Temple Complex',
      address: 'Temple Road, Akola, Maharashtra 444001',
      coordinates: {
        lat: 20.7002,
        lng: 77.0082
      },
      capacity: 4000,
      amenities: [
        'Temple premises',
        'Prayer halls',
        'Community kitchen',
        'Parking facilities',
        'Rest areas'
      ]
    },
    price: {
      early: 0,
      regular: 0,
      vip: 0,
      student: 0
    },
    maxAttendees: 3000,
    currentAttendees: 2500,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    organizer: {
      id: 'org17',
      name: 'Akola Religious Committee',
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Organizing spiritual and religious community events.',
      contact: 'committee@akolareligious.org'
    },
    speakers: [],
    sponsors: [],
    schedule: [
      {
        id: '1',
        time: '06:00 AM',
        title: 'Morning Prayers',
        description: 'Community morning prayer session',
        room: 'Main Prayer Hall',
        type: 'session'
      },
      {
        id: '2',
        time: '08:00 AM',
        title: 'Religious Discourse',
        description: 'Spiritual teachings and discussions',
        room: 'Discourse Hall',
        type: 'session'
      },
      {
        id: '3',
        time: '10:00 AM',
        title: 'Community Prayers',
        description: 'Group prayer and meditation',
        room: 'Main Prayer Hall',
        type: 'session'
      }
    ],
    tags: ['Religious', 'Spiritual', 'Community', 'Prayer', 'Discourse'],
    status: 'upcoming',
    isVirtual: false,
    isFeatured: false,
    registrationUrl: 'https://eventease.com/register/akola-religious-meet',
    requirements: [
      'Respectful attire',
      'Quiet and respectful behavior',
      'Spiritual interest'
    ],
    whatToExpect: [
      'Religious discourse and teachings',
      'Community prayer sessions',
      'Spiritual discussions',
      'Devotional music',
      'Community meals (prasad)'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
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