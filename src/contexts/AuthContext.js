// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/supabase/client'; // Import the auth object

// Create the Auth Context
const AuthContext = createContext({
  user: null,
  loading: true,
});

// Create a custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Get initial user data
    const getInitialUser = async () => {
      const { user } = await auth.getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    getInitialUser();

    // Clean up the subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};