
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MailWarning } from 'lucide-react';
import Link from 'next/link';
import { signOut } from './actions';
import HowItWorks from '@/components/landing/how-it-works';
import Tool from '@/components/landing/tool';
import Header from '@/components/landing/header';

async function App() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // This should theoretically not be hit if middleware is correct,
  // but it's good practice for defense-in-depth.
  if (!user) {
    return redirect('/login');
  }

  const maskEmail = (email: string | undefined) => {
    if (!email) return "";
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return "";

    const maskedLocalPart = localPart.length > 2
      ? `${localPart.substring(0, 2)}${'*'.repeat(localPart.length - 2)}`
      : `${localPart.substring(0, 1)}*`;

    const [domainName, topLevelDomain] = domain.split('.');
    const maskedDomainName = '*'.repeat(domainName.length);

    return `${maskedLocalPart}@${maskedDomainName}.${topLevelDomain}`;
  };

  // Screen for users who are logged in but have not confirmed their email
  if (user && !user.email_confirmed_at) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <MailWarning className="w-16 h-16 mx-auto text-primary" />
                    <CardTitle className="mt-4 text-2xl">Confirm Your Email</CardTitle>
                    <CardDescription className="mt-2">
                        We've sent a confirmation link to <strong>{maskEmail(user.email)}</strong>.
                        Please check your inbox (and spam folder) to complete your registration.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <form action={signOut} className="w-full">
                        <Button type="submit" variant="outline" className="w-full">
                            Back to Login
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
  }

  // Main dashboard for authenticated and verified users
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-1">
        <HowItWorks />
        <Tool />
      </main>
    </div>
  );
}

export default App;
