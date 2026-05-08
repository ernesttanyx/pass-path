# Tacly — Decisions & Learning Log

Format: Date | Event | Consequence

---

## 2026-05-02 | Discussion: Teaching philosophy and content scope alignment

**What happened:**
Discussed how Tacly teaches vs. what it should teach. User clarified the core learning model:
- Students are lazy, last-minute, barely grasp basic concepts
- Platform is NOT concept-teaching (unlike Pandai, JomStudy)
- Teach pattern recognition anchored to SPM question format
- Focus only on harvestable subquestions (top parts) — not full-chapter mastery
- K-marks and P-marks are the entire game

**Teacher-advised topic list (from Shawn's teacher contact):**
| Topic | Mark target | Notes |
|-------|-------------|-------|
| Index Numbers | max 6 | Current CLAUDE.md says ~10 — needs revision |
| Linear Programming | max 4 | Current CLAUDE.md says ~10 — needs revision |
| Linear Law | min 5 | Force 2dp; gradient, y-int, standard deviation |
| Simultaneous Equations | TBC | Unknown mark ceiling |
| Coordinate Geometry | 2–3 | For zero-mark students — low floor, guaranteed pickup |

**Target:** ~25 marks total → guaranteed pass (pass = ≥40/total marks — relationship to be clarified)

**Problems identified with current CLAUDE.md:**
1. Mark ceilings wrong (assumed 10 per topic, teacher says 4–6)
2. kp_steps are too abstract — not anchored to SPM question visual patterns
3. Hint Tier 1 is a concept prompt — contradicts lazy-learner model (should be pattern cue)
4. step_variants not required to mirror SPM format — breaks pattern transfer
5. SM-2 intervals too long for last-minute learners
6. Topic scope too narrow (only 2 topics) vs. teacher's 5

**Consequence:**
- Content definition (kp_steps, step_variants) needs redesign
- Topic scope decision pending user confirmation
- Mark calibration needs teacher source verification
- SPM standards concern flagged: patterns shift year-to-year

---

## 2026-05-02 | Discussion: Content generation pipeline, P/K mark communication, AI variant generation

**What happened:**
User clarified teaching philosophy and asked three core questions about content infrastructure.

**Key decisions made:**
- Teaching model: pattern recognition + lightweight concept teaching (hybrid, not pure pattern)
- Simultaneous equations: only 3-unknowns (calculator-solvable), NOT quadratic — scope locked
- Pass threshold confirmed: 25/180 raw marks ≈ 14/100 converted — historical SPM Add Maths passing grade
- 3 topics for v1 (Index Numbers, Linear Programming, Linear Law), then expand
- 3 topics alone ≠ guaranteed pass — noted, accepted tradeoff

**Open questions after this discussion:**
- Exact question_pattern_template schema to be finalised
- AI variant generation workflow: teacher provides seed questions → AI generates variants → teacher approves
- Supervision workflow still needs tooling decisions

## 2026-05-02 | Decision: Full template reference created

**What happened:** Created CONTENT_TEMPLATE_REFERENCE.md with full template schemas for all 3 v1 topics.
Templates defined: IDX-01, IDX-02 (Index Numbers), LP-01, LP-02 (Linear Programming), LL-01, LL-02 (Linear Law).

**Key design decisions:**
- Images/diagrams: LP graph reconstructed from inequality constraints — no image needed
- Linear Law: "force 2dp throughout" baked into constraints on every template
- Supervision checklist added — teacher reviews batch, not individual variants
- Skeleton template provided for teacher to add new question types

**Consequence:** Template reference is the content source of truth. Next step is either: (a) validate templates against real SPM past-year questions, or (b) start building the Supabase schema to store them.

---

## 2026-05-03 | SPM past-year harvest: Index Numbers 2021, 2022, 2024 complete

**What happened:**
Harvested K/P marks from SPM 2021 Q13, SPM 2022 Q14, SPM 2024 Q15 Index Numbers. Created full template mapping files for each paper. Generated 10 additional SPM-aligned step_variants (display_order 4–5) for the 5 highest-value kp_steps.

**Key findings:**
- Steps 4, 10, 11, 12, 13 account for ~18 of 20 Index Numbers marks across all 3 papers — these are the drill targets.
- SPM 2021 Q13(b) uses percentages as weightages (sum=100) — not raw integer weights. Existing step 4 variants didn't cover this.
- SPM 2022 Q14(a)(ii) (index + price diff → two equations) is exactly kp_step 10. Variant 30100001 already matched this paper.
- Step 13 ("express p in terms of q") is not directly auto-gradeable for the algebraic result — current variants work around this by giving q a specific value. A fill-in-blank algebraic input type would be needed for the pure version.
- SPM 2024 Q15(b)(i) algebraic weightage expressions (n, m+n, m/3, 2n → find m:n ratio) is harder than step 11 and not yet covered. Could become kp_step_15 post-pilot.

**Files produced:**
- `spm2021-q13-index-numbers-template.md`, `spm2022-q14-index-numbers-template.md`, `spm2024-q15-index-numbers-template.md`
- `supabase/seed/kp_steps/index_numbers_spm_variants.json` (10 new variants, display_order 4–5)
- `SPM_ALIGNED_QUESTIONS_SHOWCASE.md` (worked examples + SPM mapping table)

**Consequence:**
Index Numbers content fully harvested. Next content task: same harvest for Linear Programming past years. Next build task: apply Supabase migrations and run seed scripts.

---
