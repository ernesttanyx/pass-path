// ── Tacly shared TypeScript interfaces ────────────────────────────────────────
// Import from here everywhere. Never redefine shapes locally.

// ── Topics ───────────────────────────────────────────────────────────────────

/** V1 scope only — do not add more until post-SPM pilot */
export type TaclyTopic = 'Index Numbers' | 'Linear Programming';

// ── Content tables (read-only at runtime) ────────────────────────────────────

export interface KpStep {
  id: string;
  topic: TaclyTopic;
  step_description_bm: string;
  step_description_en: string;
  mark_value: 1 | 2;
  frequency_score: number;       // 1–10: how often this step appears 2014–2024
  difficulty_1_to_5: number;     // how often students miss it
  display_order: number;
  created_at: string;
}

export interface StepVariant {
  id: string;
  kp_step_id: string;
  display_order: number;
  prompt_bm: string;
  prompt_en: string;
  full_question_bm?: string;
  full_question_en?: string;
  key_sentence_bm?: string;
  key_sentence_en?: string;
  part_guide_json?: PartGuide[];
  correct_answer_json: AnswerSpec;
  common_wrongs_json: CommonWrong[];
  created_at: string;
}

export interface PartGuide {
  part: string;
  action: 'do' | 'try' | 'skip';
  marks: number;
  reason_bm: string;
  reason_en: string;
}

export interface AnswerSpec {
  expression: string;            // mathjs-evaluable, e.g. "(130*3 + 115*2)/(3+2)"
  tolerance?: number;            // numeric tolerance, default 0.01
  unit?: string;                 // shown after input field, e.g. "%"
}

export interface CommonWrong {
  expression: string;            // wrong answer as mathjs expression
  marks_awarded: number;         // partial credit (0 in most cases)
  hint_key: string;              // pointer to hint body content
}

export interface HintCache {
  id: string;
  kp_step_id: string;
  hint_tier: 1 | 2 | 3 | 4;
  body_bm: string;
  body_en: string;
  created_at: string;
}

// ── User profile ──────────────────────────────────────────────────────────────

export interface PracticeUser {
  id: string;                              // matches auth.users.id
  school_code: string;
  anon_handle: string;                     // e.g. "HarimauBiru42"
  consent_status: 'pending' | 'granted' | 'declined';
  daily_token_usage: number;               // LLM calls today
  last_token_reset: string;               // ISO date string
  trial_exam_score?: number;              // 0–100, teacher inputs once
  created_at: string;
}

// ── Student activity ──────────────────────────────────────────────────────────

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

export interface Mastery {
  user_id: string;
  kp_step_id: string;
  score_0_to_1: number;                   // 0.000–1.000
  last_seen_at: string;
  next_due_at: string;                    // SM-2 next review date
}

export interface PredictedScore {
  user_id: string;
  score: number;                          // 0–100, approximates SPM marks
  updated_at: string;
}

// ── Client-only practice session state (not persisted) ────────────────────────

export interface PracticeSession {
  queue: StepVariant[];
  currentIndex: number;
  completedToday: number;
  sessionStartedAt: string;
}

export interface CheckResult {
  isCorrect: boolean;
  numericValue: number | null;
  marksAwarded: number;
  matchedWrong?: CommonWrong;
}

export type RewardType =
  | 'streak_ping'
  | 'score_gauge_tick'
  | 'identity_statement'
  | 'silent';

// ── Teacher types ─────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  school_code: string;
  created_at: string;
}

export interface TeacherClass {
  id: string;
  teacher_id: string;
  name: string;                           // e.g. "5 Sains 1"
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

export interface WorksheetData {
  className: string;
  date: string;
  steps: KpStep[];
  variants: StepVariant[];               // 2–3 variants per step
}
