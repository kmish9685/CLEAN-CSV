
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

type FormState = {
  message: string | null;
  type: 'success' | 'error' | null;
};

const PasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // path of error
});


export async function resetPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const validationResult = PasswordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
  });

  if (!validationResult.success) {
      return {
          message: validationResult.error.errors[0].message,
          type: 'error'
      }
  }

  const { password } = validationResult.data;
  const code = formData.get('code') as string;

  if (!code) {
       return {
          message: 'Missing password reset token.',
          type: 'error'
      }
  }
  
  // Exchange code for a session
  const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  
  if (exchangeError) {
      console.error("Exchange code error:", exchangeError);
      return {
          message: 'The password reset link is invalid or has expired.',
          type: 'error'
      }
  }
  
  // Set the new password
  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    console.error('Update password error:', updateError);
    return {
      message: 'Could not reset password. Please try again.',
      type: 'error',
    };
  }

  return {
    message: 'Your password has been reset successfully. You can now log in with your new password.',
    type: 'success',
  };
}
