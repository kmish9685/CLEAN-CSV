
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Log the error for debugging but return a user-friendly message
    console.error("Login Error:", error.message)
    return redirect(`/login?message=${encodeURIComponent("Invalid email or password. Please try again.")}&type=login-error`)
  }

  revalidatePath('/', 'layout')
  redirect('/app')
}

export async function signup(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Use the NEXT_PUBLIC_SITE_URL for the redirect path
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set in .env file");
    return redirect(`/login?message=${encodeURIComponent("Server configuration error. Cannot process signup.")}&type=signup-error`);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.log("Signup Error:", error.message);
    // Provide a more specific message if possible
    if (error.message.includes("User already registered")) {
         return redirect(`/login?message=${encodeURIComponent("An account with this email already exists. Please log in.")}&type=signup-error`);
    }
    return redirect(`/login?message=${encodeURIComponent("Could not sign you up. Please try again.")}&type=signup-error`);
  }

  // Check if the user exists but their email is not confirmed (common case for re-signups)
  if (data.user && !data.user.email_confirmed_at) {
     return redirect(`/login?message=${encodeURIComponent("A confirmation link has been sent to your email. Please verify to continue.")}&type=signup-success`);
  }

  revalidatePath('/', 'layout');
  return redirect(`/login?message=Confirmation link sent successfully. Please check your email.&type=signup-success`);
}
