import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Database types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'attendee' | 'organizer' | 'sponsor';
  email_verified: boolean;
  profile_completed: boolean;
  avatar_url?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  twitter_url?: string;
  preferences: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: string;
  role: 'attendee' | 'organizer' | 'sponsor';
  permission: string;
  description?: string;
  created_at: string;
}

// Auth helper functions
export const authHelpers = {
  async signIn(email: string, password: string) {
    // Rely on Supabase's built-in check for email verification.
    // The custom pre-check has been removed.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { data: null, error };
    }

    // After a successful sign-in, get the user's profile from the correct table.
    const { data: profile, error: profileError } = await supabase
      .from('profiles') // Corrected table name to 'profiles'
      .select('*')
      .eq('id', data.user.id) // Query by user ID for accuracy
      .single();

    if (profileError || !profile) {
      // This can happen if the trigger to create a profile failed.
      // Log out the user to prevent an inconsistent state.
      await supabase.auth.signOut();
      return {
        data: null,
        error: new Error('User profile not found. Please contact support.')
      };
    }

    // Return the authenticated user data along with their profile information
    return {
      data: {
        ...data,
        profile
      },
      error: null
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { user: null, profile: null, error };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles') // Corrected table name
      .select('*')
      .eq('id', user.id)
      .single();

    return { 
      user, 
      profile: profileError ? null : profile, 
      error: profileError 
    };
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('profiles') // Corrected table name
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  },

  async getUserPermissions(userId: string) {
    const { data: profile } = await supabase
      .from('profiles') // Corrected table name
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) return [];

    const { data: permissions } = await supabase
      .from('user_role_permissions')
      .select('permission')
      .eq('role', profile.role);

    return permissions?.map(p => p.permission) || [];
  },

  async hasPermission(permission: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const permissions = await this.getUserPermissions(user.id);
    return permissions.includes(permission);
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    return { data, error };
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { data, error };
  }
};

// Real-time subscription helpers
export const subscriptions = {
  subscribeToUserProfile(userId: string, callback: (profile: UserProfile) => void) {
    return supabase
      .channel(`user_profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles', // Corrected table name
          filter: `id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as UserProfile);
          }
        }
      )
      .subscribe();
  }
};
