
import { Card, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { UploadCloud, Wand2, Download, Eye } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "1. Upload Your File",
    description: "Start by uploading your CSV file using our tool.",
  },
  {
    icon: Eye,
    title: "2. Preview Your Data",
    description: "Your data will appear in the table for you to preview.",
  },
  {
    icon: Wand2,
    title: "3. Clean & Organize",
    description: "Use the cleaning tools to organize and format your data.",
  },
  {
    icon: Download,
    title: "4. Download Clean File",
    description: "Download your perfectly formatted data with a single click.",
  },
];

const HowItWorks = () => (
    <section id="how-it-works" className="py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A simple, four-step process to clean your data.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <Card key={step.title} className="text-center bg-card border shadow-lg rounded-xl">
            <CardHeader className="flex flex-col items-center gap-4 p-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="font-headline text-xl mb-2">{step.title}</CardTitle>
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
