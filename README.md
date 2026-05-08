# Tacly — SPM Add Maths K/P Mark Harvester

Micro-practice PWA that helps Malaysian Form 5 students score on Index Numbers and Linear Programming by drilling the exact mark-earning steps (K-marks / P-marks) from official SPM marking schemes.

**Pilot:** 1 hub school (~30 students) + 2 spoke schools. 12-week timeline to SPM.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY + VITE_POSTHOG_KEY
npm run dev
```

## Key commands

| Command                        | What it does                                              |
|-------------------------------|-----------------------------------------------------------|
| `npm run dev`                  | Start local dev server (port 8080)                        |
| `npm run build`                | Production build (check bundle size stays <300KB initial) |
| `npm run test`                 | Run vitest unit tests                                     |
| `npm run lint`                 | ESLint                                                    |
| `npx ts-node scripts/batch-generate-hints.ts` | One-time: populate hint_cache from kp_steps |
| `npx ts-node scripts/seed-kp-steps.ts`        | One-time: seed kp_steps + step_variants tables |

## Supabase setup

```bash
supabase login
supabase db push          # applies migrations in supabase/migrations/ in order
supabase functions deploy explain-mistake
supabase functions deploy batch-generate-hints
supabase functions deploy generate-worksheet
```

Set secrets in Supabase dashboard → Project Settings → Edge Functions:
- `ANTHROPIC_API_KEY` — Claude Haiku key (v1 only, never Sonnet)

## Architecture decisions

- **mathjs in-browser** for all correctness checks. Zero LLM cost for grading.
- **Hints are pre-cached** — generated once in a batch job, served from `hint_cache` table forever.
- **Live LLM** only for `explain-mistake` (5 calls/user/day hard cap, enforced server-side).
- **Anonymous-first auth** — no forced login. Students identify with phone number or random anon handle.
- **BM-first** — all UI copy defaults to Bahasa Malaysia. English secondary.

## Content work (the actual product value — do this before touching code)

See `supabase/seed/kp_steps/` for harvest map templates. The K/P harvest maps — every mark-earning step from 2014–2024 SPM marking schemes, with frequency scores, difficulty scores, and 3–5 practice variants — are what make Tacly work. The app is just the delivery mechanism.

## Cost guard

Hard cap: RM200/month (LLM + hosting). Claude Haiku only. See `src/lib/cost-guard.ts` for the client-side cap logic and `supabase/functions/explain-mistake/` for the server-side enforcement.

## Project docs

Full architecture, data model, routes, tone guide, timeline, and risk register live in `CLAUDE.md`.
