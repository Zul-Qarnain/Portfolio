import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';

export type { User } from '@supabase/supabase-js';

export const createClient = () => {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
};

export const createServerSupabaseClient = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();

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
