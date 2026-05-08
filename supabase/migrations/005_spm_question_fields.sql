-- Migration 005: Add full SPM question + key sentence fields to step_variants
-- These fields power the two-phase question reader flow in StepCard.
-- Nullable so existing variants without full questions still work.

ALTER TABLE public.step_variants
  ADD COLUMN IF NOT EXISTS full_question_bm  text,
  ADD COLUMN IF NOT EXISTS full_question_en  text,
  ADD COLUMN IF NOT EXISTS key_sentence_bm   text,
  ADD COLUMN IF NOT EXISTS key_sentence_en   text;
