import type { AppUser } from '../types/database';

interface SessionData {
  user: AppUser;
  timestamp: number;
  expiresAt: number;
}

class SessionManager {
  private static instance: SessionManager;
  private readonly SESSION_KEY = 'eventease_session';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  setUser(user: AppUser): void {
    const sessionData: SessionData = {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error);
    }
  }

  getUser(): AppUser | null {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;

      const sessionData: SessionData = JSON.parse(sessionStr);
      
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        this.clearSession();
        return null;
      }

      return sessionData.user;
    } catch (error) {
      console.warn('Failed to retrieve session from localStorage:', error);
      this.clearSession();
      return null;
    }
  }

  isValidSession(): boolean {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return false;

      const sessionData: SessionData = JSON.parse(sessionStr);
      return Date.now() <= sessionData.expiresAt;
    } catch (error) {
      return false;
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.warn('Failed to clear session from localStorage:', error);
    }
  }

  refreshSession(): void {
    const user = this.getUser();
    if (user) {
      this.setUser(user); // This will update the expiration time
    }
  }
}

export const sessionManager = SessionManager.getInstance();