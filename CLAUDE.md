# Tacly — Project Context for Claude

## What this project is
Tacly is a Malaysian SPM Add Maths micro-practice platform. The core promise: move the median Add Math grade in the hub class from F to passing (≥40 marks) by systematically training students to earn K-marks and P-marks.

The long-term product vision is a **staged mastery system** — a student progresses from isolated subquestion drills all the way to independently navigating a full SPM/state paper and scoring ≥25 marks. Every design decision at every tier must serve that end state.

12-week pilot. Hub school (~30 students) + 2 spoke schools (~30 each). Live by week 6.

---

## Tacly Stage System

Tacly has three progressive stages. Each stage has its own phases, and a threshold must be met before the next stage unlocks. **Thresholds are enforced by the app — never manually overridden.** Tacly never tells the student which stage they are on; they experience it as the app naturally feeling different.

### Stage 1 — Subquestion Mastery (current v1)
**What the student does:** Practice individual kp_steps in isolation. Cikgu Picks drives the session queue using SM-2 spaced repetition.

**Phases within Stage 1:**
- **Phase A (Learning):** MCQ answer format. All 4 hint tiers available. Cikgu Picks selects steps.
- **Phase B (Applying):** Calculator mode unlocks after ≥5 correct attempts on a step. Hints still available.
- **Phase C (Independent):** Student completes steps without reaching hint tier 3 or 4 consistently. Ready to advance.

**Unlock threshold for Stage 2:** ≥75% mastery score across ≥10 kp_steps within a single chapter, with a minimum 15 sessions completed. (Research basis: Bloom's mastery learning — 80% threshold before advancing; relaxed to 75% to account for low-end device latency and attrition risk in pilot.)

---

### Stage 2 — Chapter Pattern Recognition
**What the student does:** Questions from a chapter are presented **without the kp_step label**. The student must independently identify which formula/concept applies — including "back-engineering" type questions and questions where the context differs but the underlying formula is the same.

**Cikgu Picks at this stage:** Still selects which chapter to serve based on weakest mastery, but no longer labels the step. The student sees the question cold.

**Phases within Stage 2:**
- **Phase A (Identifying):** MCQ choices include the formula type. Student picks the approach, then answers.
- **Phase B (Executing):** Calculator mode only. No formula hints — student must recall.
- **Phase C (Pattern fluency):** Student correctly identifies and executes ≥4/5 questions in a chapter without hint usage.

**Unlock threshold for Stage 3:** ≥80% pattern recognition accuracy across all in-scope chapters (Index Numbers + Linear Programming in v1), over a minimum of 30 sessions.

---

### Stage 3 — Full Paper Strategy (top tier, unlock-everything)
**What the student does:** Each day, one randomized paper is assigned (SPM past year, state exam, or any official paper in the dataset). The student reads the full paper and decides independently:
- Which questions are easy and worth attempting
- Which questions are hard and should be skipped to preserve time

**Only after the student makes their selection** does the app show the answer input for each chosen question (MCQ if below Stage 3 threshold, calculator-based if at Stage 3).

**HARD RULE: Tacly has no rights to give recommendations on which questions to attempt or skip.** The student's judgment is the skill being trained. No highlighting, no difficulty badges, no nudges.

**Goal at this stage:** Student awards themselves ≥25 marks per paper session from their chosen questions. (25/180 marks is the minimum achievable from strategic K-mark harvesting on easy topics alone — Paper 1 = 80 marks MCQ, Paper 2 = 100 marks structured.)

**Phases within Stage 3:**
- **Phase A (Guided selection):** Student selects questions; after submission, Tacly shows which were high-value vs time-wasters (post-hoc, never pre-hoc).
- **Phase B (Independent):** No post-hoc feedback on selection. Student owns their choices fully.
- **Phase C (Timed):** Full paper under SPM time conditions.

---

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite. Deployed as PWA on Vercel free tier.
- **Styling:** Tailwind CSS + Shadcn/ui (components in src/components/ui/ — DO NOT edit manually)
- **Backend/DB:** Supabase free tier (PostgreSQL + Auth + Edge Functions)
- **Routing:** React Router v6
- **State:** TanStack React Query (server state) + React Context (auth, mastery, practice)
- **Math grading:** mathjs (in-browser, deterministic — zero LLM cost for correctness checks)
- **i18n:** LanguageContext (BM-first, EN secondary)
- **Analytics:** PostHog free tier
- **Deployment:** Vercel free tier

---

## Hard constraints — never violate
- LLM: **Claude Haiku only** in v1. Sonnet is forbidden until week-8 budget review.
- Budget: RM200/month hard cap (LLM + hosting combined).
- Devices: low-end Android, 3G. PWA. Sub-300KB initial JS bundle.
- Live LLM calls only for: (a) explaining a student's specific wrong answer, rate-limited to **5 calls / student / day**; (b) encouragement copy, cached per session bucket.
- Every hint is generated **once** in a batch job (week 3–4) and served from `hint_cache` forever. No live RAG. No live hint generation in the student-facing flow.
- Hard daily token cap per user enforced server-side in the Edge Function. If cap exceeded: serve generic cached response, log event, do NOT call LLM.

---

## V1 content scope — ruthless
- **Topic 1:** Index Numbers (composite index, weightage, chain-link, back-calculation) — Paper 2, ~10 marks. **14 kp_steps + 42 variants seeded. SPM 2021–2024 harvest complete.**
- **Topic 2:** Linear Programming (define vars, inequalities, graph, shade, optimise) — Paper 2, ~10 marks.
- **Topic 3:** Linear Law (reduce to Y=mX+c, read gradient/intercept from graph) — Paper 2, ~5 marks.
- No other topics until post-SPM if pilot succeeds.

### Resources required to support full AddMath paper (Stage 3 at scale)
Stage 3 requires the full AddMath curriculum. These are the resource gates before it is achievable:

| Resource | Current state | Required for Stage 3 |
|----------|--------------|----------------------|
| kp_steps | 14 (Index Numbers only) | ~200+ across all Add Math topics |
| Paper dataset | 0 ingested papers | ≥20 SPM + state papers per paper type |
| Paper ingestion pipeline | Not built | Structured parser: paper → questions → kp_step links |
| Chapter coverage | 3 topics | All Paper 1 + Paper 2 chapters (SPM syllabus) |
| `papers` DB table | Not in schema | `paper_year`, `paper_type`, `paper_source`, `paper_code` |
| `paper_questions` DB table | Not in schema | Links each question to its kp_steps and chapter |
| MCQ answer store (Paper 1) | Not built | 40-question MCQ grading for Paper 1 |

These are acknowledged constraints for v1. The architecture must be designed to support them from Day 1 even if the content is not yet seeded.

---

## Data model
| Table            | Purpose                                                                      |
|------------------|------------------------------------------------------------------------------|
| users            | school_code, anon_handle, consent_status, daily_token_usage, last_token_reset |
| kp_steps         | One mark-earning step per row. topic, step_description_bm/en, mark_value, frequency_score, difficulty_1_to_5 |
| step_variants    | 3–5 practice variants per kp_step. prompt_bm/en, correct_answer_json, common_wrongs_json |
| hint_cache       | Pre-generated hints. kp_step_id + hint_tier (1–4) + body_bm/en             |
| attempts         | Each student answer. user_id, step_variant_id, student_input, is_correct, marks_awarded, hint_tier_used, time_taken_ms |
| mastery          | SM-2 spaced-repetition state. user_id, kp_step_id, score_0_to_1, last_seen_at, next_due_at |
| predicted_score  | Denormalised score gauge. user_id, score (integer, floor), updated_at       |
| papers           | (future) paper_year, paper_type, paper_source, paper_code                   |
| paper_questions  | (future) Links paper questions to kp_steps and chapters                     |

---

## Application routes
| Path               | Component                       | Notes                                            |
|--------------------|---------------------------------|--------------------------------------------------|
| /                  | src/pages/Onboarding.tsx        | First task loads immediately — no login, no tutorial |
| /practice          | src/pages/Practice.tsx          | Core loop — Stage 1, Tacly-guided spaced-rep feed  |
| /dashboard         | src/pages/Dashboard.tsx         | Student dashboard — K-mark score, mastery cards  |
| /auth              | src/pages/Auth.tsx              | Anon-first: save progress with phone or handle   |
| /teacher           | src/pages/Teacher.tsx           | Teacher landing — magic-link auth                |
| /teacher/class/:id | src/pages/teacher/ClassView.tsx | Mastery heatmap + worksheet PDF generator        |

---

## Onboarding flow (60-second rule)
- Land on / → **immediately** see Index Numbers Step 1 (composite index formula) with tap-to-fill blanks.
- No login. No tutorial. No level select.
- After 3 micro-wins (~3 min) → "simpan progress?" prompt → phone number OR random anon handle.
- NEVER force email in v1.

---

## Core practice loop (Stage 1)
1. Open app → "Tacly picks" feed of 3–5 micro-tasks from SM-2 spaced-rep queue.
2. Tap task → one kp_step presented as fill-in-blank or guided input.
3. mathjs checks correctness deterministically → marks awarded shown immediately.
4. Wrong answer → cached hint at next tier (never "salah" or "X").
5. Correct answer → variable reward (streak ping / score gauge tick / identity statement) ~60% of the time.
6. After 3–5 tasks → deliberately stop mid-progress. "Jumpa esok lah."

### Tacly — the guiding assistant (replaces "Cikgu Picks")
The in-app guide is called **Tacly**. It selects what the student practises and gradually fades as the student grows. The brand and the mentor are the same thing — the student is literally outgrowing Tacly.

**Content priority rules:**
1. **SPM/state paper questions always take precedence** over variant questions in Tacly's queue.
2. **Variant questions (synthetic) may only appear in Tacly's feed** when all SPM/state paper questions for that kp_step have been used within the past 5 days. Variants are a fallback for content freshness — not the primary training material. This preserves SPM marking scheme authenticity.
3. At Stage 2, Tacly selects the chapter but removes step labels — student identifies the pattern themselves. At Stage 3, Tacly is retired entirely — papers are randomized, student selects independently. No recommendations, no nudges.
4. **"Mesti buat" steps across all chapters take precedence over "cuba" steps within any single chapter.** Tacly's SM-2 queue must ensure a student has been exposed to every in-scope chapter's "mesti buat" steps before "cuba" steps enter the rotation. "Mesti buat" steps carry a higher base `frequency_score` in the `kp_steps` table. A "cuba" step for a given chapter unlocks into the queue only once the student's mastery score for that chapter's "mesti buat" steps reaches ≥0.7 — not when the full chapter is "complete." This preserves interleaved practice (cross-chapter) while still gating stretch content behind demonstrated readiness.

---

## Hint ladder (4 tiers, all pre-cached, no live LLM)
- Tier 1: concept prompt ("apa formula composite index?")
- Tier 2: formula skeleton with blanks
- Tier 3: filled formula — student plugs values only
- Tier 4: full walk-through of a sample + near-identical task
Tier 4 → step auto-marked needs-review, surfaces again tomorrow.

---

## Predicted score (Skor Ramalan)

**Display rule: always integers. Never decimals. Floor, not round.**
SPM marks are always whole numbers. Showing decimals would imply false precision and train students to expect a marking system that does not exist in the real exam.

**Formula:** `floor(Σ(mastery.score_0_to_1 × step.mark_value) / totalPossibleMarks × 100)`

**Trust and authenticity rule:** Skor Ramalan is explicitly scoped to topics Tacly has trained. It must never be presented as a prediction of the student's full SPM score. Display language: "markah anggaran dari topik yang dah latih" — not "skor SPM kau." If students conflate Tacly's gauge with actual SPM performance, the trust collapse when real results arrive will be severe.

**Starting point:** Teacher inputs student's most recent trial-exam score once. Each mastered kp_step ticks it up.

**Scope:** In v1, Skor Ramalan reflects K-marks from Index Numbers + Linear Programming only (25 available marks out of full paper). As more chapters are seeded, the denominator expands.

**Updates:** Within 1 second of any correct attempt. Animates the gauge delta.

---

## Teacher dashboard (minimum viable, week 5)
- One page per class. Per-student row: predicted score, mastery heatmap, days active this week.
- "Print worksheet" button → PDF targeting class's weakest 3 kp_steps.
- Teacher auth: magic-link only (no password).

---

## Tone constants (apply to all copy and the few LLM prompts that exist)
- BM-first code-switch: "dah dapat 1 mark, gila bagus"
- Never "good job" / "well done" / "correct!" / "salah"
- Identity statements: "macam ni la orang dapat A fikir pasal Index"
- Failure framing: "almost," "tinggal 1 langkah je," "still worth 1 mark"

---

## Directory map (src/)
```
src/
├── components/
│   ├── ui/           Shadcn/ui primitives — DO NOT edit, regenerate via `npx shadcn add`
│   ├── practice/     StepCard.tsx, QuestionGroupFlow.tsx, TopicIntro.tsx, CalcKeypad.tsx, SpmQuestionCard.tsx
│   ├── teacher/      Teacher dashboard components
│   └── layout/       AppNavbar.tsx, ProtectedRoute.tsx, TeacherRoute.tsx
├── pages/
│   ├── Onboarding.tsx   Landing + first task (public)
│   ├── Practice.tsx     Core loop (public after anon handle)
│   ├── Dashboard.tsx    Student dashboard (dummy data — swap for live Supabase once mastery rows exist)
│   ├── Auth.tsx         Save-progress prompt (anon-first) — redirects to /dashboard on success
│   ├── AuthCallback.tsx OAuth callback — redirects to /dashboard
│   ├── Teacher.tsx      Teacher landing
│   └── teacher/         Teacher sub-pages (ClassView.tsx)
├── contexts/         AuthContext.tsx only — PracticeContext/MasteryContext/LanguageContext not yet built
├── hooks/            (stub files only — hooks not yet implemented)
├── lib/              supabase.ts, mathcheck.ts, mastery.ts, cost-guard.ts, pdf.ts
└── types/            index.ts (all shared TypeScript interfaces)
```

---

## Supabase functions
| Function              | Purpose                                                                   |
|-----------------------|---------------------------------------------------------------------------|
| explain-mistake       | Live LLM (Haiku). Rate-limited to 5/user/day. Explains a specific wrong answer. |
| batch-generate-hints  | Offline batch job. Run once in week 3-4. Populates hint_cache for all kp_steps. |
| generate-worksheet    | Server-side PDF for teacher "Print worksheet" button.                     |

---

## Environment variables
```
VITE_SUPABASE_URL         — Supabase project URL
VITE_SUPABASE_ANON_KEY    — Public anon key (safe for frontend)
VITE_POSTHOG_KEY          — PostHog project API key
```
Supabase Edge Functions use `ANTHROPIC_API_KEY` set in Supabase secrets — never in .env.local.

---

## Cost discipline
- Hints: pre-generated batch, served from DB. Never generated live.
- Live LLM: only `explain-mistake`, hard cap 5 calls/user/day.
- Daily token budget per user: enforced in `cost-guard.ts` + Edge Function middleware.
- Bust cap → serve `hint_cache` tier 4, log to `attempts.hint_tier_used = 'cap_exceeded'`.

---

## Risk register (review weekly)
| Risk                              | Mitigation                                                              |
|-----------------------------------|-------------------------------------------------------------------------|
| Hub teacher loses interest        | Weekly 15-min sync, personal relationship, show HOD-friendly wins      |
| LLM cost overrun                  | Hard daily token cap, batch pre-gen hints, Haiku-only                   |
| Pilot class doesn't improve       | KILL or pivot — do not push to SPM if trial signal is flat              |
| PDPA non-compliance               | Draft parental consent form by week 2, before any student signs up      |
| Scope creep                       | The answer is no. Linear Law and Stats come post-SPM only.              |
| Skor Ramalan trust collapse       | Always scope display language to trained topics only — never "SPM score" |
| Stage 3 content deficit           | Variants used as fallback only — log when fallback rate > 60% per user  |

---

## 12-week timeline reference
- **Week 1:** Lock teachers. Draft consent/PDPA. Begin Index Numbers K/P harvest map.
- **Week 2:** Finish Index Numbers harvest. Start LP harvest. Scaffold (auth, schema, PWA).
- **Week 3:** Finish LP harvest. Build step rendering + mathjs grader. Batch Index Numbers hints.
- **Week 4:** Attempt logging, mastery (SM-2), variable reward, score gauge. Batch LP hints.
- **Week 5:** Teacher dashboard, worksheet PDF, onboarding polish.
- **Week 6:** Hub launch. Watch first sessions in person.
- **Week 7:** Fix top-5 friction issues. Add topic 2 if topic 1 mastered. Prep spokes.
- **Week 8:** Spoke schools go live.
- **Week 9:** Trial exams — KILL/PROCEED checkpoint (hub median +5 marks → proceed).
- **Week 10:** Personalised drill feed from trial wrong-answer data.
- **Week 11:** Rehearsal mode — full past-year Paper 2, timed.
- **Week 12:** Once-daily 10-min confidence drill. Lock the product. No new features.

---

## Working rules for Claude (process)
- **Before implementing any feature request, explicitly list anything that is contradictory, ambiguous, or technically hard to do in the browser, and ask the user to resolve it first.** Do not start coding until those questions are answered. This applies even for small features — one unresolved ambiguity can invalidate the whole implementation.
- Ask targeted questions — list them numbered, explain *why* each matters, offer concrete options where possible.
- Do not add features, refactor, or introduce abstractions beyond what the task requires.
- Commit nothing unless the user explicitly asks.
- Always save substantive session work as a dated change log entry in `CHANGE_LOG_YYYY_MM_DD.md`.
- Update `CLAUDE.md` whenever a new rule, constraint, or product decision is made.
- **Skor Ramalan must always be a floor integer. Never display decimals.**
- **Variant questions may only appear in Cikgu Picks as a fallback when SPM/state paper questions are exhausted for the past 5 days.**
- **Tacly never recommends which questions to attempt or skip at Stage 3. Student judgment is the product.**
- **K-marks and P-marks are the scoring targets. N-marks are never a concern.**
- **"Mesti buat" cross-chapter breadth before "cuba" depth.** Never implement a chapter-completion gate that blocks the student from seeing other chapters' "mesti buat" steps. Interleaving is the architecture; chapter completion is not a milestone.

---

## Definition of done for v1 pilot
- 30+ students in hub class with ≥20 sessions over the pilot.
- Hub class trial-exam median moves up ≥5 marks vs prior trial.
- Cost stays under RM200/month for at least 2 of the 3 active months.
- Teacher reports app made their job easier (qualitative).
- Spoke schools have non-zero usage.
