// Dummy Authentication Service
// Replaces Firebase/Supabase authentication with local storage simulation

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

export interface DummySession {
  user: DummyUser;
  access_token: string;
  expires_at: number;
}

export interface AuthResult {
  success: boolean;
  user?: DummyUser;
  profile?: DummyUser;
  error?: string;
}

class DummyAuthService {
  private static instance: DummyAuthService;
  private currentUser: DummyUser | null = null;
  private currentSession: DummySession | null = null;

  static getInstance(): DummyAuthService {
    if (!DummyAuthService.instance) {
      DummyAuthService.instance = new DummyAuthService();
    }
    return DummyAuthService.instance;
  }

  constructor() {
    this.loadSessionFromStorage();
  }

  private loadSessionFromStorage() {
    try {
      const sessionData = localStorage.getItem('dummy_auth_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.expires_at > Date.now()) {
          this.currentSession = session;
          this.currentUser = session.user;
        } else {
          localStorage.removeItem('dummy_auth_session');
        }
      }
    } catch (error) {
      console.warn('Failed to load session from storage:', error);
    }
  }

  private saveSessionToStorage(session: DummySession) {
    try {
      localStorage.setItem('dummy_auth_session', JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save session to storage:', error);
    }
  }

  private generateUser(email: string, name: string, role: 'attendee' | 'organizer' | 'admin', company?: string): DummyUser {
    return {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      full_name: name,
      role,
      company,
      avatar_url: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=200`,
      plan: role === 'organizer' ? 'pro' : 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private createSession(user: DummyUser): DummySession {
    const session: DummySession = {
      user,
      access_token: `dummy_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    this.currentSession = session;
    this.currentUser = user;
    this.saveSessionToStorage(session);
    
    return session;
  }

  async signUp(email: string, password: string, userData: {
    username: string;
    full_name: string;
    role: 'attendee' | 'organizer' | 'admin';
    company?: string;
  }): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if user already exists
      const existingUsers = this.getAllUsers();
      if (existingUsers.some(u => u.email === email)) {
        return { success: false, error: 'User already exists with this email' };
      }

      const newUser = this.generateUser(email, userData.full_name, userData.role, userData.company);
      
      // Save user to dummy database
      const users = this.getAllUsers();
      users.push(newUser);
      localStorage.setItem('dummy_users', JSON.stringify(users));

      const session = this.createSession(newUser);

      return { 
        success: true, 
        user: newUser,
        profile: newUser
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // For demo purposes, accept any password
      const session = this.createSession(user);

      return { 
        success: true, 
        user: user,
        profile: user
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  async signOut(): Promise<AuthResult> {
    try {
      this.currentUser = null;
      this.currentSession = null;
      localStorage.removeItem('dummy_auth_session');
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }

  getCurrentUser() {
    return Promise.resolve({ data: { user: this.currentUser }, error: null });
  }

  getCurrentSession() {
    return Promise.resolve({ data: { session: this.currentSession }, error: null });
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simulate auth state change listener
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  async getUserProfile(userId?: string): Promise<DummyUser | null> {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return null;

    const users = this.getAllUsers();
    return users.find(u => u.id === targetUserId) || null;
  }

  async updateUserProfile(updates: Partial<DummyUser>): Promise<AuthResult> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      const users = this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === this.currentUser!.id);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem('dummy_users', JSON.stringify(users));
      
      // Update current user
      this.currentUser = users[userIndex];
      if (this.currentSession) {
        this.currentSession.user = users[userIndex];
        this.saveSessionToStorage(this.currentSession);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        return { success: false, error: 'No user found with this email address' };
      }

      // In a real app, this would send an email
      console.log(`Password reset email would be sent to: ${email}`);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    }
  }

  async updatePassword(newPassword: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (!this.currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      // In a real app, this would update the password
      console.log('Password would be updated for user:', this.currentUser.email);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password update failed' 
      };
    }
  }

  private getAllUsers(): DummyUser[] {
    try {
      const usersData = localStorage.getItem('dummy_users');
      return usersData ? JSON.parse(usersData) : this.getDefaultUsers();
    } catch (error) {
      return this.getDefaultUsers();
    }
  }

  private getDefaultUsers(): DummyUser[] {
    const defaultUsers = [
      {
        id: 'admin_user_1',
        email: 'tanmay365210mogabeera@gmail.com',
        name: 'Tanmay Mogabeera',
        full_name: 'Tanmay Mogabeera',
        role: 'admin' as const,
        company: 'EventEase',
        avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        plan: 'enterprise',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'organizer_user_1',
        email: 'organizer@example.com',
        name: 'Sarah Johnson',
        full_name: 'Sarah Johnson',
        role: 'organizer' as const,
        company: 'Event Pros',
        avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
        plan: 'pro',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'attendee_user_1',
        email: 'attendee@example.com',
        name: 'John Doe',
        full_name: 'John Doe',
        role: 'attendee' as const,
        company: 'Tech Corp',
        avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200',
        plan: 'free',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      }
    ];

    localStorage.setItem('dummy_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  // Admin functions
  async getAllUsersForAdmin(): Promise<{ success: boolean; users?: DummyUser[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const users = this.getAllUsers();
      return { success: true, users };
    } catch (error) {
      return { success: false, error: 'Failed to fetch users' };
    }
  }

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = this.getAllUsers();
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('dummy_users', JSON.stringify(filteredUsers));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete user' };
    }
  }
}

export const dummyAuth = DummyAuthService.getInstance();