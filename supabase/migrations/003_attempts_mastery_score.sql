-- Migration 003: attempts + mastery + predicted_score
-- Apply after 002_variants_and_hints.sql

-- ── attempts ──────────────────────────────────────────────────────────────────
-- One row per student answer event. Written after every step submission.
-- hint_tier_used: NULL = no hint, 0 = answered immediately, 1–4 = hint tier shown,
--                 'cap_exceeded' = LLM cap was hit, served cached response.

CREATE TABLE IF NOT EXISTS public.attempts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  step_variant_id  uuid NOT NULL REFERENCES public.step_variants(id),
  student_input    text NOT NULL,
  is_correct       boolean NOT NULL,
  marks_awarded    smallint NOT NULL DEFAULT 0,
  hint_tier_used   text CHECK (
                     hint_tier_used IS NULL OR
                     hint_tier_used IN ('0','1','2','3','4','cap_exceeded')
                   ),
  time_taken_ms    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attempts_user_idx ON public.attempts (user_id);
CREATE INDEX IF NOT EXISTS attempts_variant_idx ON public.attempts (step_variant_id);
CREATE INDEX IF NOT EXISTS attempts_created_idx ON public.attempts (created_at DESC);

ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attempts: select own" ON public.attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "attempts: insert own" ON public.attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── mastery ───────────────────────────────────────────────────────────────────
-- SM-2 spaced-repetition state. One row per (user, kp_step).
-- Upserted after every attempt by the client (optimistic write).

CREATE TABLE IF NOT EXISTS public.mastery (
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kp_step_id    uuid NOT NULL REFERENCES public.kp_steps(id) ON DELETE CASCADE,
  score_0_to_1  numeric(4,3) NOT NULL DEFAULT 0 CHECK (score_0_to_1 BETWEEN 0 AND 1),
  last_seen_at  timestamptz NOT NULL DEFAULT now(),
  next_due_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kp_step_id)
);

CREATE INDEX IF NOT EXISTS mastery_user_due_idx ON public.mastery (user_id, next_due_at);

ALTER TABLE public.mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mastery: select own" ON public.mastery
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "mastery: upsert own" ON public.mastery
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── predicted_score ───────────────────────────────────────────────────────────
-- Denormalised score gauge. Updated after every correct attempt.
-- One row per user. Upserted client-side (optimistic).

CREATE TABLE IF NOT EXISTS public.predicted_score (
  user_id     uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  score       numeric(5,2) NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.predicted_score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "predicted_score: select own" ON public.predicted_score
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "predicted_score: upsert own" ON public.predicted_score
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
