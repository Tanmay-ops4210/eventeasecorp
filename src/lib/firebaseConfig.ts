import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration with environment variable fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'placeholder-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'placeholder.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'placeholder-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'placeholder-measurement-id'
};

// Check if we're using placeholder values
const isUsingPlaceholders = firebaseConfig.apiKey === 'placeholder-api-key';

if (isUsingPlaceholders) {
  console.info('Firebase configuration: Using placeholder values. Set environment variables in Vercel for full functionality.');
}

// Initialize Firebase
let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  if (!isUsingPlaceholders) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed. This is expected in development without proper environment variables.');
}

// Initialize Firebase Authentication
export const auth: Auth | null = app ? getAuth(app) : null;

export { app, analytics };
