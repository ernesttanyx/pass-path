# K/P Harvest Map Progress

This file tracks the hand-curation of K/P step maps — the core product content.
Each topic needs: all mark-earning steps from 2014–2024 SPM marking schemes,
frequency score, difficulty score, and 3–5 practice variants per step.

---

## Topic 1: Index Numbers

**Target:** ~15 kp_steps. Frequency + difficulty scored. 3–5 variants per step.

**Status:** 🔴 NOT STARTED — Week 1 work.

### Steps identified so far (fill in as you work through skemas)

| # | Step (BM) | Mark | Freq (1–10) | Diff (1–5) | Variants done |
|---|-----------|------|-------------|------------|---------------|
| 1 | Tulis formula Indeks Komposit dengan pemberat | 1 | – | – | 0/3 |
| 2 | Hitung I = (P₁/P₀) × 100 bagi satu item | 1 | – | – | 0/3 |
| 3 | Hitung indeks komposit menggunakan nilai I dan W | 1 | – | – | 0/3 |
| 4 | Cari harga semasa (P₁) diberi I dan P₀ | 1 | – | – | 0/3 |
| 5 | Cari harga asas (P₀) diberi I dan P₁ | 1 | – | – | 0/3 |
| 6 | Interpretasi perubahan indeks (naik/turun berapa %) | 1 | – | – | 0/3 |
| 7 | Kira peratus perubahan komposit berbanding tahun asas | 2 | – | – | 0/3 |
| 8 | Pilih tahun asas yang sesuai dan justify | 1 | – | – | 0/3 |

_Continue filling as you review each year's Paper 2 marking scheme._

### Skema sources reviewed
- [ ] 2024 SPM
- [ ] 2023 SPM
- [ ] 2022 SPM
- [ ] 2021 SPM
- [ ] 2020 SPM
- [ ] 2019 SPM
- [ ] 2018 SPM
- [ ] 2017 SPM
- [ ] 2016 SPM
- [ ] 2015 SPM
- [ ] 2014 SPM

---

## Topic 2: Linear Programming

**Target:** ~12 kp_steps. Frequency + difficulty scored. 3–5 variants per step.

**Status:** 🔴 NOT STARTED — Week 2 work.

### Steps identified so far

| # | Step (BM) | Mark | Freq (1–10) | Diff (1–5) | Variants done |
|---|-----------|------|-------------|------------|---------------|
| 1 | Takrifkan pemboleh ubah (let x = ..., y = ...) | 1 | – | – | 0/3 |
| 2 | Tulis ketaksamaan daripada kekangan dalam BM | 1 | – | – | 0/3 |
| 3 | Tukar kekangan BM kepada bentuk algebra (3 kekangan) | 1 | – | – | 0/3 |
| 4 | Lukis garis sempadan bagi setiap ketaksamaan | 1 | – | – | 0/3 |
| 5 | Lorekkan rantau yang memenuhi semua kekangan | 1 | – | – | 0/3 |
| 6 | Kenal pasti bucu rantau feasible | 1 | – | – | 0/3 |
| 7 | Gantikan bucu ke dalam fungsi objektif | 1 | – | – | 0/3 |
| 8 | Nyatakan nilai maksimum/minimum dan koordinatnya | 1 | – | – | 0/3 |
| 9 | Tulis garis bagi fungsi objektif k = ax + by | 1 | – | – | 0/3 |
| 10 | Gerakkan garis objektif untuk cari optimum | 1 | – | – | 0/3 |

_Continue filling as you review each year's Paper 2 marking scheme._

### Skema sources reviewed
- [ ] 2024 SPM
- [ ] 2023 SPM
- [ ] 2022 SPM
- [ ] 2021 SPM
- [ ] 2020 SPM
- [ ] 2019 SPM
- [ ] 2018 SPM
- [ ] 2017 SPM
- [ ] 2016 SPM
- [ ] 2015 SPM
- [ ] 2014 SPM

---

## Harvest pipeline (for each year's Paper 2)

1. Download PDF from trial.spmpaper.me or official SPM archive.
2. Convert to images:
   ```
   C:/Users/Ernest Tan/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin/pdftoppm.exe -r 200 input.pdf output_prefix
   ```
3. Open Claude, upload the marking scheme pages for Index Numbers / LP questions only.
4. Ask Claude to extract: each mark-earning step, K/N/P mark type, and marks.
5. Fill in the harvest map tables above.
6. After all 11 years done: assign frequency_score (count years where step appears).
7. Assign difficulty_1_to_5 based on student error patterns (start at 3, adjust).
8. Write 3–5 variants per step (different numbers, same underlying operation).
9. Run `validate-kp-steps.ts` to check all expressions are valid mathjs.
10. Run `seed-kp-steps.ts` to push to Supabase.
11. Run `batch-generate-hints` Edge Function to pre-populate hint_cache.

---

## Previously collected data (from old Tactiq papers pipeline)

The `2023_SBP_P1.json` file covers full Paper 1 (15 questions, many topics).
For Tacly v1, we only care about **Index Numbers** and **Linear Programming** from Paper 2.
The old Paper 1 JSON files are NOT relevant to the new pipeline — keep them archived here
but do not seed them into the Tacly schema.
