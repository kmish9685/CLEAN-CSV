
"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendOtp, verifyOtp } from './phone-actions'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input'


export default function PhoneForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const messageType = searchParams.get('type')
  const phoneParam = searchParams.get('phone')

  const [phone, setPhone] = useState(phoneParam || '')
  const [otpSent, setOtpSent] = useState(!!phoneParam)
  const [error, setError] = useState<string | null>(null)

  // Sync the phone number from URL params to state
  useEffect(() => {
    if (phoneParam) {
      setPhone(phoneParam)
      setOtpSent(true)
    }
  }, [phoneParam])

  const handleSendOtp = (formData: FormData) => {
    const phoneValue = formData.get('phone') as string;
    if (!isValidPhoneNumber(phoneValue)) {
      setError("Please enter a valid phone number.")
      return;
    }
    setError(null)
    sendOtp(formData)
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
        {message && (messageType === 'otp-error' || messageType === 'otp-sent') && (
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
            <Button type="submit" className="w-full">Send Code</Button>
          </form>
        ) : (
          <form action={verifyOtp} className="space-y-4">
            <Input type="hidden" name="phone" value={phone} />
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
            <Button type="submit" className="w-full">Verify Code & Sign In</Button>
            <Button variant="link" size="sm" className="w-full" onClick={() => {
              setOtpSent(false)
              setPhone('')
            }}>
              Use a different phone number
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
