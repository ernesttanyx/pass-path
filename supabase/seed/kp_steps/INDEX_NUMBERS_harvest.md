# K/P Harvest Map — Index Numbers (Nombor Indeks)
## SPM Paper 2, ~10 marks per question, 2014–2024

This is the week-1 deliverable. Complete this before writing any app code.
Do it with paper and actual SPM marking schemes, not from memory.

---

## How to use this file

For each kp_step:
1. **Step description (BM + EN):** Write what the student must do to earn this mark.
   Be specific — copy the language from the marking scheme.
2. **Mark value:** 1 or 2.
3. **Frequency score (1–10):** Count the number of years (2014–2024) this step appears.
4. **Difficulty (1–5):** 1 = students almost always get it; 5 = students almost always miss it.
   Start with 3 for everything, then adjust after watching hub students.
5. **Variants:** 3–5 practice questions with different numbers but the same underlying operation.
   Write them in the "Variants" section below each step.
6. **Common wrongs:** 2–3 wrong answers you've seen students write. Note any partial credit.

---

## Step 1 — Write the Composite Index formula

**BM:** Tulis formula Indeks Komposit: $\bar{I} = \frac{\sum W_i I_i}{\sum W_i}$

**EN:** Write the Composite Index formula with weightage.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants (write 3–5 with different numbers)

**Variant 1:**
- Prompt (BM): _e.g. "Hitung indeks komposit jika I₁=130, W₁=3; I₂=115, W₂=2"_
- Correct answer expression: `(130*3 + 115*2) / (3+2)`  → mathjs string
- Unit: _(none)_
- Common wrongs:
  - `(130+115)/2` → 0 marks (forgot weightage)
  - `130*3 + 115*2` → 0 marks (forgot to divide)

**Variant 2:**
- Prompt (BM): _fill in_
- Correct answer expression: _fill in_
- Common wrongs: _fill in_

**Variant 3:**
- Prompt (BM): _fill in_
- Correct answer expression: _fill in_

---

## Step 2 — Calculate individual price index I = (P₁/P₀) × 100

**BM:** Hitung indeks harga bagi satu barang: $I = \frac{P_1}{P_0} \times 100$

**EN:** Calculate the price index for one item.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants

**Variant 1:**
- Prompt (BM): _"Harga asas bagi item A ialah RM4.00. Harga semasa ialah RM5.20. Hitung indeks harga."_
- Correct answer expression: `(5.20/4.00)*100`
- Unit: _(none — answer is e.g. 130)_
- Common wrongs:
  - `(4.00/5.20)*100` → 0 marks (inverted ratio)
  - `5.20 - 4.00` → 0 marks (used difference not ratio)

**Variant 2:** _fill in_

**Variant 3:** _fill in_

---

## Step 3 — Find current price P₁ given index I and base price P₀

**BM:** Cari harga semasa (P₁) diberi indeks I dan harga asas P₀: $P_1 = \frac{I}{100} \times P_0$

**EN:** Find the current price given the index and base price.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants

**Variant 1:**
- Prompt (BM): _"Indeks harga bagi item B ialah 125. Harga asas ialah RM8.00. Hitung harga semasa."_
- Correct answer expression: `(125/100)*8.00`
- Unit: `RM`
- Common wrongs:
  - `(8.00/100)*125` → same result (coincidence — but formula understanding is wrong)
  - `8.00 + 125` → 0 marks

**Variant 2:** _fill in_

**Variant 3:** _fill in_

---

## Step 4 — Find base price P₀ given index I and current price P₁

**BM:** Cari harga asas (P₀) diberi indeks I dan harga semasa P₁: $P_0 = \frac{P_1}{I} \times 100$

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants — _fill in 3_

---

## Step 5 — Compute composite index from given I values and weightage

**BM:** Hitung indeks komposit diberi nilai I dan pemberat W bagi beberapa item.

**EN:** Calculate the composite index from given individual indices and their weights.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants — _fill in 3_

---

## Step 6 — Interpret a change in composite index as a percentage change

**BM:** Nyatakan peratus peningkatan/penurunan harga berdasarkan indeks komposit.

**EN:** Interpret the composite index as a percentage change from base year.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 1     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

_E.g. Composite index = 145 → prices increased by 45% from base year._

### Variants — _fill in 3_

---

## Step 7 — Calculate composite index for a chained year (base→year A→year B)

**BM:** Hitung indeks komposit bagi tahun B dengan tahun A sebagai asas, diberi indeks bagi A dan B.

| Attribute         | Value |
|-------------------|-------|
| Mark value        | 2     |
| Frequency (1–10)  | _fill in_ |
| Difficulty (1–5)  | _fill in_ |

### Variants — _fill in 3_

---

## Steps 8–15 — _Add remaining steps as you review each year's skema_

| # | Step (BM summary) | Mark | Freq | Diff |
|---|-------------------|------|------|------|
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |

---

## Notes from skema review

_Record any unusual examiner instructions, BOD notes, or accepted alternatives here._

- _Year XXXX: "Accept answer in decimal or fraction form"_
- _Year XXXX: BOD awarded if student uses correct formula but wrong value from earlier part_
