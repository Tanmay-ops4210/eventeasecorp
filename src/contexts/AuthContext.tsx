import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/user';
import { useApp } from './AppContext';
import { supabase, UserProfile } from '../lib/supabaseClient';
import { firebaseAuthService, FirebaseAuthUser } from '../lib/firebaseAuth';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  profile: UserProfile | null;
  isEmailVerified: boolean;
  resendVerification: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  firebaseUser: FirebaseUser | null;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const { setCurrentView } = useApp(); // Get setCurrentView from AppContext

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid);
        setIsEmailVerified(firebaseUser.emailVerified);
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        setProfile(null);
        setIsEmailVerified(false);
        localStorage.removeItem('eventease_user');
      }
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfile && !error) {
        const mappedUser: User = {
          _id: userId,
          email: firebaseUser?.email || '',
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
        
        // Save to localStorage for compatibility
        localStorage.setItem('eventease_user', JSON.stringify(mappedUser));
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await firebaseAuthService.signIn(email, password);
      
      if (!result.success) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw new Error(result.error);
      }

      // User profile will be loaded by the auth state change listener
      // Redirect logic will be handled there
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await firebaseAuthService.register({
        email,
        password,
        name,
        role
      });
      
      if (!result.success) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw new Error(result.error);
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      return { success: true, message: 'Please check your email to verify your account before signing in.' };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    firebaseAuthService.signOut();
    localStorage.removeItem('eventease_user');
    setProfile(null);
    setIsEmailVerified(false);
    setFirebaseUser(null);
    setCurrentView('home');
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('eventease_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Update profile in Supabase
      firebaseAuthService.updateUserProfile({
        full_name: updatedUser.name,
        username: updatedUser.name,
        role: updatedUser.role
      });
    }
  };

  const resendVerification = async () => {
    const result = await firebaseAuthService.resendEmailVerification();
    
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const resetPassword = async (email: string) => {
    const result = await firebaseAuthService.resetPassword(email);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  // Handle role-based redirects when user profile is loaded
  useEffect(() => {
    if (authState.isAuthenticated && profile && !authState.isLoading) {
      // Check for admin access
      if (profile.role === 'admin' || firebaseUser?.email === 'tanmay365210@gmail.com') {
        setCurrentView('admin-dashboard');
      } else {
        switch (profile.role) {
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
  }, [authState.isAuthenticated, profile, authState.isLoading, firebaseUser?.email, setCurrentView]);
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        profile,
        isEmailVerified,
        firebaseUser,
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