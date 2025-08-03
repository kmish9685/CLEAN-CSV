import { Logo } from "./logo";

const SocialProof = () => (
  <section id="social-proof" className="py-12">
    <div className="container mx-auto max-w-7xl px-4 text-center">
      <p className="text-muted-foreground">Trusted by over 2,500 users to clean 50,000+ files</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        <Logo />
        <Logo />
        <Logo />
        <Logo />
        <Logo />
      </div>
    </div>
  </section>
);

export default SocialProof;
