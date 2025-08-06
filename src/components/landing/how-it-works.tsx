
import { Card, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { UploadCloud, Wand2, Download, Eye } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "1. Upload File",
    description: "Start by uploading your CSV file.",
  },
  {
    icon: Wand2,
    title: "2. Clean & Organize",
    description: "Use the tools to format your data.",
  },
  {
    icon: Download,
    title: "3. Download",
    description: "Download your perfectly formatted file.",
  },
];

const HowItWorks = () => (
    <section id="how-it-works" className="py-20 sm:py-0">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A simple, three-step process to clean your data.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {steps.map((step) => (
          <Card key={step.title} className="text-center bg-card border shadow-lg rounded-xl flex items-center">
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <CardTitle className="font-headline text-lg mb-1">{step.title}</CardTitle>
                <CardDescription className="text-base">{step.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
    </section>
);

export default HowItWorks;
