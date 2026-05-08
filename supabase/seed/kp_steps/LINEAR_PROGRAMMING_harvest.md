# K/P Harvest Map — Linear Programming (Pengaturcaraan Linear)
## SPM Paper 2, ~10–12 marks per question, 2014–2024

Week-2 deliverable. Start after Index Numbers harvest is done. Same process.

---

## How to use this file

Same as INDEX_NUMBERS_harvest.md — fill in each step from real marking schemes.
LP questions are typically worth 10–12 marks and test a fixed sequence of steps.
The good news: the step structure is almost identical year to year. Once you've
mapped 2–3 years, you've mapped most of the pattern.

---

## Step 1 — Define variables

**BM:** Takrifkan pemboleh ubah dengan jelas. Contoh: "Katakan x = bilangan X dan y = bilangan Y"

**EN:** Define the decision variables clearly.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants

**Variant 1:**
- Context: "A factory makes chairs (x) and tables (y). Max 60 items total."
- Prompt (BM): _"Tuliskan takrifan pemboleh ubah untuk masalah ini."_
- Correct answer: Free-text step (mark as correct if x and y are defined with context units)
- NOTE: This step cannot be graded by mathjs — it's a labelling step.
  For v1: use a multiple-choice format ("Pemboleh ubah yang betul ialah...").
- Common wrongs:
  - Student defines x and y but swaps them vs the question context
  - Student skips this step entirely (most common — difficulty 4)

**Variant 2:** _fill in_

**Variant 3:** _fill in_

---

## Step 2 — Write inequalities from constraints

**BM:** Tulis ketaksamaan bagi setiap kekangan yang diberi. (3 kekangan biasanya)

**EN:** Write the inequality for each given constraint.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

_Note: This step often earns 3 marks (1 per constraint). In the harvest map, split into_
_Step 2a (constraint 1), Step 2b (constraint 2), Step 2c (constraint 3) for granularity._

### Variants

**Variant 1 (inequality from word constraint):**
- Context: "The number of chairs must be at least twice the number of tables."
- Prompt (BM): _"Tulis ketaksamaan bagi kekangan ini."_
- Correct answer expression: `x >= 2*y` (or rearranged form)
- mathjs check: evaluate at a test point to verify — not a simple numeric answer.
- For v1: use fill-in-the-blank format: `x ___ 2y` where blank = ≥ / > / ≤ / <

**Variant 2:** _fill in_

**Variant 3:** _fill in_

---

## Step 3 — Identify the feasible region boundary lines

**BM:** Cari titik-titik untuk melukis garis bagi setiap ketaksamaan (titik pada paksi x dan y).

**EN:** Find two points on each boundary line for graphing.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants

**Variant 1:**
- Prompt (BM): _"Cari dua titik pada garis 2x + 3y = 12."_
- Correct answer: Two points, e.g. (0,4) and (6,0) — check both satisfy equation
- mathjs expression for x-intercept: `12/2` (when y=0)
- mathjs expression for y-intercept: `12/3` (when x=0)

**Variant 2:** _fill in_

---

## Step 4 — Shade the feasible region correctly

**BM:** Lorekkan rantau yang memenuhi SEMUA ketaksamaan (rantau yang layak).

**EN:** Shade the region that satisfies ALL inequalities simultaneously.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

_This is a graphical step — hard to auto-grade with mathjs._
_For v1: after graphing steps, ask "which of these points is inside the feasible region?"_
_Multiple choice with 4 coordinate options — deterministically checkable._

### Variants

**Variant 1:**
- Prompt (BM): _"Titik manakah yang berada dalam rantau yang layak? (A) (2,1) (B) (5,8) (C) (0,0) (D) (3,3)"_
- Correct answer: student selects the correct coordinate
- mathjs check: substitute into all 3 inequalities, all must be true

**Variant 2:** _fill in_

---

## Step 5 — Identify vertices of the feasible region

**BM:** Kenal pasti koordinat bucu rantau yang layak.

**EN:** Find the coordinates of all vertices of the feasible region.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants

**Variant 1 (find intersection of two lines):**
- Prompt (BM): _"Cari titik persilangan bagi x + y = 10 dan 2x + y = 15."_
- Correct answer expression for x: `15-10`  (= 5)
- Correct answer expression for y: `10-5`   (= 5)
- Common wrongs:
  - Error in elimination method (most common — difficulty 4)

**Variant 2:** _fill in_

---

## Step 6 — Substitute vertices into the objective function

**BM:** Gantikan koordinat bucu ke dalam fungsi objektif k = ax + by untuk cari nilai k.

**EN:** Substitute each vertex into the objective function to find the optimal value.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants

**Variant 1:**
- Prompt (BM): _"Fungsi objektif ialah k = 3x + 2y. Bucu-bucu ialah (2,4), (5,1), (3,3). Hitung nilai k bagi setiap bucu."_
- Correct answers (fill in for each variant)
- Common wrongs: arithmetic slips when substituting

---

## Step 7 — State the maximum/minimum value and the optimal point

**BM:** Nyatakan nilai maksimum/minimum fungsi objektif dan koordinat titik optimum.

**EN:** State the maximum or minimum value of k and the coordinates where it occurs.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants — _fill in 3_

---

## Step 8 — Draw the objective function line (k = ax + by as a straight line)

**BM:** Lukis garis fungsi objektif dengan nilai k yang dipilih untuk menunjukkan arah pengoptimuman.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

_Graphical step — for v1 use the "which point" multiple-choice format._

---

## Steps 9–12 — _Add remaining steps from skema review_

| # | Step (BM summary) | Mark | Freq | Diff |
|---|-------------------|------|------|------|
| 9 | | | | |
| 10 | | | | |
| 11 | | | | |
| 12 | | | | |

---

## LP-specific notes from skema review

_Record year-by-year variations here._

- _Some years ask for MAXIMUM, others MINIMUM — the step structure is the same._
- _"Integer constraint" sometimes appears: optimal point must have whole-number coords._
- _Watch for: questions that mix LP graphing with a second calculation (e.g. profit = ...). That second calc is a separate kp_step._
