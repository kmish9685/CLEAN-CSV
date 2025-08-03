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
  <div className="w-full pt-4 mt-4 border-t">
      <h2 className="font-headline text-lg font-bold tracking-tight text-foreground text-center mb-2">Transform Your Data in 3 Simple Steps</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-2">
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center">
                <div className="absolute text-5xl font-bold font-headline text-primary/10 -top-2">{step.step}</div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 pt-0 flex flex-col items-center">
              <CardTitle className="font-headline text-sm mb-1">{step.title}</CardTitle>
              <CardDescription className="text-xs">{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
);

export default HowItWorks;
