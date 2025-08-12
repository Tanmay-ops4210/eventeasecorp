import { Sponsor, SponsorListResponse } from '../types/sponsor';

// Mock sponsor data
const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TechCorp Industries',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'platinum',
    description: 'Leading technology solutions provider specializing in enterprise software and cloud infrastructure.',
    website: 'https://techcorp.com',
    industry: 'Technology',
    partnership: 'Title Sponsor - Main Stage',
    featured: true,
    promotionalVideo: 'https://example.com/techcorp-video',
    banner: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      facebook: 'https://facebook.com/techcorp'
    },
    events: ['1', '2'],
    benefits: [
      'Logo placement on all event materials',
      'Keynote speaking opportunity',
      'Premium booth location',
      'VIP networking access',
      'Post-event attendee list'
    ]
  },
  {
    id: '2',
    name: 'Innovation Labs',
    logo: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'gold',
    description: 'Research and development company focused on breakthrough innovations in AI and machine learning.',
    website: 'https://innovationlabs.com',
    industry: 'Research & Development',
    partnership: 'Innovation Showcase Sponsor',
    featured: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/innovation-labs',
      twitter: 'https://twitter.com/innovationlabs'
    },
    events: ['1', '3'],
    benefits: [
      'Innovation showcase booth',
      'Workshop hosting opportunity',
      'Logo on event website',
      'Social media mentions',
      'Networking reception access'
    ]
  },
  {
    id: '3',
    name: 'Design Studio Pro',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'gold',
    description: 'Creative design agency helping brands create memorable experiences through innovative design solutions.',
    website: 'https://designstudiopro.com',
    industry: 'Design & Creative',
    partnership: 'Design Workshop Sponsor',
    featured: false,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/design-studio-pro',
      twitter: 'https://twitter.com/designstudiopro'
    },
    events: ['2', '3'],
    benefits: [
      'Design workshop hosting',
      'Creative showcase area',
      'Logo placement',
      'Portfolio display opportunity'
    ]
  },
  {
    id: '4',
    name: 'Marketing Dynamics',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'silver',
    description: 'Digital marketing agency specializing in data-driven strategies and customer engagement solutions.',
    website: 'https://marketingdynamics.com',
    industry: 'Marketing',
    partnership: 'Networking Lounge Sponsor',
    featured: false,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/marketing-dynamics'
    },
    events: ['1'],
    benefits: [
      'Networking lounge branding',
      'Logo on event materials',
      'Lead capture opportunities'
    ]
  },
  {
    id: '5',
    name: 'Strategic Solutions Inc',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'silver',
    description: 'Business consulting firm helping organizations navigate complex challenges and drive growth.',
    website: 'https://strategicsolutions.com',
    industry: 'Consulting',
    partnership: 'Business Track Sponsor',
    featured: false,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/strategic-solutions'
    },
    events: ['2'],
    benefits: [
      'Business track branding',
      'Speaking opportunity',
      'Networking access'
    ]
  },
  {
    id: '6',
    name: 'Green Future Corp',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'bronze',
    description: 'Sustainability consulting company focused on helping businesses create environmentally responsible practices.',
    website: 'https://greenfuture.com',
    industry: 'Sustainability',
    partnership: 'Eco-Friendly Initiatives Sponsor',
    featured: false,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/green-future'
    },
    events: ['3'],
    benefits: [
      'Sustainability showcase',
      'Logo placement',
      'Green initiatives branding'
    ]
  }
];

class SponsorService {
  private static instance: SponsorService;
  private sponsors: Sponsor[] = mockSponsors;

  static getInstance(): SponsorService {
    if (!SponsorService.instance) {
      SponsorService.instance = new SponsorService();
    }
    return SponsorService.instance;
  }

  async getSponsors(page: number = 1, limit: number = 12, tier?: string): Promise<SponsorListResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredSponsors = [...this.sponsors];

    if (tier && tier !== 'All') {
      filteredSponsors = filteredSponsors.filter(sponsor =>
        sponsor.tier === tier.toLowerCase()
      );
    }

    // Sort by tier (platinum first, then gold, silver, bronze)
    const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };
    filteredSponsors.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSponsors = filteredSponsors.slice(startIndex, endIndex);

    return {
      sponsors: paginatedSponsors,
      hasMore: endIndex < filteredSponsors.length,
      total: filteredSponsors.length,
      page,
      limit
    };
  }

  async getSponsorById(id: string): Promise<Sponsor | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.sponsors.find(sponsor => sponsor.id === id) || null;
  }

  async getSponsorsByTier(tier: string): Promise<Sponsor[]> {
    return this.sponsors.filter(sponsor => sponsor.tier === tier);
  }

  async searchSponsors(query: string, limit: number = 10): Promise<Sponsor[]> {
    const searchTerm = query.toLowerCase();
    
    return this.sponsors
      .filter(sponsor => 
        sponsor.name.toLowerCase().includes(searchTerm) ||
        sponsor.description.toLowerCase().includes(searchTerm) ||
        sponsor.industry.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
  }
}

export const sponsorService = SponsorService.getInstance();