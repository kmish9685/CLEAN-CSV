
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

  const getRedirectUrl = (params: URLSearchParams) => {
    if (redirectTo) {
        const url = new URL(redirectTo, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
        params.forEach((value, key) => url.searchParams.set(key, value));
        return url.pathname + url.search;
    }
    return `/login?${params.toString()}`;
  }


  if (!phone) {
    const params = new URLSearchParams({
        message: "Phone number is required.",
        type: "otp-error"
    });
    return redirect(getRedirectUrl(params));
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
  })

  if (error) {
    console.error('OTP Send Error:', error)
     const params = new URLSearchParams({
        message: error.message,
        type: "otp-error"
    });
    return redirect(getRedirectUrl(params));
  }
  
  const params = new URLSearchParams({
    message: `OTP sent to ${phone}.`,
    type: 'otp-sent',
    phone: phone,
  });
  return redirect(getRedirectUrl(params));
}


export async function verifyOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const phone = formData.get('phone') as string
  const token = formData.get('otp') as string

  if (!phone || !token) {
     return redirect(`/login?tab=phone&message=${encodeURIComponent("Phone number and OTP are required.")}&type=otp-error`)
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    console.error('OTP Verify Error:', error)
    return redirect(`/login?tab=phone&message=${encodeURIComponent(error.message)}&type=otp-error&phone=${encodeURIComponent(phone)}`)
  }
  
  revalidatePath('/', 'layout')
  redirect('/app')
}
