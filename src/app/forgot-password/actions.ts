
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

type FormState = {
  message: string | null;
  type: 'success' | 'error' | null;
};

export async function forgotPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const email = formData.get('email') as string;

  if (!email) {
    return {
      message: 'Please provide your email address.',
      type: 'error',
    };
  }

  // Use the NEXT_PUBLIC_SITE_URL for the redirect path
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
      console.error("NEXT_PUBLIC_SITE_URL is not set in .env file");
      return {
          message: "Server configuration error. Cannot process password reset.",
          type: "error"
      }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    console.error('Password Reset Error:', error);
    return {
      message: "Could not send password reset link. Please try again.",
      type: 'error',
    };
  }

  return {
    message: 'Password reset link has been sent to your email address. Please check your inbox.',
    type: 'success',
  };
}
