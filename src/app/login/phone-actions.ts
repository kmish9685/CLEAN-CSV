
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function sendOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const phone = formData.get('phone') as string
  const redirectTo = formData.get('redirectTo') as string | null;


  // The phone number from react-phone-number-input is already in E.164 format
  if (!phone) {
    const redirectUrl = redirectTo ? `${redirectTo}?message=${encodeURIComponent("Phone number is required.")}&type=otp-error` : `/login?message=${encodeURIComponent("Phone number is required.")}&type=otp-error`;
    return redirect(redirectUrl);
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  })

  if (error) {
    console.error('OTP Send Error:', error)
    const redirectUrl = redirectTo ? `${redirectTo}?message=${encodeURIComponent(error.message)}&type=otp-error` : `/login?message=${encodeURIComponent(error.message)}&type=otp-error`;
    return redirect(redirectUrl);
  }

  const redirectUrl = redirectTo ? `${redirectTo}?message=OTP sent to ${phone}.&type=otp-sent&phone=${encodeURIComponent(phone)}` : `/login?message=OTP sent to ${phone}.&type=otp-sent&phone=${encodeURIComponent(phone)}`;
  return redirect(redirectUrl);
}


export async function verifyOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const phone = formData.get('phone') as string
  const token = formData.get('otp') as string

  if (!phone || !token) {
     return redirect(`/login?message=${encodeURIComponent("Phone number and OTP are required.")}&type=otp-error`)
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    console.error('OTP Verify Error:', error)
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=otp-error&phone=${encodeURIComponent(phone)}`)
  }
  
  revalidatePath('/', 'layout')
  redirect('/app')
}
