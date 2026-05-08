/**
 * generate-hints.ts
 * One-time offline batch job. Calls Claude Haiku for every kp_step × 4 hint tiers
 * and writes results into hint_cache. Safe to re-run — uses upsert.
 *
 * Usage:
 *   npx tsx scripts/generate-hints.ts
 *
 * Requires in .env.local:
 *   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;

interface KpStep {
  id: string;
  topic: string;
  step_description_bm: string;
  step_description_en: string;
  mark_value: number;
  difficulty_1_to_5: number;
}

// Hint tier definitions
const TIER_PROMPTS = [
  {
    tier: 1,
    instruction_bm: `Tulis 1 soalan konsep pendek dalam BM. Contoh: "Apa formula untuk cari nombor indeks?" Jangan bagi jawapan. 1 ayat sahaja.`,
    instruction_en: 'Write 1 short concept question in English. Example: "What formula finds the index number?" No answer. 1 sentence only.',
  },
  {
    tier: 2,
    instruction_bm: `Tulis rangka formula dengan tempat kosong (___) dalam BM.
PENTING: Untuk pecahan, MESTI guna format ini — tulis pada dua baris berasingan:
ATAS: [apa yang atas]
BAWAH: [apa yang bawah]
Contoh untuk I = (Pn/P0) × 100:
I =
ATAS: Pn
BAWAH: P0
× 100
Jangan sekali-kali guna simbol / untuk pecahan.`,
    instruction_en: `Write the formula skeleton with blanks (___) in English.
IMPORTANT: For fractions, MUST use this two-line format:
ATAS: [what goes on top]
BAWAH: [what goes on bottom]
Example for I = (Pn/P0) × 100:
I =
ATAS: Pn
BAWAH: P0
× 100
Never use / symbol for fractions.`,
  },
  {
    tier: 3,
    instruction_bm: `Tunjukkan formula dengan nilai contoh dalam BM. Pelajar hanya tekan kalkulator.
PENTING: Untuk pecahan, MESTI guna format ini:
ATAS: [nilai atas]
BAWAH: [nilai bawah]
Jangan sekali-kali guna simbol / untuk pecahan.
Contoh nombor nyata. Pendek — 3 baris sahaja.`,
    instruction_en: `Show the formula with example numbers in English. Student just presses calculator.
IMPORTANT: For fractions, MUST use this format:
ATAS: [top value]
BAWAH: [bottom value]
Never use / symbol for fractions.
Use real numbers. Short — 3 lines only.`,
  },
  {
    tier: 4,
    instruction_bm: `Bagi penerangan langkah demi langkah dalam BM + satu contoh nombor penuh.
PENTING: Untuk pecahan, MESTI guna format ini:
ATAS: [apa yang atas]
BAWAH: [apa yang bawah]
Jangan sekali-kali guna simbol / untuk pecahan.
Gunakan bahasa mudah — pelajar gred F yang baru belajar.
Akhiri dengan: "Cuba sekarang."`,
    instruction_en: `Give a step-by-step walkthrough in English + one complete numeric example.
IMPORTANT: For fractions, MUST use this format:
ATAS: [top value]
BAWAH: [bottom value]
Never use / symbol for fractions.
Use simple language for a struggling student.
End with: "Try it now."`,
  },
];

async function generateHint(step: KpStep, tier: number, lang: 'bm' | 'en'): Promise<string> {
  const tierDef = TIER_PROMPTS[tier - 1];
  const instruction = lang === 'bm' ? tierDef.instruction_bm : tierDef.instruction_en;
  const stepDesc = lang === 'bm' ? step.step_description_bm : step.step_description_en;

  const prompt = `You are a Malaysian SPM Add Maths tutor writing a hint card for students.

Kemahiran/Skill: ${stepDesc}
Topic: ${step.topic}
Mark value: ${step.mark_value} mark(s)
Difficulty: ${step.difficulty_1_to_5}/5

Write Hint Tier ${tier}:
${instruction}

Rules:
- NEVER say "salah", "wrong", "incorrect", "good job", "well done", "correct"
- NEVER use the / symbol to write a fraction inline. ALWAYS use ATAS:/BAWAH: format for any fraction.
- Keep it SHORT — max 4 lines
- Use plain text only, no markdown, no asterisks, no bullet points
- Tone: calm, direct, like a patient tutor speaking to a struggling student`;

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek error ${res.status}: ${await res.text()}`);
  const json = await res.json() as { choices: Array<{ message: { content: string } }> };
  return json.choices[0].message.content.trim();
}

async function main() {
  console.log('Fetching kp_steps...');
  const { data: steps, error } = await supabase.from('kp_steps').select('*').order('topic').order('display_order');
  if (error || !steps) { console.error('Failed to fetch steps:', error); process.exit(1); }

  console.log(`Found ${steps.length} kp_steps. Generating ${steps.length * 4} hints (4 tiers × ${steps.length} steps)...`);
  console.log('Estimated cost: ~$0.01–0.03 USD (DeepSeek)\n');

  let done = 0;
  for (const step of steps as KpStep[]) {
    for (let tier = 1; tier <= 4; tier++) {
      const [body_bm, body_en] = await Promise.all([
        generateHint(step, tier, 'bm'),
        generateHint(step, tier, 'en'),
      ]);

      const { error: upsertErr } = await supabase.from('hint_cache').upsert(
        { kp_step_id: step.id, hint_tier: tier, body_bm, body_en },
        { onConflict: 'kp_step_id,hint_tier' }
      );

      if (upsertErr) {
        console.error(`  ✗ step ${step.id} tier ${tier}:`, upsertErr.message);
      } else {
        done++;
        console.log(`  ✓ [${done}/${steps.length * 4}] ${step.topic} | ${step.step_description_en.slice(0, 50)}... | tier ${tier}`);
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\nDone. ${done} hints written to hint_cache.`);
}

main().catch(e => { console.error(e); process.exit(1); });
