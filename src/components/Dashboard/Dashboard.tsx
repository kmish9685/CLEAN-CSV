
"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const Dashboard = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);


  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    // This component should ideally be protected by routing,
    // but as a fallback, we can handle the case where user is not logged in.
    return <p>Please log in to view the dashboard.</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {user.email}!</h2>
      <p>Here you will find all your important information and tools.</p>
    </div>
  );
};

export default Dashboard;
