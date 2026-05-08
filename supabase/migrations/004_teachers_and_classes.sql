-- Migration 004: teachers + classes + class_members
-- Apply after 003. Used by the teacher dashboard (week 5).

-- ── teachers ──────────────────────────────────────────────────────────────────
-- Teacher accounts are created via Supabase magic-link auth.
-- One row per teacher, keyed on auth.users.id.

CREATE TABLE IF NOT EXISTS public.teachers (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT '',
  school_code text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teachers: select own" ON public.teachers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "teachers: update own" ON public.teachers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "teachers: insert own" ON public.teachers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ── classes ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.classes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id       uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  name             text NOT NULL,                      -- e.g. "5 Sains 1"
  school_code      text NOT NULL DEFAULT '',
  trial_exam_date  date,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS classes_teacher_idx ON public.classes (teacher_id);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Teachers can only see their own classes
CREATE POLICY "classes: teacher owns" ON public.classes
  FOR ALL USING (
    auth.uid() = teacher_id
  )
  WITH CHECK (auth.uid() = teacher_id);

-- ── class_members ─────────────────────────────────────────────────────────────
-- Join table: which student (users.id) belongs to which class.
-- Teacher adds students by sharing a class join code (v1: simple text code).

CREATE TABLE IF NOT EXISTS public.class_members (
  class_id    uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, user_id)
);

CREATE INDEX IF NOT EXISTS class_members_class_idx ON public.class_members (class_id);
CREATE INDEX IF NOT EXISTS class_members_user_idx ON public.class_members (user_id);

ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- Teacher can read members of their classes
CREATE POLICY "class_members: teacher reads" ON public.class_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_id AND c.teacher_id = auth.uid()
    )
  );

-- Student can insert themselves
CREATE POLICY "class_members: student joins" ON public.class_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teacher read access to mastery of their students (needed for heatmap)
-- Implemented as a Postgres VIEW to avoid cross-table RLS complexity:

CREATE OR REPLACE VIEW public.class_mastery_view AS
SELECT
  cm.class_id,
  m.user_id,
  u.anon_handle,
  m.kp_step_id,
  m.score_0_to_1,
  m.next_due_at,
  ps.score AS predicted_score
FROM public.class_members cm
JOIN public.mastery m ON m.user_id = cm.user_id
JOIN public.users u ON u.id = cm.user_id
LEFT JOIN public.predicted_score ps ON ps.user_id = cm.user_id;

-- Teachers query this view filtered by class_id that they own.
-- No RLS needed on the view — access control is via the classes table check in application code.
