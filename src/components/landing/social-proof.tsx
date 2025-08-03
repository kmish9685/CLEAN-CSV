import { Briefcase } from "lucide-react";

const companies = [
  "DataWorks",
  "Insight Inc.",
  "QuantumLeap",
  "Stellar Solutions",
  "Apex Analytics",
];

const SocialProof = () => (
  <section id="social-proof" className="py-12 bg-secondary/40">
    <div className="container mx-auto max-w-7xl px-4 text-center">
      <p className="text-muted-foreground">Trusted by over 2,500 users to clean 50,000+ files</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {companies.map((company) => (
          <div key={company} className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-5 w-5" />
            <span className="font-semibold">{company}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
