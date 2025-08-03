import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload",
    description: "Drag & drop your messy CSV file.",
    step: "01",
  },
  {
    icon: Wand2,
    title: "Clean",
    description: "Select from our cleaning templates.",
    step: "02",
  },
  {
    icon: Download,
    title: "Download",
    description: "Get your perfectly formatted data.",
    step: "03",
  },
];

const HowItWorks = () => (
  <div className="w-full">
      <h2 className="font-headline text-lg font-bold tracking-tight text-foreground text-center mb-2">How It Works</h2>
      <div className="grid grid-cols-1 gap-2">
        {steps.map((step) => (
          <Card key={step.title} className="text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-card/80 backdrop-blur-sm p-2 flex items-center gap-4">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <step.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline text-sm mb-1">{step.title}</CardTitle>
              <CardDescription className="text-xs">{step.description}</CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </div>
);

export default HowItWorks;
