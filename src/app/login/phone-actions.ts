
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function sendOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const phone = formData.get('phone') as string

  // Format phone number to E.164 format
  const formattedPhone = `+${phone.replace(/\D/g, '')}`

  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  })

  if (error) {
    console.error('OTP Send Error:', error)
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=otp-error`)
  }

  return redirect(`/login?message=OTP sent to ${formattedPhone}.&type=otp-sent&phone=${encodeURIComponent(formattedPhone)}`)
}


export async function verifyOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const phone = formData.get('phone') as string
  const token = formData.get('otp') as string

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
