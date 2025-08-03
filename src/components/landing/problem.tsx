import { Card } from "@/components/ui/card";
import { Clock, DatabaseZap, FileX2, Store, Handshake } from "lucide-react";

const painPoints = [
  { icon: Clock, text: "Spending hours on Excel formulas and Google Sheets scripts" },
  { icon: DatabaseZap, text: "Fighting with inconsistent phone number formats" },
  { icon: FileX2, text: "Manual date formatting for different systems" },
  { icon: Store, text: "Cleaning up messy Shopify/Amazon exports" },
  { icon: Handshake, text: "Preparing data imports that keep failing" },
];

const Problem = () => (
  <section id="problem" className="bg-secondary py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Tired of Manual Data Cleanup?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Data cleaning is a tedious, error-prone, and time-consuming task. We get it.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {painPoints.map((point, index) => (
          <Card key={index} className="flex items-center p-6 space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
              <point.icon className="h-6 w-6" />
            </div>
            <p className="text-base font-medium text-foreground">{point.text}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Problem;
