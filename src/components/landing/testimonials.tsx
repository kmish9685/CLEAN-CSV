import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah L.",
    role: "Marketing Agency Owner",
    testimonial: "Saves me 3 hours every week preparing client data imports. This tool is a lifesaver for my agency!",
    avatar: "SL",
  },
  {
    name: "Mike R.",
    role: "E-commerce Store Owner",
    testimonial: "Finally, a tool that just works. No more Excel headaches, no more weird formatting errors. Game-changer for our Shopify data exports.",
    avatar: "MR",
  },
  {
    name: "Lisa Chen",
    role: "Data Consultant",
    testimonial: "I can't believe how fast and easy it is to clean up messy client files now. CleanCSV is an essential part of my toolkit.",
    avatar: "LC",
  }
];

const stats = [
  { value: "50,000+", label: "Files Processed" },
  { value: "500+", label: "Happy Customers" },
  { value: "99.9%", label: "Uptime Guarantee" }
];

const Testimonials = () => (
  <section id="testimonials" className="py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Loved by Professionals Worldwide</h2>
        <p className="mt-4 text-lg text-muted-foreground">Don't just take our word for it. Here's what our users are saying.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name}>
            <CardContent className="p-6">
              <p className="text-muted-foreground">"{t.testimonial}"</p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                  <AvatarFallback>{t.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16 grid grid-cols-2 gap-8 border-t pt-12 text-center md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-4xl font-bold font-headline text-primary">{stat.value}</p>
            <p className="mt-2 text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
