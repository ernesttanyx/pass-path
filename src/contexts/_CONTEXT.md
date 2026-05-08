# src/contexts/

React Context providers for cross-cutting app state.
Existing: `LanguageContext.tsx` (BM/EN i18n — do not modify the interface, only extend translations).

## Files to build here (in order of week)

### AuthContext.tsx (week 2)
Wraps the whole app in App.tsx, inside `<QueryClientProvider>`.
- Subscribes to `supabase.auth.onAuthStateChange` on mount.
- **Anonymous-first**: on first visit, creates an anonymous Supabase session automatically.
  Student does NOT need to sign up to practise. Auth is only for saving progress.
- Exposes:
  ```ts
  {
    user: PracticeUser | null,
    supabaseUser: SupabaseUser | null,
    loading: boolean,
    saveProgress: (handleOrPhone: string) => Promise<void>,
    signOut: () => void,
  }
  ```
- `saveProgress` upgrades an anon session to a named one (phone number or anon handle).
- On state change → `queryClient.invalidateQueries()` so fresh data loads.

### MasteryContext.tsx (week 4)
Scoped to the student flow (wrap Practice and Onboarding, not Teacher pages).
- Holds the in-memory mastery state and predicted score.
- Exposes:
  ```ts
  {
    mastery: Record<string, Mastery>,        // kp_step_id → Mastery
    predictedScore: number,
    updateAfterAttempt: (attempt: Attempt, step: KpStep) => void,
    // ^ runs SM-2 update + denormalised predicted_score write (via lib/mastery.ts)
  }
  ```
- On mount, fetches mastery rows for current user from Supabase.
- `updateAfterAttempt` is called synchronously from the practice loop after every answer;
  it writes to Supabase in the background but updates local state immediately for
  the score gauge to feel instant.

### PracticeContext.tsx (week 3–4)
Scoped to `<Practice>` page. Manages the session queue and UI reward state.
- Exposes:
  ```ts
  {
    session: PracticeSession,
    currentVariant: StepVariant | null,
    submitAnswer: (input: string) => AnswerResult,
    // ^ calls mathjs check (lib/mathcheck.ts), logs attempt, updates mastery
    requestHint: () => HintCache | null,
    // ^ advances hint_tier, returns pre-cached hint from DB
    nextTask: () => void,
    // ^ moves to next item; if completedToday >= dailyCap → "Jumpa esok lah" screen
    lastReward: RewardType | null,
  }
  ```
- `submitAnswer` is synchronous for the correctness check (mathjs, zero network).
  Supabase writes happen in background via fire-and-forget after the UI updates.
- Daily cap: 3–5 tasks then stops. Enforced here, not server-side.
