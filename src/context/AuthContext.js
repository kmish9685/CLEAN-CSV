import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Import Supabase client

const AuthContext = createContext();

// Define your user object structure here if needed for clarity or type checking

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('Error fetching user:', authError.message);
        setError(authError.message);
        setCurrentUser(null);
        setProfile(null);
        setSubscription(null);
      } else {
        setCurrentUser(user);
        if (user) {
          // Fetch profile and subscription data
          await fetchUserProfile(user.id);
          await fetchSubscription(user.id);
        } else {
          setProfile(null);
          setSubscription(null);
        }
      }
      setLoading(false);
    };

    fetchUserAndData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setCurrentUser(session.user);
          await fetchUserProfile(session.user.id);
          await fetchSubscription(session.user.id);
        } else {
          setCurrentUser(null);
          setProfile(null);
          setSubscription(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      setError(error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  const fetchSubscription = async (userId) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error.message);
      setError(error.message);
      setSubscription(null);
    } else {
      setSubscription(data);
    }
  };

  const signup = async (email, password, metadata) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // Include metadata here if you want to store it with the auth user
        },
      });

      if (signUpError) throw signUpError;

      // Fetch the newly created profile and potentially subscription data
      if (user) {
        await fetchUserProfile(user.id);
        await fetchSubscription(user.id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Signup error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;
      // authStateChange listener will handle setting user and fetching data
    }  catch (err) {
      setError(err.message);
      console.error('Login error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;
      // authStateChange listener will handle clearing user and data
    }  catch (err) {
      setError(err.message);
      console.error('Logout error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', currentUser.id);

      if (error) throw error;

      await fetchUserProfile(currentUser.id); // Refresh profile data
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file, userId) => {
    const { data, error } = await supabase
      .storage
      .from('avatars') // make sure you created this bucket in Supabase Storage
      .upload(`${userId}/avatar.png`, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { publicUrl } = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.png`);
    return publicUrl;
  };

  const value = {
    currentUser,
    profile,
    subscription,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Optionally show a loading indicator or null while authenticating */}
      {/* {loading ? <LoadingSpinner /> : children} */}
      {/* For now, just render children */}
      {children}
    </AuthContext.Provider>
  );
};
