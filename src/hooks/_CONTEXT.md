# src/hooks/

Custom React hooks. Existing: `use-toast.ts`, `use-mobile.tsx` — do not modify.

## Files to build here

### useAuth.ts (week 2)
Thin convenience hook over AuthContext.
```ts
const { user, loading, saveProgress, signOut } = useAuth();
```
Throws an error if called outside `<AuthProvider>` — dev safety check.

### useMastery.ts (week 4)
Thin convenience hook over MasteryContext.
```ts
const { mastery, predictedScore, updateAfterAttempt } = useMastery();
```

### usePracticeQueue.ts (week 3)
TanStack React Query hook that builds the "Cikgu Picks" daily queue.

`usePracticeQueue(userId: string)`
- Fetches mastery rows for the user from Supabase (`mastery` table).
- Joins with `kp_steps` and `step_variants` to find items due today (next_due_at ≤ now).
- If fewer than 3 items are due, backfills with lowest-mastery-score steps.
- Returns `StepVariant[]` sorted by: (1) overdue days desc, (2) difficulty desc.
- Cache key includes userId + today's date string — invalidated after each attempt.

### useHints.ts (week 3)
Fetches the next hint tier for a given kp_step from the pre-cached `hint_cache` table.

`useHints(kpStepId: string)`
- Returns `{ getHint: (tier: 1|2|3|4) => HintCache | null }`.
- Pre-fetches all 4 tiers for the current step on mount (tiny payloads, warm cache).
- Returns null if hint not found (fail-open: show generic encouragement copy instead).

### useTeacher.ts (week 5)
Data hooks for the teacher dashboard.

`useClassRoster(classId: string)`
- Fetches all students in the class with their predicted_score and mastery_by_step map.
- Returns `StudentRow[]` sorted by predicted_score asc (weakest first).

`useWeakestSteps(classId: string, topN = 3)`
- Aggregates mastery_by_step across all class students.
- Returns the N kp_steps with the lowest mean mastery score.
- Used by "Print worksheet" to know what to target.

### useExplainMistake.ts (week 4)
Calls the `explain-mistake` Edge Function (rate-limited live LLM call).

`useExplainMistake()`
- Returns `{ explain: (attemptId: string) => Promise<string>, remaining: number }`.
- `remaining` = 5 − daily_token_usage (read from AuthContext user profile).
- If remaining === 0: returns cached generic explanation, does NOT call API.
- On success: increments daily_token_usage in Supabase + updates local AuthContext.
