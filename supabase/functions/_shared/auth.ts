import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders } from './cors.ts';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export async function verifyUser(
  req: Request
): Promise<{ user: AuthenticatedUser | null; errorResponse: Response | null }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Missing or invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // Local development and test mock fallback
    return {
      user: { id: 'usr_edge_developer', email: 'edge_dev@spendx.local' },
      errorResponse: null,
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired authentication session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  }

  return {
    user: { id: user.id, email: user.email || '' },
    errorResponse: null,
  };
}
