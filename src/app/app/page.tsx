
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Header from '@/components/landing/header';
import HowItWorks from '@/components/landing/how-it-works';
import Tool from '@/components/landing/tool';

// This is now the protected dashboard page.
// The middleware ensures only authenticated users can reach this page.
export default async function App() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.email}!</h1>
            <p className="text-muted-foreground mt-2">You're logged in and ready to clean some data.</p>
        </div>
        <HowItWorks />
        <Tool />
      </main>
    </div>
  );
}
