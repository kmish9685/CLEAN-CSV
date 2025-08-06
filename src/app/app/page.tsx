
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, MailWarning } from 'lucide-react';
import Link from 'next/link';

async function App() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const signOut = async () => {
    'use server';
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect('/');
  };

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

  // If the user is logged in but their email is not yet confirmed,
  // show them a message to check their email.
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
       <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Your App Dashboard</CardTitle>
            <CardDescription>
              Welcome back, {user.email || user.phone}.
            </CardDescription>
          </div>
           <Badge variant={"secondary"} className="capitalize">
             Free Plan
           </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> Basic Cleaning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Access standard data cleaning templates.</p>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Star className={"text-muted-foreground"} /> AI-Powered Suggestions
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground">
                     Unlock AI to automatically suggest the best cleaning strategies.
                    </p>
                 </CardContent>
              </Card>
          </div>

        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button className="w-full" asChild>
                <Link href="/#tool">Ready To Go</Link>
            </Button>
        </CardFooter>
      </Card>
      <div className="mt-4 flex items-center gap-4">
        <p className="text-xs text-muted-foreground">This is your protected app page. Only authenticated users can see this.</p>
        <form action={signOut}>
            <Button type="submit" variant="link" size="sm" className="text-xs p-0 h-auto">
            Sign Out
            </Button>
        </form>
      </div>
    </div>
  );
}

export default App;
