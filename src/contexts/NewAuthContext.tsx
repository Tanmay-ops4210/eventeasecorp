import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Mock User Interface
export interface DummyUser {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  role: 'attendee' | 'organizer' | 'admin';
  company?: string;
  avatar_url?: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: DummyUser | null;
  profile: DummyUser | null;
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => Promise<void>;
  register: (email: string, password: string, name: string, role: 'attendee' | 'organizer' | 'admin', company?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<DummyUser>) => Promise<void>;
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
  const [user, setUser] = useState<DummyUser | null>(null);
  const [profile, setProfile] = useState<DummyUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock initialization - no backend
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: 'attendee' | 'organizer' | 'admin') => {
    // Mock login - always succeeds for demo
    const mockUser: DummyUser = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      full_name: email.split('@')[0],
      role: role || 'attendee',
      plan: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockUser);
    setSession({ user: mockUser });
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'attendee' | 'organizer' | 'admin', 
    company?: string
  ) => {
    // Mock registration - always succeeds for demo
    const mockUser: DummyUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      full_name: name,
      role,
      company,
      plan: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockUser);
    setSession({ user: mockUser });
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    // Mock password reset - always succeeds for demo
    console.log(`Password reset email would be sent to: ${email}`);
  };

  const updatePassword = async (newPassword: string) => {
    // Mock password update
    console.log('Password would be updated');
  };

  const updateProfile = async (updates: Partial<DummyUser>) => {
    // Mock profile update
    if (user && profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      setUser(updatedProfile);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};