import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, isConfigured } from './env.js';
import { logger } from '../utils/logger.js';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

if (isConfigured.supabase && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
  supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  logger.info('Supabase client initialized with anon key.');
} else {
  logger.warn('Supabase credentials not configured in environment. Supabase client is idle.');
}

if (isConfigured.supabase && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  logger.info('Supabase admin client initialized with service role key.');
}

export { supabaseClient, supabaseAdminClient };
