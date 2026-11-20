import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try resolving .env in order: current working directory, backend folder, project root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
  SUPABASE_ANON_KEY: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  GEMINI_API_KEY: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  OPENROUTER_API_KEY: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  OPENROUTER_MODEL: z.string().default('nvidia/nemotron-3.5-lightning:free'),
  SENTRY_DSN: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

export const isConfigured = {
  supabase: Boolean(env.SUPABASE_URL && (env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY)),
  gemini: Boolean(env.GEMINI_API_KEY),
  openrouter: Boolean(env.OPENROUTER_API_KEY),
  ai: Boolean(env.OPENROUTER_API_KEY || env.GEMINI_API_KEY),
};
