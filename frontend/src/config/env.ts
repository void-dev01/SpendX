/**
 * SPENDX Frontend Environment Configuration & Safety Validator
 */

export interface AppEnvConfig {
  apiBaseUrl: string;
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  openRouterApiKey: string | undefined;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string | undefined => {
  const value = import.meta.env[key];
  if (value && typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return defaultValue;
};

export const env: AppEnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api/v1')!,
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  openRouterApiKey: getEnvVar('VITE_OPENROUTER_API_KEY'),
  isDevelopment: Boolean(import.meta.env.DEV),
  isProduction: Boolean(import.meta.env.PROD),
};

// Log warning in development if Supabase credentials are not configured
if (env.isDevelopment && (!env.supabaseUrl || !env.supabaseAnonKey)) {
  console.info(
    '[SPENDX Telemetry] Supabase credentials not found in frontend environment. Using client-side offline mock sync.'
  );
}
