// Firebase initialization for CancelKit website
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Fetches vendor data from Firestore by user ID
 * @param {string} userId - The user's ID
 * @returns {Promise<object|null>} - The vendor data or null if not found
 */
export async function getVendorByUserId(userId) {
  try {
    console.log('Fetching vendor data for user ID:', userId);
    const vendorsRef = collection(db, 'vendors');
    const q = query(vendorsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const vendorDoc = querySnapshot.docs[0];
      console.log('Found vendor document with ID:', vendorDoc.id);
      return {
        id: vendorDoc.id,
        vendorKey: vendorDoc.id, // The document ID is the vendor key
        ...vendorDoc.data()
      };
    }
    console.warn('No vendor document found for user ID:', userId);
    return null;
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    return null;
  }
}

/**
 * Fetches vendor data from Firestore by vendor key (document ID)
 * @param {string} vendorKey - The vendor key (document ID)
 * @returns {Promise<object|null>} - The vendor data or null if not found
 */
export async function getVendorByKey(vendorKey) {
  try {
    console.log('Fetching vendor data for vendor key:', vendorKey);
    const vendorDocRef = doc(db, 'vendors', vendorKey);
    const vendorDoc = await getDoc(vendorDocRef);
    
    if (vendorDoc.exists()) {
      console.log('Found vendor document with data');
      return {
        id: vendorDoc.id,
        vendorKey: vendorDoc.id, // The document ID is the vendor key
        ...vendorDoc.data()
      };
    }
    console.warn('No vendor document found for vendor key:', vendorKey);
    return null;
  } catch (error) {
    console.error('Error fetching vendor data by key:', error);
    return null;
  }
}

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

export { db, auth, googleProvider };
