
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    return redirect(`/login?message=${encodeURIComponent(error.message)}&type=signup-error`);
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
     return redirect(`/login?message=${encodeURIComponent("User with this email already exists.")}&type=signup-error`);
  }

  revalidatePath('/', 'layout');
  return redirect(`/login?message=Confirmation link sent. Check your email.&type=signup-success`);
}
