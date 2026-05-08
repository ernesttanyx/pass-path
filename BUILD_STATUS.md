# Tacly — Build Status
*As of 2026-05-07*

---

## Phase 1 — DONE ✅
DB schema applied (migrations 001–004), seed data live: 23 kp_steps + 69 step_variants.

## Phase 2 — DONE ✅
- `src/lib/mathcheck.ts` — mathjs answer checker
- `src/contexts/AuthContext.tsx` — anon-first Supabase auth
- `src/pages/Onboarding.tsx` — first task loads immediately, redirects to /auth after 3 wins
- `src/components/practice/StepCard.tsx` — formula choice buttons (K1 style)
- `src/pages/Practice.tsx` — spaced-rep queue, attempt logging, mastery writes, score gauge

## Phase 3 — DONE ✅ (2026-05-04)
- `src/lib/mastery.ts` — SM-2 variant scoring + computePredictedScore
- Practice.tsx: fetches mastery, builds due+new queue, upserts mastery, updates score gauge
- Variable reward copy in StepCard (~60% on correct)
- Save-progress prompt: Onboarding→/auth after 3 wins, Practice done screen has button

## Phase 4 — DONE ✅ (2026-05-05)
- `src/pages/Teacher.tsx` — magic-link auth landing, class list
- `src/pages/teacher/ClassView.tsx` — mastery heatmap, student table, PDF generation
- `src/lib/pdf.ts` — client-side jsPDF worksheet (lazy-loaded)
- RLS policies: teachers can read student mastery/attempts/users/predicted_score

## Phase 5 — MOSTLY DONE ✅ (2026-05-05)
- `supabase/functions/explain-mistake/index.ts` — Haiku LLM, rate-limited 5/user/day — **DEPLOYED**
- `src/lib/cost-guard.ts` — daily token cap enforcement
- `scripts/generate-hints.ts` — batch hint script (uses DeepSeek, DEEPSEEK_API_KEY in .env.local) — **NOT YET RUN**
- LLM explain-mistake wired into StepCard: "Terangkan kenapa salah →" button after wrong answer

## Phase 7 — DONE (2026-05-07)
- `src/components/practice/QuestionGroupFlow.tsx` — **NEW**: groups queue items by full SPM question; walks through (a)(b)(c) sequentially with part-progress tabs
- `StepCard.tsx`: `hideQuestionReader` prop; unified scrollable layout (answer choices no longer stuck at bottom); text bumped to `text-base prose-base` with `prose-p:mb-4`
- `Practice.tsx`: groupedQueue (useMemo), groupIdx, sync mastery update (score ticks immediately for anon users too), score display rescaled to /25 with motivational context, Teruskan lagi bug fixed

## Remaining to-dos
| Item | Status |
|---|---|
| Set ANTHROPIC_API_KEY in Supabase secrets | ❌ `npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref nzmgbdzkixtzmpgtclfd` |
| Run batch hint generation | ❌ `npx tsx scripts/generate-hints.ts` |
| Seed `full_question_bm` + `part_guide_json` for remaining variants | ❌ Only step-1 variants have full question data |
| English translations (`prompt_en`, `step_description_en`) | ❌ Most DB rows null |
| Score gauge on Onboarding screen | ⚠️ Only on /practice |

## Bundle sizes (post-optimization, 2026-05-05)
| Chunk | Raw | Gzip | Load |
|---|---|---|---|
| index.js (initial) | 159KB | 52KB | Eager |
| vendor.js | 160KB | 52KB | Eager |
| supabase.js | 206KB | 53KB | Eager |
| StepCard.js | 164KB | 50KB | **Lazy** |
| mathjs.js | 643KB | 185KB | **Lazy** |
| jspdf.js | 357KB | 118KB | **Lazy** |
| html2canvas.js | 201KB | 48KB | **Lazy** |

Initial gzip load for landing page: ~52KB + 52KB + 53KB = ~157KB gzip ✅ (under 300KB constraint)

## StepCard behaviour
- Formula choice buttons (K1 style, not numeric N1)
- After wrong answer: shows "Tunjuk hint →" + "Terangkan kenapa salah →" (calls explain-mistake edge fn)
- After correct answer: variable reward identity statement ~60% of time
- Explain button hidden if user not logged in (userId undefined)
