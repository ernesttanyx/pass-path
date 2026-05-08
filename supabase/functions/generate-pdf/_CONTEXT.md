# supabase/functions/generate-worksheet/

RENAME this folder from `generate-pdf/` to `generate-worksheet/` when building week 5.

Supabase Edge Function for server-side teacher worksheet PDF generation.
Client-side jsPDF (lib/pdf.ts) handles most PDF work — this Edge Function is only
needed if the worksheet requires data aggregation too heavy for the browser
(e.g. pulling mastery data for 30+ students server-side before rendering).

Deploy: `supabase functions deploy generate-worksheet`
Invoked by: `WorksheetButton.tsx` → POST `/functions/v1/generate-worksheet`

## File: index.ts

### What it does
1. Validates JWT — must be a teacher account (checks `teachers` table for JWT sub).
2. Receives `{ classId, topN: 3 }`.
3. Aggregates mastery data across all students in the class (server-side JOIN — faster
   than doing it in the browser for 30+ students).
4. Identifies the N kp_steps with the lowest mean mastery score.
5. Fetches 2–3 step_variants per weakest step.
6. Returns JSON: `{ steps: KpStep[], variants: StepVariant[] }` — the browser's jsPDF
   renders the actual PDF from this payload.

NOTE: If latency becomes an issue, this function can be replaced by a Postgres function
(RPC call) that does the aggregation and returns the same JSON shape.

### Environment variables
```
SUPABASE_URL              — auto-injected
SUPABASE_SERVICE_ROLE_KEY — auto-injected (needed to read all students' mastery rows)
```

No LLM calls. No token cost. Pure data aggregation.

## batch-generate-hints/ (separate function)
ALSO to be created here as `supabase/functions/batch-generate-hints/`.
This is the ONE-TIME batch job (run in week 3–4, not during student flow) that
populates `hint_cache` for every kp_step × 4 tiers.

### What it does
1. Fetches all `kp_steps` from Supabase.
2. For each step × each tier (1–4): checks if hint already exists in `hint_cache`.
3. If not: calls Claude Haiku with the step description to generate the hint.
4. Writes BM and EN versions to `hint_cache`.
5. Logs: steps processed, hints generated, tokens used, estimated cost.

Run command: `supabase functions invoke batch-generate-hints --no-verify-jwt`

Cost estimate: ~15 kp_steps (Index Numbers) + ~12 kp_steps (LP) = 27 steps × 4 tiers
= 108 Haiku calls × ~200 tokens each ≈ 21,600 tokens ≈ **RM0.03 one-time**. Negligible.
