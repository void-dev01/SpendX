import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

interface WebhookAlertPayload {
  eventType: 'BUDGET_THRESHOLD' | 'RECURRING_DUE' | 'SAVINGS_MILESTONE' | 'SECURITY_ALERT';
  userId: string;
  title: string;
  message: string;
  actionRoute?: string;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload: WebhookAlertPayload = await req.json();
    const { eventType, userId, title, message, actionRoute } = payload;

    if (!eventType || !userId || !title || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required alert fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      // Mock edge response for offline testing
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Webhook alert simulated (offline mode)',
          data: { eventType, userId, title, dispatched: true },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check user notification preferences
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (preferences) {
      if (eventType === 'BUDGET_THRESHOLD' && !preferences.budget_threshold_alerts) {
        return new Response(
          JSON.stringify({ success: true, message: 'Notification skipped by user preferences', dispatched: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (eventType === 'RECURRING_DUE' && !preferences.recurring_due_alerts) {
        return new Response(
          JSON.stringify({ success: true, message: 'Notification skipped by user preferences', dispatched: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (eventType === 'SAVINGS_MILESTONE' && !preferences.savings_milestone_alerts) {
        return new Response(
          JSON.stringify({ success: true, message: 'Notification skipped by user preferences', dispatched: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Insert into notifications table
    const { data: record, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: eventType,
        title,
        message,
        action_route: actionRoute,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification dispatched successfully', data: record, dispatched: true }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
