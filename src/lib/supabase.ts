import { createBrowserClient, createServerClient } from '@supabase/ssr';

export type { User } from '@supabase/supabase-js';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const createServerSupabaseClient = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
