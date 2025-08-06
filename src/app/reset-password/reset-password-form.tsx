
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

export default function ResetPasswordForm() {
    const [state, formAction] = useFormState(resetPassword, initialState);
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    if (!code) {
        return (
             <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Invalid Link</CardTitle>
                    <CardDescription>
                    This password reset link is invalid or has expired.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                     <Button asChild className="w-full">
                        <Link href="/forgot-password">Request a new link</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    if (state.type === 'success') {
         return (
             <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Password Reset!</CardTitle>
                     <CardDescription>
                        {state.message}
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                     <Button asChild className="w-full">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <CardDescription>
                Enter a new password for your account below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="code" value={code} />
                     {state?.message && (
                    <Alert variant={state.type === 'error' ? 'destructive' : 'default'}>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                        />
                    </div>
                    <SubmitButton className="w-full">Set New Password</SubmitButton>
                </form>
            </CardContent>
        </Card>
    )
}
