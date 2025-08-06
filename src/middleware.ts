import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // First, run the Supabase middleware to ensure the session is fresh.
  const response = await updateSession(request);

  // Get the user from the Supabase client.
  const supabase = response.locals.supabase;
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const publicAuthRoutes = ['/login', '/forgot-password', '/reset-password', '/signup'];

  // If the user is logged in and trying to access a public-only route
  // (like login, signup, or the main landing page), redirect them to the dashboard.
  if (user && (pathname === '/' || publicAuthRoutes.includes(pathname))) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // If the user is not logged in and trying to access a protected route,
  // redirect them to the login page.
  if (!user && pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return response;
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
