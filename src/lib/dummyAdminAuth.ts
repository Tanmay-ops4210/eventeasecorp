// Dummy Admin Authentication Service
// Replaces the complex admin auth system with simple dummy authentication

export interface DummyAdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin';
  permissions: string[];
  last_login: string;
  created_at: string;
}

export interface DummyAuthResult {
  success: boolean;
  user?: DummyAdminUser;
  error?: string;
  method?: 'bypass' | 'standard';
}

export interface DummySecurityLog {
  id: string;
  email: string;
  action: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'access_denied';
  method: 'bypass' | 'standard';
  ip_address: string;
  user_agent: string;
  timestamp: string;
  additional_info?: Record<string, any>;
}

class DummyAdminAuthService {
  private static instance: DummyAdminAuthService;
  private readonly BYPASS_EMAIL = 'tanmay365210mogabeera@gmail.com';
  private readonly BYPASS_PASSWORD = 'tam123***';

  static getInstance(): DummyAdminAuthService {
    if (!DummyAdminAuthService.instance) {
      DummyAdminAuthService.instance = new DummyAdminAuthService();
    }
    return DummyAdminAuthService.instance;
  }

  private logSecurityEvent(
    email: string, 
    action: DummySecurityLog['action'], 
    method: 'bypass' | 'standard',
    success: boolean = true,
    additionalInfo?: Record<string, any>
  ): void {
    try {
      const logEntry: DummySecurityLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        action,
        method,
        ip_address: '127.0.0.1', // Dummy IP
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        additional_info: {
          success,
          ...additionalInfo
        }
      };

      const existingLogs = this.getSecurityLogs();
      existingLogs.push(logEntry);
      
      // Keep only last 500 logs
      if (existingLogs.length > 500) {
        existingLogs.splice(0, existingLogs.length - 500);
      }
      
      localStorage.setItem('dummy_admin_security_logs', JSON.stringify(existingLogs));

      console.log(`[DUMMY ADMIN SECURITY] ${action}:`, {
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        method,
        success,
        timestamp: logEntry.timestamp
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private isBypassAccount(email: string, password: string): boolean {
    return email.toLowerCase() === this.BYPASS_EMAIL.toLowerCase() && 
           password === this.BYPASS_PASSWORD;
  }

  async authenticate(email: string, password: string): Promise<DummyAuthResult> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check for bypass credentials first
      if (this.isBypassAccount(email, password)) {
        this.logSecurityEvent(email, 'login_success', 'bypass');
        
        const bypassUser: DummyAdminUser = {
          id: 'bypass_admin',
          email: this.BYPASS_EMAIL,
          full_name: 'System Administrator',
          role: 'admin',
          permissions: ['*'], // All permissions
          last_login: new Date().toISOString(),
          created_at: '2024-01-01T00:00:00Z'
        };

        // Save session
        localStorage.setItem('dummy_admin_session', JSON.stringify({
          user: bypassUser,
          method: 'bypass',
          loginTime: new Date().toISOString()
        }));

        return { 
          success: true, 
          user: bypassUser, 
          method: 'bypass' 
        };
      }

      // Standard authentication (dummy)
      this.logSecurityEvent(email, 'login_attempt', 'standard');
      
      // For demo, accept admin@example.com with any password
      if (email.toLowerCase() === 'admin@example.com') {
        this.logSecurityEvent(email, 'login_success', 'standard');

        const adminUser: DummyAdminUser = {
          id: 'admin_user',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          permissions: ['users.read', 'users.write', 'events.read', 'events.write', 'content.read', 'content.write'],
          last_login: new Date().toISOString(),
          created_at: '2024-01-01T00:00:00Z'
        };

        // Save session
        localStorage.setItem('dummy_admin_session', JSON.stringify({
          user: adminUser,
          method: 'standard',
          loginTime: new Date().toISOString()
        }));

        return { 
          success: true, 
          user: adminUser, 
          method: 'standard' 
        };
      }

      this.logSecurityEvent(email, 'login_failure', 'standard', false);
      return { 
        success: false, 
        error: 'Invalid email or password',
        method: 'standard'
      };
    } catch (error) {
      this.logSecurityEvent(email, 'login_failure', 'standard', false, { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      return { 
        success: false, 
        error: 'Authentication service unavailable',
        method: 'standard'
      };
    }
  }

  async validateSession(): Promise<{ valid: boolean; user?: DummyAdminUser; error?: string }> {
    try {
      const sessionData = localStorage.getItem('dummy_admin_session');
      if (!sessionData) {
        return { valid: false, error: 'No session found' };
      }

      const session = JSON.parse(sessionData);
      const sessionAge = Date.now() - new Date(session.loginTime).getTime();
      const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
      
      if (sessionAge > SESSION_DURATION) {
        localStorage.removeItem('dummy_admin_session');
        return { valid: false, error: 'Session expired' };
      }

      return { valid: true, user: session.user };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Session validation failed' 
      };
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const sessionData = localStorage.getItem('dummy_admin_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        this.logSecurityEvent(session.user.email, 'logout', session.method);
      }

      localStorage.removeItem('dummy_admin_session');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }

  getSecurityLogs(): DummySecurityLog[] {
    try {
      const logs = localStorage.getItem('dummy_admin_security_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve security logs:', error);
      return [];
    }
  }

  clearOldLogs(daysToKeep: number = 30): void {
    try {
      const logs = this.getSecurityLogs();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filteredLogs = logs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      );
      
      localStorage.setItem('dummy_admin_security_logs', JSON.stringify(filteredLogs));
    } catch (error) {
      console.error('Failed to clear old logs:', error);
    }
  }

  hasPermission(user: DummyAdminUser, permission: string): boolean {
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  getCurrentUser(): DummyAdminUser | null {
    try {
      const sessionData = localStorage.getItem('dummy_admin_session');
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      const sessionAge = Date.now() - new Date(session.loginTime).getTime();
      const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
      
      if (sessionAge > SESSION_DURATION) {
        localStorage.removeItem('dummy_admin_session');
        return null;
      }

      return session.user;
    } catch (error) {
      return null;
    }
  }
}

export const dummyAdminAuth = DummyAdminAuthService.getInstance();