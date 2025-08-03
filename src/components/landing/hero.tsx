import { Button } from "@/components/ui/button";
import { Check, Lock } from "lucide-react";
import Image from "next/image";
import HowItWorks from "@/components/landing/how-it-works";

const Hero = () => (
  <section id="hero" className="bg-gradient-to-b from-background to-secondary/40 py-20 sm:py-32">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Clean Your CSV Files in Seconds
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Transform messy spreadsheet data into perfect, formatted files. No Excel formulas. No coding. Just upload, clean, and download.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Remove duplicates and fix formatting instantly</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Standardize phone numbers, dates, and addresses</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Export to CSV, Excel, or JSON in any format you need</span>
            </li>
          </ul>
          <div className="mt-8 flex justify-center gap-4 lg:justify-start">
            <Button size="lg" asChild>
              <a href="#tool">Try Free Now</a>
            </Button>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
            <Lock className="h-4 w-4" />
            Your data is processed securely and deleted after 1 hour.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 items-start">
            <div className="rounded-xl bg-card p-4 shadow-lg ring-1 ring-border">
                <Image 
                    src="https://images.unsplash.com/photo-1718202248160-59558af70521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHwzRHxlbnwwfHx8fDE3NTQyMzMwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="CSV data cleaning transformation illustration"
                    width={600}
                    height={240}
                    className="rounded-lg"
                    data-ai-hint="data transformation business"
                />
                <HowItWorks />
            </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
