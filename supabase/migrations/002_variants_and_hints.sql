-- Migration 002: step_variants + hint_cache
-- Apply after 001_users_and_kp_steps.sql

-- ── step_variants ─────────────────────────────────────────────────────────────
-- 3–5 practice questions per kp_step. Populated by seed script.
-- correct_answer_json and common_wrongs_json are checked client-side by mathjs.

CREATE TABLE IF NOT EXISTS public.step_variants (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kp_step_id            uuid NOT NULL REFERENCES public.kp_steps(id) ON DELETE CASCADE,
  display_order         smallint NOT NULL,
  prompt_bm             text NOT NULL,
  prompt_en             text NOT NULL,
  correct_answer_json   jsonb NOT NULL,
  -- shape: { expression: string, tolerance?: number, unit?: string }
  common_wrongs_json    jsonb NOT NULL DEFAULT '[]',
  -- shape: [{ expression: string, marks_awarded: number, hint_key: string }]
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kp_step_id, display_order)
);

CREATE INDEX IF NOT EXISTS step_variants_kp_step_idx ON public.step_variants (kp_step_id);

ALTER TABLE public.step_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "step_variants: read for all authed" ON public.step_variants
  FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));

-- ── hint_cache ────────────────────────────────────────────────────────────────
-- Pre-generated hints for every kp_step × tier combination.
-- Populated ONCE by the batch-generate-hints Edge Function (week 3–4).
-- Never generated at runtime — served directly from this table.

CREATE TABLE IF NOT EXISTS public.hint_cache (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kp_step_id  uuid NOT NULL REFERENCES public.kp_steps(id) ON DELETE CASCADE,
  hint_tier   smallint NOT NULL CHECK (hint_tier BETWEEN 1 AND 4),
  body_bm     text NOT NULL,
  body_en     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kp_step_id, hint_tier)
);

CREATE INDEX IF NOT EXISTS hint_cache_kp_step_idx ON public.hint_cache (kp_step_id);

ALTER TABLE public.hint_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hint_cache: read for all authed" ON public.hint_cache
  FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
