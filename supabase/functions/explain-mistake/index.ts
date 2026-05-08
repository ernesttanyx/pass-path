/**
 * explain-mistake — Supabase Edge Function
 * Calls Claude Haiku to explain a student's specific wrong answer.
 * Rate-limited: 5 calls per user per day (enforced server-side).
 *
 * POST body: { user_id, step_description_bm, student_input, correct_expression, lang? }
 * Response:  { explanation: string } | { error: string }
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_CAP = 5;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const { user_id, step_description_bm, step_description_en, student_input, correct_expression, lang = 'BM' } = body;

    if (!user_id || !step_description_bm || !student_input || !correct_expression) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limit check
    const { data: userData } = await supabase
      .from('users')
      .select('daily_token_usage, last_token_reset')
      .eq('id', user_id)
      .maybeSingle();

    const today = new Date().toISOString().slice(0, 10);
    const lastReset = userData?.last_token_reset?.slice(0, 10);
    const usage = lastReset === today ? (userData?.daily_token_usage ?? 0) : 0;

    if (usage >= DAILY_CAP) {
      // Serve tier-4 hint from cache instead
      const { data: hint } = await supabase
        .from('hint_cache')
        .select('body_bm, body_en')
        .eq('hint_tier', 4)
        .limit(1)
        .maybeSingle();

      const fallback = lang === 'BM'
        ? (hint?.body_bm ?? 'Had harian dah penuh. Cuba lagi esok.')
        : (hint?.body_en ?? 'Daily limit reached. Try again tomorrow.');

      await supabase.from('attempts').update({ hint_tier_used: 'cap_exceeded' })
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(1);

      return new Response(JSON.stringify({ explanation: fallback, cap_exceeded: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call DeepSeek
    const stepDesc = lang === 'BM' ? step_description_bm : (step_description_en ?? step_description_bm);

    const prompt = lang === 'BM'
      ? `Kamu tutor Add Math SPM. Pelajar cuba soalan ini:
Kemahiran: ${stepDesc}
Jawapan pelajar: ${student_input}
Jawapan betul (formula): ${correct_expression}

Terangkan dalam BM (2–3 ayat) KENAPA jawapan pelajar salah dan apa langkah yang betul. Jangan guna "salah" atau "wrong". Mulakan dengan "Hampir —" atau "Tinggal satu langkah —".`
      : `You are an SPM Add Maths tutor.
Skill: ${stepDesc}
Student answer: ${student_input}
Correct formula: ${correct_expression}

Explain in 2–3 sentences WHY the student's answer is wrong and what the correct step is. Never say "wrong" or "incorrect". Start with "Almost —" or "One step away —".`;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')!}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`DeepSeek error ${res.status}`);
    const json = await res.json() as { choices: Array<{ message: { content: string } }> };
    const explanation = json.choices[0].message.content.trim();

    // Increment usage
    await supabase.from('users').update({
      daily_token_usage: usage + 1,
      ...(lastReset !== today ? { last_token_reset: today } : {}),
    }).eq('id', user_id);

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
