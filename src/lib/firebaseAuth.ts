import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  User as FirebaseUser,
  UserCredential,
  AuthError
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { supabase } from "./supabase";
import { UserRole } from "../types/user";

// Types for Firebase Auth integration
export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: FirebaseAuthUser;
  error?: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

/**
 * Firebase Authentication Service
 * Handles all authentication operations while using Supabase only for database
 */
export class FirebaseAuthService {
  private static instance: FirebaseAuthService;

  static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  /**
   * Register a new user with Firebase Auth and create profile in Supabase database
   */
  async register(data: RegistrationData): Promise<AuthResult> {
    try {
      // Create user in Firebase
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: data.name
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Create user profile in Supabase database
      const { error: supabaseError } = await supabase
        .from('profiles')
        .insert([
          {
            id: firebaseUser.uid,
            username: data.name,
            full_name: data.name,
            role: data.role,
            plan: 'free'
          }
        ]);

      if (supabaseError) {
        console.error('Failed to create Supabase profile:', supabaseError);
      }

      return {
        success: true,
        user: this.mapFirebaseUser(firebaseUser)
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError)
      };
    }
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Check if email is verified
      if (!firebaseUser.emailVerified) {
        return {
          success: false,
          error: 'Please verify your email address before signing in. Check your inbox for a verification link.'
        };
      }

      // Verify user exists in Supabase database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', firebaseUser.uid)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist (fallback)
        const { error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              full_name: firebaseUser.displayName || '',
              role: 'attendee' as UserRole,
              plan: 'free'
            }
          ]);

        if (createError) {
          console.error('Failed to create profile:', createError);
        }
      }

      return {
        success: true,
        user: this.mapFirebaseUser(firebaseUser)
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError)
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError)
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError)
      };
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Get current user with Supabase profile data
   */
  async getCurrentUserWithProfile(): Promise<{
    firebaseUser: FirebaseUser | null;
    profile: any;
    error?: string;
  }> {
    const firebaseUser = this.getCurrentUser();
    
    if (!firebaseUser) {
      return { firebaseUser: null, profile: null };
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', firebaseUser.uid)
        .single();

      return {
        firebaseUser,
        profile: error ? null : profile,
        error: error?.message
      };
    } catch (error) {
      return {
        firebaseUser,
        profile: null,
        error: 'Failed to fetch user profile'
      };
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<{ success: boolean; error?: string }> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        return { success: false, error: 'No user is currently signed in' };
      }

      await sendEmailVerification(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError)
      };
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Update user profile in Supabase
   */
  async updateUserProfile(updates: {
    username?: string;
    full_name?: string;
    role?: UserRole;
    company?: string;
    title?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const firebaseUser = this.getCurrentUser();
      if (!firebaseUser) {
        return { success: false, error: 'No user is currently signed in' };
      }

      // Update Firebase display name if full_name is provided
      if (updates.full_name && updates.full_name !== firebaseUser.displayName) {
        await updateProfile(firebaseUser, {
          displayName: updates.full_name
        });
      }

      // Update Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', firebaseUser.uid);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError)
      };
    }
  }

  /**
   * Map Firebase user to our application user format
   */
  private mapFirebaseUser(firebaseUser: FirebaseUser): FirebaseAuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified,
      photoURL: firebaseUser.photoURL
    };
  }

  /**
   * Convert Firebase Auth errors to user-friendly messages
   */
  private getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/requires-recent-login':
        return 'Please sign out and sign in again to perform this action.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
}

// Export singleton instance
export const firebaseAuthService = FirebaseAuthService.getInstance();

// Export individual functions for convenience
export const {
  register,
  signIn,
  signOut,
  resetPassword,
  getCurrentUser,
  getCurrentUserWithProfile,
  resendEmailVerification,
  onAuthStateChanged,
  updateUserProfile
} = firebaseAuthService;