
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
import { Skeleton } from "@/components/ui/skeleton";
import PhoneForm from "./phone-form";
import { useFormStatus } from "react-dom";

function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Please wait..." : children}
    </Button>
  );
}

function LoginMessages() {
    // This component uses the useSearchParams hook, which is why its parent
    // needs to be wrapped in a <Suspense> boundary.
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const messageType = searchParams.get('type');

    if (!message) return null;

    if (messageType === 'login-error') {
        return (
            <Alert variant="destructive">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )
    }

    if (messageType === 'success' || messageType === 'signup-success') {
        return (
            <Alert>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )
    }
    
    return null;
}

function SignupMessages() {
    // This component also uses the useSearchParams hook.
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const messageType = searchParams.get('type');

    if (message && messageType === 'signup-error') {
      return (
        <Alert variant="destructive">
          <AlertTitle>Signup Failed</AlertTitle>
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
              {!isClient ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-11 w-full" />
                </div>
              ) : (
                <>
                  <form action={login} className="space-y-4">
                     <LoginMessages />
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <SubmitButton className="w-full">Login</SubmitButton>
                  </form>
                </>
              )}
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
              {!isClient ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                  </div>
                ) : (
                <>
                  <form action={signup} className="space-y-4">
                    <SignupMessages />
                    <div className="grid gap-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" name="password" type="password" required />
                    </div>
                    <SubmitButton className="w-full">Sign Up</SubmitButton>
                  </form>
                </>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function LoginPage() {
  // Wrapping LoginPageContent in <Suspense> is required because it uses the
  // useSearchParams() hook for reading URL parameters. Next.js needs this
  // to handle dynamic rendering on the client side correctly.
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
