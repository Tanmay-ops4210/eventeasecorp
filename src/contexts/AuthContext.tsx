import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// NEW: Import supabase client for auth and sessionManager
import { supabase, sessionManager } from '../lib/supabaseClient';
// NEW: Import AppUser from its new, dedicated types file to fix the build error
import type { AppUser } from '../types/database';
import { firebaseAuthService } from '../lib/firebaseAuth';
import { getUserProfile, syncUserProfile } from '../lib/firebaseAuthHelpers';

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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Your original session logic is unchanged.
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

      if (result.success && result.user) {
        // NEW STEP: Get Firebase token and sign in to Supabase to get the correct UUID
        const firebaseToken = await result.user.getIdToken();
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithIdToken({
          provider: 'google', // Or your configured provider (e.g., 'apple', 'facebook')
          token: firebaseToken,
        });

        if (supabaseError) throw supabaseError;
        if (!supabaseData.user) throw new Error("Could not create Supabase session.");

        // Now we use the correct Supabase user ID (the UUID)
        const supabaseUserId = supabaseData.user.id;

        // Sync the profile using the correct Supabase UUID
        await syncUserProfile({ ...result.user, uid: supabaseUserId }, role);

        const profile = await getUserProfile(supabaseUserId);

        if (profile) {
          const appUser: AppUser = {
            id: supabaseUserId, // UPDATED: Use the Supabase UUID
            email: result.user.email || '',
            full_name: profile.full_name || '',
            role: profile.role as 'attendee' | 'organizer' | 'sponsor',
            company: profile.company || undefined,
            avatar_url: profile.avatar_url || undefined,
            plan: profile.plan || 'free'
          };
          
          setUser(appUser);
          sessionManager.setUser(appUser);
        } else {
          // Fallback if profile fetch fails
          const appUser: AppUser = {
            id: supabaseUserId, // UPDATED: Use the Supabase UUID
            email: result.user.email || '',
            full_name: result.user.displayName || '',
            role: role,
            plan: 'free'
          };
          
          setUser(appUser);
          sessionManager.setUser(appUser);
        }
        
        setIsAuthenticated(true);
        
        // Your redirect logic is unchanged
        setTimeout(() => {
          switch (role) {
            case 'attendee':
              window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: 'attendee-dashboard' }));
              break;
            case 'organizer':
              window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: 'organizer-dashboard' }));
              break;
            case 'sponsor':
              window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: 'sponsor-dashboard' }));
              break;
          }
        }, 100);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'attendee' | 'organizer' | 'sponsor', company?: string) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuthService.register({ email, password, name, role });

      if (result.success && result.user) {
        // NEW STEP: Get Firebase token and sign in to Supabase to get the correct UUID
        const firebaseToken = await result.user.getIdToken();
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithIdToken({
          provider: 'google', // Or your configured provider
          token: firebaseToken,
        });

        if (supabaseError) throw supabaseError;
        if (!supabaseData.user) throw new Error("Could not create Supabase user.");
        
        // Now we use the correct Supabase user ID (the UUID)
        const supabaseUserId = supabaseData.user.id;

        // Sync the profile using the correct Supabase UUID
        await syncUserProfile({ ...result.user, uid: supabaseUserId }, role, company);
        
        const profile = await getUserProfile(supabaseUserId);
        
        if (profile) {
          const appUser: AppUser = {
            id: supabaseUserId, // UPDATED: Use the Supabase UUID
            email: result.user.email || '',
            full_name: profile.full_name || name,
            role: profile.role as 'attendee' | 'organizer' | 'sponsor',
            company: profile.company || company,
            avatar_url: profile.avatar_url || undefined,
            plan: profile.plan || 'free'
          };
          
          setUser(appUser);
          sessionManager.setUser(appUser);
        } else {
          // Fallback if profile fetch fails
          const appUser: AppUser = {
            id: supabaseUserId, // UPDATED: Use the Supabase UUID
            email: result.user.email || '',
            full_name: name,
            role: role,
            company: company,
            plan: 'free'
          };
          
          setUser(appUser);
          sessionManager.setUser(appUser);
        }
        
        setIsAuthenticated(true);
        
        // Your redirect logic is unchanged
        setTimeout(() => {
          switch (role) {
            case 'attendee':
              window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: 'attendee-dashboard' }));
              break;
            case 'organizer':
              window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: 'organizer-dashboard' }));
              break;
            case 'sponsor':
              window.dispatchEvent(new CustomEvent('navigate-to-dashboard', { detail: 'sponsor-dashboard' }));
              break;
          }
        }, 100);
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await firebaseAuthService.signOut();
    await supabase.auth.signOut(); // NEW: Sign out from Supabase as well
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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
