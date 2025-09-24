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

  useEffect(() => {
    // Get initial session
    supabaseAuth.getCurrentSession().then(({ data: { session } }) => {
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
      const userProfile = await supabaseAuth.getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const login = async (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => {
    const result = await supabaseAuth.signIn(email, password);
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
    
    // Trigger navigation based on user role after successful login
    if (result.profile?.role === 'organizer') {
      window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { 
        detail: 'organizer-dashboard' 
      }));
    } else if (result.profile?.role === 'attendee') {
      window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { 
        detail: 'attendee-dashboard' 
      }));
    } else if (result.profile?.role === 'admin') {
      window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { 
        detail: 'admin-dashboard' 
      }));
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'attendee' | 'organizer' | 'admin', 
    company?: string
  ) => {
    const result = await supabaseAuth.signUp(email, password, {
      username: name.toLowerCase().replace(/\s+/g, '_'),
      full_name: name,
      role,
      company
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }
  };

  const logout = async () => {
    const result = await supabaseAuth.signOut();
    if (!result.success) {
      throw new Error(result.error || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    const result = await supabaseAuth.resetPassword(email);
    if (!result.success) {
      throw new Error(result.error || 'Password reset failed');
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};