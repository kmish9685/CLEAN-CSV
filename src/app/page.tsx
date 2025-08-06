
import Header from "@/components/landing/header";
import SocialProof from "@/components/landing/social-proof";
import Solution from "@/components/landing/solution";
import Tool from "@/components/landing/tool";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Tool />
        <Solution />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
