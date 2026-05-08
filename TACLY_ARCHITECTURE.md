# Tacly Architecture — Backend Pipeline & Motivational Design

## Table of Contents
1. [Database Layer](#1-database-layer)
2. [TypeScript Type System](#2-typescript-type-system)
3. [Supabase Client](#3-supabase-client)
4. [In-Browser Math Grader](#4-in-browser-math-grader)
5. [Spaced Repetition Engine](#5-spaced-repetition-engine)
6. [Cost Guard](#6-cost-guard)
7. [React State Architecture](#7-react-state-architecture)
8. [TanStack React Query Hooks](#8-tanstack-react-query-hooks)
9. [Supabase Edge Functions](#9-supabase-edge-functions)
10. [Full Data Flow](#10-full-data-flow-student-tap--score-gauge-update)
11. [Developer Scripts](#11-developer-scripts)
12. [How Tacly Solves the Motivational Paradox](#12-how-tacly-solves-the-motivational-paradox)

---

## 1. Database Layer

**Stack:** Supabase PostgreSQL + Row Level Security (RLS)

Schema is built across 4 migrations, each unlocking a new capability tier:

| Migration | Tables Created | Purpose |
|-----------|---------------|---------|
| `001` | `users`, `kp_steps` | Student profiles + SPM mark-step content |
| `002` | `step_variants`, `hint_cache` | Practice questions + pre-baked hints |
| `003` | `attempts`, `mastery`, `predicted_score` | Student activity + SM-2 state + score gauge |
| `004` | `teachers`, `classes`, `class_members`, `class_mastery_view` | Teacher dashboard + class access |

**RLS** is enforced at the database level — Supabase's Postgres policy engine blocks any query where `auth.uid() ≠ user_id`. No student can read another student's mastery or attempts, even with the public anon key.

### Table Details

**`users`** — Extends `auth.users`. Fields: `school_code`, `anon_handle`, `consent_status`, `daily_token_usage`, `last_token_reset`, `trial_exam_score`.

**`kp_steps`** — Read-only content. One row per mark-earning SPM step. Fields: `topic` ('Index Numbers' | 'Linear Programming' | 'Linear Law'), `step_description_bm/en`, `mark_value` (1|2), `frequency_score` (1–10), `difficulty_1_to_5` (1–5), `display_order`. Currently seeded: **14 steps / 42 variants** (Index Numbers complete from SPM 2021–2024 harvest).

#### Index Numbers — IDX Pattern Reference (14 kp_steps)

| kp_step | IDX | Trigger pattern | Operation | mark_value | Difficulty |
|---------|-----|-----------------|-----------|------------|------------|
| 1 | IDX-01a | See P₀ and P₁ → asked for index | `(P₁/P₀)×100` | 1 | 2 |
| 2 | IDX-02a | See index I and P₀ → asked for P₁ | `(I/100)×P₀` | 1 | 3 |
| 3 | IDX-02b | See index I and P₁ → asked for P₀ | `(P₁/I)×100` | 1 | 4 |
| 4 | IDX-01b | See table of I and w columns → composite | `Σ(I×w)/Σw` | 2 | 3 |
| 5 | IDX-07a | Table with 1 missing weight w, Ī given | `(Ī×Σw_known − Σ(I×w)_known)/(I_missing−Ī)` | 2 | 4 |
| 6 | IDX-11a | Table with 1 missing index I, Ī given | `(Ī×Σw − Σ(I×w)_known)/w_missing` | 2 | 4 |
| 7 | IDX-08a | See I(A→B) and I(B→C) → asked for I(A→C) | `I₁×I₂/100` | 2 | 4 |
| 8 | IDX-08b | See Ī and P_old → asked for P_future | `(Ī/100)×P_old` | 1 | 2 |
| 9 | IDX-09 | "Price increased/decreased X%" → state index | `100±X` (no calculation) | 1 | 1 |
| 10 | IDX-06 | See index I and price diff D → find base price | `x = (100×D)/(I−100)` | 2 | 4 |
| 11 | IDX-11b | Ratio a:b:m:d given, all I known, Ī given | Cross-multiply, solve for integer m | 2 | 4 |
| 12 | IDX-10 | Ī(B/A), %↑ B→C, selling price − RM profit → base cost | Chain backward: `cost_C×100/chain_index` | 2 | 5 |
| 13 | IDX-07b | 2 unknown weightages p and q, Ī given | Express p in terms of q: `p = A − Bq` | 2 | 5 |
| 14 | IDX-12 | Other ingredients frozen, Ī for target year → find % increase of 1 ingredient | Solve for I_unknown, subtract 100 | 2 | 5 |

**`step_variants`** — 3–5 practice questions per kp_step. Fields: `prompt_bm/en`, `correct_answer_json` (JSONB: expression, tolerance, unit), `common_wrongs_json` (array: expression + marks_awarded).

**`hint_cache`** — Pre-generated hints for every kp_step × tier (1–4). Fields: `hint_tier`, `body_bm`, `body_en`. Populated once by the batch job, never regenerated live.

**`attempts`** — One row per student answer event. Fields: `user_id`, `step_variant_id`, `student_input`, `is_correct`, `marks_awarded`, `hint_tier_used` (null|0|1|2|3|4|'cap_exceeded'), `time_taken_ms`.

**`mastery`** — SM-2 spaced-repetition state. Composite key: `(user_id, kp_step_id)`. Fields: `score_0_to_1` (0.000–1.000), `last_seen_at`, `next_due_at`.

**`predicted_score`** — Denormalized score gauge. One row per user. Fields: `user_id` (PK), `score` (0–100), `updated_at`. Upserted client-side after every attempt.

**`teachers`**, **`classes`**, **`class_members`** — Teacher auth + class roster.

**`class_mastery_view`** — Postgres VIEW joining class_members → mastery → users → predicted_score. Allows teacher queries without RLS complexity.

---

## 2. TypeScript Type System

**File:** `src/types/index.ts`

Single source of truth for all shared interfaces. Every layer references the same types.

| Type | Description |
|------|-------------|
| `TaclyTopic` | `'Index Numbers' \| 'Linear Programming' \| 'Linear Law'` |
| `AnswerSpec` | `{ expression: string, tolerance?: number, unit?: string }` — mathjs-evaluable grading spec |
| `CommonWrong` | `{ expression, marks_awarded, hint_key }` — partial credit for known wrong answers |
| `CheckResult` | `{ isCorrect, numericValue, marksAwarded, matchedWrong? }` — output of mathjs grader |
| `Mastery` | `{ score_0_to_1, last_seen_at, next_due_at }` — SM-2 state per step |
| `PredictedScore` | `{ user_id, score (0–100), updated_at }` |
| `RewardType` | `'streak_ping' \| 'score_gauge_tick' \| 'identity_statement' \| 'silent'` |
| `PracticeSession` | Client-only: `{ queue, currentIndex, completedToday, sessionStartedAt }` |
| `StudentRow` | Teacher dashboard view: `{ user_id, anon_handle, predicted_score, mastery_by_step, days_active_this_week }` |

---

## 3. Supabase Client

**File:** `src/lib/supabase.ts`
**Package:** `@supabase/supabase-js v2`

```ts
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Singleton client. The anon key is safe to expose — RLS enforces per-user access. Auth state tracked via `supabase.auth.onAuthStateChange()`.

---

## 4. In-Browser Math Grader

**File:** `src/lib/mathcheck.ts`
**Package:** `mathjs v13`

```ts
checkAnswer(input: string, spec: AnswerSpec): CheckResult
```

**Steps:**
1. Parse student's raw text input as a mathjs expression
2. Evaluate numerically against `spec.expression` within `spec.tolerance` (default ±0.01)
3. Check input against `common_wrongs_json` for partial credit matches
4. Return `{ isCorrect, numericValue, marksAwarded, matchedWrong? }`

**Key property:** Zero network, zero latency, zero LLM cost. Correctness check is deterministic and runs entirely in-browser. Never throws — always returns a CheckResult.

---

## 5. Spaced Repetition Engine

**File:** `src/lib/mastery.ts`
**Algorithm:** Modified SM-2 (pure TypeScript, no external package)

### `updateMastery(current, isCorrect, timeTakenMs): Mastery`

- Correct + fast: `score_0_to_1 += (1 - current.score) × 0.1 × speedBonus`
- Incorrect: `score_0_to_1 = max(0, score - 0.15)`
- Recomputes `next_due_at` — the longer a step stays correct, the further out it's scheduled

### `computePredictedScore(masteryMap, allKpSteps): number`

```
score = Σ(mastery.score_0_to_1 × step.mark_value) / totalPossibleMarks × 100
```

Runs after every attempt. Result upserted to `predicted_score` table and animates the score gauge. Returns 0–100.

---

## 6. Cost Guard

**File:** `src/lib/cost-guard.ts`

```ts
canCallLLM(user: PracticeUser): boolean
recordLLMCall(userId: string): Promise<void>
```

Returns false if `daily_token_usage >= 5` and `last_token_reset` is today.

**Double-fence:** Enforced client-side (skip the network call entirely) AND server-side in the Edge Function (return 429 + cached response). Prevents token overrun even under client compromise.

---

## 7. React State Architecture

Three nested contexts wrap the app, each with a specific scope:

```
<AuthContext>           ← entire app — anonymous session, save-progress upgrade
  <MasteryContext>      ← practice + onboarding — SM-2 state, predicted score
    <PracticeContext>   ← practice page only — session queue, hint state, reward triggers
```

### AuthContext (`src/contexts/AuthContext.tsx`)

- On first visit: auto-creates an anonymous Supabase session. Student practises immediately, no sign-up.
- `saveProgress(handle)`: upgrades anonymous session to named one — the only auth prompt in v1.
- Invalidates React Query cache on auth state changes.
- Exposes: `{ user, supabaseUser, loading, saveProgress, signOut }`

### MasteryContext (`src/contexts/MasteryContext.tsx`)

- On mount: fetches all mastery rows for the current user.
- `updateAfterAttempt()`: runs SM-2 update locally (instant), fires background Supabase upsert for persistence.
- Exposes: `{ mastery: Record<kp_step_id, Mastery>, predictedScore, updateAfterAttempt }`

### PracticeContext (`src/contexts/PracticeContext.tsx`)

- `submitAnswer(input)`: synchronous mathjs check → immediate UI update → background DB write. Student never waits for a network round-trip.
- `requestHint()`: advances `hint_tier` locally, pulls from pre-cached `hint_cache`.
- `nextTask()`: advances session queue; enforces daily cap (3–5 tasks), then shows deliberate stop screen.
- Exposes: `{ session, currentVariant, submitAnswer, requestHint, nextTask, lastReward }`

---

## 8. TanStack React Query Hooks

**Package:** `@tanstack/react-query v5`

### `usePracticeQueue(userId)` — Tacly daily feed

1. Fetch mastery rows for user
2. Join with `kp_steps` + `step_variants` to find items where `next_due_at ≤ now`
3. If fewer than 3 items due, backfill with lowest-mastery steps
4. Sort: overdue days DESC, then difficulty DESC
5. Cache key: `userId + today's date` — invalidated after each attempt

### `useHints(kpStepId)`

Pre-fetches all 4 hint tiers on mount. Tiny payloads, instant access during the practice loop. Returns null on miss (fail-open).

### `useExplainMistake()`

Rate-limited LLM hook. Checks `remaining` from AuthContext before calling the Edge Function. Exposes `{ explain(attemptId), remaining }`.

### `useClassRoster(classId)` + `useWeakestSteps(classId, topN)`

Teacher dashboard queries via `class_mastery_view`. `useWeakestSteps` aggregates mastery across all class students and returns N steps with lowest mean score.

---

## 9. Supabase Edge Functions

**Runtime:** Deno
**Deploy:** `supabase functions deploy <name>`

### `explain-mistake` — Live LLM (Weeks 4+)

**Endpoint:** POST `/functions/v1/explain-mistake`
**Body:** `{ attemptId: string }`

1. Validate JWT
2. Server-side cap check: `daily_token_usage >= DAILY_LLM_CAP` → return 429 + tier-4 cached hint
3. Fetch attempt + kp_step context; verify `user_id` matches JWT sub
4. Call **Claude Haiku** (`claude-haiku-4-5`) via Anthropic SDK
   - Max 60 tokens out, BM-first, never says "wrong", ends with one actionable hint
5. Return explanation as plain string
6. Increment `daily_token_usage`, reset if new day

**Secrets:** `ANTHROPIC_API_KEY`, `DAILY_LLM_CAP=5`
**Cost ceiling:** 100 students × 5 calls/day × 30 days × ~210 tokens ≈ RM0.79/month

---

### `generate-worksheet` — Teacher PDF data (Week 5)

**Endpoint:** POST `/functions/v1/generate-worksheet`
**Body:** `{ classId: string, topN: 3 }`

1. Validate teacher JWT (check `teachers` table)
2. Server-side JOIN: `class_members → mastery → kp_steps` → compute mean mastery per step
3. Return weakest N steps + variants as JSON
4. Browser's `jsPDF` (`lib/pdf.ts`) renders actual PDF locally — no server rendering cost

**Cost:** Zero. Pure data aggregation, no LLM.

---

### `batch-generate-hints` — One-time batch job (Weeks 3–4)

Run once: `supabase functions invoke batch-generate-hints --no-verify-jwt`

- Loops every `kp_step × hint tier (1–4)`
- Calls Claude Haiku once per combination → writes to `hint_cache`
- After this runs, the entire student hint flow is zero-LLM-cost forever

**Cost:** 27 steps × 4 tiers × ~200 tokens ≈ RM0.03 one-time

---

## 10. Full Data Flow: Student Tap → Score Gauge Update

```
1. Student types answer
   └─ PracticeContext.submitAnswer(input)
          ↓
2. mathcheck.checkAnswer(input, spec)          [synchronous, in-browser, zero network]
   └─ mathjs: parse → evaluate → check common_wrongs
   └─ returns { isCorrect, marksAwarded, matchedWrong? }
          ↓
3. UI updates immediately                      [optimistic — no network wait]
   └─ correct:   show marks + reward animation
   └─ incorrect: show hint tier 1 from hint_cache
          ↓
4. Background: supabase.insertAttempt(...)     [fire-and-forget]
          ↓
5. MasteryContext.updateAfterAttempt()
   └─ mastery.ts SM-2: new score_0_to_1, new next_due_at
   └─ mastery.ts: computePredictedScore() → new 0–100 score
   └─ Local state updated immediately
          ↓
6. Background: supabase.upsertPredictedScore(...) [fire-and-forget]
          ↓
7. ScoreGauge animates delta
   └─ "dah dapat X markah dalam poket"
   └─ RewardBurst fires (streak_ping / identity_statement / silent — ~60% of correct answers)
          ↓
8. PracticeContext.nextTask()
   └─ completedToday >= dailyCap → "Jumpa esok lah" end screen
   └─ otherwise → next item from SM-2 queue

── Hint path (optional) ──────────────────────────────
   Incorrect answer → PracticeContext.requestHint()
   └─ Advance hint_tier locally (1 → 2 → 3 → 4)
   └─ Pull body_bm from hint_cache (pre-cached, instant)
   └─ Tier 4 + remaining > 0 → show "Explain my mistake" button
      └─ useExplainMistake() → POST /functions/v1/explain-mistake
         └─ Server cap check → Claude Haiku → increment daily_token_usage

── Teacher path ──────────────────────────────────────
   Teacher loads /teacher/class/:id
   └─ useClassRoster(classId) → class_mastery_view JOIN
   └─ useWeakestSteps(classId, 3) → aggregate mastery by step
   └─ "Print worksheet" → POST /functions/v1/generate-worksheet
      └─ Server returns weakest steps + variants
      └─ lib/pdf.generateWorksheetPdf() → browser downloads PDF
```

---

## 11. Developer Scripts

**Runtime:** `ts-node`
**Auth:** `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` — never the anon key
**Run:** `npx ts-node scripts/<file>.ts`

| Script | Purpose |
|--------|---------|
| `validate-kp-steps.ts` | Dry-run validator: mark ranges, mathjs expression validity, variant counts. Run before seeding. |
| `seed-kp-steps.ts` | Bulk upsert `kp_steps` + `step_variants` from JSON harvest files. Idempotent — safe to re-run. |
| `generate-anon-handles.ts` | Generates 200 BM/EN handles (e.g. "GilaBabi77") for anonymous students. |
| `export-class-csv.ts` | Export class predicted scores + mastery to CSV for HOD/Excel. Args: `--classId --outputFile`. |

**Package:** `zod v3` used in `validate-kp-steps.ts` for runtime schema validation.

---

## 12. How Tacly Solves the Motivational Paradox

The motivational paradox in exam prep: **students who most need practice are least likely to do it**, because every session confirms their belief that they are bad at the subject. A red X, a "salah," a score of 12/40 — all reinforce the identity "I cannot do Add Maths." Tacly is designed at every layer to invert that loop.

---

### Partial Credit Over Binary Right/Wrong (`CommonWrong` + `marks_awarded`)

The `common_wrongs_json` field on every `step_variant` stores known wrong answers with `marks_awarded > 0`. A student who writes the wrong composite index but sets up the formula correctly still gets 1 mark. The UI shows "dapat 1 mark" — not "wrong."

This is structurally identical to how SPM examiners actually award K-marks and P-marks. It teaches accurate self-assessment while preserving the student's sense of progress.

---

### Zero-Friction Entry (Anonymous-First + 60-Second Rule)

The first thing a student sees on `/` is a real exam question — not a login form or level selector. Supabase anonymous sessions mean they are already "in" with no commitment. The hardest part of any behaviour is starting; Tacly removes all barriers before that first step.

---

### Variable Reward Schedule (`RewardType`)

`RewardType` fires on only ~60% of correct answers, not every one. Intermittent reinforcement (the same mechanism as social media likes and Duolingo streaks) produces more durable behaviour than 100% reinforcement. The system knows when to be silent.

---

### Identity Statements Over Praise

"macam ni la orang dapat A fikir pasal Index" is categorically different from "good job."

Praise is external and contingent. Identity statements shift the student's internal self-model. A student who internalises "I think like an A student" will seek out more practice — the behaviour becomes self-reinforcing rather than dependent on external validation.

---

### Deliberate Stopping (`Jumpa esok lah`)

After 3–5 tasks, Tacly ends the session mid-progress. This is counter-intuitive but deliberate.

The **Zeigarnik effect** — humans remember and are motivated by unfinished tasks more than completed ones — means stopping before completion keeps the student thinking about Add Maths between sessions. "I almost got the LP optimisation" is a more motivating state than "I finished today's set."

---

### Predicted Score Gauge (Visible on Every Screen)

`predicted_score` updates within 1 second of a correct answer. Every micro-win has an immediate, tangible consequence on the student's projected exam score.

This converts abstract effort ("I'm studying") into concrete progress ("I'm now worth 34 marks instead of 33"). That concreteness matters enormously for students who have historically scored 12/40 — for the first time, they can see themselves moving toward passing, one step at a time.

---

### Failure Framing ("almost," "tinggal 1 langkah je")

The hint ladder never says "salah" or shows an X. Tier 1 is a concept prompt. Tier 4 is a full walkthrough. The tone constants — "almost," "tinggal 1 langkah je," "still worth 1 mark" — reframe every wrong answer as proximity to correct rather than distance from it.

This preserves the student's sense of competence (critical for continued engagement) while still encoding accurate information about what they need to fix.

---

### The SM-2 Queue Is Motivationally Calibrated

`usePracticeQueue` sorts by overdue days DESC, difficulty DESC. Students are always working near their frontier — hard enough to feel meaningful, not so hard they give up.

Backfilling with lowest-mastery steps ensures they're reinforcing weak spots. The spaced-repetition schedule means they revisit steps just before forgetting them, producing the strongest long-term retention signal. The student experiences this as **Tacly** — they don't see the algorithm, they just feel like the app knows what they need.

Critically, Tacly fades as the student advances through the stage system. At Stage 1 it selects specific kp_steps. At Stage 2 it selects chapters without labeling the step. At Stage 3 it disappears — the student navigates a real paper alone. The product name and the mentor are the same entity. Outgrowing Tacly is the goal.

---

### Summary

| Design Decision | Motivational Mechanism |
|----------------|----------------------|
| `CommonWrong` partial credit | Every attempt earns something — no pure-fail state |
| Anonymous-first auth | Zero barrier to first task |
| Variable `RewardType` (~60%) | Intermittent reinforcement — more durable than 100% |
| Identity statements | Internal self-model shift, not external praise |
| Deliberate stop (`Jumpa esok lah`) | Zeigarnik effect — motivation persists between sessions |
| Live score gauge | Converts effort into visible, numeric progress |
| Hint ladder framing | Failure = proximity, not distance |
| SM-2 queue calibration | Always at the student's frontier — challenge without overwhelm |
| Tacly fades by stage | Mentor and product name are the same — outgrowing Tacly is the win condition |

The core thesis: a failing student needs to feel like they are *becoming* someone who passes. Every architectural decision — from `marks_awarded > 0` in the DB schema to identity statements in the tone constants — is in service of that single belief shift.
