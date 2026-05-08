# src/pages/teacher/

Full page components for the teacher-facing area. Each file here corresponds to a
`/teacher/*` route and composes components from `src/components/teacher/`.

Note: rename this folder from `dashboard/` to `teacher/` when building week 5.

## Files to build here

### ClassView.tsx → route: /teacher/class/:id (week 5)
The main teacher working page.

Layout:
1. Header: class name, trial exam date, "Print worksheet" button.
2. Student table: one row per student.
   - Columns: anon_handle, predicted score (animated gauge), mastery heatmap (one cell
     per kp_step, coloured 0→red to 1→green), days active this week.
   - Sorted: weakest predicted score first by default.
3. Weak-spots panel (right sidebar on desktop): top 3 kp_steps with lowest class average,
   with mark value and frequency score shown.

Data flow:
1. `useClassRoster(classId)` fetches `StudentRow[]` from Supabase.
2. `useWeakestSteps(classId, 3)` aggregates mastery to find weakest steps.
3. "Print worksheet" → calls `lib/pdf.ts generateWorksheetPdf()` with the weakest 3 steps.

### MasteryHeatmap.tsx → used inside ClassView (component, not a page)
Renders a row of coloured cells for one student's mastery across all kp_steps.
- One cell per kp_step, ordered by display_order.
- Colour: red (#ef4444) at 0.0, yellow (#eab308) at 0.5, green (#22c55e) at 1.0.
- Tooltip on hover/tap: step description + mastery score.
- Designed for `<table>` row embedding — returns a `<td>` fragment.

### WorksheetButton.tsx → used inside ClassView (component, not a page)
"Print worksheet" CTA + download logic.
- Receives `steps: KpStep[]` (the 3 weakest), `variants: StepVariant[]`, `className: string`.
- On click: calls `lib/pdf.ts generateWorksheetPdf()` → browser downloads PDF.
- Button label: "Cetak Latihan" (BM) / "Print Worksheet" (EN toggle).
- Shows spinner while PDF generates (jsPDF is synchronous but can be slow for >3 pages).
