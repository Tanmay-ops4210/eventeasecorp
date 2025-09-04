import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser, sessionManager } from '../lib/supabaseClient';
import { attendeeService } from '../services/attendeeService';
import { organizerService } from '../services/organizerService';
import { sponsorService } from '../services/sponsorService';

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
    // Check for existing session on app load
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
      let result;
      
      switch (role) {
        case 'attendee':
          result = await attendeeService.login({ email, password });
          break;
        case 'organizer':
          result = await organizerService.login({ email, password });
          break;
        case 'sponsor':
          result = await sponsorService.login({ email, password });
          break;
        default:
          throw new Error('Invalid role specified');
      }

      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        sessionManager.setUser(result.user);
        
        // Auto-redirect to appropriate dashboard after login
        setTimeout(() => {
          switch (result.user.role) {
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
      let result;
      const registrationData = {
        email,
        password,
        full_name: name,
        company
      };

      switch (role) {
        case 'attendee':
          result = await attendeeService.register(registrationData);
          break;
        case 'organizer':
          result = await organizerService.register(registrationData);
          break;
        case 'sponsor':
          result = await sponsorService.register(registrationData);
          break;
        default:
          throw new Error('Invalid role specified');
      }

      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        sessionManager.setUser(result.user);
        
        // Auto-redirect to appropriate dashboard after registration
        setTimeout(() => {
          switch (result.user.role) {
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

  const logout = () => {
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