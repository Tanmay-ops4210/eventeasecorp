export interface SponsorExhibitor {
  id: string;
  name: string;
  email: string;
  company: string;
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
    instagram?: string;
  };
  events: string[];
  benefits: string[];
  booth: {
    id: string;
    name: string;
    description: string;
    layout: 'standard' | 'premium' | 'custom';
    customization: {
      primaryColor: string;
      secondaryColor: string;
      logo: string;
      banner: string;
      brochures: string[];
      videos: string[];
    };
    isActive: boolean;
  };
  leads: Lead[];
  analytics: {
    boothVisits: number;
    leadsCaptured: number;
    brochureDownloads: number;
    videoViews: number;
    conversionRate: number;
  };
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone?: string;
  interests: string[];
  notes: string;
  source: 'booth_visit' | 'brochure_download' | 'video_view' | 'direct_contact';
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  capturedAt: string;
  lastContactedAt?: string;
}

export interface BoothCustomization {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  banner: string;
  brochures: BoothAsset[];
  videos: BoothAsset[];
  description: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
}

export interface BoothAsset {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'video';
  size: number;
  uploadedAt: string;
}

export interface SponsorDashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  boothVisits: number;
  brochureDownloads: number;
  videoViews: number;
  eventParticipation: number;
}

export interface SponsorActivity {
  id: string;
  type: 'lead_captured' | 'booth_visit' | 'brochure_download' | 'video_view' | 'contact_made';
  message: string;
  timestamp: string;
  leadId?: string;
  eventId?: string;
}