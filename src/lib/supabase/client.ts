
import { createBrowserClient } from '@supabase/ssr';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

// Row Level Security is enabled in your database.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  )
}


// Authentication functions using the client
export const auth = {

  // Sign up new user
  signUp: async (email: string, password: string, metadata?: object) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Optional metadata for the user
      },
    });
    return { data, error };
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user and listen for auth state changes
  // Note: For SSR contexts, using `auth.getSession()` or `auth.getUser()`
  // within server components or API routes with a server client is recommended.
  // This `onAuthStateChange` is primarily for client-side routing and reactivity.

  getCurrentUser: async (): Promise<{ user: User | null; error: any | null }> => {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }
};

// Trial tracking functions

// Generate or retrieve a unique session ID from localStorage for anonymous users
export const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('trial_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('trial_session_id', sessionId);
    }
    return sessionId;
};

// Initialize trial session in Supabase
export const initializeTrialSession = async (sessionId: string): Promise<{ data: any | null; error: any | null }> => {
  const supabase = createClient(); // Get the Supabase client instance
  const { data, error } = await supabase
    .from('trial_sessions')
    .insert([{ session_id: sessionId, usage_count: 0 }])
    .select();
  return { data, error };
};

// Get current trial usage
export const getTrialUsage = async (sessionId: string): Promise<{ count: number | null; error: any | null }> => {
  const supabase = createClient(); // Get the Supabase client instance
  const { data, error } = await supabase
    .from('trial_sessions')
    .select('usage_count')
    .eq('session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore "No rows found" error, return 0 instead
    console.error('Error fetching trial usage:', error);
    return { count: null, error };
  }

  return { count: data ? data.usage_count : 0, error: null };
};


// Increment trial usage
export const incrementTrialUsage = async (sessionId: string): Promise<{ data: any | null; error: any | null }> => {
    const supabase = createClient();
    const { count, error: fetchError } = await getTrialUsage(sessionId);

    if (fetchError) {
        return { data: null, error: fetchError };
    }

    if (count === null) {
        // Session doesn't exist, create it first
        const { error: createError } = await initializeTrialSession(sessionId);
        if (createError) {
            return { data: null, error: createError };
        }
    }

    const { data, error } = await supabase.rpc('increment_trial_usage', { p_session_id: sessionId });
    
    if (error) {
        console.error('Error incrementing trial usage:', error);
    }

    return { data, error };
};


// Check if trial expired
export const isTrialExpired = async (sessionId: string): Promise<boolean> => {
  const { count } = await getTrialUsage(sessionId);
  return count !== null && count >= 2;
};

// Reset trial after signup
export const resetTrialAfterSignup = async (sessionId: string, userId: string): Promise<{ data: any | null; error: any | null }> => {
  const supabase = createClient(); // Get the Supabase client instance
  // In a real application, you might want to transfer trial data
  // to the user's account or usage_tracking table here.
  // For this example, we'll just delete the trial session.
  const { data, error } = await supabase
    .from('trial_sessions')
    .delete()
    .eq('session_id', sessionId);

  // You could also update the user's profile to reflect they are no longer on trial
  // await supabase.from('profiles').update({ trial_used: true, trial_count: (await getTrialUsage(sessionId)).count }).eq('id', userId);

  return { data, error };
};

// Fetch all templates from the 'templates' table
export const getTemplates = async (): Promise<{ data: any | null; error: any | null }> => {
  const supabase = createClient(); // Get the Supabase client instance
  const { data, error } = await supabase
    .from('templates')
    .select('*'); // Select all columns
  return { data, error };
};
