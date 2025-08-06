
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
    <div className="bg-card rounded-xl p-4 shadow-lg ring-1 ring-border">
        <div className="text-center mb-8">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">
                How It Works
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Clean your CSV files in 4 simple steps.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {steps.map((step) => (
            <Card key={step.title} className="text-left bg-secondary border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                        <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-base mb-1">{step.title}</CardTitle>
                        <CardDescription className="text-xs">{step.description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
            ))}
        </div>
    </div>
);

export default HowItWorks;
