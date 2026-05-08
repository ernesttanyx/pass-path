# src/types/

All shared TypeScript interfaces and enums for Tacly.
Single entry point: **`src/types/index.ts`** — import from there everywhere, never redefine shapes locally.

## index.ts — complete type surface

### V1 topics (do not expand until post-SPM)
```ts
export type TaclyTopic = 'Index Numbers' | 'Linear Programming';
```

### KpStep — one mark-earning step from the SPM marking scheme
```ts
export interface KpStep {
  id: string;
  topic: TaclyTopic;
  step_description_bm: string;   // BM-first
  step_description_en: string;
  mark_value: number;            // 1 or 2
  frequency_score: number;       // 1–10: how often this step appears 2014–2024
  difficulty_1_to_5: number;     // how often students miss it (from harvest map)
  display_order: number;         // ordering within topic
  created_at: string;
}
```

### StepVariant — one practice question targeting a kp_step
```ts
export interface StepVariant {
  id: string;
  kp_step_id: string;
  prompt_bm: string;             // fill-in-blank prompt, BM
  prompt_en: string;
  correct_answer_json: AnswerSpec;
  common_wrongs_json: CommonWrong[];
  created_at: string;
}

export interface AnswerSpec {
  expression: string;            // mathjs-evaluable, e.g. "(130/120)*100"
  tolerance?: number;            // numeric tolerance, default 0.01
  unit?: string;                 // shown after input field, e.g. "%"
}

export interface CommonWrong {
  expression: string;            // wrong answer — mathjs expression
  marks_awarded: number;         // partial credit still earned
  hint_key: string;              // pointer to why wrong (used in hint body)
}
```

### HintCache — pre-generated hint, served forever from DB (no live LLM)
```ts
export interface HintCache {
  id: string;
  kp_step_id: string;
  hint_tier: 1 | 2 | 3 | 4;
  body_bm: string;
  body_en: string;
  created_at: string;
}
```

### Attempt — one student answer event
```ts
export interface Attempt {
  id: string;
  user_id: string;
  step_variant_id: string;
  student_input: string;
  is_correct: boolean;
  marks_awarded: number;
  hint_tier_used: 0 | 1 | 2 | 3 | 4 | 'cap_exceeded' | null;
  time_taken_ms: number;
  created_at: string;
}
```

### Mastery — SM-2 spaced-repetition state per user per kp_step
```ts
export interface Mastery {
  user_id: string;
  kp_step_id: string;
  score_0_to_1: number;
  last_seen_at: string;
  next_due_at: string;           // SM-2 computed next review date
}
```

### PredictedScore
```ts
export interface PredictedScore {
  user_id: string;
  score: number;                 // 0–100 maps to approximate SPM marks
  updated_at: string;
}
```

### PracticeUser
```ts
export interface PracticeUser {
  id: string;
  school_code: string;
  anon_handle: string;           // e.g. "HarimauBiru42"
  consent_status: 'pending' | 'granted' | 'declined';
  daily_token_usage: number;
  last_token_reset: string;
  trial_exam_score?: number;     // teacher inputs once at class setup
  created_at: string;
}
```

### Client-only practice session state (not persisted to DB)
```ts
export interface PracticeSession {
  queue: StepVariant[];
  currentIndex: number;
  completedToday: number;
  sessionStartedAt: string;
}

export type RewardType =
  | 'streak_ping'
  | 'score_gauge_tick'
  | 'identity_statement'
  | 'silent';
```

### Teacher types
```ts
export interface TeacherClass {
  id: string;
  teacher_id: string;
  name: string;                  // e.g. "5 Sains 1"
  school_code: string;
  trial_exam_date?: string;
  created_at: string;
}

export interface StudentRow {
  user_id: string;
  anon_handle: string;
  predicted_score: number;
  mastery_by_step: Record<string, number>; // kp_step_id → score_0_to_1
  days_active_this_week: number;
}
```
