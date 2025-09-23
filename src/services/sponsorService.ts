import { Sponsor, SponsorListResponse } from '../types/sponsor';

// Mock data for sponsors, matching the detailed Sponsor interface
const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Innovatech Solutions',
    logo: 'https://placehold.co/100x100/6366F1/FFFFFF?text=IS',
    tier: 'platinum',
    description: 'Pioneering the future of AI and machine learning to solve complex business challenges.',
    website: 'https://example.com',
    industry: 'Technology',
    partnership: 'Official Innovation Partner',
    featured: true,
    promotionalVideo: 'https://example.com/promo.mp4',
    banner: 'https://placehold.co/600x400/313264/FFFFFF?text=Innovatech',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/innovatech',
      twitter: 'https://twitter.com/innovatech',
    },
    events: ['event1', 'event2'],
    benefits: ['Keynote Speaker Slot', 'Main Stage Branding', 'Exclusive Workshop Host']
  },
  {
    id: '2',
    name: 'QuantumLeap Analytics',
    logo: 'https://placehold.co/100x100/EC4899/FFFFFF?text=QL',
    tier: 'platinum',
    description: 'Providing cutting-edge data analytics and business intelligence for global enterprises.',
    website: 'https://example.com',
    industry: 'Data Science',
    partnership: 'Official Data Partner',
    featured: true,
    banner: 'https://placehold.co/600x400/7a2c53/FFFFFF?text=QuantumLeap',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/quantumleap',
    },
    events: ['event1'],
    benefits: ['Data Insights Session', 'Logo on all reports', 'VIP Networking Access']
  },
  {
    id: '3',
    name: 'Synergy Systems',
    logo: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=SS',
    tier: 'gold',
    description: 'Integrated software solutions for seamless team collaboration and project management.',
    website: 'https://example.com',
    industry: 'Software',
    partnership: 'Collaboration Zone Sponsor',
    featured: false,
    banner: 'https://placehold.co/600x400/8c5a07/FFFFFF?text=Synergy',
    socialLinks: {
      twitter: 'https://twitter.com/synergysystems',
    },
    events: ['event2', 'event3'],
    benefits: ['Branded Collaboration Lounge', 'Featured in event app', 'Workshop inclusion']
  },
  {
    id: '4',
    name: 'FutureScape AI',
    logo: 'https://placehold.co/100x100/10B981/FFFFFF?text=FS',
    tier: 'gold',
    description: 'Building the next generation of artificial intelligence for a smarter world.',
    website: 'https://example.com',
    industry: 'Artificial Intelligence',
    partnership: 'AI Hackathon Sponsor',
    featured: true,
    promotionalVideo: 'https://example.com/promo.mp4',
    banner: 'https://placehold.co/600x400/0a694a/FFFFFF?text=FutureScape',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/futurescape',
    },
    events: ['event3'],
    benefits: ['Hackathon Naming Rights', 'Mentorship Opportunities', 'Access to talent pool']
  },
  {
    id: '5',
    name: 'SecureNet Cybersecurity',
    logo: 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=SN',
    tier: 'silver',
    description: 'Comprehensive security solutions to protect your digital assets.',
    website: 'https://example.com',
    industry: 'Cybersecurity',
    partnership: 'Wi-Fi & Charging Station Sponsor',
    featured: false,
    banner: 'https://placehold.co/600x400/4d3385/FFFFFF?text=SecureNet',
    socialLinks: {},
    events: ['event1', 'event3'],
    benefits: ['Branded charging stations', 'Logo on Wi-Fi login page']
  },
   {
    id: '6',
    name: 'EcoVibes Ltd.',
    logo: 'https://placehold.co/100x100/22C55E/FFFFFF?text=EV',
    tier: 'silver',
    description: 'Sustainable solutions for a greener planet and a better tomorrow.',
    website: 'https://example.com',
    industry: 'Sustainability',
    partnership: 'Official Green Partner',
    featured: false,
    banner: 'https://placehold.co/600x400/136d35/FFFFFF?text=EcoVibes',
    socialLinks: {
      facebook: 'https://facebook.com/ecovibes',
    },
    events: ['event2'],
    benefits: ['Branding on recycling bins', 'Mention in sustainability report']
  },
  {
    id: '7',
    name: 'Creative Canvas',
    logo: 'https://placehold.co/100x100/EF4444/FFFFFF?text=CC',
    tier: 'bronze',
    description: 'Design and branding agency for startups and creative entrepreneurs.',
    website: 'https://example.com',
    industry: 'Design Agency',
    partnership: 'Community Partner',
    featured: false,
    banner: 'https://placehold.co/600x400/8c2b2b/FFFFFF?text=Creative+Canvas',
    socialLinks: {},
    events: ['event1'],
    benefits: ['Logo on community partner slide']
  },
  {
    id: '8',
    name: 'Local Host Coffee',
    logo: 'https://placehold.co/100x100/D97706/FFFFFF?text=LH',
    tier: 'bronze',
    description: 'Artisanal coffee to fuel great ideas and conversations.',
    website: 'https://example.com',
    industry: 'Food & Beverage',
    partnership: 'Coffee Break Sponsor',
    featured: false,
    banner: 'https://placehold.co/600x400/804604/FFFFFF?text=Local+Host',
    socialLinks: {},
    events: ['event3'],
    benefits: ['Signage at coffee stations']
  },
];

class SponsorService {
  private static instance: SponsorService;
  private sponsors: Sponsor[] = mockSponsors;

  public static getInstance(): SponsorService {
    if (!SponsorService.instance) {
      SponsorService.instance = new SponsorService();
    }
    return SponsorService.instance;
  }

  // Simulate API call
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async getSponsors(page: number = 1, limit: number = 12, tier?: string): Promise<SponsorListResponse> {
    await this.delay(500); // Simulate network latency

    const tierLower = tier?.toLowerCase();

    const filteredSponsors = this.sponsors.filter(sponsor => {
      if (!tierLower || tierLower === 'all') return true;
      return sponsor.tier.toLowerCase() === tierLower;
    });

    const total = filteredSponsors.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSponsors = filteredSponsors.slice(startIndex, endIndex);

    return {
      sponsors: paginatedSponsors,
      hasMore: endIndex < total,
      total,
      page,
      limit,
    };
  }
  
  public async searchSponsors(query: string, limit: number = 20): Promise<Sponsor[]> {
    await this.delay(300);
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    
    const results = this.sponsors.filter(sponsor => 
        sponsor.name.toLowerCase().includes(searchTerm) ||
        sponsor.description.toLowerCase().includes(searchTerm) ||
        sponsor.industry.toLowerCase().includes(searchTerm)
    );

    return results.slice(0, limit);
  }
}

export const sponsorService = SponsorService.getInstance();
