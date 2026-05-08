# SPM 2021 — Question 13: Index Numbers
**Paper:** 3472/2 | **Topic:** Index Numbers | **Total marks:** 10

---

## Full Question Transcription

**13** Jadual 3 menunjukkan maklumat berkaitan tiga bahan yang digunakan dalam penghasilan sejenis makanan.
*Table 3 shows the information related to three ingredients used in the production of a type of food.*

| Bahan / *Ingredient* | Harga (RM) per kg 2018 / *Price (RM) per kg 2018* | Harga (RM) per kg 2020 / *Price (RM) per kg 2020* | Indeks harga 2020 berasaskan 2018 / *Price index 2020 based on 2018* | Peratus penggunaan / *Percentage of usage* |
|:---:|:---:|:---:|:---:|:---:|
| A | 20.00 | 21.60 | 108 | 60 |
| B | 12.50 | 13.00 | 104 | *(not stated)* |
| C | *y* | 2.00 | *x* | 5 |

*Jadual 3 / Table 3*

**(a)** Harga bahan C menyusut 20% dari tahun 2018 ke tahun 2020.
*The price of ingredient C decreased by 20% from the year 2018 to the year 2020.*

**(i)** Nyatakan nilai *x*.
*State the value of x.* **[1 mark]**

**(ii)** Cari nilai *y*.
*Find the value of y.* **[2 marks]**

**(b)** Peratus penggunaan bagi beberapa bahan tersebut diberikan dalam Jadual 3.
Hitung indeks gubahan bagi kos pembuatan makanan itu pada tahun 2020 berasaskan tahun 2018.
*Percentage of usage for several ingredients are given in Table 3.
Calculate the composite index for the cost of making the food in the year 2020 based on the year 2018.* **[3 marks]**

**(c)** Kos untuk membuat sebungkus makanan itu meningkat 40% dari tahun 2020 ke tahun 2021. Harga jualan sebungkus makanan itu ialah RM43 dengan keuntungan sebanyak RM5 pada tahun 2021.
Hitung kos pembuatan bagi sebungkus makanan itu pada tahun 2018.
*The cost of making a packet of food increases by 40% from the year 2020 to the year 2021. The selling price of a packet of food is RM43 with a profit of RM5 in the year 2021.
Calculate the cost of making a packet of food in the year 2018.* **[4 marks]**

---

## K/P Mark Identification (from marking scheme)

> Mark allocation: (a)(i) 1 mark | (a)(ii) 2 marks | (b) 3 marks | (c) 4 marks = **10 total**

### Part (a)(i) — 1 mark

Ingredient C's price decreased by 20% from 2018 to 2020.
A 20% decrease means the 2020 price is 80% of the 2018 price → price index = 80. No calculation needed.

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **P1** | State price index directly from % decrease | *x* = **80** |

### Part (a)(ii) — 2 marks

Using *x* = 80: the price index for C = 80, current price (2020) = RM2.00, base price (2018) = *y*.

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Set up price index equation with *y* as unknown base price | (2.00 / *y*) × 100 = 80 |
| 2 | **P1** | Solve for *y* | *y* = **RM2.50** |

### Part (b) — 3 marks

Percentage of usage for B is not stated in the table. Since percentages sum to 100:
**B's percentage = 100 − 60 − 5 = 35**

Because weightages are percentages summing to 100, the denominator of the composite index formula = 100.

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1–2 | **K2** | Infer B's percentage (35); substitute all 3 indices and percentages into composite formula | Ī = (108 × 60 + 104 × 35 + 80 × 5) / 100 |
| 3 | **P1** | Correct final answer | Ī = (6480 + 3640 + 400) / 100 = **105.20** |

### Part (c) — 4 marks

Working:
- 40% increase from 2020 to 2021 → I(2021/2020) = 140
- Chain index: I(2021/2018) = (105.20 × 140) / 100 = 147.28
- Cost in 2021 = selling price − profit = RM43 − RM5 = RM38
- Back-calculate: (38 / P_2018) × 100 = 147.28 → P_2018 = RM25.80

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Convert 40% increase to index and chain-link: I(2021/2018) = (105.20 × 140) / 100 = 147.28 | I(2021/2020) = 140; I(2021/2018) = 147.28 |
| 2 | **K1** | Extract cost in 2021 from selling price and profit amount | cost_2021 = 43 − 5 = RM38 |
| 3 | **K1** | Set up back-calculation equation using chain index and cost_2021 | (38 / P_2018) × 100 = 147.28 |
| 4 | **P1** | Solve for P_2018 | P_2018 = **RM25.80** |

---

## Template Mappings

---

### Template: IDX-09 — State Price Index Directly from Percentage Change

**Harvestable marks:** 1 out of 1 (P1)
**Subpart:** (a)(i) or embedded in (a) typically
**SPM format:** Told that a price increased/decreased by r%, asked to "state" (not calculate) the price index

#### What it tests
- P1: Recognise that r% increase → price index = 100 + r; r% decrease → price index = 100 − r

#### Structure

**Fixed:**
```
"The price of ingredient [X] [increased / decreased] by [r]% from the year [base] to the year [current]."
"State the value of [x]."  (where x is the price index)
Answer format: x = [integer]
```

**Variable:**
```
- Direction: increase or decrease
- Percentage r
- Ingredient label and years
```

#### Variable Slots
```json
{
  "direction": { "pick_from": ["increased", "decreased"] },
  "r": {
    "type": "integer",
    "pick_from": [5, 8, 10, 12, 15, 20, 25, 30],
    "rule": "must yield index between 70 and 135 — avoid r=0 (trivial)"
  }
}
```

#### Constraints
```
1. r must be a whole number (no decimal % in SPM "state" questions)
2. For decrease: r < 100 (price cannot drop by more than 100%)
3. The resulting index must be an integer (always satisfied when r is integer)
4. This template only applies when the question says "state" — if it says "calculate" or "find",
   the student needs to show working (use IDX-03 instead)
```

#### Solution Steps
```
Step 1 | P1
What student writes: x = 100 − r  (for decrease)  OR  x = 100 + r  (for increase)
Pattern cue: "decrease → subtract from 100. Increase → add to 100. No formula needed."
Concept note: "price index 100 = same price as base year. Below 100 = cheaper. Above 100 = dearer."
```

#### Hint Ladder
```
Tier 1: "A price index of 100 means no change. What does 20% cheaper mean for the index?"

Tier 2: "Decreased by 20% → the price is now 80% of the original.
Price index = (current / base) × 100 = 80% × 100 = 80."

Tier 3: "Price index = 100 − [r] = 100 − 20 = 80. Write it directly."

Tier 4: "Example: price dropped 15% → price index = 100 − 15 = 85.
Example: price rose 8% → price index = 100 + 8 = 108."
```

#### Common Wrongs
```
Error 1: Writes x = 20 (just the percentage) instead of x = 80 → confuses % change with index
Error 2: Writes x = 120 (adds instead of subtracts for a decrease) → direction error
Error 3: Tries to calculate from prices instead of reading the stated % — wastes time and risks error
Error 4: Writes x = 0.80 (confuses index with decimal multiplier) → unit confusion
```

---

### IDX-01 Variant Note — Percentage of Usage as Weightage (Denominator = 100)

**When this applies:** The table uses "Percentage of usage / *Peratus penggunaan*" instead of a raw integer weightage column. The percentages sum to 100, so the composite index formula simplifies to:

> **Ī = Σ(I_i × W_i) / 100** (denominator is always exactly 100)

**Additional K-mark step (not in base IDX-01):**

When one percentage is missing from the table, students must infer it before computing the composite index:

```
Missing percentage = 100 − Σ(all stated percentages)
```

This inference step is marked as part of the K-mark for "setting up the composite formula correctly."
The denominator = 100 means students do NOT need to compute Σweights — it is always 100.

**Constraint additions for variants using this format:**
```
1. Stated percentages must sum to less than 100 (so missing percentage is positive)
2. Missing percentage must be a whole number ≥ 5
3. The missing percentage must clearly belong to exactly one ingredient (not ambiguous)
4. Include in the hint: "The percentages of usage always add up to 100 — use this to find the missing one."
```

**Common wrong for this variant:**
- Computes denominator as number of items (3) instead of 100 → classic IDX-01 Error 1, amplified here because students may also forget to infer the missing percentage first

---

### Template: IDX-10 — Chain-Link Backward: Find Base Year Cost from Selling Price + Profit Amount

**Harvestable marks:** 4 out of 4 (K1, K1, K1, P1)
**Subpart:** (c) typically
**SPM format:** % increase given for the most recent period → chain-link to get overall index →
given selling price and profit as a RM amount (not %) → derive cost in later year →
back-calculate cost in the base year

#### What it tests
- K1: Convert % increase to index and chain-link with composite index from part (b)
- K1: Extract actual cost in the later year from selling price minus profit amount
- K1: Set up the back-calculation equation correctly (later year cost over base year cost = chain index)
- P1: Solve for base year cost

#### Structure

**Fixed:**
```
"The cost of making [product] increases by [r]% from [year B] to [year C]."
"The selling price of [product] is RM[SP] with a profit of RM[Profit] in [year C]."
"Calculate the cost of making [product] in [year A]."
Answer format: cost in year A = RM[2dp]
```

**Variable:**
```
- % increase r from year B to year C (carries forward period B→C)
- Composite index Ī(B/A) from part (b) (the already-computed composite)
- Selling price SP in year C
- Profit amount (RM, not %) in year C
- Base year A (same as part b's base year)
```

#### Variable Slots
```json
{
  "pct_increase_B_to_C": {
    "type": "integer",
    "pick_from": [20, 25, 30, 40, 50],
    "note": "uniform increase, so Ī(C/B) = 100 + r exactly"
  },
  "composite_index_B_over_A": {
    "type": "float",
    "range": [100.00, 130.00],
    "decimal_places": 2,
    "note": "from part (b) — must produce clean 2dp chain index when multiplied by Ī(C/B)/100"
  },
  "selling_price_C": {
    "type": "float",
    "range": [20.00, 80.00],
    "decimal_places": 2
  },
  "profit_amount": {
    "type": "float",
    "range": [1.00, 15.00],
    "decimal_places": 2,
    "note": "RM amount, NOT a percentage — cost_C = selling_price_C − profit_amount"
  }
}
```

#### Constraints
```
1. cost_C = selling_price_C − profit_amount must be positive and > 0 (obviously)
2. Chain index = Ī(B/A) × (100 + r) / 100 must produce a clean 2dp value
3. base_year_cost = cost_C × 100 / chain_index must round to exactly 2dp
4. base_year_cost must be contextually plausible (e.g. RM5–RM60 for a packet of food)
5. selling_price_C must clearly exceed profit_amount (avoid trivial cases where profit ≈ SP)
6. Distinguish clearly from IDX-08: in IDX-08 direction is forward (base → selling price);
   here direction is backward (selling price → base cost). Profit is given as RM amount, not %.
```

#### Solution Steps
```
Step 1 | K1
What student writes: I(C/B) = 100 + r
                   Chain index I(C/A) = Ī(B/A) × I(C/B) / 100
Pattern cue: "r% increase → index = 100 + r. Then chain-link: multiply the two indices and divide by 100."
Concept note: "chain rule always: I(C/A) = I(B/A) × I(C/B) / 100 — the 100 prevents double-counting"

Step 2 | K1
What student writes: cost_C = selling_price_C − profit_amount
Pattern cue: "selling price = cost + profit. So cost = selling price MINUS the profit amount."
Concept note: "profit here is a RM amount, not a percentage — subtract it directly"

Step 3 | K1
What student writes: (cost_C / P_A) × 100 = I(C/A)
                   → set up equation with P_A as unknown
Pattern cue: "the chain index IS the price ratio × 100 — same formula as any price index"
Concept note: "cost_C goes on TOP (numerator) because it's the later year; P_A is what we're solving for"

Step 4 | P1
What student writes: P_A = (cost_C × 100) / I(C/A)
Pattern cue: "rearrange: multiply cost_C by 100, then divide by the chain index"
```

#### Hint Ladder
```
Tier 1: "Two things to do first: (1) find the chain index from year A to year C.
(2) find the actual cost in year C from the selling price and profit."

Tier 2: "Chain index: I(C/A) = [Ī(B/A)] × (100 + [r]) / 100 = ___
Cost in year C: RM[SP] − RM[Profit] = RM___"

Tier 3: "(RM___ / P_A) × 100 = [chain index]
P_A = (RM___ × 100) / [chain index] = RM___"

Tier 4 (full static worked example — SPM 2021 numbers):
"Ī(2020/2018) = 105.20. Cost increases 40% from 2020→2021 → I(2021/2020) = 140.
I(2021/2018) = 105.20 × 140 / 100 = 147.28.
Cost 2021 = RM43 − RM5 = RM38.
(38 / P_2018) × 100 = 147.28 → P_2018 = (38 × 100) / 147.28 = RM25.80"
```

#### Common Wrongs
```
Error 1: Uses 40 as the index instead of 140 (treats % as the index directly) → targets Step 1
Error 2: Uses selling price (RM43) as cost_C instead of subtracting profit
          (confuses selling price with cost price) → targets Step 2
Error 3: Subtracts profit from base year price instead of from selling price in year C → targets Step 2
Error 4: Sets up equation with P_A on top (forward direction): P_C / P_A × 100 becomes P_A / P_C × 100
          → puts base year cost in numerator, gets a value > RM43 → targets Step 3
Error 5: Divides chain index by cost_C instead of multiplying cost_C by 100 first
          (gets nonsense answer from rearrangement error) → targets Step 4
Error 6: Uses Ī(B/A) directly as the chain index, forgetting to link the B→C period
          (ignores the 40% increase entirely) → targets Step 1
```

---

## Contrast: IDX-08 vs IDX-10

| Feature | IDX-08 | IDX-10 |
|---------|--------|--------|
| Direction | Forward: base year → selling price | Backward: selling price → base year cost |
| Profit given as | % of cost | RM amount |
| What's known | Base year cost | Selling price + profit amount |
| What's solved | Selling price in year C | Cost in base year A |
| Key equation | SP = (chain_index/100) × cost_A × (1 + profit%) | P_A = cost_C × 100 / chain_index |

---

## Template Coverage Summary for This Question

| Subpart | Marks | Template used | New / Existing |
|---------|-------|---------------|---------------|
| (a)(i) | 1 | **IDX-09** (state price index from % decrease) | **NEW** |
| (a)(ii) | 2 | **IDX-03** (rearrange to find base price from index + current price) | Existing |
| (b) | 3 | **IDX-01 variant** (composite index with percentage-of-usage weightages; one percentage inferred from 100 − others) | Existing + variant note |
| (c) | 4 | **IDX-10** (chain-link backward; profit as RM amount; find base year cost) | **NEW** |

---

## Supervision Checklist for Variants

- [ ] (a)(i): r is a whole-number percentage; resulting index is an integer
- [ ] (a)(ii): base price y = (current price × 100) / x rounds to exactly 2dp; price is plausible for a food ingredient
- [ ] (b): stated percentages in the table sum to less than 100; missing percentage is a positive whole number ≥ 5
- [ ] (b): composite index = Σ(I_i × %-of-usage_i) / 100 rounds to exactly 2dp
- [ ] (c): chain index = Ī(B/A) × (100 + r) / 100 is a clean decimal (≤ 2dp)
- [ ] (c): selling price − profit amount is positive and produces a clean 2dp cost_C
- [ ] (c): base year cost = cost_C × 100 / chain_index rounds to exactly 2dp
- [ ] (c): conclusion is unambiguous — base year cost is clearly less than cost in later years (sanity check)
- [ ] All intermediate values achievable on a standard calculator to 2dp
