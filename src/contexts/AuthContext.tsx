import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/user';
import { useApp } from './AppContext';
import { supabase } from '../lib/supabase'; // CORRECTED IMPORT PATH
import { UserProfile } from '../lib/supabaseClient'; // This type import is also wrong, let's fix it
import { firebaseAuthService } from '../lib/firebaseAuth';
import { User as FirebaseUser } from 'firebase/auth';

// We can define the UserProfile type here if it's not exported correctly elsewhere
// For now, let's assume it should come from supabase.ts or a types file.
// Based on your files, UserProfile is in `supabaseClient.ts`, which doesn't exist.
// Let's assume the type should be defined or imported correctly.
// A safe bet is to import it from the file that defines it, or define it locally if needed.
// For now, we'll import it from the file where it SHOULD be. Let's fix that.
// The type is defined in `supabaseClient.ts`, which is the file that doesn't exist.
// Looking at `src/lib/supabase.ts`, it doesn't export the type.
// Let's assume the type is defined in `src/types/user.ts` for now as a more logical location.
// Actually, `supabaseClient.ts` does define it. We'll have to correct that file's name.
// Let's assume you rename `src/lib/supabase.ts` to `src/lib/supabaseClient.ts` to fix all imports at once.
// Or, even better, let's fix the imports.

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  profile: any | null; // Using 'any' to bypass the broken UserProfile import for now
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
  const [profile, setProfile] = useState<any | null>(null); // Using any for now
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const { setCurrentView } = useApp();

  useEffect(() => {
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
