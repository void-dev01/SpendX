import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { user, errorResponse } = await verifyUser(req);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const rawText = typeof body.text === 'string' ? body.text.trim() : '';
    const accountId = typeof body.accountId === 'string' ? body.accountId : '00000000-0000-0000-0000-000000000001';

    if (!rawText) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bad Request: "text" payload is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. High-speed regex extraction for Indian Banking SMS & UPI Share Intents
    const amtMatch = rawText.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);
    const amount = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, '')) : 0;

    if (isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not extract valid financial amount from intent text' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isCredit = /credited|received|refund|deposited/i.test(rawText);
    const type = isCredit ? 'INCOME' : 'EXPENSE';

    const refMatch = rawText.match(/(?:ref|utr|txn|id)\s*[:#]?\s*([a-zA-Z0-9]{6,20})/i);
    const referenceNumber = refMatch ? refMatch[1] : undefined;

    let description = 'Quick Capture Transaction';
    const toMerchantMatch = rawText.match(/(?:to|at|info|vpa|upi\/)\s*([a-zA-Z0-9\s._&-]{3,30})/i);
    if (toMerchantMatch) {
      description = toMerchantMatch[1].trim();
    } else {
      description = rawText.substring(0, 40);
    }

    const date = new Date().toISOString();

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      // Mock edge response when running offline
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Quick capture simulated successfully (offline mode)',
          data: {
            id: `edge_${Date.now()}`,
            userId: user!.id,
            accountId,
            amount,
            type,
            description,
            date,
            referenceNumber,
            isDuplicate: false,
          },
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. 24-Hour Deduplication Check
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', user!.id)
      .eq('amount', amount)
      .eq('description', description)
      .gte('date', windowStart)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Duplicate transaction detected within 24-hour window',
          data: { isDuplicate: true },
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Insert Transaction
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: user!.id,
        account_id: accountId,
        amount,
        type,
        category: type === 'INCOME' ? 'Income' : 'General',
        description,
        date,
        reference_number: referenceNumber,
      })
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Log Capture Event
    await supabase.from('capture_events').insert({
      user_id: user!.id,
      source: 'SMS_TEXT',
      total_count: 1,
      imported_count: 1,
      duplicate_count: 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Transaction captured and recorded in ledger',
        data: transaction,
      }),
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
