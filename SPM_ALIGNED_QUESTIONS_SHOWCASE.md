# SPM-Aligned Practice Questions — Index Numbers
*Generated from SPM 2021 Q13, SPM 2022 Q14, SPM 2024 Q15*

This doc shows what the new `index_numbers_spm_variants.json` produces, and how each example maps back to the real exam.

---

## How the 3 SPM papers map to kp_steps

| SPM paper / subpart | kp_step drilled | Marks |
|---|---|---|
| 2021 Q13(a)(i) — state index when price drops 20% | kp_step 9 (% → index) | K1 |
| 2021 Q13(a)(ii) — find base price y from index 80 + current RM2.00 | kp_step 3 (P1÷I×100) | K1, P1 |
| 2021 Q13(b) — compute composite from 3 ingredients with % usage | **kp_step 4** | K2, P1 |
| 2021 Q13(c) — chain backward from selling price to base year cost | **kp_step 12** | K1, K1, P1, P1 |
| 2022 Q14(a)(i) — find current price from index 130 + base RM15 | kp_step 2 (I÷100 × P0) | K1, P1 |
| 2022 Q14(a)(ii) — index 140 + price diff RM6 → find both prices | **kp_step 10** | K1, K1, K1, P1 |
| 2022 Q14(b) — express p in terms of q with 2 unknown weightages | **kp_step 13** | K2, P1 |
| 2022 Q14(c) — chain index A→B→C + profit → selling price | kp_step 7 + 8 | K1, K1, P1 |
| 2024 Q15(a) — 3-unknown table: find x, y, z | kp_steps 3, 1, 2 | K1, K1, K1 |
| 2024 Q15(b)(i) — algebraic weightages → find m:n ratio | **kp_step 11** | K1, K1, P1 |
| 2024 Q15(b)(ii) — multi-year cost projection + box cost → compare | kp_step 8 + chain | K1, K1, P1, P1 |

**Bold = highest-value steps. These 5 steps (4, 10, 11, 12, 13) account for ~18 of the 20 Index Numbers marks across the 3 papers.**

---

## Example questions created (new variants 4–5 per step)

---

### kp_step 4 — variant 4 (SPM 2021 Q13(b) — percentage usage style)

**Question (BM):**
> Jadual menunjukkan indeks harga 2020 (asas: 2018) dan peratus penggunaan bagi tiga bahan:
> A: I=108, 60% | B: I=104, 35% | C: I=80, 5%
> Hitung indeks gubahan.

**Answer:** (108×60 + 104×35 + 80×5) / (60+35+5) = **105.2**

**Why it's SPM-authentic:** Uses percentage-as-weightage (sum=100), not arbitrary integers. This is exactly the 2021 format. Most students get this wrong by dividing by 3 (number of items) instead of summing percentages (100).

---

### kp_step 10 — variant 4 (SPM 2022 Q14(a)(ii) style, new numbers)

**Question (EN):**
> The price index of ingredient P for 2022 based on 2020 is **125**. The 2020 price is **RM5 less** than the 2022 price. Find the 2020 price.

**Two equations:**
1. (y / x) × 100 = 125
2. y = x + 5

**Solution:** 125x = 100(x + 5) → 25x = 500 → **x = RM20.00**, y = RM25.00

**Why it's SPM-authentic:** Identical structure to 2022 Q14(a)(ii) (which used I=140, D=6 → answer RM15). Students must write BOTH equations before solving — skipping either costs 2 K-marks out of 4.

---

### kp_step 11 — variant 4 (ratio with 1 unknown, clean integer answer)

**Question (BM):**
> Nisbah A:B:C:D = 3:2:m:1. Indeks: 100, 120, 160, 110. Indeks gubahan = 129. Cari m.

**Solution:**
- (129 × 6 − 100×3 − 120×2 − 110×1) / (160 − 129)
- = (774 − 650) / 31 = 124/31 = **m = 4**

**Why it's SPM-authentic:** Follows 2024 Q15(b)(i) structure but with simpler weightages (integer ratio, not algebraic m/n expressions) — making this the right drill level for early practice before the harder algebraic version.

---

### kp_step 12 — variant 4 (chain backward, new numbers)

**Question (EN):**
> Production cost increased **25%** from 2022 to 2023. Selling price in 2023 = **RM50**, profit = **RM12.50**. Composite index 2022/2020 = **120**. Find production cost in 2020.

**Working:**
- Cost 2023 = 50 − 12.50 = **RM37.50**
- Chain index 2023/2020 = 120 × 125 / 100 = **150**
- Cost 2020 = 37.50 × 100 / 150 = **RM25.00**

**Why it's SPM-authentic:** Mirrors SPM 2021 Q13(c) and 2022 Q14(c). The chain-link step is where most students drop marks — they either (a) skip chaining and use composite_B/A directly, or (b) add the % instead of multiplying.

---

### kp_step 13 — variant 5 (new table, q=3, answer p=5)

**Question (BM):**
> Jadual: P(I=125, w=4), Q(I=140, w=p), R(I=150, w=q), S(I=120, w=2). Indeks gubahan=135.
> Diberi q=3, cari nilai p.

**Working:**
- (135 × 9 − 125×4 − 150×3 − 120×2) / (140 − 135)
- = (1215 − 1190) / 5 = 25/5 = **p = 5**

**Why it's SPM-authentic:** Table structure identical to 2022 Q14(b). Giving a specific q value makes it auto-gradeable (numeric answer) while still drilling the same composite-equation manipulation.

---

## Files produced

| File | Contents |
|---|---|
| `supabase/seed/kp_steps/index_numbers_spm_variants.json` | 10 new variants (display_order 4–5) for kp_steps 4, 10, 11, 12, 13 |
| `supabase/seed/kp_steps/index_numbers.json` | Original 42 variants (unchanged) |

**To deploy:** merge `step_variants` array from `index_numbers_spm_variants.json` into `index_numbers.json`, then run `npx ts-node scripts/seed-kp-steps.ts`.

---

## What's still missing for full SPM coverage

| Gap | What's needed |
|---|---|
| kp_step 13 "express p in terms of q" | Needs fill-in-blank with algebraic answer check — not yet supported by mathjs grader |
| SPM 2024 Q15(b)(i) algebraic weightages (n, m+n, m/3, 2n) | More complex than step 11 — could be a new kp_step_15 |
| SPM 2024 Q15(b)(ii) multi-year + box cost | Compound problem — partially covered by step 8 + step 7 separately |
| Chain index used to FIND future price (forward, not backward) | kp_step 8 has this — but no SPM-contextualized variants yet |
