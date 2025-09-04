import { supabase } from '../lib/supabaseClient';

export interface AttendeeUser {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  role: 'attendee';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendeeRegistrationData {
  email: string;
  password: string;
  full_name: string;
  company?: string;
}

export interface AttendeeLoginData {
  email: string;
  password: string;
}

class AttendeeService {
  private static instance: AttendeeService;

  static getInstance(): AttendeeService {
    if (!AttendeeService.instance) {
      AttendeeService.instance = new AttendeeService();
    }
    return AttendeeService.instance;
  }

  async register(data: AttendeeRegistrationData): Promise<{ success: boolean; user?: AttendeeUser; error?: string }> {
    try {
      const { data: result, error } = await supabase.rpc('register_user', {
        p_email: data.email,
        p_password: data.password,
        p_role: 'attendee',
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

  async login(data: AttendeeLoginData): Promise<{ success: boolean; user?: AttendeeUser; error?: string }> {
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

      // Check if user is attendee
      if (result.user.role !== 'attendee') {
        return { success: false, error: 'Invalid credentials for attendee login' };
      }

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async getProfile(userId: string): Promise<{ success: boolean; user?: AttendeeUser; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', userId)
        .eq('role', 'attendee')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  async updateProfile(userId: string, updates: Partial<AttendeeUser>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('app_users')
        .update(updates)
        .eq('id', userId)
        .eq('role', 'attendee');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }
}

export const attendeeService = AttendeeService.getInstance();