# src/components/layout/

Shared layout wrappers used by multiple pages. Not feature-specific.

## Files to build here

### AppShell.tsx (week 3)
Minimal persistent shell for the student-facing app.
- Contains: ScoreGauge (top right, always visible), anon_handle (top left).
- No heavy nav — the student flow is linear, not menu-driven.
- Bottom safe-area padding for mobile (iOS home indicator).
- Renders `children` in the main content area.

### TeacherRoute.tsx (week 5)
Route guard for `/teacher/*` pages.
- Uses AuthContext: if user has no `teacher_id`, redirects to `/teacher` magic-link login.
- Does NOT redirect student users — teacher auth is separate from student anon auth.

### ProtectedRoute.tsx (week 2, if needed)
Thin guard — redirects to `/auth` only if the app requires a named account.
- For v1: most routes are public (students practice anonymously).
- Use only if a feature genuinely needs an identified user (e.g. cross-device sync).
- Check `user.anon_handle !== null` rather than full auth session.

## Usage in App.tsx
```tsx
// Student flow — no route guards needed for v1
<Route path="/" element={<Onboarding />} />
<Route path="/practice" element={<AppShell><Practice /></AppShell>} />
<Route path="/auth" element={<Auth />} />

// Teacher flow — magic-link gated
<Route element={<TeacherRoute />}>
  <Route path="/teacher" element={<Teacher />} />
  <Route path="/teacher/class/:id" element={<ClassView />} />
</Route>
```
