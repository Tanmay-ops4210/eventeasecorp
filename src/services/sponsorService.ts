import { supabase } from '../lib/supabaseClient';
import { Sponsor, SponsorListResponse } from '../types/sponsor';

export interface SponsorUser {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  role: 'sponsor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SponsorRegistrationData {
  email: string;
  password: string;
  full_name: string;
  company?: string;
}

export interface SponsorLoginData {
  email: string;
  password: string;
}

class SponsorService {
  private static instance: SponsorService;

  static getInstance(): SponsorService {
    if (!SponsorService.instance) {
      SponsorService.instance = new SponsorService();
    }
    return SponsorService.instance;
  }

  async register(data: SponsorRegistrationData): Promise<{ success: boolean; user?: SponsorUser; error?: string }> {
    try {
      const { data: result, error } = await supabase.rpc('register_user', {
        p_email: data.email,
        p_password: data.password,
        p_role: 'sponsor',
        p_full_name: data.full_name,
        p_company: data.company || null
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(data: SponsorLoginData): Promise<{ success: boolean; user?: SponsorUser; error?: string }> {
    try {
      const { data: result, error } = await supabase.rpc('validate_login', {
        p_email: data.email,
        p_password: data.password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Check if user is sponsor
      if (result.user.role !== 'sponsor') {
        return { success: false, error: 'Invalid credentials for sponsor login' };
      }

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async getProfile(userId: string): Promise<{ success: boolean; user?: SponsorUser; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', userId)
        .eq('role', 'sponsor')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  async updateProfile(userId: string, updates: Partial<SponsorUser>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('app_users')
        .update(updates)
        .eq('id', userId)
        .eq('role', 'sponsor');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  async getSponsors(page: number = 1, limit: number = 12, tier?: string): Promise<SponsorListResponse> {
    try {
      let query = supabase
        .from('sponsors')
        .select('*', { count: 'exact' });

      if (tier) {
        query = query.eq('tier', tier.toLowerCase());
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      const sponsors: Sponsor[] = (data || []).map(sponsor => ({
        id: sponsor.id,
        name: sponsor.name,
        logo: sponsor.logo_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        tier: sponsor.tier || 'bronze',
        website: sponsor.website || '#',
        industry: sponsor.industry || 'Technology',
        description: `Leading ${sponsor.industry || 'technology'} company providing innovative solutions.`,
        partnership: 'Event Partner',
        benefits: [
          'Brand visibility throughout the event',
          'Access to networking opportunities',
          'Lead generation and customer acquisition'
        ],
        socialLinks: {
          linkedin: '#',
          twitter: '#'
        },
        promotionalVideo: null
      }));

      return {
        sponsors,
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > page * limit
      };
    } catch (error) {
      throw new Error('Failed to fetch sponsors');
    }
  }

  async searchSponsors(searchTerm: string): Promise<Sponsor[]> {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`)
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(sponsor => ({
        id: sponsor.id,
        name: sponsor.name,
        logo: sponsor.logo_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        tier: sponsor.tier || 'bronze',
        website: sponsor.website || '#',
        industry: sponsor.industry || 'Technology',
        description: `Leading ${sponsor.industry || 'technology'} company providing innovative solutions.`,
        partnership: 'Event Partner',
        benefits: [
          'Brand visibility throughout the event',
          'Access to networking opportunities',
          'Lead generation and customer acquisition'
        ],
        socialLinks: {
          linkedin: '#',
          twitter: '#'
        },
        promotionalVideo: null
      }));
    } catch (error) {
      throw new Error('Failed to search sponsors');
    }
  }

  async getMySponsorship(userId: string): Promise<{ success: boolean; sponsorship?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        return { success: false, error: error.message };
      }

      return { success: true, sponsorship: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch sponsorship' };
    }
  }
}

export const sponsorService = SponsorService.getInstance();