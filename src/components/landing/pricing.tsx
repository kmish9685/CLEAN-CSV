
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Paddle: any;
  }
}

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
    price_id: null,
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
    cta: "Upgrade to Pro",
    isPopular: true,
    price_id: "pri_01k1sqj31tms8d6fpjbyzwntzh",
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
    cta: "Upgrade to Business",
    isPopular: false,
    price_id: "pri_01k1sqjzq9mzcf2308p78wxgyj",
  }
];

const Pricing = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleCheckout = (tier: typeof pricingTiers[0]) => {
    if (!tier.price_id) {
      const toolElement = document.getElementById('tool');
      if (toolElement) {
        toolElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to upgrade your plan.",
        variant: "destructive",
      });
      sessionStorage.setItem('upgrade_redirect', 'true'); // simple flag
      window.location.href = "/login";
      return;
    }

    if (window.Paddle) {
       window.Paddle.Checkout.open({
         items: [{ priceId: tier.price_id, quantity: 1 }],
         customer: {
            email: user.email,
         },
         customData: {
            user_id: user.id,
         }
       });
    } else {
        toast({
            title: "Error",
            description: "Paddle checkout is not available. Please try again later.",
            variant: "destructive",
        });
    }
  };

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
                <Button 
                  className="w-full" 
                  variant={tier.isPopular ? "default" : "outline"}
                  onClick={() => handleCheckout(tier)}
                >
                  {tier.cta}
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
