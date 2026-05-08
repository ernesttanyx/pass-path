# src/components/practice/

UI components used exclusively in the student practice loop.
Rename this folder from `dashboard/` to `practice/` when building week 3.
Each file here is a focused, reusable piece — not a full page.

## Files to build here

### ScoreGauge.tsx (week 4)
The always-visible predicted SPM score indicator.
- Receives `score: number` (0–100) and `prevScore: number`.
- Renders as a circular gauge or animated number ticker.
- Animates the delta on change (CSS transition, no heavy animation library needed).
- Placed in the app shell so it's visible on every screen.
- Copy: never "you scored X" — use "dapat X markah lagi" or "X markah dalam poket".

### StepCard.tsx (week 3)
Renders a single kp_step as a fill-in-blank practice card.
- Receives `variant: StepVariant` and `lang: 'bm' | 'en'`.
- Parses `prompt_bm/en` to replace `{{blank}}` tokens with `<input>` fields.
- On submit, calls `PracticeContext.submitAnswer(input)`.
- Shows marks available in the corner (never shows the answer before submission).
- Mobile-first: large tap targets, numeric keyboard for numeric blanks.

### HintPanel.tsx (week 3)
Slides up (bottom sheet on mobile) when a student gets a wrong answer.
- Receives `hint: HintCache | null` and `tier: 1 | 2 | 3 | 4`.
- Renders the hint body in BM (EN toggle available).
- Never uses the word "salah" or "wrong". Tone: "almost," "cuba lagi," "nak clue lagi satu?"
- Tier 4: shows "Explain my mistake" button → calls `useExplainMistake` (live LLM, rate-limited).
- Shows remaining explain-calls for the day: "3 penjelasan lagi hari ni".

### RewardBurst.tsx (week 4)
Micro-animation shown on correct answer (~60% of the time).
- Receives `type: RewardType`.
- `streak_ping`: animated streak counter bump.
- `score_gauge_tick`: score gauge briefly highlights.
- `identity_statement`: full-bleed text overlay ("macam ni la orang dapat A fikir").
- `silent`: nothing — just the mark awarded shown quietly.
- All animations are CSS-only (no Framer Motion) to keep bundle lean.

### CikguPicksFeed.tsx (week 3)
Renders the "Cikgu Picks" task list for the day.
- Receives `queue: StepVariant[]` and `currentIndex: number`.
- Shows 3–5 task pills at the top; active one is highlighted.
- After `completedToday >= dailyCap`: show "Jumpa esok lah" end screen.
- End screen: score gauge, streak count, "bagitau kawan" share button.

### TopicBadge.tsx (week 3)
Tiny pill component for topic labelling.
- `<TopicBadge topic="Index Numbers" />` → teal pill.
- `<TopicBadge topic="Linear Programming" />` → indigo pill.

## Naming conventions
- Props types defined inline or imported from `src/types/index.ts`.
- No direct Supabase calls — all data comes through hooks and contexts.
- All copy must follow the tone constants in CLAUDE.md.
