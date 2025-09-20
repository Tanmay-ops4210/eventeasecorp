import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { sessionManager } from '../lib/sessionManager';
import type { AppUser } from '../types/database';
import { firebaseAuthService } from '../lib/firebaseAuth';
import { getUserProfile, syncUserProfile } from '../lib/firebaseAuthHelpers';
import { getAuth } from 'firebase/auth';

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'attendee' | 'organizer' | 'sponsor') => Promise<void>;
  register: (email: string, password: string, name: string, role: 'attendee' | 'organizer' | 'sponsor', company?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const checkSession = () => {
      if (sessionManager.isValidSession()) {
        const storedUser = sessionManager.getUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } else {
        sessionManager.clearSession();
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string, role: 'attendee' | 'organizer' | 'sponsor') => {
    setIsLoading(true);
    try {
      const result = await firebaseAuthService.signIn(email, password);
      if (!result.success || !result.user) throw new Error(result.error || 'Login failed');

      // ✅ Get the actual Firebase User
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Firebase user not found');

      const firebaseToken = await firebaseUser.getIdToken();

      // ✅ Sign in to Supabase with ID token
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithIdToken({
        provider: 'google', // your provider if using social login
        token: firebaseToken,
      });

      if (supabaseError) throw supabaseError;
      if (!supabaseData.user) throw new Error('Could not create Supabase session.');

      const supabaseUserId = supabaseData.user.id;

      // ✅ Sync Firebase profile to Supabase
      await syncUserProfile({ ...result.user, uid: supabaseUserId }, role);
      const profile = await getUserProfile(supabaseUserId);

      const appUser: AppUser = {
        id: supabaseUserId,
        email: result.user.email || '',
        full_name: profile?.full_name || result.user.displayName || '',
        role: profile?.role as 'attendee' | 'organizer' | 'sponsor' || role,
        company: profile?.company,
        avatar_url: profile?.avatar_url,
        plan: profile?.plan || 'free',
      };

      setUser(appUser);
      sessionManager.setUser(appUser);
      setIsAuthenticated(true);

      // ✅ Dispatch dashboard navigation
      setTimeout(() => {
        const eventDetail = role === 'attendee' ? 'attendee-dashboard' : role === 'organizer' ? 'organizer-dashboard' : 'sponsor-dashboard';
        window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: eventDetail }));
      }, 100);

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'attendee' | 'organizer' | 'sponsor', company?: string) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuthService.register({ email, password, name, role });
      if (!result.success || !result.user) throw new Error(result.error || 'Registration failed');

      // ✅ Get the actual Firebase User
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Firebase user not found');

      const firebaseToken = await firebaseUser.getIdToken();

      // ✅ Sign in to Supabase with ID token
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: firebaseToken,
      });

      if (supabaseError) throw supabaseError;
      if (!supabaseData.user) throw new Error('Could not create Supabase user.');

      const supabaseUserId = supabaseData.user.id;

      // ✅ Sync Firebase profile to Supabase
      await syncUserProfile({ ...result.user, uid: supabaseUserId }, role, company);
      const profile = await getUserProfile(supabaseUserId);

      const appUser: AppUser = {
        id: supabaseUserId,
        email: result.user.email || '',
        full_name: profile?.full_name || name,
        role: profile?.role as 'attendee' | 'organizer' | 'sponsor' || role,
        company: profile?.company || company,
        avatar_url: profile?.avatar_url,
        plan: profile?.plan || 'free',
      };

      setUser(appUser);
      sessionManager.setUser(appUser);
      setIsAuthenticated(true);

      setTimeout(() => {
        const eventDetail = role === 'attendee' ? 'attendee-dashboard' : role === 'organizer' ? 'organizer-dashboard' : 'sponsor-dashboard';
        window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: eventDetail }));
      }, 100);

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await firebaseAuthService.signOut();
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    sessionManager.clearSession();
  };

  const updateUser = (userData: Partial<AppUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      sessionManager.setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
