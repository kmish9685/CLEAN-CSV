
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from 'next/link';

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    frequency: "/month",
    description: "Perfect for trying us out",
    features: [
      "3 files per month",
      "Up to 5,000 rows per file",
      "Basic templates only",
      "Standard processing"
    ],
    cta: "Start for Free",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$12",
    frequency: "/month",
    description: "Most popular choice",
    features: [
      "Unlimited files",
      "Up to 50,000 rows per file",
      "All templates + custom rules",
      "Priority processing",
      "Email support"
    ],
    cta: "Get Started",
    isPopular: true,
  },
  {
    name: "Business",
    price: "$29",
    frequency: "/month",
    description: "For agencies & power users",
    features: [
      "Everything in Pro",
      "Up to 500,000 rows per file",
      "API access",
      "Custom template creation",
      "Phone support"
    ],
    cta: "Get Started",
    isPopular: false,
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-secondary py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you. Cancel anytime.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-primary ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.frequency}</span>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                 <Button className="w-full" variant={tier.isPopular ? "default" : "outline"} asChild>
                    <Link href="#tool">{tier.cta}</Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
