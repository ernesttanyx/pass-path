-- Migration 006: Add part_guide_json to step_variants
-- This column was referenced in code (types/index.ts, Practice.tsx, QuestionGroupFlow.tsx)
-- but was omitted from migration 005. Nullable so existing rows are unaffected.
-- Shape: [{ part: string, action: 'do'|'try'|'skip', marks: number, reason_bm: string, reason_en: string }]

ALTER TABLE public.step_variants
  ADD COLUMN IF NOT EXISTS part_guide_json jsonb;
