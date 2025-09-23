import { firebaseAuthService } from './firebaseAuth';
import { supabase, setSupabaseAuth, ensureSupabaseAuth } from './supabaseClient';
import { UserRole, UserProfile } from '../types/user';

/**
 * Helper functions for Firebase Auth integration with Supabase database
 * These functions provide integration between Firebase Auth and Supabase database
 */

/**
 * Check if current user has admin privileges
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    await ensureSupabaseAuth();
    const { firebaseUser, profile } = await firebaseAuthService.getCurrentUserWithProfile();
    
    if (!firebaseUser || !profile) return false;
    
    // Check if user is admin by role or specific email
    return profile.role === 'admin' || firebaseUser.email === 'tanmay365210mogabeera@gmail.com';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get user permissions based on role
 */
export const getUserPermissions = async (userId?: string): Promise<string[]> => {
  try {
    await ensureSupabaseAuth();
    const targetUserId = userId || firebaseAuthService.getCurrentUser()?.uid;
    if (!targetUserId) return [];

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', targetUserId)
      .single();

    if (!profile) return [];

    // Define permissions based on role
    const rolePermissions: Record<UserRole, string[]> = {
      admin: ['*'], // All permissions
      organizer: [
        'events.create',
        'events.update',
        'events.delete',
        'attendees.manage',
        'analytics.view',
        'tickets.manage'
      ],
      sponsor: [
        'booth.customize',
        'leads.manage',
        'analytics.view',
        'attendees.contact'
      ],
      attendee: [
        'events.view',
        'events.register',
        'profile.update',
        'network.connect'
      ]
    };

    return rolePermissions[profile.role as UserRole] || [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
};

/**
 * Check if user has specific permission
 */
export const hasPermission = async (permission: string): Promise<boolean> => {
  try {
    const permissions = await getUserPermissions();
    return permissions.includes('*') || permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Sync Firebase user data with Supabase profile
 */
export const syncUserProfile = async (
  firebaseUser: any, 
  role?: UserRole, 
  company?: string
): Promise<void> => {
  try {
    // Set Supabase auth context with Firebase user
    await setSupabaseAuth(firebaseUser);
    
    // Wait a moment for the session to be established
    await new Promise(resolve => setTimeout(resolve, 100));

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', firebaseUser.uid)
      .single();

    if (!existingProfile) {
      // Create new profile if it doesn't exist
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            full_name: firebaseUser.displayName || '',
            role: role || 'attendee' as UserRole,
            plan: 'free',
            company: company || null
          }
        ]);
      
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
    } else {
      // Update existing profile with Firebase data if needed
      const updates: any = {};
      
      if (firebaseUser.displayName && firebaseUser.displayName !== existingProfile.full_name) {
        updates.full_name = firebaseUser.displayName;
      }
      
      if (role && role !== existingProfile.role) {
        updates.role = role;
      }
      
      if (company && company !== existingProfile.company) {
        updates.company = company;
      }
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', firebaseUser.uid);
        
        if (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error syncing user profile:', error);
    throw error;
  }
};

/**
 * Get user's Supabase profile data
 */
export const getUserProfile = async (userId?: string): Promise<UserProfile | null> => {
  try {
    await ensureSupabaseAuth();
    const targetUserId = userId || firebaseAuthService.getCurrentUser()?.uid;
    if (!targetUserId) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Update user profile in Supabase
 */
export const updateUserProfile = async (
  updates: Partial<UserProfile>,
  userId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await ensureSupabaseAuth();
    const targetUserId = userId || firebaseAuthService.getCurrentUser()?.uid;
    if (!targetUserId) {
      return { success: false, error: 'No user ID provided' };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Delete user account (Firebase + Supabase cleanup)
 */
export const deleteUserAccount = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const firebaseUser = firebaseAuthService.getCurrentUser();
    if (!firebaseUser) {
      return { success: false, error: 'No user is currently signed in' };
    }

    // Delete from Supabase first (this will cascade delete related data)
    const { error: supabaseError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', firebaseUser.uid);

    if (supabaseError) {
      console.error('Error deleting Supabase profile:', supabaseError);
    }

    // Delete Firebase user
    await firebaseUser.delete();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account'
    };
  }
};

/**
 * Check if user can access a specific resource
 */
export const canAccessResource = async (
  resourceType: string,
  resourceId?: string,
  action: 'read' | 'write' | 'delete' = 'read'
): Promise<boolean> => {
  try {
    const firebaseUser = firebaseAuthService.getCurrentUser();
    if (!firebaseUser) return false;

    // Admin can access everything
    if (await isAdmin()) return true;

    const profile = await getUserProfile();
    if (!profile) return false;

    // Define resource access rules
    switch (resourceType) {
      case 'event':
        if (action === 'read') return true; // Anyone can read published events
        if (action === 'write' || action === 'delete') {
          // Only organizers can modify their own events
          if (profile.role !== 'organizer') return false;
          if (resourceId) {
            const { data: event } = await supabase
              .from('events')
              .select('organizer_id')
              .eq('id', resourceId)
              .single();
            return event?.organizer_id === firebaseUser.uid;
          }
        }
        break;

      case 'profile':
        // Users can only access their own profile
        return resourceId === firebaseUser.uid || !resourceId;

      case 'attendee':
        // Organizers can manage attendees for their events
        return profile.role === 'organizer';

      case 'sponsor':
        // Sponsors can manage their own booth and leads
        return profile.role === 'sponsor';

      default:
        return false;
    }

    return false;
  } catch (error) {
    console.error('Error checking resource access:', error);
    return false;
  }
};