import { supabase } from '../lib/supabaseClient';

export interface OrganizerUser {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  role: 'organizer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizerRegistrationData {
  email: string;
  password: string;
  full_name: string;
  company?: string;
}

export interface OrganizerLoginData {
  email: string;
  password: string;
}

class OrganizerService {
  private static instance: OrganizerService;

  static getInstance(): OrganizerService {
    if (!OrganizerService.instance) {
      OrganizerService.instance = new OrganizerService();
    }
    return OrganizerService.instance;
  }

  async register(data: OrganizerRegistrationData): Promise<{ success: boolean; user?: OrganizerUser; error?: string }> {
    try {
      const { data: result, error } = await supabase.rpc('register_user', {
        p_email: data.email,
        p_password: data.password,
        p_role: 'organizer',
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

  async login(data: OrganizerLoginData): Promise<{ success: boolean; user?: OrganizerUser; error?: string }> {
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

      // Check if user is organizer
      if (result.user.role !== 'organizer') {
        return { success: false, error: 'Invalid credentials for organizer login' };
      }

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async getProfile(userId: string): Promise<{ success: boolean; user?: OrganizerUser; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', userId)
        .eq('role', 'organizer')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  async updateProfile(userId: string, updates: Partial<OrganizerUser>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('app_users')
        .update(updates)
        .eq('id', userId)
        .eq('role', 'organizer');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  async getMyEvents(userId: string): Promise<{ success: boolean; events?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, events: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch events' };
    }
  }
}

export const organizerService = OrganizerService.getInstance();