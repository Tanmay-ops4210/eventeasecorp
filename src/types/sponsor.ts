export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  description: string;
  website: string;
  industry: string;
  partnership: string;
  featured: boolean;
  promotionalVideo?: string;
  banner?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  events: string[];
  benefits: string[];
}

export interface SponsorListResponse {
  sponsors: Sponsor[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}