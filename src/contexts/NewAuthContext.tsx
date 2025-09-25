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

  console.log('AuthProvider state:', { user: !!user, profile: !!profile, session: !!session, loading });

  useEffect(() => {
    console.log('AuthProvider useEffect - getting initial session');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabaseAuth.getCurrentSession();
        console.log('Initial session:', !!session);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const userProfile = await supabaseAuth.getUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await supabaseAuth.getUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error('Failed to load profile after auth change:', error);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => {
    try {
      console.log('Attempting login for:', email, 'with role:', role);
      
      const result = await supabaseAuth.signIn(email, password);
      if (!result.success) {
        console.error('Login failed:', result.error);
        throw new Error(result.error || 'Login failed');
      }
      
      console.log('Login successful');
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
      
      console.log('Registration successful');
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
      const updatedProfile = await supabaseAuth.getUserProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user && !!profile,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  console.log('AuthProvider rendering children, loading:', loading, 'isAuthenticated:', !!user && !!profile);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};