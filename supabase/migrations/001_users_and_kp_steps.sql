-- Migration 001: users profile + kp_steps content table
-- Apply: supabase db push
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE)

-- ── users ────────────────────────────────────────────────────────────────────
-- Extends auth.users with Tacly-specific profile data.
-- Keyed on auth.users.id — created automatically on first anonymous sign-in.

CREATE TABLE IF NOT EXISTS public.users (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_code         text NOT NULL DEFAULT '',
  anon_handle         text NOT NULL DEFAULT '',        -- e.g. "HarimauBiru42"
  consent_status      text NOT NULL DEFAULT 'pending'  -- 'pending' | 'granted' | 'declined'
                        CHECK (consent_status IN ('pending', 'granted', 'declined')),
  daily_token_usage   smallint NOT NULL DEFAULT 0,     -- LLM calls today
  last_token_reset    date NOT NULL DEFAULT CURRENT_DATE,
  trial_exam_score    smallint,                        -- teacher inputs once (0–100)
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- RLS: users can only read/update their own row
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users: update own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users: insert own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- service_role bypass is implicit (no policy blocks service_role)

-- ── kp_steps ─────────────────────────────────────────────────────────────────
-- One row per mark-earning step from the SPM marking scheme.
-- Populated by scripts/seed-kp-steps.ts from supabase/seed/kp_steps/*.json.
-- Read-only at runtime (service_role writes only).

CREATE TABLE IF NOT EXISTS public.kp_steps (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic               text NOT NULL                    -- 'Index Numbers' | 'Linear Programming' | 'Linear Law'
                        CHECK (topic IN ('Index Numbers', 'Linear Programming', 'Linear Law')),
  step_description_bm text NOT NULL,
  step_description_en text NOT NULL,
  mark_value          smallint NOT NULL CHECK (mark_value IN (1, 2)),
  frequency_score     smallint NOT NULL CHECK (frequency_score BETWEEN 1 AND 10),
  difficulty_1_to_5   smallint NOT NULL CHECK (difficulty_1_to_5 BETWEEN 1 AND 5),
  display_order       smallint NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (topic, display_order)
);

CREATE INDEX IF NOT EXISTS kp_steps_topic_idx ON public.kp_steps (topic);
CREATE INDEX IF NOT EXISTS kp_steps_difficulty_idx ON public.kp_steps (difficulty_1_to_5 DESC);

-- RLS: all authenticated users (including anon) can read; only service_role writes
ALTER TABLE public.kp_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kp_steps: read for all authed" ON public.kp_steps
  FOR SELECT USING (auth.role() IN ('authenticated', 'anon'));
