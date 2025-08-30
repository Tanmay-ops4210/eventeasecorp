// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  Auth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0SgZdxaBagK0U4qG5olmJl8LDciZ-6og",
  authDomain: "event-49a89.firebaseapp.com",
  projectId: "event-49a89",
  storageBucket: "event-49a89.firebasestorage.app",
  messagingSenderId: "1061205319218",
  appId: "1:1061205319218:web:f70c6c18001a3d2c7d262b",
  measurementId: "G-PRGXW1NF1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Connect to Auth emulator in development (optional)
if (process.env.NODE_ENV === 'development' && !auth.emulatorConfig) {
  // Uncomment the line below if you want to use Firebase Auth emulator
  // connectAuthEmulator(auth, "http://localhost:9099");
}

export { app, analytics };
export type { FirebaseUser, UserCredential };