
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// The `updateSession` function is a crucial part of Supabase's server-side
// auth helper package. It's responsible for refreshing the user's session
// cookie, which is essential for maintaining their authenticated state.
// This function must be run in your middleware for all routes that require
// authentication.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  );

  // This is the key step that refreshes the session.
  // It also makes the user object available on the request object,
  // which is useful for middleware logic.
  // We can destructure the response to get the Supabase client
  // with the fresh session.
  const { data: { user } } = await supabase.auth.getUser();

  // We are enriching the `NextResponse` object with a `locals` object
  // that holds the Supabase client. This is a common pattern to pass
  // data from middleware to the page components.
  // @ts-ignore
  response.locals = { supabase, user };


  return response
}
