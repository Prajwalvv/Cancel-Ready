import '../styles/globals.css';
import React, { useState, useEffect, createContext } from 'react';
import { onAuthStateChange } from '../lib/firebase';

// Create a context for the auth user
export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
