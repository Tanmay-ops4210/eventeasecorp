import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable email confirmation detection
    flowType: 'pkce'
  }
});

console.log('Supabase client initialized with URL:', supabaseUrl);

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  role: 'attendee' | 'organizer' | 'admin';
  plan: string;
  company?: string;
  title?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  profile?: UserProfile;
  error?: string;
}

class SupabaseAuthService {
  private static instance: SupabaseAuthService;

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance;
  }

  // Sign up without email confirmation
  async signUp(email: string, password: string, userData: {
    username: string;
    full_name: string;
    role: 'attendee' | 'organizer' | 'admin';
    company?: string;
  }): Promise<AuthResult> {
    try {
      console.log('Supabase signUp called with:', { email, userData });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name,
            role: userData.role,
            company: userData.company
          },
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      if (error) throw error;

      console.log('Supabase signUp response:', data);

      // If signup is successful, sign in immediately (no email confirmation)
      if (data.user && !data.session) {
        console.log('No session from signup, attempting sign in');
        const signInResult = await this.signIn(email, password);
        return signInResult;
      }

      console.log('Signup successful with session');
      return { 
        success: true, 
        user: data.user,
        profile: data.user ? await this.getUserProfile(data.user.id) : null
      };
    } catch (error) {
      console.error('Supabase signUp error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  // Sign in
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Supabase signIn called with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('Supabase signIn response:', data);

      const profile = await this.getUserProfile(data.user?.id);
      console.log('User profile loaded:', profile);

      return { 
        success: true, 
        user: data.user,
        profile
      };
    } catch (error) {
      console.error('Supabase signIn error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  // Sign out
  async signOut(): Promise<AuthResult> {
    try {
      console.log('Supabase signOut called');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Supabase signOut successful');
      return { success: true };
    } catch (error) {
      console.error('Supabase signOut error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }

  // Get current user
  async getCurrentUser() {
    return supabase.auth.getUser();
  }

  // Get current session
  getCurrentSession() {
    return supabase.auth.getSession();
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Get user profile
  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    try {
      console.log('Getting user profile for:', userId);
      
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        console.log('No user ID available');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error);
        // Don't throw error for missing profile, return null instead
        return null;
      }
      
      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.warn('Failed to fetch profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<UserProfile>): Promise<AuthResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?view=auth-reset-password`
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password update failed' 
      };
    }
  }
}

export const supabaseAuth = SupabaseAuthService.getInstance();