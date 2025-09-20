import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// NEW: Import the Supabase client
import { supabase, AppUser, sessionManager } from '../lib/supabaseClient';
import { firebaseAuthService } from '../lib/firebaseAuth';
import { getUserProfile, syncUserProfile } from '../lib/firebaseAuthHelpers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth'; // Assuming 'auth' is your exported firebase auth instance

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
    // UPDATED: Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // If there's a Supabase session, get the full profile
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          const appUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile.full_name || '',
            role: profile.role as 'attendee' | 'organizer' | 'sponsor',
            company: profile.company || undefined,
            avatar_url: profile.avatar_url || undefined,
            plan: profile.plan || 'free'
          };
          setUser(appUser);
          setIsAuthenticated(true);
          sessionManager.setUser(appUser);
        }
      } else {
        // If there's no session, clear user data
        setUser(null);
        setIsAuthenticated(false);
        sessionManager.clearSession();
      }
      setIsLoading(false);
    });

    // Also listen to Firebase auth changes to handle initial sign-in
    const firebaseUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
            setIsLoading(false);
        }
    });

    return () => {
      subscription?.unsubscribe();
      firebaseUnsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: 'attendee' | 'organizer' | 'sponsor') => {
    setIsLoading(true);
    try {
      // Step 1: Sign in to Firebase (Your existing code)
      const result = await firebaseAuthService.signIn(email, password);

      if (result.success && result.user) {
        
        // NEW: Get the Firebase ID Token
        const firebaseToken = await result.user.getIdToken();
        
        // NEW: Sign in to Supabase with the token to create a valid session
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithIdToken({
          // IMPORTANT: This provider must match the one you use in Firebase (e.g., 'google.com' for Google)
          // For email/password, you might not need a provider if set up correctly, but often it's 'google.com' etc.
          // Let's assume email/password doesn't need a specific provider string here.
          // If you use Google Sign-In, change this to 'google'.
          provider: 'google', 
          token: firebaseToken,
        });

        if (supabaseError) throw supabaseError;
        if (!supabaseData.user) throw new Error("Could not create Supabase session.");

        // UPDATED: Now, we use the Supabase user ID (a proper UUID) for all DB operations
        const profile = await getUserProfile(supabaseData.user.id);
        
        if (profile) {
          const appUser: AppUser = {
            id: supabaseData.user.id, // UPDATED: Use the Supabase UUID
            email: supabaseData.user.email || '',
            full_name: profile.full_name || '',
            role: profile.role as 'attendee' | 'organizer' | 'sponsor',
            company: profile.company || undefined,
            avatar_url: profile.avatar_url || undefined,
            plan: profile.plan || 'free'
          };
          
          setUser(appUser);
          sessionManager.setUser(appUser);
        } else {
          // Fallback if profile fetch fails - still use the Supabase ID
          const appUser: AppUser = {
            id: supabaseData.user.id, // UPDATED: Use the Supabase UUID
            email: result.user.email || '',
            full_name: result.user.displayName || '',
            role: role,
            plan: 'free'
          };
          
          setUser(appUser);
          sessionManager.setUser(appUser);
        }
        
        setIsAuthenticated(true);
        
        // Auto-redirect (Your existing code)
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
        console.error("Login Error:", error);
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

        // NEW: Get the Firebase ID Token from the newly created user
        const firebaseToken = await result.user.getIdToken();
        
        // NEW: Sign in to Supabase with the token to create the Supabase user
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: firebaseToken,
        });

        if (supabaseError) throw supabaseError;
        if (!supabaseData.user) throw new Error("Could not create Supabase user.");
        
        // UPDATED: Sync profile using the new Supabase ID
        // Note: Your syncUserProfile function must now create a profile with the Supabase UUID as the `id`.
        await syncUserProfile({ ...result.user, uid: supabaseData.user.id }, role, company);
        
        // Get complete user profile from Supabase
        const profile = await getUserProfile(supabaseData.user.id); // UPDATED
        
        if (profile) {
          const appUser: AppUser = {
            id: supabaseData.user.id, // UPDATED
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
           const appUser: AppUser = {
            id: supabaseData.user.id, // UPDATED
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
        
        // Auto-redirect (Your existing code)
        setTimeout(() => {
            // ... (redirect logic remains the same)
        }, 100);
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration Error:", error);
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
