
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function Dashboard() {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to your Dashboard</CardTitle>
          <CardDescription>
            You are logged in as {user.email || user.phone}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This is your protected dashboard page. Only authenticated users can see this.
          </p>
          <form action={signOut}>
            <Button className="w-full" type="submit">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
