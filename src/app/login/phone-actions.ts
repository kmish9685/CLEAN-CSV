
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function sendOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const phone = formData.get('phone') as string

  // The phone number from react-phone-number-input is already in E.164 format
  if (!phone) {
    return redirect(`/login?message=${encodeURIComponent("Phone number is required.")}&type=otp-error`)
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  })

  if (error) {
    console.error('OTP Send Error:', error)
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=otp-error`)
  }

  return redirect(`/login?message=OTP sent to ${phone}.&type=otp-sent&phone=${encodeURIComponent(phone)}`)
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
  redirect('/')
}
