import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

// This configuration now securely reads the variables from Vercel.
const firebaseConfig = {
  apiKey: import.meta.env.NEXT_FIREBASE_API_KEY,
  authDomain: import.meta.env.NEXT_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.NEXT_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.NEXT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NEXT_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NEXT_FIREBASE_APP_ID,
  measurementId: import.meta.env.NEXT_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

export { app, analytics };
