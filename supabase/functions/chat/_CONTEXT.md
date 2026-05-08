# supabase/functions/explain-mistake/

RENAME this folder from `chat/` to `explain-mistake/` when building week 4.

Supabase Edge Function (Deno runtime) for the rate-limited live LLM call.
This is the ONLY place in v1 where LLM is called live during the student flow.
All other AI content (hints) is pre-cached.

Deploy: `supabase functions deploy explain-mistake`
Invoked by: `useExplainMistake` hook → POST `/functions/v1/explain-mistake`

## File: index.ts

### What it does
1. Validates the JWT — must be a valid Supabase user (anon or named).
2. Checks the user's `daily_token_usage` in the `users` table server-side.
   - If usage ≥ `DAILY_LLM_CAP` (5): return 429 with `{ cached: true, body: <tier4 hint> }`.
3. Fetches the `attempt` row by `attemptId` — verifies `user_id` matches JWT sub.
4. Fetches the corresponding `kp_step` and `step_variant` for context.
5. Calls **Claude Haiku** (`claude-haiku-4-5`) via Anthropic SDK with:
   - A tight system prompt (see below).
   - The student's wrong input + the correct answer spec.
6. Returns the explanation as a plain string (no streaming needed — short response).
7. Increments `users.daily_token_usage` and updates `last_token_reset` if needed.

### System prompt
```
You are a patient SPM Add Maths tutor. The student got a step wrong.
Explain in 2–3 sentences why their answer is incorrect and what they should do instead.
Rules:
- BM-first. Code-switch naturally (BM + some EN math terms is fine).
- Never say "wrong" or "incorrect" — say "almost" or "belum tepat".
- End with one specific, actionable hint, not the full answer.
- Max 60 words. No markdown.
```

### Environment variables (set in Supabase secrets — never in .env.local)
```
ANTHROPIC_API_KEY         — Claude Haiku key. v1 only. Sonnet forbidden.
SUPABASE_URL              — auto-injected
SUPABASE_SERVICE_ROLE_KEY — auto-injected, used to read/write users table
DAILY_LLM_CAP             — set to "5" (override in Supabase secrets if needed)
```

## Cost budget
- Haiku input: ~$0.25 / 1M tokens. Each call ~150 tokens in + ~60 tokens out.
- Worst case: 100 students × 5 calls/day × 30 days = 15,000 calls.
- Cost estimate: 15,000 × (150+60) / 1,000,000 × $0.25 ≈ **$0.79/month**. Well within RM200 cap.
