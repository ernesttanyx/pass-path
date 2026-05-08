# src/lib/

Low-level utility modules. No React here — pure functions and client instances only.
Existing: `supabase.ts` (Supabase client), `auth.ts` (auth helpers), `utils.ts` (cn helper).

## Files to build here

### mathcheck.ts (week 3)
In-browser correctness checker using mathjs. Zero LLM cost.

```ts
checkAnswer(input: string, spec: AnswerSpec): CheckResult
```
- Parses `input` as a mathjs expression and evaluates it.
- Compares against `spec.expression` within `spec.tolerance` (default 0.01).
- Returns:
  ```ts
  {
    isCorrect: boolean,
    numericValue: number | null,
    marksAwarded: number,
    matchedWrong?: CommonWrong,   // if input matches a common wrong answer
  }
  ```
- Handles: fractions, percentages, bare numbers, simple expressions.
- If input cannot be parsed → isCorrect: false, marksAwarded: 0.
- Never throws — always returns a CheckResult.

### mastery.ts (week 4)
SM-2 spaced-repetition algorithm. Pure functions, no side effects.

```ts
updateMastery(current: Mastery, isCorrect: boolean, timeTakenMs: number): Mastery
```
- Increases `score_0_to_1` on correct (scaled by speed bonus).
- Decreases `score_0_to_1` on incorrect (floor: 0).
- Computes `next_due_at` using a modified SM-2 interval.

```ts
computePredictedScore(masteryMap: Record<string, Mastery>, steps: KpStep[]): number
```
- score = Σ(mastery.score_0_to_1 × step.mark_value) / totalPossibleMarks × 100.
- Returns 0–100. Called after every attempt to update the score gauge.

### cost-guard.ts (week 3)
Client-side guard for the daily token cap. Mirrors server-side enforcement.

```ts
canCallLLM(user: PracticeUser): boolean
```
- Returns false if `user.daily_token_usage >= DAILY_TOKEN_LIMIT` (const: 5).
- Returns false if `user.last_token_reset` is today and limit is already hit.
- Called by `useExplainMistake` before making the Edge Function request.

```ts
recordLLMCall(userId: string): Promise<void>
```
- Increments `daily_token_usage` in Supabase `users` table.
- Resets counter if `last_token_reset` is a prior day.

### pdf.ts (week 5)
Client-side worksheet PDF generator using jsPDF.

```ts
generateWorksheetPdf(data: WorksheetData): void
```
- Builds and downloads a PDF targeting the class's weakest kp_steps.
- `WorksheetData: { className, date, steps: KpStep[], variants: StepVariant[] }`

Document structure:
- Page 1 — Header: "Tacly Worksheet", class name, date, topic.
- Page N — One kp_step per section: step description in BM + EN, blank working space,
  marks available. 2–3 variants per step. No answer key on the student copy.
- Separate answer key pages (teacher copy flag).

### analytics.ts (week 2)
Thin PostHog wrapper. Tree-shakeable — import only what you use.

```ts
track(event: string, props?: Record<string, unknown>): void
capturePageView(path: string): void
```
- Initialises PostHog on first call using `VITE_POSTHOG_KEY`.
- No-ops gracefully in dev if key is missing.
- Events to track: `practice_started`, `answer_submitted`, `hint_requested`,
  `session_ended`, `score_gauge_updated`, `explain_mistake_requested`.
