# Teacher Dashboard — Backend Build Sequence

Complete ordered list to get the teacher dashboard backend live, fastest path.

---

## Current State Snapshot

| Layer | Status |
|-------|--------|
| DB migrations (001–004) | SQL written, **not yet applied** to Supabase |
| `src/types/index.ts` | Complete |
| `src/lib/supabase.ts` | Exists (has stray console.log) |
| `src/lib/auth.ts` | Basic email/password only — not anon-first, not magic-link |
| `src/lib/mastery.ts` | **Missing** |
| `src/lib/cost-guard.ts` | **Missing** |
| `src/lib/pdf.ts` | **Missing** |
| `src/contexts/AuthContext.tsx` | **Missing** |
| `src/hooks/useTeacher.ts` | **Missing** |
| `supabase/functions/generate-worksheet/` | Spec only, no `index.ts` |
| `src/components/teacher/` | **Empty** |
| `src/pages/Teacher.tsx` | Stub only |
| `src/pages/teacher/ClassView.tsx` | Stub only |
| Seed data JSON | Exists — not yet loaded into DB |

---

## Dependency Note

The teacher dashboard reads `mastery` and `predicted_score` rows written by the **student practice flow**. You need at least the auth + mastery write pipeline working before the heatmap has real data. For early testing, manually INSERT mock rows via the Supabase SQL editor (step 2 covers this).

---

## Sequence

---

### Step 1 — Apply DB Migrations

**Where:** Supabase dashboard → SQL Editor  
**What to run:** Paste and execute each file in order:

```
supabase/migrations/001_users_and_kp_steps.sql
supabase/migrations/002_variants_and_hints.sql
supabase/migrations/003_attempts_mastery_score.sql
supabase/migrations/004_teachers_and_classes.sql
```

Or via CLI (if Supabase CLI is linked to the project):
```
supabase db push
```

**Concepts used:** PostgreSQL DDL, Row Level Security (RLS), Postgres VIEWs  
**Unblocks:** Every subsequent step. Nothing works without this.

---

### Step 2 — Seed kp_steps + step_variants

**Where:** Terminal, project root  
**What to run:**

```bash
# Add to .env.local first:
# SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

npx tsx scripts/seed-kp-steps.ts
```

**Concepts used:** `@supabase/supabase-js` (service role), `upsert` with `onConflict: 'id'`  
**Unblocks:** useWeakestSteps hook, generate-worksheet function, worksheet PDF

Optional — also manually INSERT one teacher, one class, a few students with mastery rows via SQL for dashboard testing before the student flow is live:
```sql
-- Quick test fixtures (run in Supabase SQL editor)
INSERT INTO public.teachers (id, name, school_code) VALUES
  ('<teacher-auth-uuid>', 'Cikgu Test', 'SMK_TEST');

INSERT INTO public.classes (teacher_id, name, school_code) VALUES
  ('<teacher-auth-uuid>', '5 Sains 1', 'SMK_TEST');
```

---

### Step 3 — Enable Auth Providers in Supabase

**Where:** Supabase dashboard → Authentication → Providers

1. **Anonymous sign-ins** — Enable (students practise without account)
2. **Email — Magic Link** — Enable (teacher login flow)
3. Email OTP expiry — set to 60 minutes

**Concepts used:** Supabase Auth provider config  
**Unblocks:** AuthContext (step 4), teacher magic-link login (step 9)

---

### Step 4 — Build `src/lib/mastery.ts`

**File to create:** `src/lib/mastery.ts`  
**Packages:** None — pure TypeScript math  
**Exports:**

```ts
updateMastery(current: Mastery, isCorrect: boolean, timeTakenMs: number): Mastery
computePredictedScore(masteryMap: Record<string, Mastery>, steps: KpStep[]): number
```

**Logic:**
- `updateMastery`: SM-2 algorithm. Correct → `score += (1 - score) × 0.1 × speedBonus`. Incorrect → `score = max(0, score - 0.15)`. Recompute `next_due_at` using interval doubling.
- `computePredictedScore`: `Σ(mastery.score × step.mark_value) / totalPossibleMarks × 100`

**Unblocks:** MasteryContext, useTeacher aggregation logic, predicted score gauge

---

### Step 5 — Build `src/contexts/AuthContext.tsx`

**File to create:** `src/contexts/AuthContext.tsx`  
**Packages:** `@supabase/supabase-js`  
**Exports:** `AuthProvider`, `useAuthContext()`

**Responsibilities:**
- On first load: `supabase.auth.signInAnonymously()` if no session exists
- `saveProgress(handle: string)`: upserts `users` row with `anon_handle`
- Exposes teacher identity check: reads `teachers` table for current user id
- `signInWithMagicLink(email)`: `supabase.auth.signInWithOtp({ email })`
- `supabase.auth.onAuthStateChange` subscription → updates context state
- On auth change: calls `queryClient.invalidateQueries()`

**Unblocks:** All hooks that need `user.id`, teacher route guard

---

### Step 6 — Build `src/hooks/useAuth.ts`

**File to create:** `src/hooks/useAuth.ts`  
**Packages:** None  

Thin wrapper:
```ts
export function useAuth() {
  const ctx = useAuthContext()
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
```

**Unblocks:** Any component that needs auth state

---

### Step 7 — Build `src/components/layout/TeacherRoute.tsx`

**File to create:** `src/components/layout/TeacherRoute.tsx`  
**Packages:** `react-router-dom`

Route guard that:
1. Reads `useAuth()`
2. Queries `teachers` table for `user.id`
3. If loading → spinner
4. If not a teacher → redirect to `/teacher` (magic-link login page)
5. If confirmed teacher → renders `<Outlet />`

**Packages:** `@supabase/supabase-js`, `react-router-dom`  
**Unblocks:** Protected teacher routes in App.tsx

---

### Step 8 — Wire AuthProvider into `App.tsx`

**File to edit:** `src/App.tsx`

```tsx
import { AuthProvider } from "@/contexts/AuthContext"
import TeacherRoute from "@/components/layout/TeacherRoute"

// Wrap everything:
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    ...
    <Route path="/teacher" element={<Teacher />} />
    <Route element={<TeacherRoute />}>
      <Route path="/teacher/class/:id" element={<ClassView />} />
    </Route>
    ...
  </AuthProvider>
</QueryClientProvider>
```

**Unblocks:** Teacher route protection is live

---

### Step 9 — Build `src/hooks/useTeacher.ts`

**File to create:** `src/hooks/useTeacher.ts`  
**Packages:** `@tanstack/react-query`, `@supabase/supabase-js`

Two hooks:

**`useClassRoster(classId: string): StudentRow[]`**  
Query: `class_mastery_view` filtered by `class_id`, grouped by `user_id`.  
Returns one `StudentRow` per student: `{ user_id, anon_handle, predicted_score, mastery_by_step, days_active_this_week }`.  
Cache key: `['classRoster', classId]`

**`useWeakestSteps(classId: string, topN = 3): KpStep[]`**  
Query: aggregate mastery from `class_mastery_view`, compute mean `score_0_to_1` per `kp_step_id`, join back to `kp_steps`, return N steps with lowest mean.  
Cache key: `['weakestSteps', classId, topN]`

**Unblocks:** ClassView data layer, WorksheetButton

---

### Step 10 — Build `supabase/functions/generate-worksheet/index.ts`

**Folder to rename:** `supabase/functions/generate-pdf/` → `supabase/functions/generate-worksheet/`  
**Create:** `supabase/functions/generate-worksheet/index.ts`  
**Runtime:** Deno  
**Packages:** `@supabase/supabase-js` (Deno import), Supabase auto-injected service role key

**Logic:**
1. Parse JWT from Authorization header → verify with `SUPABASE_SERVICE_ROLE_KEY`
2. Check `teachers` table for `jwt.sub` → 403 if not a teacher
3. Read body: `{ classId: string, topN: number }`
4. SQL: aggregate mean `score_0_to_1` per `kp_step_id` from `class_mastery_view WHERE class_id = $1`
5. Sort ASC, take top N weakest step IDs
6. Fetch `kp_steps` + `step_variants` (2–3 per step) for those IDs
7. Return `{ steps: KpStep[], variants: StepVariant[] }`

**Deploy command:**
```bash
supabase functions deploy generate-worksheet
```

**Unblocks:** WorksheetButton, pdf.ts

---

### Step 11 — Build `src/lib/pdf.ts`

**File to create:** `src/lib/pdf.ts`  
**Package:** `jspdf` (already in package.json)  
**Export:** `generateWorksheetPdf(data: WorksheetData): void`

**Logic:**
1. New `jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })`
2. Header: "Tacly Latihan — [className]", date, "Untuk Cikgu" watermark on teacher copy
3. For each `kp_step` in `data.steps`:
   - Print `step_description_bm` + `step_description_en`
   - Print 2–3 variants as numbered questions with blank working space
   - Show `[X markah]` per question
4. Footer: page number
5. `doc.save('tacly-worksheet.pdf')`

**Unblocks:** WorksheetButton can now trigger a download

---

### Step 12 — Build Teacher UI Components

Three small components in `src/components/teacher/`:

**`MasteryHeatmap.tsx`**  
Props: `steps: KpStep[], students: StudentRow[]`  
Grid: rows = students, columns = kp_steps. Cell colour: green (score > 0.7) → yellow (0.4–0.7) → red (< 0.4). Uses Tailwind bg classes.  
Package: None (pure CSS grid)

**`StudentTable.tsx`**  
Props: `students: StudentRow[]`  
Columns: anon_handle, predicted score bar (Progress from Shadcn/ui), days active this week.  
Sorted: predicted score ASC (weakest first).  
Package: `src/components/ui/table`, `src/components/ui/progress`

**`WorksheetButton.tsx`**  
Props: `classId: string`  
On click:
1. POST `/functions/v1/generate-worksheet` with `classId`
2. Pass response JSON to `generateWorksheetPdf()`
3. Button shows loading state during fetch  
Package: Shadcn Button, `src/lib/pdf`

---

### Step 13 — Build `src/pages/Teacher.tsx` (real implementation)

**File to replace:** the stub in `App.tsx` inline → real file at `src/pages/Teacher.tsx`

Two states:

**Unauthenticated:** magic-link email form  
```
Email input → "Hantar link log masuk" button
→ supabase.auth.signInWithOtp({ email })
→ Show "Semak email anda" confirmation
```

**Authenticated teacher:** list of their classes  
```
Query: SELECT * FROM classes WHERE teacher_id = user.id
→ Cards per class → link to /teacher/class/:id
→ "Tambah kelas baru" button (optional v1)
```

Package: `react-hook-form`, `@supabase/supabase-js`, `react-router-dom`

---

### Step 14 — Build `src/pages/teacher/ClassView.tsx` (real implementation)

**File to create:** `src/pages/teacher/ClassView.tsx`

```
useParams() → classId
useClassRoster(classId)    → StudentRow[]
useWeakestSteps(classId)   → KpStep[]

Layout:
  Header: class name | trial exam date | <WorksheetButton classId={classId} />
  Body:
    Left (2/3): <StudentTable students={roster} />
    Right (1/3): "Topik paling lemah" list of 3 KpSteps
  Bottom: <MasteryHeatmap steps={allSteps} students={roster} />
```

Loading state: Skeleton components from Shadcn/ui.  
Empty state: "Tiada pelajar dalam kelas ini lagi."

---

### Step 15 — Update `App.tsx` with Real Imports

```tsx
import Teacher from "./pages/Teacher"
import ClassView from "./pages/teacher/ClassView"
// Remove the inline stub components for Teacher and ClassView
```

Remove the `console.log` from `src/lib/supabase.ts`.

---

### Step 16 — End-to-End Test

**Checklist:**
- [ ] Magic-link email → teacher lands on `/teacher`
- [ ] Class list loads
- [ ] Click class → `/teacher/class/:id` loads
- [ ] Student table shows (may be empty if no students yet)
- [ ] Manually insert mastery rows via SQL → heatmap colours appear
- [ ] "Print worksheet" button → PDF downloads with correct questions
- [ ] Non-teacher user hit `/teacher/class/:id` → redirected by TeacherRoute

---

## Build Order Summary (tightest path)

```
1.  Apply migrations 001–004             [Supabase SQL editor, ~5 min]
2.  Seed kp_steps                        [npx tsx scripts/seed-kp-steps.ts]
3.  Enable Anon + Magic Link in Supabase [Supabase dashboard, ~2 min]
4.  src/lib/mastery.ts                   [pure TS, no deps]
5.  src/contexts/AuthContext.tsx         [Supabase auth wrapper]
6.  src/hooks/useAuth.ts                 [thin wrapper]
7.  src/components/layout/TeacherRoute.tsx
8.  src/App.tsx — wire AuthProvider + TeacherRoute
9.  src/hooks/useTeacher.ts              [React Query + class_mastery_view]
10. supabase/functions/generate-worksheet/index.ts + deploy
11. src/lib/pdf.ts                       [jsPDF]
12. src/components/teacher/MasteryHeatmap.tsx
13. src/components/teacher/StudentTable.tsx
14. src/components/teacher/WorksheetButton.tsx
15. src/pages/Teacher.tsx                [magic-link form + class list]
16. src/pages/teacher/ClassView.tsx      [main dashboard page]
17. src/App.tsx — swap stubs for real imports
18. Test end-to-end
```

Total files to create/edit: **15**  
Blockers that must go in order: 1 → 2 → 3 → 4 → 5 → 8 → 9 → 10  
Everything else (11–16) can be parallelised once step 9 is done.
