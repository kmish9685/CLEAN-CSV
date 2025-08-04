import Header from "@/components/landing/header";
import SocialProof from "@/components/landing/social-proof";
import Solution from "@/components/landing/solution";
import Tool from "@/components/landing/tool";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Tool />
        <SocialProof />
        <Solution />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
