
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';

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
    console.error(error)
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=login-error`)
  }

  revalidatePath('/', 'layout')
  redirect('/app')
}

export async function signup(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Important: This prevents Supabase from sending its own email.
      // We will handle it manually with Resend.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=signup-error`);
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    // This indicates a user with the same email already exists.
     return redirect(`/login?message=${encodeURIComponent("User with this email already exists.")}&type=signup-error`);
  }

   if (data.user) {
    await sendVerificationEmail(email, data.user.id);
  }


  revalidatePath('/', 'layout');
  return redirect(`/login?message=Verification link sent to ${email}. Please check your inbox.&type=success`);
}


export async function signInWithGoogle() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error) {
        console.log(error)
        return redirect(`/login?message=${encodeURIComponent(error.message)}&type=login-error`)
    }
    
    if (data.url) {
        redirect(data.url)
    }
  } catch (error: any) {
    console.error('Google Sign-In Error:', error)
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=login-error`)
  }

  return redirect('/login?message=Could not authenticate with Google&type=login-error')
}
