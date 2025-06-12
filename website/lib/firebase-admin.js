// Firebase Admin initialization for server-side operations
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
  // Use service account credentials from environment variables
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace newlines in the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : undefined,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Export the admin instance
export default admin;

/**
 * Fetches vendor data from Firestore by user ID
 * @param {string} userId - The user's ID
 * @returns {Promise<object|null>} - The vendor data or null if not found
 */
export async function getVendorByUserId(userId) {
  try {
    const db = admin.firestore();
    const vendorsRef = db.collection('vendors');
    const snapshot = await vendorsRef.where('userId', '==', userId).get();
    
    if (!snapshot.empty) {
      const vendorDoc = snapshot.docs[0];
      return {
        id: vendorDoc.id,
        vendorKey: vendorDoc.id, // The document ID is the vendor key
        ...vendorDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching vendor data by user ID:', error);
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
    const db = admin.firestore();
    const vendorDocRef = db.collection('vendors').doc(vendorKey);
    const vendorDoc = await vendorDocRef.get();
    
    if (vendorDoc.exists) {
      return {
        id: vendorDoc.id,
        vendorKey: vendorDoc.id, // The document ID is the vendor key
        ...vendorDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching vendor data by key:', error);
    return null;
  }
}
