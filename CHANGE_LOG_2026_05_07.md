# Tacly — Change Log
**Date:** 2026-05-07  
**Session:** Multi-part SPM question flow + layout fixes + score gauge + product decisions (Ernest + Claude)

---

## Session 2 — Product decisions (2026-05-07)

### Decision 1 — Start page: no preamble, straight to question
Main route `/` redirects immediately to the first Index Numbers question. No motivational copy, no "you can still pass SPM" text, no tutorial. Action precedes motivation (Fogg Behavior Model); verbal persuasion is the weakest self-efficacy lever for already-failing students (Bandura 1977). The product IS the pitch.

A pitch/landing page for teachers and HODs lives at a subpage (e.g. `/about`). Students never need to see it. Precedent: Wordle's main URL was the game, not a description of it.

### Decision 2 — "Mesti buat" sequencing: cross-chapter breadth before "cuba" depth
Tacly's SM-2 queue must prioritise "mesti buat" (must-do) steps across ALL in-scope chapters before "cuba" (stretch) steps for any single chapter enter rotation.

**Why:** A student who knows the first step of 5 topics scores more SPM marks than a student who fully masters 1 topic. Rohrer & Taylor (2007) confirms interleaved practice produces significantly better long-term retention than blocked (chapter-complete-then-move-on) practice.

**Implementation rule added to CLAUDE.md:** "Mesti buat" steps carry a higher base `frequency_score`. A "cuba" step unlocks into the queue when the student's mastery on that chapter's "mesti buat" steps reaches ≥0.7 — not when the chapter is "complete." No chapter-completion gate that blocks cross-chapter exposure.

---

## Summary

Three major features/fixes shipped this session:
1. **Multi-part question flow** — Cikgu Picks now walks through (a)(b)(c) of a real SPM question sequentially, not just one isolated sub-part
2. **Layout fixes** — answer scrolls instead of being stuck below fold; "Teruskan lagi" fixed
3. **Score gauge** — now ticks immediately on every answer (anon users too); rescaled to /25 with motivational context; text bumped to readable size

---

## Change 1 — Multi-Part SPM Question Flow

**Problem:** `SpmQuestionCard` showed the full question with (a)(b)(c) parts, but clicking "Jawab" took the student to answer only ONE sub-part. Felt broken — why show the full question if you only answer one bit?

**New flow:** Questions that share the same `full_question_bm` are grouped. The full question stays visible at the top (collapsible). Part tabs `(a) → (b) → (c)` tick off as each part is answered. After each part, auto-advances to the next with the usual 1.2s/2.5s delay. When all parts done, advances to next question group.

### New file: `src/components/practice/QuestionGroupFlow.tsx`
- Props: `group` (array of `{step, variant, hints}`), `lang`, `correctCount`, `userId`, `onPartResult`, `onGroupDone`, `onBack`
- Shows full question at top (collapsible, forest green header)
- Part progress tabs (only shown if group has >1 part)
- Renders `StepCard` for each part with `hideQuestionReader` prop (question already visible above)
- Handles timing: correct → 1.2s → next part; wrong → 2.5s → next part

### Modified: `src/components/practice/StepCard.tsx`
- Added `hideQuestionReader?: boolean` prop — when true, skips the `SpmQuestionCard` reader phase entirely (question shown in group wrapper above)
- Initial phase state: `hasFullQuestion && !hideQuestionReader ? 'question-reader' : 'answer'`

### Modified: `src/pages/Practice.tsx`
- `groupedQueue` (useMemo): groups flat queue items by `full_question_bm`. Solo items (no full question) are their own single-item group. Parts within a group are sorted by `part_guide_json[action='do'].part` label (a < b < c).
- `currentIdx` → `groupIdx` state
- `handleResult` → split into:
  - `handlePartResult(result, hintTierUsed, step, variant)` — writes mastery + score, no timeout/advancement
  - `handleGroupDone()` — advances groupIdx or sets done
- Sidebar queue list now shows groups, with part label suffix e.g. `(a) (b)` if multi-part
- Progress counter and bar use `groupIdx / groupedQueue.length`
- `QuestionGroupFlow` replaces direct `StepCard` in main content area

---

## Change 2 — Layout Fixes

### 2a — Answer choices scrollable (not crammed at bottom)
**Problem:** `StepCard` had a fixed-height sticky bottom section for answer choices. On small screens this ate half the screen, leaving almost no room for the question.

**Fix:** Merged the two zones (scrollable question + sticky choices) into one unified `flex-1 overflow-y-auto` section. Everything — question, hint, choices, feedback — scrolls together. A thin `border-t` divider visually separates question from choices without locking them to the bottom.

**File:** `src/components/practice/StepCard.tsx`

### 2b — "Teruskan lagi" button broken
**Problem:** "Keep going" on the done screen called `setCurrentIdx(0)` — a stale reference from before `currentIdx` was renamed to `groupIdx` earlier this session. Caused a crash/no-op.

**Fix:** Both the desktop and mobile "Teruskan lagi" buttons updated to `setGroupIdx(0)`.

**File:** `src/pages/Practice.tsx` (two occurrences)

---

## Change 3 — Score Gauge Fixes + Rescale

### 3a — Score gauge not updating (root cause fixed)
**Root cause:** `writeMastery` was async — it awaited the Supabase DB upsert before updating local `masteryRows` state. For anon users (`user === null`), the function returned immediately without ever touching state. The gauge never moved for anyone who hadn't logged in.

**Fix:** Deleted `writeMastery` entirely. `handlePartResult` now:
1. Computes the updated mastery row synchronously using current `masteryRows` snapshot
2. Calls `setMasteryRows(newRows)` + `setPredictedScore(computePredictedScore(newRows, allSteps))` in the same tick
3. Fires `supabase.from('mastery').upsert(...)` in the background (no await) only if `user` is logged in

Score gauge now ticks on every answered question regardless of login state.

**File:** `src/pages/Practice.tsx`

### 3b — Score rescaled to /25 with motivational context
**Change:** `predictedScore` (0–100 internal) is now displayed as `(predictedScore × 0.25) / 25` everywhere. The 25 = approximate total marks Tacly covers across Index Numbers + Linear Programming + Linear Law.

- Sidebar gauge label: "Marks yang boleh dicapai", subtitle "25 marks = cukup untuk lulus"
- Done screen gauge: same /25 display + message: *"Nak lulus Add Maths, 25 marks dah lebih dari cukup. Tacly akan ajar kau macam mana nak curi 25 marks tu — soalan yang sama je keluar tiap tahun."*

**File:** `src/pages/Practice.tsx`

### 3c — Text size bumped, paragraph spacing added
**Change:** Question and full-question text bumped from `text-sm prose-sm` → `text-base prose-base`. Added `prose-p:mb-4 prose-p:mt-0` so paragraphs have clear vertical breathing room (not letter spacing). Pattern cue header: `text-sm` → `text-base`. Feedback and hint text bumped to match.

**Files:** `src/components/practice/StepCard.tsx`, `src/components/practice/QuestionGroupFlow.tsx`

---

## Files Changed This Session

| File | Change |
|------|--------|
| `src/components/practice/QuestionGroupFlow.tsx` | **NEW** — multi-part question flow wrapper |
| `src/components/practice/StepCard.tsx` | `hideQuestionReader` prop; unified scrollable layout; larger text; bigger feedback |
| `src/pages/Practice.tsx` | groupedQueue; groupIdx; handlePartResult (sync mastery); handleGroupDone; score /25 display; Teruskan lagi fix; larger prose |
| `src/components/practice/QuestionGroupFlow.tsx` | Larger text + prose-p:mb-4 for paragraph spacing |

---

## Known Issues / Pending

| Item | Status |
|------|--------|
| Set `ANTHROPIC_API_KEY` in Supabase secrets | ❌ `npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref nzmgbdzkixtzmpgtclfd` |
| Run batch hint generation | ❌ `npx tsx scripts/generate-hints.ts` |
| Seed `full_question_bm` + `part_guide_json` for remaining variants (kp_step != 10000001) | ❌ Only step-1 variants have full question data; other steps show StepCard directly with no context |
| English translations for `prompt_en`, `step_description_en` | ❌ Most rows null — EN toggle falls back to BM |
| Score gauge on Onboarding screen | ⚠️ Only on /practice |
| `common_wrongs_json` values for V1/V2/V3 | ⚠️ May not match exact SPM values |

---
---

# Session 2 — 2026-05-07 (later)
**Work:** Goal screen animation · MCQ/Calculator answer mode · SPM-aligned mark flow · Student dashboard

---

## Process rule added this session

> **Before implementing any feature, list contradictions and ambiguities, ask the user to resolve them before writing code.**

Rationale: several multi-step feature requests in this session had blocking ambiguities (25/180 denominator, "confidence score" threshold, K vs N mark distinction, calculator variable scope). Resolving them upfront prevented wasted rewrites. Rule now in `CLAUDE.md § Working rules for Claude`.

---

## Change 4 — Goal screen + TopicIntro rework

**Problem:** Students landed straight on Index Numbers questions with no context on why they were doing it. No sense of what the finish line looks like.

**New slide 0 in `TopicIntro`:** Animated count-up (0→40) over 1.4s showing the lulus target. Score bar fills to 40%. Three icon cards: ⚡ 2 topics / ⏱ 5 min/day / 🎯 score goes up live. Font sizes bumped throughout (buttons: `text-lg font-black`, headers: `text-2xl font-black`, body: `text-base`).

**Animations added to `src/index.css`:**
- `animate-fade-up` / `animate-fade-up-d1..d4` — staggered entrance at 0.1s intervals
- `animate-score-bar` — bar fills after 0.8s delay
- `animate-pop-in` — spring-scale entrance

**`useCountUp` hook** (inside TopicIntro): uses `requestAnimationFrame` with expo ease-out, fires only when `slide === 0`.

**File:** `src/components/practice/TopicIntro.tsx` — full rewrite (4 slides, was 3)

---

## Change 5 — MCQ / Calculator answer mode + SPM mark flow

### 5a — Wrong answer no longer locks the card or reveals the correct answer

Previously: wrong answer → all choices locked, correct choice shown in green. Students could not retry.

Now:
- Wrong answer flashes red for 0.9s, then resets — student can retry immediately
- Correct answer is **never** highlighted on wrong attempts
- `onResult` (logging) is called on every attempt; `onProceed` (navigation) is called only when correct or after reveal

### 5b — Auto-hint progression

Hint tier increments automatically with each wrong answer (wrong 1 → tier 1, wrong 2 → tier 2 … up to tier 4). No manual "tunjuk hint" click needed.

### 5c — Tunjuk jawapan

After 3 wrong attempts or hint tier 4, a "Tunjuk jawapan" link appears. Pressing it:
1. Shows the correct formula rendered via `FormulaDisplay`
2. 5-second countdown (student must read)
3. "Soalan seterusnya" button unlocks — calling `onProceed()`
4. Logs as a wrong attempt (mastery interval resets to 1 day, score unchanged)

### 5d — Calculator mode (gated)

`masteryCount > 5` (kp_steps with `score_0_to_1 > 0.3`) unlocks the on-screen calculator keypad instead of MCQ.

**`src/components/practice/CalcKeypad.tsx` (new):**
- Rows: `[7,8,9,÷] [4,5,6,×] [1,2,3,−] [0,.,DEL,+] [(,),C,=]`
- Expression display div (not an input — keyboard cannot interact)
- Requires at least one operator before accepting submission (bare numbers rejected with BM message)
- Calls `onSubmit(normalizedExpr, numericValue)`

Revert condition: 5 consecutive wrong answers in calc mode → force MCQ for that card instance.

### 5e — Skor ramalan: K-marks only, target 25/180

- All existing `kp_steps` treated as K-mark steps (Option B — no DB schema change needed)
- `computePredictedScore` unchanged; display = `predictedScore × 0.25 / 25`
- 25 = approximate K-marks available from Index Numbers + Linear Programming
- 180 = total SPM Add Maths marks (P1: 80, P2: 100); 25/180 ≈ lulus threshold from easy topics
- Mastery DB upsert now only fires on **correct** answers (not every wrong attempt)

### Files changed

| File | Change |
|------|--------|
| `src/components/practice/CalcKeypad.tsx` | **NEW** — on-screen calculator keypad |
| `src/components/practice/StepCard.tsx` | Full rewrite — retry flow, auto-hints, tunjuk jawapan, calc/MCQ mode gate, `masteryCount` + `onProceed` props |
| `src/components/practice/QuestionGroupFlow.tsx` | Add `masteryCount` prop; replace setTimeout navigation with `onProceed` callback; `lastResult` ref for part outcome tracking |
| `src/pages/Practice.tsx` | Pass `masteryCount`; mastery/score update on correct only; dashboard link in sidebar |
| `src/pages/Onboarding.tsx` | `useRef` import; `pendingAuth` ref; split `handleResult` / `handleProceed`; `masteryCount=0` |

---

## Change 6 — Student dashboard (`/dashboard`)

**New page:** `src/pages/Dashboard.tsx`

Sections:
1. **Sticky nav** — tacly wordmark, anon handle badge, sign-out button
2. **Hero score card** (dark green) — animated K-mark score X/25, progress bar, streak 🔥, total correct, steps mastered
3. **Weekly activity strip** — 7-day grid, checkmark on active days
4. **Topic mastery cards** × 2 — Index Numbers (6/14) and Linear Programming (2/9), step-dot grid (green = mastered)
5. **Contextual tip** — message adapts to student's Index Numbers progress
6. **Sticky "Teruskan Latihan →" CTA** at bottom

All values hardcoded as dummy data for testing. Replace with live Supabase queries once real mastery rows accumulate.

**Auth redirects updated:**
- `Auth.tsx` `saveHandle()` → `/dashboard` (was `/practice`)
- `AuthCallback.tsx` → `/dashboard` (was `/practice`)
- `App.tsx` — `/dashboard` route added, `Dashboard` lazy-loaded
- `Practice.tsx` — "Dashboard kau" link added to desktop sidebar (only shown when logged in)

---

## Decisions / constraints logged this session

| Decision | Rationale |
|----------|-----------|
| K marks only in skor ramalan | N marks auto-awarded when K is correct; no value in tracking separately until post-pilot |
| All kp_steps treated as K-mark steps | No DB schema change needed for v1; revisit if specific steps are found to be N-only |
| Calculator mode gate: masteryCount > 5 | Arbitrary but safe — student has enough exposure before being asked to build expressions |
| Revert to MCQ after 5 consecutive wrong in calc | Prevents students getting stuck in a mode they can't use yet |
| No explanations for correct/wrong answers (v1) | Scope cut; focus on hint ladder instead |
| Linear Law not started | Sequence: fully grasp Index Numbers → Linear Programming → Linear Law |

---

## Known Issues / Pending (updated)

| Item | Status |
|------|--------|
| Dashboard dummy data → real Supabase queries | ❌ Hardcoded — swap when real mastery rows exist |
| `hint_cache` rows need seeding | ❌ Auto-hints show fallback (step description) if no cached hints |
| Set `ANTHROPIC_API_KEY` in Supabase secrets | ❌ |
| Run batch hint generation | ❌ `npx tsx scripts/generate-hints.ts` |
| Seed `full_question_bm` + `part_guide_json` for remaining variants | ❌ |
| English translations for `prompt_en` | ❌ Falls back to BM |
| Calculator variable buttons (P₀, P₁, I, w) | ⚠️ Deferred — digits+operators sufficient for v1 K-mark detection |

---
---

# Session 3 — 2026-05-07 (later)
**Work:** Bug fixes + polish — score gauge, scroll layout, 2nd question bug, emoji removal, real dashboard data, dotted background

---

## Change 7 — Score gauge now ticks immediately

**Root cause:** `computePredictedScore` returned a 0–100 percentage. Display was `Math.floor(pct * 0.25)`. With GROWTH=0.35, one correct answer gave a score of 0.35 on a step worth 1 mark across 14 total possible marks → percentage ≈ 2.5 → floor(2.5 * 0.25) = 0. Score never visibly moved.

**Fix:** `computePredictedScore` now returns 0–25 K-marks directly. A step counts as its full `mark_value` once `score_0_to_1 > 0.3` (first correct answer). Capped at 25. All bar widths updated from `predictedScore / 100` to `predictedScore / 25`. Score display now uses `{predictedScore}` directly (already a floor integer).

**File:** `src/lib/mastery.ts`, `src/pages/Practice.tsx`

---

## Change 8 — 2nd question not loading after sign-in (fixed)

**Root cause:** `useEffect(() => { loadQueue(); }, [user])` re-triggered whenever the auth object reference changed (e.g. Supabase token refresh mid-session). This reset `queue` while `groupIdx` was already > 0, causing `groupedQueue[groupIdx]` to be undefined → blank screen.

**Fix:** Changed dependency to `[user?.id]` — `loadQueue()` only re-runs on actual login/logout (user ID change), not reference changes.

**File:** `src/pages/Practice.tsx`

---

## Change 9 — "Cikgu Picks" renamed to "Tacly"

**Reason:** CLAUDE.md already defined Tacly as the in-app guide name. "Cikgu Picks" was a stale label.

**File:** `src/pages/Practice.tsx` sidebar header

---

## Change 10 — Scrollable practice layout (navbar no longer blocks answers)

**Problem:** `h-screen overflow-hidden` on the practice page root meant content below the fold (especially long questions with tables) was invisible and unreachable.

**Fix:**
- Practice outer wrapper: `h-screen overflow-hidden` → `min-h-screen lg:h-screen lg:overflow-hidden` (mobile scrolls, desktop stays viewport-locked)
- Main content area: `overflow-hidden` → `overflow-y-auto` on mobile
- `StepCard` outer: dropped `h-[calc(100vh-160px)] min-h-[500px]` → `min-h-[400px] lg:h-full`

**Files:** `src/pages/Practice.tsx`, `src/components/practice/StepCard.tsx`

---

## Change 11 — All emojis removed, replaced with Lucide icons

**Files changed:**
- `src/components/practice/TopicIntro.tsx`:
  - ⚡ → `<Zap size={22} />`
  - ⏱ → `<Timer size={22} />`
  - 🎯 → `<Target size={22} />`
  - ▲▼ text chevrons → `<ChevronUp />` / `<ChevronDown />`

---

## Change 12 — Dashboard wired to real Supabase data

**Replaced all dummy values with live queries:**
- `users` table → `anon_handle`
- `kp_steps` → topic grouping (Index Numbers, Linear Programming)
- `mastery` → per-step mastery scores, predicted K-marks
- `attempts` → total correct count, weekly activity (Sun–Sat), streak (consecutive days)

**Computed values:**
- `predictedKMarks` = `computePredictedScore(mastery, allSteps)` (0–25 integer)
- `streak` = consecutive days with ≥1 attempt ending today
- `weekActivity[7]` = which days of current Sun–Sat week had attempts
- Topic mastery cards now show real step dots from DB

**Added:** TrendingUp insight card (only shown if totalCorrect > 0)

**File:** `src/pages/Dashboard.tsx`

---

## Change 13 — Dotted grid background

Added `.dot-bg` CSS utility class:
```css
.dot-bg {
  background-color: #FFF8EC;
  background-image: radial-gradient(circle, rgba(220,204,172,0.7) 1.2px, transparent 1.2px);
  background-size: 22px 22px;
}
```
Applied to: Practice, Dashboard, Onboarding, Practice done screen.

**Files:** `src/index.css`, `src/pages/Practice.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Onboarding.tsx`

---

## Calculator unlock condition (carried from Session 2)

Calculator mode gate was changed from global `masteryCount > 5` (total steps mastered) to **per-step** `stepMasteryScore > 0.85`. This required:
- `StepCard` prop: `masteryCount` → `stepMasteryScore: number`
- `QuestionGroupFlow` prop: `masteryCount` → `masteryRows: Mastery[]`, computes `score_0_to_1` for the current step on each render
- `Practice.tsx` passes `masteryRows={masteryRows}` directly

---

## Files Changed This Session

| File | Change |
|------|--------|
| `src/lib/mastery.ts` | `computePredictedScore` returns 0–25 marks (was 0–100 percentage); threshold-based counting |
| `src/components/practice/StepCard.tsx` | `masteryCount` → `stepMasteryScore`; removed fixed mobile height |
| `src/components/practice/QuestionGroupFlow.tsx` | `masteryCount` → `masteryRows: Mastery[]`; per-step score computed inline |
| `src/components/practice/TopicIntro.tsx` | Emojis replaced with Lucide icons |
| `src/pages/Practice.tsx` | useEffect dep fix; "Tacly" rename; score display 0–25; layout scroll fix; dot-bg |
| `src/pages/Dashboard.tsx` | Full rewrite — real Supabase data, no dummy values |
| `src/pages/Onboarding.tsx` | `masteryCount={0}` → `stepMasteryScore={0}`; dot-bg |
| `src/index.css` | `.dot-bg` utility class added |

---

## Known Issues / Pending (updated Session 3)

| Item | Status |
|------|--------|
| `hint_cache` rows need seeding | ❌ Auto-hints show fallback (step description) if no cached hints |
| Set `ANTHROPIC_API_KEY` in Supabase secrets | ❌ |
| Run batch hint generation | ❌ `npx tsx scripts/generate-hints.ts` |
| Seed `full_question_bm` + `part_guide_json` for remaining variants | ❌ Only step-1 variants have full question data |
| English translations for `prompt_en` | ❌ Falls back to BM |
| Calculator variable buttons (P₀, P₁, I, w) | ⚠️ Deferred — digits+operators sufficient for v1 |
| Linear Programming kp_steps not seeded | ❌ Dashboard LP card shows 0/0 until seeded |
