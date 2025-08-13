import { User } from './user';

export interface Event {
  _id: string;
  ownerId: string;
  status: "DRAFT" | "PUBLISHED";
  planSnapshot: {
    tier: "FREE" | "PAID" | "PRO";
    constraints: any;
  };
  waterfall: {
    requirements: {
      title?: string;
      goals?: string;
      audience?: string;
      scope?: string;
      successCriteria?: string;
    };
    design: {
      venueType?: "online" | "on-site" | "hybrid";
      location?: string;
      schedule?: string;
      brandingNotes?: string;
    };
    implementation: {
      ticketTypes: { name: string; price: number; currency: string; qty: number }[];
      capacity?: number;
      staffNotes?: string;
    };
    verification: {
      qaChecklist: string[];
      approvals: string[];
    };
    maintenance: {
      commsPlan?: string;
      postEventActions?: string;
    };
  };
  summary: {
    name: string;
    startDate: Date;
    endDate: Date;
    city: string;
    isPaid: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
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
