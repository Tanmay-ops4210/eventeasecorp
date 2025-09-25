import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAuth, UserProfile } from '../lib/supabaseAuth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => Promise<void>;
  register: (email: string, password: string, name: string, role: 'attendee' | 'organizer' | 'admin', company?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider state:', { user, profile, session, loading });

  useEffect(() => {
    console.log('AuthProvider useEffect - getting initial session');
    // Get initial session
    supabaseAuth.getCurrentSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      const userProfile = await supabaseAuth.getUserProfile(userId);
      console.log('User profile loaded:', userProfile);
      setProfile(userProfile);
      
      // If we have a user but no profile, create a default one
      if (!userProfile && userId) {
        console.log('No profile found, user may need to complete setup');
        // For now, create a minimal profile object to prevent auth loops
        const defaultProfile = {
          id: userId,
          email: '',
          username: '',
          full_name: '',
          role: 'attendee' as const,
          plan: 'free',
          company: null,
          title: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Don't throw error, just set profile to null to prevent auth loops
      setProfile(null);
    }
  };

  const login = async (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => {
    try {
      console.log('Attempting login for:', email, 'with role:', role);
      
      const result = await supabaseAuth.signIn(email, password);
      if (!result.success) {
        console.error('Login failed:', result.error);
        throw new Error(result.error || 'Login failed');
      }
      
      console.log('Login successful:', result.user);
      
      // Wait a moment for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Manually trigger profile load if needed
      if (result.user && !profile) {
        await loadUserProfile(result.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'attendee' | 'organizer' | 'admin', 
    company?: string
  ) => {
    try {
      console.log('Attempting registration for:', email, 'with role:', role);
      
      const result = await supabaseAuth.signUp(email, password, {
        username: name.toLowerCase().replace(/\s+/g, '_'),
        full_name: name,
        role,
        company
      });
      
      if (!result.success) {
        console.error('Registration failed:', result.error);
        throw new Error(result.error || 'Registration failed');
      }
      
      console.log('Registration successful:', result.user);
      
      // The auth state change listener will handle setting user and profile
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      
      const result = await supabaseAuth.signOut();
      if (!result.success) {
        console.error('Logout failed:', result.error);
        throw new Error(result.error || 'Logout failed');
      }
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      
      const result = await supabaseAuth.resetPassword(email);
      if (!result.success) {
        console.error('Password reset failed:', result.error);
        throw new Error(result.error || 'Password reset failed');
      }
      
      console.log('Password reset successful');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    const result = await supabaseAuth.updatePassword(newPassword);
    if (!result.success) {
      throw new Error(result.error || 'Password update failed');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const result = await supabaseAuth.updateUserProfile(updates);
    if (!result.success) {
      throw new Error(result.error || 'Profile update failed');
    }
    
    // Reload profile after update
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  console.log('AuthProvider rendering children, loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};