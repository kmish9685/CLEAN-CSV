
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
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
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import App from "./app/page";
import Hero from "@/components/landing/hero";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return <App />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto max-w-7xl px-4 py-20 sm:py-24">
            <Skeleton className="h-[400px] w-full" />
          </div>
        }>
          <Hero />
          <Tool />
          <SocialProof />
          <Solution />
          <Pricing />
          <Testimonials />
          <Faq />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
