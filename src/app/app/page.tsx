
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Header from '@/components/landing/header';
import HowItWorks from '@/components/landing/how-it-works';
import Pricing from '@/components/landing/pricing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// This is now the protected dashboard page.
// The middleware ensures only authenticated users can reach this page.
export default async function App() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-4xl mx-auto mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                    <CardDescription>
                    {user?.email || 'You are logged in'}.
                    </CardDescription>
                </div>
                <Badge variant={"secondary"} className="capitalize">
                    Free Plan
                </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p>You're logged in and ready to clean some data.</p>
                    <Button asChild>
                      <Link href="/#tool">
                        Go to Cleaning Tool
                      </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
        <HowItWorks />
        <Pricing />
      </main>
    </div>
  );
}
