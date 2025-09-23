import { supabase } from './supabaseClient';
import CryptoJS from 'crypto-js';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin';
  permissions: string[];
  last_login: string;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
  method?: 'bypass' | 'standard';
}

export interface SecurityLog {
  id: string;
  email: string;
  action: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'access_denied';
  method: 'bypass' | 'standard';
  ip_address: string;
  user_agent: string;
  timestamp: string;
  additional_info?: Record<string, any>;
}

class AdminAuthService {
  private static instance: AdminAuthService;
  private readonly BYPASS_EMAIL = import.meta.env.VITE_ADMIN_BYPASS_EMAIL || 'tanmay365210mogabeera@gmail.com';
  private readonly BYPASS_PASSWORD = import.meta.env.VITE_ADMIN_BYPASS_PASSWORD || 'tam123***';
  private readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  private readonly SALT_ROUNDS = 12;

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  /**
   * Hash password using SHA-256 with salt
   */
  private hashPassword(password: string, salt: string): string {
    return CryptoJS.SHA256(password + salt).toString();
  }

  /**
   * Generate random salt
   */
  private generateSalt(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Verify password against hash
   */
  private verifyPassword(password: string, hash: string, salt: string): boolean {
    return this.hashPassword(password, salt) === hash;
  }

  /**
   * Log security events
   */
  private async logSecurityEvent(
    email: string, 
    action: SecurityLog['action'], 
    method: 'bypass' | 'standard',
    success: boolean = true,
    additionalInfo?: Record<string, any>
  ): Promise<void> {
    try {
      const logEntry: Omit<SecurityLog, 'id'> = {
        email: email.toLowerCase(),
        action,
        method,
        ip_address: 'client-ip', // In production, get real client IP
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        additional_info: {
          success,
          ...additionalInfo
        }
      };

      // In production, send to secure logging service
      // For demo, store in localStorage
      const existingLogs = JSON.parse(localStorage.getItem('admin_security_logs') || '[]');
      existingLogs.push({
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...logEntry
      });
      
      // Keep only last 500 logs
      if (existingLogs.length > 500) {
        existingLogs.splice(0, existingLogs.length - 500);
      }
      
      localStorage.setItem('admin_security_logs', JSON.stringify(existingLogs));

      // Also log to console for development
      console.log(`[ADMIN SECURITY] ${action}:`, {
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        method,
        success,
        timestamp: logEntry.timestamp
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Check if credentials match bypass account
   */
  private isBypassAccount(email: string, password: string): boolean {
    return email.toLowerCase() === this.BYPASS_EMAIL.toLowerCase() && 
           password === this.BYPASS_PASSWORD;
  }

  /**
   * Authenticate admin user
   */
  async authenticate(email: string, password: string): Promise<AuthResult> {
    try {
      // Check for bypass credentials first
      if (this.isBypassAccount(email, password)) {
        await this.logSecurityEvent(email, 'login_success', 'bypass');
        
        const bypassUser: AdminUser = {
          id: 'bypass_admin',
          email: this.BYPASS_EMAIL,
          full_name: 'System Administrator',
          role: 'admin',
          permissions: ['*'], // All permissions
          last_login: new Date().toISOString(),
          created_at: '2024-01-01T00:00:00Z'
        };

        return { 
          success: true, 
          user: bypassUser, 
          method: 'bypass' 
        };
      }

      // Standard Supabase authentication
      await this.logSecurityEvent(email, 'login_attempt', 'standard');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await this.logSecurityEvent(email, 'login_failure', 'standard', false, { error: error.message });
        return { 
          success: false, 
          error: this.getErrorMessage(error.message),
          method: 'standard'
        };
      }

      if (!data.user) {
        await this.logSecurityEvent(email, 'login_failure', 'standard', false, { error: 'No user data' });
        return { 
          success: false, 
          error: 'Authentication failed',
          method: 'standard'
        };
      }

      // Check admin privileges
      if (!this.isAdminUser(data.user)) {
        await this.logSecurityEvent(email, 'access_denied', 'standard', false, { reason: 'Insufficient privileges' });
        return { 
          success: false, 
          error: 'Access denied. Admin privileges required.',
          method: 'standard'
        };
      }

      await this.logSecurityEvent(email, 'login_success', 'standard');

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || 'Admin User',
        role: 'admin',
        permissions: this.getAdminPermissions(data.user),
        last_login: new Date().toISOString(),
        created_at: data.user.created_at
      };

      return { 
        success: true, 
        user: adminUser, 
        method: 'standard' 
      };
    } catch (error) {
      await this.logSecurityEvent(email, 'login_failure', 'standard', false, { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      return { 
        success: false, 
        error: 'Authentication service unavailable',
        method: 'standard'
      };
    }
  }

  /**
   * Check if user has admin privileges
   */
  private isAdminUser(user: any): boolean {
    // Check if user email matches admin email or has admin role
    return user.email === this.BYPASS_EMAIL || 
           user.user_metadata?.role === 'admin' ||
           user.app_metadata?.role === 'admin';
  }

  /**
   * Get admin permissions based on user
   */
  private getAdminPermissions(user: any): string[] {
    if (user.email === this.BYPASS_EMAIL) {
      return ['*']; // All permissions for bypass account
    }
    
    // Standard admin permissions
    return [
      'users.read',
      'users.write',
      'events.read',
      'events.write',
      'content.read',
      'content.write',
      'analytics.read'
    ];
  }

  /**
   * Convert Supabase error to user-friendly message
   */
  private getErrorMessage(error: string): string {
    if (error.includes('Invalid login credentials')) {
      return 'Invalid email or password';
    }
    if (error.includes('Email not confirmed')) {
      return 'Please verify your email address';
    }
    if (error.includes('Too many requests')) {
      return 'Too many login attempts. Please try again later';
    }
    return 'Authentication failed. Please try again';
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<{ valid: boolean; user?: AdminUser; error?: string }> {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) {
        return { valid: false, error: 'No session found' };
      }

      const session = JSON.parse(sessionData);
      const sessionAge = Date.now() - new Date(session.loginTime).getTime();
      
      if (sessionAge > this.SESSION_DURATION) {
        localStorage.removeItem('admin_session');
        return { valid: false, error: 'Session expired' };
      }

      // For bypass sessions, return bypass user
      if (session.method === 'bypass') {
        const bypassUser: AdminUser = {
          id: 'bypass_admin',
          email: this.BYPASS_EMAIL,
          full_name: 'System Administrator',
          role: 'admin',
          permissions: ['*'],
          last_login: session.loginTime,
          created_at: '2024-01-01T00:00:00Z'
        };
        return { valid: true, user: bypassUser };
      }

      // For standard sessions, validate with Supabase
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        localStorage.removeItem('admin_session');
        return { valid: false, error: 'Session invalid' };
      }

      if (!this.isAdminUser(data.user)) {
        localStorage.removeItem('admin_session');
        await this.logSecurityEvent(session.email, 'access_denied', 'standard', false, { 
          reason: 'Session validation failed - insufficient privileges' 
        });
        return { valid: false, error: 'Access denied' };
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || 'Admin User',
        role: 'admin',
        permissions: this.getAdminPermissions(data.user),
        last_login: session.loginTime,
        created_at: data.user.created_at
      };

      return { valid: true, user: adminUser };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Session validation failed' 
      };
    }
  }

  /**
   * Logout admin user
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        await this.logSecurityEvent(session.email, 'logout', session.method);
      }

      // Clear local session
      localStorage.removeItem('admin_session');
      
      // Sign out from Supabase if not bypass session
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.method === 'standard') {
          await supabase.auth.signOut();
        }
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }

  /**
   * Get security logs (for admin dashboard)
   */
  getSecurityLogs(): SecurityLog[] {
    try {
      const logs = localStorage.getItem('admin_security_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve security logs:', error);
      return [];
    }
  }

  /**
   * Clear old security logs
   */
  clearOldLogs(daysToKeep: number = 30): void {
    try {
      const logs = this.getSecurityLogs();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filteredLogs = logs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      );
      
      localStorage.setItem('admin_security_logs', JSON.stringify(filteredLogs));
    } catch (error) {
      console.error('Failed to clear old logs:', error);
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: AdminUser, permission: string): boolean {
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  /**
   * Get current admin user from session
   */
  getCurrentUser(): AdminUser | null {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      const sessionAge = Date.now() - new Date(session.loginTime).getTime();
      
      if (sessionAge > this.SESSION_DURATION) {
        localStorage.removeItem('admin_session');
        return null;
      }

      if (session.method === 'bypass') {
        return {
          id: 'bypass_admin',
          email: this.BYPASS_EMAIL,
          full_name: 'System Administrator',
          role: 'admin',
          permissions: ['*'],
          last_login: session.loginTime,
          created_at: '2024-01-01T00:00:00Z'
        };
      }

      return null; // For standard sessions, use validateSession instead
    } catch (error) {
      return null;
    }
  }
}

export const adminAuthService = AdminAuthService.getInstance();