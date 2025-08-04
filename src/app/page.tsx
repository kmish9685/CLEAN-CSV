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

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {user ? <Tool /> : <Hero />}
        <SocialProof />
        <Solution />
        {!user && <Tool />}
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
