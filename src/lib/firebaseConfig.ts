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
  apiKey: "AIzaSyDCScMcAMwBFXHKei_RRZ7M6SG9YA2oQqE",
  authDomain: "eventeasecorp.firebaseapp.com",
  projectId: "eventeasecorp",
  storageBucket: "eventeasecorp.firebasestorage.app",
  messagingSenderId: "796329798902",
  appId: "1:796329798902:web:cd5a163b12fc2fdb6750d7",
  measurementId: "G-WB4KBXM17F"
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