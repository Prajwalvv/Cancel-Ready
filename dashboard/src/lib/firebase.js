// Firebase initialization for CancelKit dashboard
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<UserCredential>} - Firebase user credential
 */
export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in an existing user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<UserCredential>} - Firebase user credential
 */
export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with Google
 * @returns {Promise<UserCredential>} - Firebase user credential
 */
export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const logOut = async () => {
  return signOut(auth);
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Send email verification to current user
 * @returns {Promise<void>}
 */
export const verifyEmail = async () => {
  const user = auth.currentUser;
  if (user) {
    return sendEmailVerification(user);
  }
  throw new Error('No user is signed in');
};

/**
 * Subscribe to auth state changes
 * @param {function} callback - Function to call when auth state changes
 * @returns {function} - Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current user
 * @returns {User|null} - Current Firebase user or null if not signed in
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

export { db, analytics, auth, googleProvider };
