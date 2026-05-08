# scripts/

One-time developer utility scripts. NOT part of the deployed app.
Run from project root: `npx ts-node scripts/<file>.ts`
All scripts use `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` — never the anon key.

## Files to create here

### seed-kp-steps.ts (week 2–3)
Reads the harvest map JSON files from `supabase/seed/kp_steps/` and bulk-upserts
`kp_steps` + `step_variants` into Supabase.

Logic:
1. Glob all `*.json` files in `supabase/seed/kp_steps/`.
2. Validate each against the kp_step seed schema (Zod recommended).
3. Upsert into `kp_steps` (on conflict `topic + display_order` → update).
4. For each step's variants: upsert into `step_variants` (on conflict `kp_step_id + display_order` → update).
5. Log: steps seeded, variants seeded, any validation errors.

Safe to re-run. Use it every time the harvest map is updated.

### validate-kp-steps.ts (week 2)
Dry-run validator before seeding. Checks:
- `mark_value` is 1 or 2.
- `frequency_score` is 1–10.
- `difficulty_1_to_5` is 1–5.
- `correct_answer_json.expression` is a valid mathjs expression.
- No duplicate `display_order` within a topic.
- 3–5 variants per step (warn if fewer than 3).
- `common_wrongs_json` entries each have `marks_awarded < mark_value`.

Run before `seed-kp-steps.ts`. Fix all warnings before batch hint generation.

### generate-anon-handles.ts (week 2)
Utility to generate a pool of friendly BM/EN anon handles for new students.
- Outputs 200 unique handles to `scripts/anon-handles.json`.
- Format: `[Adjective][BmAnimal][Number]`, e.g. "GilaBabi77", "HebatLang42".
- Used by AuthContext on first visit to assign a random handle.

### export-class-csv.ts (week 5)
Teacher utility: export a class's predicted scores + mastery to CSV.
- Args: `--classId <id> --outputFile <path>`
- Columns: anon_handle, predicted_score, mastery columns (one per kp_step), days_active_30d.
- Used for sharing with HOD or importing into Excel.

## Environment setup for scripts
```bash
# .env.local must have:
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...  # NOT the anon key
```

Install ts-node once: `npm install -g ts-node typescript`
