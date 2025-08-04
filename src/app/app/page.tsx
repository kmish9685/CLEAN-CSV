
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';
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
            <form action={signOut} className="w-full">
                <Button className="w-full" type="submit" variant="outline">
                Sign Out
                </Button>
            </form>
        </CardFooter>
      </Card>
      <p className="text-xs text-muted-foreground mt-4">This is your protected app page. Only authenticated users can see this.</p>
    </div>
  );
}

export default App;
