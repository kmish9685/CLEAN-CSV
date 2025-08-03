import { Card, CardContent } from "@/components/ui/card";
import { Phone, CalendarDays, Trash2, Braces, Store } from "lucide-react";

const benefits = [
  { 
    icon: Phone, 
    title: "Phone Number Formatting", 
    description: "Standardize phone numbers to a consistent format.",
    visual: "555.123.4567 → (555) 123-4567",
  },
  { 
    icon: CalendarDays, 
    title: "Date Unification", 
    description: "Convert various date formats into the standard YYYY-MM-DD.",
    visual: "12/25/2023 → 2023-12-25",
  },
  { 
    icon: Trash2, 
    title: "Remove Duplicates & Trim", 
    description: "Instantly delete duplicate rows and remove extra whitespace.",
    visual: "",
  },
  { 
    icon: Braces, 
    title: "JSON Conversion", 
    description: "Convert your clean CSV data into JSON for other applications.",
    visual: "",
  },
  { 
    icon: Store, 
    title: "E-commerce Cleanup", 
    description: "Templates to clean Shopify & WooCommerce exports.",
    visual: "",
  },
  {
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m12 12-2 2 2 2"/><path d="m16 12-2 2 2 2"/></svg>,
    title: "Custom Formatting",
    description: "Apply custom rules and transformations for unique needs.",
    visual: "",
  }
];

const Solution = () => (
  <section id="solution" className="py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          One-Click Data Transformation
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Apply powerful cleaning rules with a single click. No more manual work.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline">{benefit.title}</h3>
                  <p className="mt-1 text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
              {benefit.visual.trim() && (
                 <div className="mt-4 rounded-md bg-secondary p-3 font-mono text-sm text-secondary-foreground">
                    {benefit.visual}
                 </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Solution;
