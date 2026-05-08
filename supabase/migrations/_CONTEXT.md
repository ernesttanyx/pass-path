# supabase/migrations/

SQL migration files for the Tacly data model.
Apply with: `supabase db push` or paste into Supabase SQL editor.
Name format: `001_description.sql` — always sequential.

## Migrations to create (in order)

### 001_users_and_kp_steps.sql
Core content + user profile tables.

### 002_variants_and_hints.sql
Step variants + pre-cached hint table.

### 003_attempts_mastery_score.sql
Student activity tracking tables.

### 004_teachers_and_classes.sql
Teacher dashboard tables.

See the actual SQL files — created in `supabase/migrations/` — for the full schema.
The _CONTEXT.md is a summary; the `.sql` files are the source of truth.
