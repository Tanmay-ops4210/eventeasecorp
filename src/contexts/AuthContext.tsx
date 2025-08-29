import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/user';
import { useApp } from './AppContext';
import { supabase, authHelpers, UserProfile } from '../lib/supabaseClient';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  profile: UserProfile | null;
  isEmailVerified: boolean;
  resendVerification: () => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { setCurrentView } = useApp(); // Get setCurrentView from AppContext

  useEffect(() => {
    // Initialize Supabase auth session
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          setProfile(null);
          setIsEmailVerified(false);
          localStorage.removeItem('eventease_user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const { user, profile: userProfile, error } = await authHelpers.getCurrentUser();
      
      if (user && userProfile) {
        const mappedUser: User = {
          _id: user.id,
          email: user.email || '',
          name: userProfile.full_name,
          role: userProfile.role as UserRole,
          plan: 'FREE', // Default plan
          createdAt: userProfile.created_at,
          updatedAt: userProfile.updated_at,
        };

        setAuthState({
          user: mappedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        setProfile(userProfile);
        setIsEmailVerified(userProfile.email_verified);
        
        // Save to localStorage for compatibility
        localStorage.setItem('eventease_user', JSON.stringify(mappedUser));
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfile && !error) {
        const mappedUser: User = {
          _id: userId,
          email: userProfile.email,
          name: userProfile.full_name,
          role: userProfile.role as UserRole,
          plan: 'FREE', // Default plan
          createdAt: userProfile.created_at,
          updatedAt: userProfile.updated_at,
        };

        setAuthState({
          user: mappedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        setProfile(userProfile);
        setIsEmailVerified(userProfile.email_verified);
        
        // Save to localStorage for compatibility
        localStorage.setItem('eventease_user', JSON.stringify(mappedUser));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }

      if (data?.profile) {
        const userProfile = data.profile as UserProfile;
        
        const mappedUser: User = {
          _id: data.user?.id || '',
          email: userProfile.email,
          name: userProfile.full_name,
          role: userProfile.role as UserRole,
          plan: 'FREE',
          createdAt: userProfile.created_at,
          updatedAt: userProfile.updated_at,
        };

        setAuthState({
          user: mappedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        setProfile(userProfile);
        setIsEmailVerified(userProfile.email_verified);
        
        // Save to localStorage for compatibility
        localStorage.setItem('eventease_user', JSON.stringify(mappedUser));

        // Redirect based on role
        if (userProfile.role === 'admin' || email === 'tanmay365210@gmail.com') {
          setCurrentView('admin-dashboard');
        } else {
          switch (userProfile.role) {
            case 'organizer':
              setCurrentView('organizer-dashboard');
              break;
            case 'sponsor':
              setCurrentView('sponsor-dashboard');
              break;
            case 'attendee':
            default:
              setCurrentView('attendee-dashboard');
              break;
          }
        }
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          },
          emailRedirectTo: `${window.location.origin}?type=email`
        }
      });
      
      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      return { success: true, message: 'Please check your email to verify your account before signing in.' };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    authHelpers.signOut();
    localStorage.removeItem('eventease_user');
    setProfile(null);
    setIsEmailVerified(false);
    setCurrentView('home');
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('eventease_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Also update Supabase profile
      authHelpers.updateProfile({
        full_name: updatedUser.name,
        // Map other fields as needed
      });
    }
  };

  const resendVerification = async () => {
    if (!authState.user?.email) {
      throw new Error('No email address found');
    }
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: authState.user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await authHelpers.resetPassword(email);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        profile,
        isEmailVerified,
        login,
        register,
        logout,
        updateUser,
        resendVerification,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};