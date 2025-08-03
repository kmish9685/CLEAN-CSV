import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Your CSV",
    description: "Drag & drop your messy CSV file or click to browse. We support files up to 10MB.",
    step: "01",
  },
  {
    icon: Wand2,
    title: "Choose Your Template",
    description: "Select from phone formatting, date cleanup, duplicate removal, or custom rules.",
    step: "02",
  },
  {
    icon: Download,
    title: "Download Clean Data",
    description: "Get your perfectly formatted CSV in seconds. Export to CSV, Excel, or JSON format.",
    step: "03",
  },
];

const HowItWorks = () => (
  <section className="bg-gradient-to-b from-background to-secondary/40 py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Transform Your Data in 3 Simple Steps</h2>
        <p className="mt-4 text-lg text-muted-foreground">No formulas. No scripts. No headaches.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <CardHeader>
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute text-7xl font-bold font-headline text-primary/10 -top-4">{step.step}</div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <CardTitle className="font-headline mb-2">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
