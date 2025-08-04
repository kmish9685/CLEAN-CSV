import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import SocialProof from "@/components/landing/social-proof";
import Solution from "@/components/landing/solution";
import Tool from "@/components/landing/tool";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // If the user is logged in, redirect them to the app dashboard.
  // This is where you can add logic to check the user's plan
  // and redirect them to different pages.
  if (user) {
    // For now, we'll redirect all logged-in users to the main app page.
    // Later, you could do something like:
    // const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
    // if (profile?.plan === 'free') redirect('/cleaning/basic');
    // if (profile?.plan === 'paid') redirect('/ai/suggestions');
    redirect('/app');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Solution />
        <Tool />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
