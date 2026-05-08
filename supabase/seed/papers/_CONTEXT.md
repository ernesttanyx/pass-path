# supabase/seed/kp_steps/

RENAME this folder from `papers/` to `kp_steps/` when setting up week 2.

Source files for the K/P harvest maps — the hand-curated content that is Tacly's actual
product value. These files get seeded into Supabase (`kp_steps` + `step_variants` tables)
by `scripts/seed-kp-steps.ts`.

Once seeded, the Supabase tables are the source of truth. These JSON files are the input
archive — keep them in version control.

## Folder contents (to create)

```
supabase/seed/kp_steps/
├── _CONTEXT.md              (this file)
├── INDEX_NUMBERS_harvest.md (hand-curated harvest map — week 1–2 work)
├── LINEAR_PROGRAMMING_harvest.md (week 2–3 work)
├── index_numbers.json       (machine-readable, seeded from harvest map)
└── linear_programming.json  (machine-readable, seeded from harvest map)
```

## JSON schema for each file

```json
{
  "topic": "Index Numbers",
  "steps": [
    {
      "display_order": 1,
      "step_description_bm": "Tulis formula Indeks Komposit dengan pemberat",
      "step_description_en": "Write the Composite Index formula with weightage",
      "mark_value": 1,
      "frequency_score": 9,
      "difficulty_1_to_5": 4,
      "variants": [
        {
          "display_order": 1,
          "prompt_bm": "Hitung indeks komposit jika I₁=130, I₂=115, W₁=3, W₂=2",
          "prompt_en": "Calculate composite index if I₁=130, I₂=115, W₁=3, W₂=2",
          "correct_answer_json": {
            "expression": "(130*3 + 115*2) / (3+2)",
            "tolerance": 0.01,
            "unit": ""
          },
          "common_wrongs_json": [
            {
              "expression": "(130 + 115) / 2",
              "marks_awarded": 0,
              "hint_key": "forgot_weightage"
            },
            {
              "expression": "(130*3 + 115*2)",
              "marks_awarded": 0,
              "hint_key": "forgot_to_divide_by_total_weight"
            }
          ]
        }
      ]
    }
  ]
}
```

## Notes
- `frequency_score`: 1–10. Count how many of the 2014–2024 past-year papers include this step.
- `difficulty_1_to_5`: Based on how often students skip or get it wrong. Assign conservatively.
- `variants`: aim for 3–5 per step. Use different numbers and contexts, same underlying step.
- `correct_answer_json.expression`: must be a valid mathjs expression. Run `validate-kp-steps.ts` first.
- `common_wrongs_json`: list the 2–3 most common wrong answers you've seen in student working.
  `marks_awarded` should reflect any partial credit the real SPM marking scheme would award.
