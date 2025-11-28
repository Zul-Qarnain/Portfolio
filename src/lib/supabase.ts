import { createBrowserClient, createServerClient } from '@supabase/ssr';

export type { User } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzvxpamfvfzkchbqfxgt.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnhwYW1mdmZ6a2NoYnFmeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjExNDQsImV4cCI6MjA2NDUzNzE0NH0.BxvV5yhtvjELIU3mcWbjTwrxXAZRgARY2OKivQ6JdNs';

  return createBrowserClient(supabaseUrl, supabaseKey);
};

export const createServerSupabaseClient = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzvxpamfvfzkchbqfxgt.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnhwYW1mdmZ6a2NoYnFmeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjExNDQsImV4cCI6MjA2NDUzNzE0NH0.BxvV5yhtvjELIU3mcWbjTwrxXAZRgARY2OKivQ6JdNs';

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set(name: string, value: string, options: { [key: string]: any }) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignore errors when called from Server Component
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        remove(name: string, options: { [key: string]: any }) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Ignore errors when called from Server Component
          }
        },
      },
    }
  );
};
