
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
import { useEffect, useState } from "react";
import PhoneForm from "./phone-form";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Please wait..." : children}
    </Button>
  );
}

function AuthMessages({ state }: { state: { message: string | null, type: string | null } | null }) {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || state?.message;
    const type = searchParams.get('type') || state?.type;

    if (!message) return null;

    return (
        <Alert variant={type?.includes('error') ? 'destructive' : 'default'}>
            <AlertTitle>{type?.includes('error') ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}

const initialLoginState = {
  message: null,
  type: null,
};

function LoginForm() {
    const [state, formAction] = useFormState(login, initialLoginState);

    return (
        <Card>
        <CardHeader>
            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            <CardDescription>
            Enter your credentials to access your account.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <AuthMessages state={state} />
            <form action={formAction} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
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
            <SubmitButton className="w-full">Login</SubmitButton>
            </form>
        </CardContent>
        </Card>
    );
}

export default function LoginPageContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'login';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full max-w-sm mx-4">
        <Card className="h-[480px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </Card>
      </div>
    );
  }

  return (
      <Tabs defaultValue={defaultTab} className="w-full max-w-sm mx-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
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
                <AuthMessages state={null} />
              <form action={signup} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" name="password" type="password" required />
                </div>
                <SubmitButton className="w-full">Sign Up</SubmitButton>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  );
}
