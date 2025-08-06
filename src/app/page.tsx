
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, Suspense } from "react";
import type { User } from "@supabase/supabase-js";
import Header from "@/components/landing/header";
import SocialProof from "@/components/landing/social-proof";
import Solution from "@/components/landing/solution";
import Tool from "@/components/landing/tool";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import HowItWorks from "@/components/landing/how-it-works";
import { Skeleton } from "@/components/ui/skeleton";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Home() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto max-w-7xl px-4 py-20 sm:py-24">
            <Skeleton className="h-[400px] w-full" />
          </div>
        }>
          <Tool />
          {loading ? (
             <div className="container mx-auto max-w-7xl px-4 py-10">
                <Skeleton className="h-24 w-full mb-8" />
                <Skeleton className="h-64 w-full" />
             </div>
          ) : !user ? (
            <>
              <SocialProof />
              <HowItWorks />
              <Solution />
              <Pricing />
              <Testimonials />
              <Faq />
            </>
          ) : (
            <Dashboard />
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
