import { type NextRequest } from 'next/server'
import { updateSession, createClient } from '@/lib/supabase/middleware'
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';

const supabase = createClient();

supabase.auth.onAuthStateChange(async (event, session) => {
 if (event === 'USER_SIGNED_UP') {
 const user = session?.user;
 if (user?.email && user?.id) {
 await sendVerificationEmail(user.email, user.id); // or use user.confirmation_token if needed
    }
  }
});
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
