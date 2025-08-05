import React, { useContext, useState, useEffect, createContext } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext();

const supabase = createClient();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('Error fetching user:', authError.message);
        setUser(null);
        setProfile(null);
        setSubscription(null);
      } else {
        setUser(user);
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
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          await fetchSubscription(session.user.id);
        } else {
          setUser(null);
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
      setSubscription(null);
    } else {
      setSubscription(data);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    return user;
  };

  const signUp = async (email, password, metadata) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    setLoading(false);
    if (error) throw error;
    return data.user;
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
  };

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);
    setLoading(false);
    if (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
    await fetchUserProfile(user.id); // Refresh profile data
    return data;
  };

  const updateSubscription = async (subscriptionData) => {
     setLoading(true);
     const { data, error } = await supabase
       .from('subscriptions')
       .update(subscriptionData)
       .eq('user_id', user.id);
     setLoading(false);
     if (error) {
       console.error('Error updating subscription:', error.message);
       throw error;
     }
     await fetchSubscription(user.id); // Refresh subscription data
     return data;
   };


  const uploadAvatar = async (file) => {
    if (!user) throw new Error('User not authenticated.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const { error } = await supabase.storage
      .from('avatars') // make sure you created this bucket in Supabase Storage
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    if (publicUrlData && publicUrlData.publicUrl) {
      // Optionally update the user's profile with the new avatar_url
      await updateUserProfile({ avatar_url: publicUrlData.publicUrl });
      return publicUrlData.publicUrl;
    } else {
      throw new Error('Could not get public URL for uploaded avatar.');
    }
  };


  const value = {
    user,
    loading,
    profile,
    subscription,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    updateSubscription,
    uploadAvatar,
    fetchUserProfile, // Expose fetch functions if needed elsewhere
    fetchSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
