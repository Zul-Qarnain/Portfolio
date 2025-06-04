import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if we're in the browser and have the required env vars
  if (typeof window === 'undefined') {
    throw new Error('createClient should only be called in the browser');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(url, anonKey);
}