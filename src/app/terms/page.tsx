
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CleanCSV',
  description: 'The terms and conditions for using the CleanCSV service.',
};

const TermsPage = () => {
  return (
    <div className="bg-background font-body text-foreground">
        <div className="container mx-auto max-w-3xl py-16 px-4">
        <h1 className="font-headline text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="mt-8 space-y-6 text-foreground/90">
            <p>Welcome to CLEAN CSV!</p>
            <p>
            These terms and conditions outline the rules and regulations for the use of our website and services.
            </p>
            <p>
            By accessing this website and/or using our services, we assume you accept these terms. Do not continue to use CLEAN CSV if you do not agree to all of the terms and conditions stated on this page.
            </p>

            <div>
            <h2 className="font-headline text-2xl font-bold mt-8 mb-3">1. Services</h2>
            <p>
                We provide tools that allow users to clean and process CSV and PDF files. Premium features may require a paid subscription.
            </p>
            </div>

            <div>
            <h2 className="font-headline text-2xl font-bold mt-8 mb-3">2. User Responsibilities</h2>
            <p>
                Users are responsible for the data they upload and must not use the service for illegal purposes.
            </p>
            </div>

            <div>
            <h2 className="font-headline text-2xl font-bold mt-8 mb-3">3. Payments</h2>
            <p>
                All paid features are processed securely. Subscriptions can be canceled at any time.
            </p>
            </div>

            <div>
            <h2 className="font-headline text-2xl font-bold mt-8 mb-3">4. Limitation of Liability</h2>
            <p>
                We are not responsible for data loss or service interruptions.
            </p>
            </div>

            <div>
            <h2 className="font-headline text-2xl font-bold mt-8 mb-3">5. Modifications</h2>
            <p>
                We may update these terms at any time. Continued use implies acceptance of the updated terms.
            </p>
            </div>

            <div>
            <h2 className="font-headline text-2xl font-bold mt-8 mb-3">Contact Us</h2>
            <p>
                If you have any questions, email us at: [your email]
            </p>
            </div>
        </div>
        </div>
    </div>
  );
};

export default TermsPage;
