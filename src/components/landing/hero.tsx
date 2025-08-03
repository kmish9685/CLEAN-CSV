import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero = () => (
  <section id="hero" className="container mx-auto max-w-7xl px-4 py-20 sm:py-32">
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div className="text-center lg:text-left">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Clean Your CSV Files in Seconds, Not Hours
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Stop wrestling with Excel formulas. Upload, clean, download. Perfect for agencies, e-commerce, and consultants.
        </p>
        <div className="mt-8 flex justify-center gap-4 lg:justify-start">
          <Button size="lg" asChild>
            <a href="#tool">Try Free Now</a>
          </Button>
        </div>
      </div>
      <div className="rounded-xl bg-card p-4 shadow-lg ring-1 ring-border">
         <Image 
          src="https://placehold.co/1200x800.png"
          alt="Before and after CSV preview"
          width={1200}
          height={800}
          className="rounded-lg"
          data-ai-hint="csv data table"
        />
      </div>
    </div>
  </section>
);

export default Hero;
