# Tacly — Change Log
**Date:** 2026-05-08
**Session:** Blocker debug — pre-launch fixes (Ernest + Claude)

---

## Summary

Four pre-launch blockers diagnosed and resolved (code fixes). Two require Ernest to run commands. One is deferred content work.

---

## Blocker 1 — Wrong API key name in all status docs (corrected)

**Finding:** `explain-mistake` Edge Function and `generate-hints.ts` script both use **DeepSeek**, not Anthropic/Claude Haiku. The env var they read is `DEEPSEEK_API_KEY`. Every prior status doc and BUILD_STATUS.md incorrectly listed `ANTHROPIC_API_KEY` as the missing secret. There is no Anthropic API key anywhere in the codebase.

**Resolution:** No code change needed. Ernest needs to push the existing `.env.local` key to Supabase secrets:
```
npx supabase secrets set DEEPSEEK_API_KEY=REDACTED --project-ref nzmgbdzkixtzmpgtclfd
```

---

## Blocker 2 — `seed-kp-steps.ts` dotenv loading bug (fixed)

**Finding:** `seed-kp-steps.ts` used `import 'dotenv/config'` which loads `.env` by default. All env vars (`VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) live in `.env.local`. Script would fail silently with missing env var error on any fresh run.

**Fix:** Changed dotenv import to explicitly target `.env.local`, matching the pattern already used in `generate-hints.ts`.

**File:** `scripts/seed-kp-steps.ts`

```ts
// before
import 'dotenv/config';

// after
import { config } from 'dotenv';
config({ path: '.env.local' });
```

---

## Blocker 3 — `tsx` not installed (fixed)

**Finding:** `tsx` was not in `package.json` devDependencies and not present in `node_modules/.bin/`. Both seed and hint scripts require it (`npx tsx scripts/...`). `npx tsx` downloads it on demand but is unreliable without a pinned version.

**Fix:** Added `tsx@^4.19.4` to devDependencies in `package.json`.

Ernest needs to run: `npm install`

---

## Blocker 4 — `part_guide_json` column missing from DB schema (fixed)

**Finding:** Migration 005 added `full_question_bm`, `full_question_en`, `key_sentence_bm`, `key_sentence_en` — but never added `part_guide_json`, which is referenced in:
- `src/types/index.ts` (`StepVariant.part_guide_json?: PartGuide[]`)
- `src/pages/Practice.tsx` (sorting parts a/b/c within a group)
- `src/components/practice/QuestionGroupFlow.tsx`
- `src/components/practice/SpmQuestionCard.tsx`

Column silently missing from DB — all code uses `?.` and `?? []` so no crash, but part-label sorting and display is broken for any variant that would have this data.

**Fix:** New migration `006_part_guide_json.sql` created:
```sql
ALTER TABLE public.step_variants
  ADD COLUMN IF NOT EXISTS part_guide_json jsonb;
```

Ernest needs to run: `npx supabase db push --project-ref nzmgbdzkixtzmpgtclfd`

---

## LP seed status (clarified)

BUILD_STATUS.md Phase 1 claimed "23 kp_steps + 69 step_variants seeded" — this count (14 Index Numbers + 9 LP = 23) implies LP was seeded in Phase 1. However, the pending list also said "LP card shows 0/0 until seeded." Dashboard showing 0/0 is explained by zero mastery rows for LP steps — not missing kp_steps.

Running `npx tsx scripts/seed-kp-steps.ts` is safe regardless (upsert — idempotent). Confirms LP is present and re-seeds with any updated variant data.

---

## Deferred — `full_question_bm` + `part_guide_json` content

**Not a launch blocker.** App degrades gracefully: variants without `full_question_bm` show `prompt_bm` directly; `part_guide_json` null means parts aren't labelled a/b/c. Students can practice.

**What's needed (content, not code):** Real SPM exam question text for steps 2–14 (Index Numbers) and all 9 LP steps. When ready, a seeding script can be built to upsert from JSON.

**Target:** Week 3–4 alongside batch hint run.

---

## Files Changed This Session

| File | Change |
|------|--------|
| `scripts/seed-kp-steps.ts` | Fixed dotenv loading: `import 'dotenv/config'` → `config({ path: '.env.local' })` |
| `package.json` | Added `tsx@^4.19.4` to devDependencies |
| `supabase/migrations/006_part_guide_json.sql` | **NEW** — adds missing `part_guide_json jsonb` column to `step_variants` |

---

## Commands Ernest Needs to Run (in order)

```bash
# 1. Install tsx
npm install

# 2. Push DeepSeek key to Supabase Edge Function secrets
npx supabase secrets set DEEPSEEK_API_KEY=REDACTED --project-ref nzmgbdzkixtzmpgtclfd

# 3. Apply migration 006 (part_guide_json column)
npx supabase db push --project-ref nzmgbdzkixtzmpgtclfd

# 4. Seed kp_steps + variants (idempotent — safe to re-run)
npx tsx scripts/seed-kp-steps.ts

# 5. Generate all hints (23 steps × 4 tiers × 2 langs = 184 DeepSeek calls, ~2–3 min, <$0.05)
npx tsx scripts/generate-hints.ts
```

---

## Updated Blocking Status

| Blocker | Status |
|---------|--------|
| DeepSeek key not in Supabase secrets | ⏳ Needs Ernest to run `supabase secrets set` |
| `tsx` not installed | ⏳ Needs Ernest to run `npm install` |
| `seed-kp-steps.ts` dotenv bug | ✅ Fixed |
| `part_guide_json` column missing | ✅ Migration written — needs `db push` |
| Hints not generated | ⏳ Needs Ernest to run `generate-hints.ts` after step 2 |
| LP seed unconfirmed | ⏳ Needs Ernest to run `seed-kp-steps.ts` to confirm |
| `full_question_bm` content | 🔵 Deferred — not a launch blocker |
