import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { firebaseAuthService } from '../lib/firebaseAuth';
import { syncUserProfile, getUserProfile } from '../lib/firebaseAuthHelpers';
import { setSupabaseAuth } from '../lib/supabaseClient';
import { UserRole, User } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          console.log('🔥 Firebase user authenticated:', firebaseUser.email);
          
          try {
            // Set Supabase auth context with Firebase user
            await setSupabaseAuth(firebaseUser);
            console.log('✅ Supabase auth context set');
            
            // Wait a moment for the session to be established
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Get user profile from Supabase
            const profile = await getUserProfile(firebaseUser.uid);
            console.log('📋 User profile loaded:', profile ? 'Found' : 'Not found');
            
            if (profile) {
              const userData = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                full_name: profile.full_name || firebaseUser.displayName || '',
                role: profile.role,
                company: profile.company,
                avatar_url: profile.avatar_url,
                is_active: true,
                plan: profile.plan,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
              };
              
              setUser(userData);
              console.log('👤 User state set:', userData.email, userData.role);
            } else {
              console.warn('⚠️ No profile found for user, clearing user state');
              setUser(null);
            }
          } catch (profileError) {
            console.error('❌ Error loading user profile:', profileError);
            setUser(null);
          }
        } else {
          console.log('🚪 Firebase user signed out');
          // Clear Supabase auth when Firebase user is null
          await setSupabaseAuth(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Clear Supabase auth on error
        await setSupabaseAuth(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    console.log('🔐 Attempting login for:', email);
    const result = await firebaseAuthService.signIn(email, password);
    if (!result.success) {
      console.error('❌ Login failed:', result.error);
      throw new Error(result.error || 'Login failed');
    }
    console.log('✅ Firebase login successful');
  };

  const register = async (email: string, password: string, name: string, role: UserRole, company?: string) => {
    console.log('📝 Attempting registration for:', email, 'as', role);
    const result = await firebaseAuthService.register({
      email,
      password,
      name,
      role
    });

    if (!result.success) {
      console.error('❌ Registration failed:', result.error);
      throw new Error(result.error || 'Registration failed');
    }

    console.log('✅ Firebase registration successful');
    
    // Sync profile with Supabase
    if (result.user) {
      try {
        await syncUserProfile(result.user, role, company);
        console.log('✅ Profile synced with Supabase');
      } catch (syncError) {
        console.error('❌ Failed to sync profile:', syncError);
        throw new Error('Registration completed but profile sync failed');
      }
    }
  };

  const logout = async () => {
    const result = await firebaseAuthService.signOut();
    if (!result.success) {
      throw new Error(result.error || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    const result = await firebaseAuthService.resetPassword(email);
    if (!result.success) {
      throw new Error(result.error || 'Password reset failed');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};