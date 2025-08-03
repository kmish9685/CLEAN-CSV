import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://ncrgcgcuucfcntjqqizn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcmdjZ2N1dWNmY250anFxaXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1OTYxNjUsImV4cCI6MjA2OTE3MjE2NX0.M16qaLwJpbVxJUL-NArhcQ_gozYNpDfA7wx0C1emWWs"
  )
}