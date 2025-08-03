import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    step: "01",
    title: "Upload Your CSV",
    description: "Drag & drop your messy CSV file or click to browse. We support files up to 10MB.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Choose Your Template",
    description: "Select from phone formatting, date cleanup, duplicate removal, or custom rules.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download Clean Data",
    description: "Get your perfectly formatted CSV in seconds. Export to CSV, Excel, or JSON format.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-gradient-to-b from-white to-[#f8faff] py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-[#1a365d] sm:text-4xl">
          Transform Your Data in 3 Simple Steps
        </h2>
        <p className="mt-4 text-lg text-[#718096]">
          No formulas. No scripts. No headaches.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute text-7xl font-bold text-primary opacity-10">{step.step}</div>
                <step.icon className="h-12 w-12 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="font-headline mb-2">{step.title}</CardTitle>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
