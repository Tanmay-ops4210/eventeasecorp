import { SponsorExhibitor, Lead, BoothCustomization, BoothAsset, SponsorDashboardStats, SponsorActivity } from '../types/sponsorExhibitor';

// Mock data storage
let sponsorExhibitors: SponsorExhibitor[] = [
  {
    id: '1',
    name: 'TechCorp Industries',
    email: 'sponsor@techcorp.com',
    company: 'TechCorp Industries',
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
    ],
    booth: {
      id: 'booth_1',
      name: 'TechCorp Innovation Hub',
      description: 'Discover the latest in enterprise technology solutions',
      layout: 'premium',
      customization: {
        primaryColor: '#3b82f6',
        secondaryColor: '#6366f1',
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
        banner: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
        brochures: [],
        videos: []
      },
      isActive: true
    },
    leads: [],
    analytics: {
      boothVisits: 245,
      leadsCaptured: 67,
      brochureDownloads: 123,
      videoViews: 189,
      conversionRate: 27.3
    },
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

let sponsorActivities: SponsorActivity[] = [
  {
    id: '1',
    type: 'lead_captured',
    message: 'New lead captured: John Doe from ABC Corp',
    timestamp: '2024-01-15T14:30:00Z',
    leadId: 'lead_1'
  },
  {
    id: '2',
    type: 'booth_visit',
    message: 'Booth visited by potential customer',
    timestamp: '2024-01-15T13:45:00Z'
  }
];

class SponsorExhibitorService {
  private static instance: SponsorExhibitorService;

  static getInstance(): SponsorExhibitorService {
    if (!SponsorExhibitorService.instance) {
      SponsorExhibitorService.instance = new SponsorExhibitorService();
    }
    return SponsorExhibitorService.instance;
  }

  // Dashboard functions
  async getDashboardStats(): Promise<SponsorDashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentSponsor = sponsorExhibitors[0]; // Mock current user
    
    return {
      totalLeads: currentSponsor.leads.length,
      qualifiedLeads: currentSponsor.leads.filter(lead => lead.status === 'qualified').length,
      conversionRate: currentSponsor.analytics.conversionRate,
      boothVisits: currentSponsor.analytics.boothVisits,
      brochureDownloads: currentSponsor.analytics.brochureDownloads,
      videoViews: currentSponsor.analytics.videoViews,
      eventParticipation: currentSponsor.events.length
    };
  }

  async getRecentActivity(): Promise<SponsorActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...sponsorActivities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);
  }

  // Booth customization
  async getBoothCustomization(): Promise<BoothCustomization> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const currentSponsor = sponsorExhibitors[0];
    return {
      primaryColor: currentSponsor.booth.customization.primaryColor,
      secondaryColor: currentSponsor.booth.customization.secondaryColor,
      logo: currentSponsor.booth.customization.logo,
      banner: currentSponsor.booth.customization.banner,
      brochures: currentSponsor.booth.customization.brochures.map(url => ({
        id: `brochure_${Date.now()}`,
        name: 'Company Brochure',
        url,
        type: 'pdf' as const,
        size: 1024000,
        uploadedAt: new Date().toISOString()
      })),
      videos: currentSponsor.booth.customization.videos.map(url => ({
        id: `video_${Date.now()}`,
        name: 'Company Video',
        url,
        type: 'video' as const,
        size: 5120000,
        uploadedAt: new Date().toISOString()
      })),
      description: currentSponsor.booth.description,
      contactInfo: {
        email: currentSponsor.email,
        phone: '+1 (555) 123-4567',
        website: currentSponsor.website
      }
    };
  }

  async updateBoothCustomization(customization: BoothCustomization): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const sponsorIndex = sponsorExhibitors.findIndex(s => s.id === '1'); // Mock current user
      if (sponsorIndex === -1) {
        return { success: false, error: 'Sponsor not found' };
      }

      sponsorExhibitors[sponsorIndex].booth.customization = {
        primaryColor: customization.primaryColor,
        secondaryColor: customization.secondaryColor,
        logo: customization.logo,
        banner: customization.banner,
        brochures: customization.brochures.map(asset => asset.url),
        videos: customization.videos.map(asset => asset.url)
      };
      sponsorExhibitors[sponsorIndex].booth.description = customization.description;
      sponsorExhibitors[sponsorIndex].updatedAt = new Date().toISOString();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update booth customization' };
    }
  }

  // Lead management
  async getLeads(): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentSponsor = sponsorExhibitors[0];
    return [...currentSponsor.leads].sort((a, b) => 
      new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
    );
  }

  async createLead(leadData: Omit<Lead, 'id' | 'capturedAt'>): Promise<{ success: boolean; lead?: Lead; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newLead: Lead = {
        ...leadData,
        id: `lead_${Date.now()}`,
        capturedAt: new Date().toISOString()
      };

      const sponsorIndex = sponsorExhibitors.findIndex(s => s.id === '1');
      if (sponsorIndex !== -1) {
        sponsorExhibitors[sponsorIndex].leads.push(newLead);
        sponsorExhibitors[sponsorIndex].analytics.leadsCaptured++;
        sponsorExhibitors[sponsorIndex].updatedAt = new Date().toISOString();

        // Add activity
        sponsorActivities.push({
          id: `activity_${Date.now()}`,
          type: 'lead_captured',
          message: `New lead captured: ${newLead.name} from ${newLead.company}`,
          timestamp: new Date().toISOString(),
          leadId: newLead.id
        });
      }

      return { success: true, lead: newLead };
    } catch (error) {
      return { success: false, error: 'Failed to create lead' };
    }
  }

  async updateLeadStatus(leadId: string, status: Lead['status'], notes?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const sponsorIndex = sponsorExhibitors.findIndex(s => s.id === '1');
      if (sponsorIndex === -1) {
        return { success: false, error: 'Sponsor not found' };
      }

      const leadIndex = sponsorExhibitors[sponsorIndex].leads.findIndex(lead => lead.id === leadId);
      if (leadIndex === -1) {
        return { success: false, error: 'Lead not found' };
      }

      sponsorExhibitors[sponsorIndex].leads[leadIndex].status = status;
      if (notes) {
        sponsorExhibitors[sponsorIndex].leads[leadIndex].notes = notes;
      }
      sponsorExhibitors[sponsorIndex].leads[leadIndex].lastContactedAt = new Date().toISOString();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update lead status' };
    }
  }

  async deleteLead(leadId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const sponsorIndex = sponsorExhibitors.findIndex(s => s.id === '1');
      if (sponsorIndex === -1) {
        return { success: false, error: 'Sponsor not found' };
      }

      const leadIndex = sponsorExhibitors[sponsorIndex].leads.findIndex(lead => lead.id === leadId);
      if (leadIndex === -1) {
        return { success: false, error: 'Lead not found' };
      }

      sponsorExhibitors[sponsorIndex].leads.splice(leadIndex, 1);
      sponsorExhibitors[sponsorIndex].analytics.leadsCaptured--;

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete lead' };
    }
  }

  // Asset management
  async uploadAsset(file: File, type: 'brochure' | 'video'): Promise<{ success: boolean; asset?: BoothAsset; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate file upload
      const mockUrl = `https://example.com/assets/${file.name}`;
      
      const newAsset: BoothAsset = {
        id: `asset_${Date.now()}`,
        name: file.name,
        url: mockUrl,
        type: type === 'brochure' ? 'pdf' : 'video',
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      return { success: true, asset: newAsset };
    } catch (error) {
      return { success: false, error: 'Failed to upload asset' };
    }
  }

  async deleteAsset(assetId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      // In a real app, this would delete the asset from storage
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete asset' };
    }
  }

  // Analytics
  async getDetailedAnalytics(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentSponsor = sponsorExhibitors[0];
    
    return {
      ...currentSponsor.analytics,
      dailyVisits: this.generateMockDailyData(),
      leadSources: [
        { source: 'Booth Visit', count: 25, percentage: 37.3 },
        { source: 'Brochure Download', count: 18, percentage: 26.9 },
        { source: 'Video View', count: 15, percentage: 22.4 },
        { source: 'Direct Contact', count: 9, percentage: 13.4 }
      ],
      topInterests: [
        { interest: 'Enterprise Software', count: 32 },
        { interest: 'Cloud Solutions', count: 28 },
        { interest: 'AI/ML Tools', count: 24 },
        { interest: 'Security', count: 19 }
      ]
    };
  }

  private generateMockDailyData() {
    const data = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        visits: Math.floor(Math.random() * 50) + 10,
        leads: Math.floor(Math.random() * 15) + 2
      });
    }
    return data;
  }

  // Export functions
  async exportLeads(format: 'csv' | 'excel'): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentSponsor = sponsorExhibitors[0];
      const leads = currentSponsor.leads;
      
      if (format === 'csv') {
        const csvContent = [
          ['Name', 'Email', 'Company', 'Title', 'Phone', 'Status', 'Captured Date'],
          ...leads.map(lead => [
            lead.name,
            lead.email,
            lead.company,
            lead.title,
            lead.phone || '',
            lead.status,
            new Date(lead.capturedAt).toLocaleDateString()
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        return { success: true, url };
      }
      
      return { success: false, error: 'Format not supported yet' };
    } catch (error) {
      return { success: false, error: 'Failed to export leads' };
    }
  }

  // Attendee interaction tools
  async sendMessage(attendeeId: string, message: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add activity
      sponsorActivities.push({
        id: `activity_${Date.now()}`,
        type: 'contact_made',
        message: `Message sent to attendee`,
        timestamp: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send message' };
    }
  }

  async scheduleDemo(attendeeId: string, demoData: any): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would integrate with calendar systems
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to schedule demo' };
    }
  }

  async shareResource(attendeeId: string, resourceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Track resource sharing
      const sponsorIndex = sponsorExhibitors.findIndex(s => s.id === '1');
      if (sponsorIndex !== -1) {
        sponsorExhibitors[sponsorIndex].analytics.brochureDownloads++;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to share resource' };
    }
  }
}

export const sponsorExhibitorService = SponsorExhibitorService.getInstance();