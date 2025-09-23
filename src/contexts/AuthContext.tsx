import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../lib/supabase';
import { UserRole } from '../types/user';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to handle authentication state changes
  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
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
      const result = await authService.getUserProfile(userId);
      if (result.success && result.profile) {
        setProfile(result.profile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  // Function to sign in a user
  const login = useCallback(async (email: string, password: string, role?: UserRole) => {
    const result = await authService.signIn(email, password);
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
  }, []);

  // Function to register a user
  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    company?: string
  ) => {
    const result = await authService.signUp(email, password, {
      username: name.toLowerCase().replace(/\s+/g, '_'),
      full_name: name,
      role,
      company
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }
  }, []);

  // Function to sign out a user
  const logout = useCallback(async () => {
    const result = await authService.signOut();
    if (!result.success) {
      throw new Error(result.error || 'Logout failed');
    }
  }, []);

  // Function to send a password reset email
  const resetPassword = useCallback(async (email: string) => {
    const result = await authService.resetPassword(email);
    if (!result.success) {
      throw new Error(result.error || 'Password reset failed');
    }
  }, []);

  // Function to update user profile
  const updateProfile = useCallback(async (updates: any) => {
    const result = await authService.updateUserProfile(updates);
    if (!result.success) {
      throw new Error(result.error || 'Profile update failed');
    }
    
    // Reload profile after update
    if (user) {
      await loadUserProfile(user.id);
    }
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
    }),
    [
      user,
      profile,
      session,
      loading,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};