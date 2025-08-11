export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue?: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  image: string;
  organizerId: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  speakers: Speaker[];
  sponsors: Sponsor[];
  tags: string[];
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  isVirtual: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
  expertise: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website: string;
  description: string;
}