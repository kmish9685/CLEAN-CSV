
"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendOtp, verifyOtp } from './phone-actions'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

function PhoneSubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} {...props}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {pending ? "Please wait..." : children}
      </Button>
    );
}

export default function PhoneForm() {
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const router = useRouter();

  const message = searchParams.get('message')
  const messageType = searchParams.get('type')
  const phoneParam = searchParams.get('phone')
  const isOtpSentFlow = messageType === 'otp-sent';

  const [phone, setPhone] = useState(phoneParam || '')
  const [otpSent, setOtpSent] = useState(isOtpSentFlow || !!phoneParam)
  const [error, setError] = useState<string | null>(null)
  
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = useCallback(() => {
    setResendCooldown(30);
    timerRef.current = setInterval(() => {
        setResendCooldown((prev) => {
            if (prev <= 1) {
                if(timerRef.current) clearInterval(timerRef.current);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  }, []);

  useEffect(() => {
    if (isOtpSentFlow) {
      startCooldown();
    }
    // Clean up timer on component unmount
    return () => {
        if (timerRef.current) clearInterval(timerRef.current)
    };
  }, [isOtpSentFlow, startCooldown]);

  useEffect(() => {
    // Sync state if URL params change
    const phoneInUrl = searchParams.get('phone');
    const typeInUrl = searchParams.get('type');
    setPhone(phoneInUrl || '');
    setOtpSent(typeInUrl === 'otp-sent' || !!phoneInUrl && typeInUrl !=='otp-error');
  }, [searchParams]);

  const handleSendOtp = (formData: FormData) => {
    const phoneValue = formData.get('phone') as string;
    if (!phoneValue || !isValidPhoneNumber(phoneValue)) {
      setError("Please enter a valid phone number.")
      return;
    }
    setError(null)
    sendOtp(formData)
  }

  const handleDifferentNumber = () => {
    // Reset state and URL
    setOtpSent(false);
    setPhone('');
    if (timerRef.current) clearInterval(timerRef.current);
    setResendCooldown(0);
    const newPath = `${pathname}?tab=phone`;
    router.replace(newPath, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign In with Phone</CardTitle>
        <CardDescription>
          {otpSent ? "Enter the code we sent to your phone." : "Enter your phone number to get a login code."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && messageType?.includes('otp-') && (
          <Alert variant={messageType === 'otp-error' ? 'destructive' : 'default'}>
            <AlertTitle>{messageType === 'otp-error' ? 'Error' : 'Info'}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Invalid Input</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!otpSent ? (
          <form action={handleSendOtp} className="space-y-4">
             <input type="hidden" name="redirectTo" value={`${pathname}?tab=phone`} />
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(value) => setPhone(value || '')}
                defaultCountry="US"
                international
                className="w-full"
              />
            </div>
            <PhoneSubmitButton className="w-full">Send Code</PhoneSubmitButton>
          </form>
        ) : (
          <form action={verifyOtp} className="space-y-4">
            <input type="hidden" name="phone" value={phone} />
            <div className="grid gap-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input 
                id="otp" 
                name="otp" 
                type="text" 
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456" 
                required 
              />
            </div>
            <PhoneSubmitButton className="w-full">Verify Code & Sign In</PhoneSubmitButton>
            <div className="flex justify-between items-center mt-4">
                <Button variant="link" size="sm" className="p-0 h-auto" type="button" onClick={handleDifferentNumber}>
                    Use a different number
                </Button>
                
                <form action={handleSendOtp}>
                     <input type="hidden" name="phone" value={phone} />
                     <input type="hidden" name="redirectTo" value={`${pathname}?tab=phone`} />
                     <Button type="submit" variant="link" size="sm" className="p-0 h-auto" disabled={resendCooldown > 0}>
                        Resend OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
                    </Button>
                </form>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
