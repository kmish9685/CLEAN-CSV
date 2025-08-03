import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is my data secure?",
    answer: "Absolutely. We process your files in memory and they are permanently deleted from our servers within 1 hour. We never store your data."
  },
  {
    question: "What file formats do you support?",
    answer: "We currently support CSV (.csv) files. Support for Excel (.xlsx) and TSV is coming soon."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account dashboard. There are no long-term contracts or hidden fees."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee on all our paid plans. If you're not satisfied, just contact support and we'll issue a full refund, no questions asked."
  }
];

const Faq = () => (
  <section id="faq" className="bg-secondary py-20 sm:py-24">
    <div className="container mx-auto max-w-4xl px-4">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Have questions? We have answers.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full mt-12">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default Faq;
