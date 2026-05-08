# Tacly — Change Log
**Date:** 2026-05-05  
**Session:** UI polish + bug fixes (Ernest + Claude)

---

## Summary

Two rounds of changes in this session. Round 1 was a UX/design pass. Round 2 was a bug-fix pass based on live testing feedback.

---

## Round 1 — UX & Design Pass

### 1. Back Button (Navigation)
- **Files:** `src/components/practice/StepCard.tsx`, `src/pages/Practice.tsx`
- Added `onBack` prop to StepCard. When `currentIdx > 0`, a `ChevronLeft` back button appears in the pattern-cue header.
- Clicking it goes to the previous question and resets the task timer.
- First question has no back button (nothing to go back to).

### 2. Replace All Emojis with Lucide Icons
- **Files:** `StepCard.tsx`, `SpmQuestionCard.tsx`, `Practice.tsx`, `Onboarding.tsx`, `TopicIntro.tsx`, `teacher/ClassView.tsx`
- Replacements:
  - 🎯 → `<Target>` (lucide)
  - ✓ → `<Check>` (lucide)
  - ✅ → `<CheckCircle2>` (lucide)
  - ⚡ → `<Zap>` (lucide)
  - ⏭ → `<SkipForward>` (lucide)
  - 🖨 → `<Printer>` (lucide)
  - 💡 → removed, text stands alone
  - 💡 hint trigger → `<Lightbulb>` (lucide)

### 3. Font — Times New Roman, Tighter Tracking
- **Files:** `tailwind.config.ts`, `src/index.css`
- Extended Tailwind `fontFamily.serif` to `["Times New Roman", "Times", "serif"]`.
- Set `font-family: "Times New Roman", Times, serif` and `letter-spacing: -0.02em` on the body.
- Key text elements use `tracking-tight` for tighter, slimmer feel.

### 4. No-Scroll Layout + More Interactive Questions
- **Files:** `Practice.tsx`, `StepCard.tsx`, `SpmQuestionCard.tsx`
- `Practice.tsx` changed from `min-h-screen` to `h-screen overflow-hidden` — page-level scroll eliminated.
- `StepCard` restructured into a 3-zone flex column:
  - Top (fixed): dark pattern-cue header
  - Middle (scrollable): question text + hints
  - Bottom (sticky): choice buttons + feedback — always visible, never hidden below fold
- `SpmQuestionCard` full question text is now **collapsed by default** behind a tap-to-expand header. Students see the key sentence immediately, not a wall of markdown.
- Sub-part buttons are in a scrollable zone within the card.

---

## Round 2 — Bug Fixes (Post-Testing)

### 1. Times New Roman Not Applying
- **Root cause:** `src/index.css` had an existing `@layer base { body {} }` block with `font-family: 'Inter'` that appeared later in the cascade and overrode the new rule.
- **Fix:** Edited that existing body rule directly. Removed the duplicate rule added in Round 1.

### 2. Language Toggle — Question Still Showing BM
- **Root cause:** When `prompt_en` or `step_description_en` is `null` in the database (English content not yet seeded), the expression evaluated to `undefined` and showed nothing or fell through incorrectly.
- **Fix:** Added `|| bm_fallback` on all language-switched string fields in `StepCard.tsx` and `SpmQuestionCard.tsx`.
  ```ts
  // Before
  const prompt = lang === 'BM' ? variant.prompt_bm : variant.prompt_en;
  // After
  const prompt = (lang === 'BM' ? variant.prompt_bm : variant.prompt_en) || variant.prompt_bm;
  ```

### 3. "Focus on this part now" — Clarified Intent
- **What it means:** Each drill variant trains one specific sub-part of a multi-part SPM question. The `do` part is what this drill covers. `try` parts are harder — attempt if ready. `skip` (now labelled **"Nanti"**) parts are a recommendation only — the "Cabaran" button lets students attempt them anytime.
- **Changes in `SpmQuestionCard.tsx`:**
  - Renamed action labels: `"Skip dulu"` → `"Nanti"`, `"Skip"` → `"Later"`
  - `do` label changed from `"Mesti buat"` → `"Fokus sekarang"`
  - Added subtitle note: *'"Nanti" = cadangan je — klik "Cabaran" bila sedia.'*

### 4. Phone Sign-In — "Unsupported provider phone number"
- **Root cause:** Supabase SMS/phone provider is not activated in the project dashboard. This is a backend config issue — Twilio or a similar SMS provider needs to be connected in Supabase → Authentication → Providers → Phone.
- **Code fix (`src/pages/Auth.tsx`):**
  - Detect the unsupported-provider error by keyword and show a friendly BM message: *"SMS belum aktif lagi. Guna nama anonymus dulu — progress tetap tersimpan."*
  - Surface a direct `"Guna nama anonymus →"` button so users aren't stuck.
- **To fully fix:** Go to Supabase dashboard → Authentication → Providers → Phone → enable and connect a Twilio account.

### 5. Score Gauge Going Backward
- **Root cause:** `DECAY = 0.15` in `src/lib/mastery.ts` reduced `score_0_to_1` on every wrong answer, causing the predicted score gauge to visibly drop mid-session. This felt punishing and confusing.
- **Fix (`src/lib/mastery.ts`):**
  - `DECAY` changed from `0.15` → `0`. Wrong answers reset the spaced-repetition schedule (next_due_at moves to tomorrow) but no longer decrease the stored mastery score.
  - `GROWTH` increased from `0.10` → `0.35` so the first correct answer on a new step causes a visible tick on the gauge.
  - Score gauge is now monotonically non-decreasing within a session.

---

## Files Changed This Session

| File | Change |
|------|--------|
| `src/index.css` | Times New Roman on body, removed Inter |
| `tailwind.config.ts` | Extended fontFamily.serif |
| `src/lib/mastery.ts` | DECAY=0, GROWTH=0.35 |
| `src/pages/Practice.tsx` | h-screen layout, back button wiring, lucide icons |
| `src/pages/Onboarding.tsx` | Lucide Check icon |
| `src/pages/Auth.tsx` | Better phone error message + anonymous fallback button |
| `src/pages/teacher/ClassView.tsx` | Printer icon |
| `src/components/practice/StepCard.tsx` | Back button, no-scroll layout, lucide icons, EN fallbacks |
| `src/components/practice/SpmQuestionCard.tsx` | Collapsible full question, lucide icons, "Nanti" labels, EN fallbacks |
| `src/components/practice/TopicIntro.tsx` | Lucide check icon, removed 💡 emoji |

---

## Pending / Known Issues

- **Phone auth (Supabase SMS):** Needs Twilio connected in Supabase dashboard before OTP flow works.
- **English content:** `prompt_en`, `step_description_en`, `key_sentence_bm/en` fields are likely null for most rows — need to seed English translations in the DB for the EN toggle to show different content.
- **Score gauge calibration:** With GROWTH=0.35, first correct answer on 14 steps contributes ~2.5 marks to the gauge. May want to tune further once real student data comes in.
