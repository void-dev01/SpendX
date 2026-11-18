import { corsHeaders, handleCors } from '../_shared/cors.ts';

interface CategorizationResult {
  category: string;
  merchant: string;
  confidence: number;
  isRecurring: boolean;
}

const STATIC_MERCHANT_MAP: Record<string, { category: string; merchant: string; isRecurring?: boolean }> = {
  swiggy: { category: 'Food & Dining', merchant: 'Swiggy' },
  zomato: { category: 'Food & Dining', merchant: 'Zomato' },
  starbucks: { category: 'Food & Dining', merchant: 'Starbucks' },
  mcdonald: { category: 'Food & Dining', merchant: "McDonald's" },
  blinkit: { category: 'Groceries', merchant: 'Blinkit' },
  zepto: { category: 'Groceries', merchant: 'Zepto' },
  instamart: { category: 'Groceries', merchant: 'Swiggy Instamart' },
  uber: { category: 'Transportation', merchant: 'Uber' },
  ola: { category: 'Transportation', merchant: 'Ola Cabs' },
  rapido: { category: 'Transportation', merchant: 'Rapido' },
  netflix: { category: 'Entertainment', merchant: 'Netflix', isRecurring: true },
  spotify: { category: 'Entertainment', merchant: 'Spotify', isRecurring: true },
  prime: { category: 'Entertainment', merchant: 'Amazon Prime', isRecurring: true },
  airtel: { category: 'Utilities', merchant: 'Airtel Broadband', isRecurring: true },
  jio: { category: 'Utilities', merchant: 'Jio Telecom', isRecurring: true },
  bescom: { category: 'Utilities', merchant: 'Electricity Utility', isRecurring: true },
  salary: { category: 'Income', merchant: 'Employer Payroll', isRecurring: true },
  rent: { category: 'Rent & Housing', merchant: 'House Rent', isRecurring: true },
};

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
    const body = await req.json();
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    if (!description) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing "description" parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clean = description.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

    // 1. High-speed deterministic rules lookup
    for (const [key, mapping] of Object.entries(STATIC_MERCHANT_MAP)) {
      if (clean.includes(key)) {
        const result: CategorizationResult = {
          category: mapping.category,
          merchant: mapping.merchant,
          confidence: 95,
          isRecurring: mapping.isRecurring || false,
        };
        return new Response(
          JSON.stringify({ success: true, data: result, engine: 'RULE_ENGINE' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Gemini fallback if API key is in environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (geminiApiKey) {
      try {
        const prompt = `Classify this bank description: "${description}".
Return strictly JSON matching:
{
  "category": "Food & Dining" | "Transportation" | "Groceries" | "Entertainment" | "Utilities" | "Shopping" | "Income" | "General",
  "merchant": string,
  "confidence": number (0-100),
  "isRecurring": boolean
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const match = candidateText.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            return new Response(
              JSON.stringify({ success: true, data: parsed, engine: 'GEMINI_AI' }),
              { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (_err) {
        // Fall through to heuristic fallback
      }
    }

    // 3. Graceful heuristic baseline
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          category: 'General',
          merchant: description.substring(0, 30),
          confidence: 60,
          isRecurring: false,
        },
        engine: 'HEURISTIC_FALLBACK',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
