import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Your CSV",
    description: "Drag & drop your messy CSV file or click to browse.",
    step: "01",
  },
  {
    icon: Wand2,
    title: "Choose Your Template",
    description: "Select from phone formatting, date cleanup, etc.",
    step: "02",
  },
  {
    icon: Download,
    title: "Download Clean Data",
    description: "Get your perfectly formatted CSV in seconds.",
    step: "03",
  },
];

const HowItWorks = () => (
  <div className="w-full">
      <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground text-center mb-2">Transform Your Data in 3 Simple Steps</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-4">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute text-6xl font-bold font-headline text-primary/10 -top-3">{step.step}</div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex flex-col items-center">
              <CardTitle className="font-headline text-base mb-1">{step.title}</CardTitle>
              <CardDescription className="text-xs">{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
);

export default HowItWorks;
