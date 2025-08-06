
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { forgotPassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
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

const initialState = {
  message: null,
  type: null,
};

export default function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPassword, initialState);

  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
            No problem. Enter your email below and we'll send you a link to reset it.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="space-y-4">
                {state?.message && (
                <Alert variant={state.type === 'error' ? 'destructive' : 'default'}>
                    <AlertTitle>{state.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <SubmitButton className="w-full">Send Reset Link</SubmitButton>
            </form>
        </CardContent>
          <CardFooter className="mt-4 text-center block">
              <Button variant="link" asChild>
                <Link href="/login">Back to Login</Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
