const FALLBACK_SUPABASE_URL = 'https://lzvxpamfvfzkchbqfxgt.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnhwYW1mdmZ6a2NoYnFmeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjExNDQsImV4cCI6MjA2NDUzNzE0NH0.BxvV5yhtvjELIU3mcWbjTwrxXAZRgARY2OKivQ6JdNs';

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
}
