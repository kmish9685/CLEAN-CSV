
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, signup } from "./actions";
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import PhoneForm from "./phone-form";
import { useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton({ children, pending: formPending, ...props }: React.ComponentProps<typeof Button> & { pending?: boolean }) {
  const { pending: hookPending } = useFormStatus();
  const isPending = formPending || hookPending;

  return (
    <Button type="submit" disabled={isPending} {...props}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isPending ? "Please wait..." : children}
    </Button>
  );
}

function LoginMessages() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const messageType = searchParams.get('type');

    if (!message) return null;

    if (messageType?.includes('error')) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )
    }

    if (messageType?.includes('success')) {
        return (
            <Alert>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )
    }
    
    return null;
}

function LoginPageContent() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Tabs defaultValue="login" className="w-full max-w-sm mx-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back!</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={null}>
                <LoginMessages />
              </Suspense>
              <form action={login} className="space-y-4">
                <fieldset disabled={!isClient} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" passHref>
                           <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                             Forgot Password?
                           </Button>
                        </Link>
                    </div>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <SubmitButton className="w-full" pending={!isClient}>Login</SubmitButton>
                </fieldset>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="phone">
          <PhoneForm />
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>
                Join us! It only takes a second to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Suspense fallback={null}>
                  <LoginMessages />
                </Suspense>
              <form action={signup} className="space-y-4">
                <fieldset disabled={!isClient} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" name="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" name="password" type="password" required />
                  </div>
                  <SubmitButton className="w-full" pending={!isClient}>Sign Up</SubmitButton>
                </fieldset>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
