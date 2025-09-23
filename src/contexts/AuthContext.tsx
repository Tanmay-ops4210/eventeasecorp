import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { setSupabaseAuth } from '../lib/supabaseClient';
import { AppUser } from '../types/database';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, username: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
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
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect to handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await setSupabaseAuth(firebaseUser);
        // Here you might fetch the corresponding appUser profile from your DB
        // For now, we'll just set a placeholder or leave it to be fetched elsewhere
        setAppUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          username: firebaseUser.displayName || 'User',
          role: 'attendee', // Default role
          status: 'active',
          created_at: new Date().toISOString(),
        });
        // Replace with your actual admin check logic
        setIsAdmin(firebaseUser.email === import.meta.env.VITE_ADMIN_BYPASS_EMAIL);
      } else {
        setUser(null);
        setAppUser(null);
        setIsAdmin(false);
        await setSupabaseAuth(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to sign in a user
  const signIn = useCallback(async (email, password) => {
    if (!auth) return null;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }, []);

  // Function to sign up a user
  const signUp = useCallback(async (email, password, username) => {
    if (!auth) return null;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // **THIS IS THE FIX:**
    // The `db.createUser` call has been removed.
    // The database trigger you created will now handle creating the
    // user profile automatically and reliably on the backend.

    if (firebaseUser) {
      // Optional: You can send a verification email upon registration
      await sendEmailVerification(firebaseUser);
    }

    return firebaseUser;
  }, []);


  // Function to sign out a user
  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  // Function to send a password reset email
  const resetPassword = useCallback(async (email: string) => {
    if (!auth) return;
    await sendPasswordResetEmail(auth, email);
  }, []);

  // Function to resend the verification email
  const resendVerificationEmail = useCallback(async () => {
    if (auth?.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      appUser,
      loading,
      isAdmin,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerificationEmail,
    }),
    [
      user,
      appUser,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerificationEmail,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
