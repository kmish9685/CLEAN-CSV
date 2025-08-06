
import { Card, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { UploadCloud, Wand2, Download, Eye } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "1. Upload Your File",
    description: "Start by uploading your CSV file using the upload area below.",
  },
  {
    icon: Eye,
    title: "2. Preview Your Data",
    description: "Your data will appear in the table below for you to preview.",
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
    <section id="how-it-works" className="py-20 sm:py-24 bg-secondary">
        <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    How It Works - Follow These 4 Steps
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Clean your CSV files in just 4 simple steps below.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step) => (
                <Card key={step.title} className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <CardHeader>
                        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <step.icon className="h-8 w-8" />
                        </div>
                    </CardHeader>
                    <CardTitle className="font-headline text-xl mb-2">{step.title}</CardTitle>
                    <CardDescription className="p-4 pt-0">{step.description}</CardDescription>
                </Card>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;
