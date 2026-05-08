/**
 * seed-kp-steps.ts
 * Reads the two topic seed files and upserts into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-kp-steps.ts
 *
 * Requires VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (service role key bypasses RLS — never expose to the browser)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Supabase client (service role, server-side only) ─────────────────────────

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    '❌  Missing env vars. Add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ── Load seed files ───────────────────────────────────────────────────────────

const SEED_FILES = [
  resolve(__dirname, '../supabase/seed/kp_steps/index_numbers.json'),
  resolve(__dirname, '../supabase/seed/kp_steps/linear_programming.json'),
];

interface SeedFile {
  kp_steps: object[];
  step_variants: object[];
}

function loadSeed(filePath: string): SeedFile {
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as SeedFile;
}

// ── Upsert helpers ────────────────────────────────────────────────────────────

async function upsertSteps(steps: object[]) {
  const { error } = await supabase
    .from('kp_steps')
    .upsert(steps, { onConflict: 'id' });
  if (error) throw error;
}

async function upsertVariants(variants: object[]) {
  const { error } = await supabase
    .from('step_variants')
    .upsert(variants, { onConflict: 'id' });
  if (error) throw error;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  let totalSteps = 0;
  let totalVariants = 0;

  for (const filePath of SEED_FILES) {
    console.log(`\n📂  Processing ${filePath.split('/').pop()} ...`);

    const seed = loadSeed(filePath);

    console.log(`   Upserting ${seed.kp_steps.length} kp_steps ...`);
    await upsertSteps(seed.kp_steps);
    totalSteps += seed.kp_steps.length;

    console.log(`   Upserting ${seed.step_variants.length} step_variants ...`);
    await upsertVariants(seed.step_variants);
    totalVariants += seed.step_variants.length;
  }

  console.log(`\n✅  Done. ${totalSteps} steps + ${totalVariants} variants seeded.`);
}

main().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
