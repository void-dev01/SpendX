import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

export const supabase: SupabaseClient | null =
  env.supabaseUrl && env.supabaseAnonKey
    ? createClient(env.supabaseUrl, env.supabaseAnonKey)
    : null;
