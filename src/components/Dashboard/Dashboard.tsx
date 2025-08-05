
"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Pricing from '../landing/pricing';
import Solution from '../landing/solution';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Star } from 'lucide-react';
import { Badge } from '../ui/badge';

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
    return null;
  }

  return (
    <div className="bg-secondary">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-4xl mx-auto mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                    <CardDescription>
                    {user.email || 'You are logged in'}.
                    </CardDescription>
                </div>
                <Badge variant={"secondary"} className="capitalize">
                    Free Plan
                </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary" /> Unlimited Basic Cleaning</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-muted-foreground">Access all standard data cleaning templates and features.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className={"text-primary"} /> AI-Powered Suggestions
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-muted-foreground">
                            Use AI to automatically suggest the best cleaning strategies for your data.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                </CardContent>
            </Card>
        </div>
        <Solution />
        <Pricing />
    </div>
  );
};

export default Dashboard;
