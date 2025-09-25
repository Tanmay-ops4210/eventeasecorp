import { dummyAdminAuth, DummyAdminUser, DummyAuthResult, DummySecurityLog } from './dummyAdminAuth';

export type AdminUser = DummyAdminUser;

export type AuthResult = DummyAuthResult;

export type SecurityLog = DummySecurityLog;

class AdminAuthService {
  private static instance: AdminAuthService;

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  /**
   * Authenticate admin user
   */
  async authenticate(email: string, password: string): Promise<AuthResult> {
    return dummyAdminAuth.authenticate(email, password);
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<{ valid: boolean; user?: AdminUser; error?: string }> {
    return dummyAdminAuth.validateSession();
  }

  /**
   * Logout admin user
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    return dummyAdminAuth.logout();
  }

  /**
   * Get security logs (for admin dashboard)
   */
  getSecurityLogs(): SecurityLog[] {
    return dummyAdminAuth.getSecurityLogs();
  }

  /**
   * Clear old security logs
   */
  clearOldLogs(daysToKeep: number = 30): void {
    dummyAdminAuth.clearOldLogs(daysToKeep);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: AdminUser, permission: string): boolean {
    return dummyAdminAuth.hasPermission(user, permission);
  }

  /**
   * Get current admin user from session
   */
  getCurrentUser(): AdminUser | null {
    return dummyAdminAuth.getCurrentUser();
  }
}

export const adminAuthService = AdminAuthService.getInstance();