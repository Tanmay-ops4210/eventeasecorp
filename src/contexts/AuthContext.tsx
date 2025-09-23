import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { firebaseAuthService } from '../lib/firebaseAuth';
import { syncUserProfile, getUserProfile } from '../lib/firebaseAuthHelpers';
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
          // Get user profile from Supabase
          const profile = await getUserProfile(firebaseUser.uid);
          
          if (profile) {
            setUser({
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
            });
          } else {
            // Profile doesn't exist, user might need to complete registration
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    const result = await firebaseAuthService.signIn(email, password);
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, company?: string) => {
    const result = await firebaseAuthService.register({
      email,
      password,
      name,
      role
    });

    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }

    // Sync profile with Supabase
    if (result.user) {
      await syncUserProfile(result.user, role, company);
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