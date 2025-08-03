
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Zap } from 'lucide-react';
import Link from 'next/link';

async function App() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: userPlan, error } = await supabase
    .from('users_extended')
    .select('plan, rows_used, rows_limit')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore error when no rows are found
    console.error('Error fetching user plan:', error);
    // You might want to show an error page here
  }
  
  const planName = userPlan?.plan || 'free';
  const isPremium = planName !== 'free';

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
           <Badge variant={isPremium ? "default" : "secondary"} className="capitalize">
             {planName} Plan
           </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Usage Info */}
          {userPlan && (
            <div className="p-4 border rounded-lg bg-background">
              <h3 className="font-semibold text-lg mb-2">Usage Overview</h3>
              <div className="flex items-end justify-between">
                <p className="text-muted-foreground">You've used <span className="font-bold text-foreground">{userPlan.rows_used.toLocaleString()}</span> of your <span className="font-bold text-foreground">{userPlan.rows_limit.toLocaleString()}</span> monthly rows.</p>
                {!isPremium && (
                  <Button asChild variant="link" size="sm" className="text-accent h-auto p-0">
                    <Link href="/#pricing">
                      Upgrade Now <Zap className="ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(userPlan.rows_used / userPlan.rows_limit) * 100}%` }}></div>
              </div>
            </div>
          )}

          {/* Feature Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Feature */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> Basic Cleaning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Access standard data cleaning templates.</p>
                </CardContent>
              </Card>

              {/* Premium Feature */}
              <Card className={!isPremium ? 'bg-secondary/50 border-dashed' : ''}>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Star className={isPremium ? "text-yellow-500" : "text-muted-foreground"} /> AI-Powered Suggestions
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground">
                     {isPremium ? "Unlock AI to automatically suggest the best cleaning strategies." : "Upgrade to unlock AI suggestions."}
                    </p>
                 </CardContent>
                 {!isPremium && (
                    <CardFooter>
                       <Button asChild className="w-full">
                         <Link href="/#pricing">
                           Upgrade to Pro <Zap className="ml-2" />
                         </Link>
                       </Button>
                    </CardFooter>
                  )}
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
