import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/user';
import { useApp } from './AppContext';
import { supabase } from '../lib/supabaseClient'; // CORRECTED IMPORT
import { firebaseAuthService } from '../lib/firebaseAuth';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  profile: any | null;
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
  const [profile, setProfile] = useState<any | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const { setCurrentView } = useApp();

  const loadUserProfile = async (fbUser: FirebaseUser) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', fbUser.uid)
        .single();

      if (error) {
        console.error('Supabase profile fetch error:', error.message);
        // This can happen if the profile creation failed during registration.
        // Logging out prevents the user from being stuck in a broken state.
        logout();
        return;
      }
      
      if (userProfile) {
        const mappedUser: User = {
          _id: fbUser.uid,
          email: fbUser.email || '',
          name: userProfile.full_name,
          role: userProfile.role as UserRole,
          plan: userProfile.plan || 'FREE',
          createdAt: userProfile.created_at,
          updatedAt: userProfile.updated_at,
        };

        setAuthState({
          user: mappedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        setProfile(userProfile);
        localStorage.setItem('eventease_user', JSON.stringify(mappedUser));
      } else {
         console.error('No profile found for user:', fbUser.uid);
         logout();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };
  
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        await loadUserProfile(fbUser);
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        setProfile(null);
        localStorage.removeItem('eventease_user');
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await firebaseAuthService.signIn(email, password);
      if (!result.success) {
        throw new Error(result.error);
      }
      // onAuthStateChanged will handle the rest
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await firebaseAuthService.register({ email, password, name, role });
      if (!result.success) {
        throw new Error(result.error);
      }
      // onAuthStateChanged will handle the rest
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    firebaseAuthService.signOut();
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('eventease_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
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

  useEffect(() => {
    if (authState.isAuthenticated && profile && !authState.isLoading) {
      if (profile.role === 'admin' || firebaseUser?.email === 'tanmay365210mogabeera@gmail.com') {
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
        firebaseUser,
        isEmailVerified: firebaseUser?.emailVerified || false,
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
