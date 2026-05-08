# SPM 2022 — Question 14: Index Numbers
**Paper:** 3472/2 | **Topic:** Index Numbers | **Total marks:** 10

---

## Full Question Transcription

**14** Jadual 2 menunjukkan maklumat berkaitan empat bahan yang digunakan untuk menghasilkan sejenis biskut.
*Table 2 shows the information related to four ingredients used to produce a type of biscuit.*

| Bahan / *Ingredient* | Harga (RM) per kg 2019 / *Price (RM) per kg 2019* | Harga (RM) per kg 2021 / *Price (RM) per kg 2021* | Pemberat / *Weightage* |
|:---:|:---:|:---:|:---:|
| P | 15.00 | *z* | 5 |
| Q | *x* | *y* | *p* |
| R | 7.50 | 12.00 | *q* |
| S | 8.00 | 8.80 | 3 |

*Jadual 2 / Table 2*

**(a)(i)** Diberi bahawa indeks harga bagi bahan P pada tahun 2021 berasaskan tahun 2019 ialah 130, cari nilai *z*.
*Given that the price index of ingredient P for the year 2021 based on the year 2019 is 130, find the value of z.* **[2 marks]**

**(a)(ii)** Indeks harga bagi bahan Q pada tahun 2021 berasaskan tahun 2019 ialah 140. Harga per kg bahan Q pada tahun 2019 ialah RM6 kurang daripada harga sepadannya pada tahun 2021. Hitung nilai *x* dan nilai *y*.
*The price index of ingredient Q for the year 2021 based on the year 2019 is 140. The price per kg of ingredient Q in the year 2019 is RM6 less than its corresponding price in the year 2021. Calculate the value of x and of y.* **[4 marks]**

**(b)** Diberi bahawa indeks gubahan untuk menghasilkan biskut itu pada tahun 2021 berasaskan tahun 2019 ialah 132, ungkapkan *p* dalam sebutan *q*.
*Given that the composite index to produce the biscuit for the year 2021 based on the year 2019 is 132, express p in terms of q.* **[3 marks]**

**(c)** Harga biskut pada tahun 2019 ialah RM40. Harga bagi semua bahan meningkat sebanyak 20% dari tahun 2021 ke tahun 2022. Cari harga jualan biskut dalam tahun 2022, jika syarikat itu mensasarkan keuntungan sebanyak 15%.
*The price of the biscuit in the year 2019 is RM40. The prices of all the ingredients have increased by 20% from the year 2021 to the year 2022. Find the selling price of the biscuit in the year 2022, if the company is targetting a profit of 15%.* **[3 marks]**

---

## K/P Mark Identification (from marking scheme)

> Mark allocation: (a)(i) 2 marks | (a)(ii) 4 marks | (b) 3 marks | (c) 3 marks = **10 total**

### Part (a)(i) — 2 marks

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Set up price index equation | (*z* / 15) × 100 = 130 |
| 2 | **P1** | Correct value of *z* | *z* = **RM19.50** |

### Part (a)(ii) — 4 marks

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Write price index equation AND price difference equation | (*y* / *x*) × 100 = 140 **and** *x* + 6 = *y* |
| 2 | **K1** | Substitute and rearrange into single-variable equation | 140*x* = (*x* + 6) × 100 |
| 3 | **K1** | Solve for *x* | *x* = **RM15** |
| 4 | **P1** | Find *y* | 15 + 6 = *y* → *y* = **RM21** |

### Part (b) — 3 marks

Individual price indices (derived):
- I_P = 130 (given)
- I_Q = 140 (given)
- I_R = (12.00 / 7.50) × 100 = **160**
- I_S = (8.80 / 8.00) × 100 = **110**

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1–2 | **K2** | Set up composite index equation with all 4 indices and weightages | [130(5) + 140*p* + 160*q* + 110(3)] / (5 + *p* + *q* + 3) = 132 |
| 3 | **P1** | Simplify and express *p* in terms of *q* | 980 + 140*p* + 160*q* = 1056 + 132*p* + 132*q* → 8*p* = 76 − 28*q* → ***p* = 19/2 − (7/2)*q*** |

### Part (c) — 3 marks

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Compute chain index from 2019 to 2022 | Ī(2022/2019) = (132 × 120) / 100 = **158.4** |
| 2 | **K1** | Find cost price of biscuit in 2022 | (*x* / 40) × 100 = 158.4 → *x* = **RM63.36** |
| 3 | **P1** | Apply profit margin to get selling price | Selling price = (115/100) × 63.36 = **RM72.86** |

---

## Template Mappings

---

### Template: IDX-06 — Find Base and Current Price Simultaneously (Index + Price Difference)

**Harvestable marks:** 4 out of 4 (K1, K1, K1, P1)
**Subpart:** (a)(ii) typically
**SPM format:** Given price index and that current price exceeds base price by RM*D*, find both prices

#### What it tests
- K1: Write price index equation correctly (current / base × 100 = I)
- K1: Write price difference constraint correctly (y = x + D or equivalent)
- K1: Substitute to form and solve a single-variable equation for x
- P1: Back-calculate y from x

#### Structure

**Fixed (never changes between variants):**
```
"The price index of ingredient [X] for the year [current] based on the year [base] is [I].
The price per kg of ingredient [X] in [base year] is RM[D] less than its corresponding price
in [current year]. Calculate the value of x and of y."
Answer format: x = RM[2dp], y = RM[2dp]
```

**Variable (changes every variant):**
```
- Ingredient name and context
- Price index value I
- Price difference D (how much the current year price exceeds the base year price)
- The two years referenced
```

#### Variable Slots
```json
{
  "price_index_I": {
    "type": "integer",
    "pick_from": [120, 125, 130, 140, 150, 160],
    "rule": "must yield clean 2dp x when solved"
  },
  "price_difference_D": {
    "type": "float",
    "range": [2.00, 20.00],
    "decimal_places": 2,
    "rule": "D must be exactly divisible by (I - 100) to produce a clean base price"
  },
  "base_year": { "pick_from": [2015, 2018, 2019, 2020, 2022] },
  "current_year": { "rule": "base_year + 1 to +4" },
  "ingredient_label": { "pick_from": ["P", "Q", "R", "A", "B", "C"] }
}
```

#### Constraints
```
1. x = (D × 100) / (I − 100) — this must yield a clean 2dp result
   → choose D and I such that D × 100 is exactly divisible by (I − 100)
2. y = x + D — must also be 2dp clean (trivially satisfied if x is 2dp and D is 2dp)
3. x must be contextually plausible as a food ingredient price (RM1–RM50)
4. I must not be 100 (that would require D = 0 — trivial)
5. The price difference must make the problem unambiguous: "base year is RM[D] less" → y = x + D
```

#### Solution Steps
```
Step 1 | K1
What student writes: (y / x) × 100 = I  AND  y = x + D
Pattern cue: "two unknowns = two equations. Write both before solving."
Concept note: "price index formula always has base year on the BOTTOM"

Step 2 | K1
What student writes: substitute y = x + D into the index equation → I·x = 100(x + D)
Pattern cue: "replace y in equation 1 with (x + D), then expand and collect x terms"

Step 3 | K1
What student writes: (I − 100)x = 100D → x = (100D) / (I − 100)
Pattern cue: "move all x terms to one side — common mistake is forgetting to subtract 100x"

Step 4 | P1
What student writes: y = x + D (substitute the x value just found)
Pattern cue: "do not redo the whole calculation — just add D to your x answer"
```

#### Hint Ladder
```
Tier 1: "You need two equations — one from the price index formula, one from the price difference.
Write them both before you try to solve."

Tier 2: "Price index: (y / x) × 100 = [I]. Price difference: y = x + [D].
Now substitute the second equation into the first."

Tier 3: "[I] × x = 100 × (x + [D])
         [I]x = 100x + [100D]
         ([I] − 100)x = [100D]
         x = [100D] / ([I] − 100) = ___"

Tier 4 (static near-identical example):
"Price index = 140, price difference = RM6.
Equation 1: (y/x) × 100 = 140
Equation 2: y = x + 6
Sub: 140x = 100(x + 6) = 100x + 600
40x = 600 → x = RM15
y = 15 + 6 = RM21"
```

#### Common Wrongs
```
Error 1: Writes only one equation (just the index formula) and cannot solve → targets Step 1
Error 2: Sets up y − x = D as x − y = D (wrong direction of difference) → targets Step 1
Error 3: Substitutes correctly but makes algebra error: forgets to subtract 100x after expanding
          (e.g., writes 140x = 100x + 600 but then gets 140x = 600 instead of 40x = 600) → targets Step 3
Error 4: Finds x correctly but computes y = x − D instead of y = x + D → targets Step 4
Error 5: Rounds x mid-calculation and gets rounding error in y → targets Step 4
```

---

### Template: IDX-07 — Express One Unknown Weightage in Terms of Another

**Harvestable marks:** 3 out of 3 (K2, P1)
**Subpart:** (b) typically
**SPM format:** 4-item table; 2 weightages are known numbers, 2 are independent unknowns p and q;
composite index given; express p in terms of q (linear result)

#### What it tests
- K2: Set up composite index equation with all 4 individual indices (some requiring prior calculation)
      and all 4 weightages (2 numeric, 2 algebraic); simplify correctly
- P1: Rearrange to express p as a linear function of q

#### Structure

**Fixed:**
```
"Given that the composite index to produce [product] for the year [current] based on
the year [base] is [Ī], express p in terms of q."
Answer format: p = [constant] − [coefficient]q
```

**Variable:**
```
- Composite index Ī (integer, 120–145)
- Table with 4 ingredients; 2 with fully known prices (so their indices are computable),
  2 with indices given directly
- 2 numeric weightages (known), 2 unknown weightages labelled p and q
- Which 2 items carry p and which carry q
```

#### Variable Slots
```json
{
  "composite_index": { "type": "integer", "range": [120, 145] },
  "n_items": 4,
  "weightages": {
    "known_1": { "type": "integer", "range": [2, 7] },
    "known_2": { "type": "integer", "range": [2, 7] },
    "unknown_p": "p",
    "unknown_q": "q"
  },
  "individual_indices": {
    "note": "two given directly (e.g. 130, 140), two computed from prices in the table (e.g. 160, 110)",
    "type": "integer",
    "range": [105, 175]
  }
}
```

#### Constraints
```
1. The 4 individual indices must all be computable integers or clean decimals
2. The composite equation, after substituting all 4 indices + weightages, must simplify to
   a linear equation in p and q (no quadratics)
3. The final expression p = A − Bq must have A and B as simple fractions or integers
   (e.g., 19/2 − 7/2·q, not messy decimals)
4. p must remain positive for all realistic q values (check: p > 0 when q = 1, 2, 3, ...)
5. Composite index must lie in [120, 145] — SPM realistic range
6. Known weightages must not be 0; unknown weightages p and q are assumed positive integers
```

#### Solution Steps
```
Step 1a | (part of K2)
What student writes: compute any remaining individual indices from the table
Pattern cue: "find the indices you are NOT given — use the price index formula on the rows
              where both prices are shown"
Example cue: "I_R = (12.00 / 7.50) × 100 = 160"

Step 1b | (part of K2)
What student writes: substitute ALL 4 indices and ALL 4 weightages into the composite formula
  [I_1·w_1 + I_2·p + I_3·q + I_4·w_4] / (w_1 + p + q + w_4) = Ī
Pattern cue: "write every term explicitly — do not skip any item"
Concept note: "known weightages go in as numbers; p and q stay as letters"

Step 2 | P1
What student writes: cross-multiply, expand, collect p and q terms, rearrange to p = A − Bq
Pattern cue: "cross-multiply first to clear the denominator, then move all p terms to one side"
Concept note: "check: coefficient of p on the left must be positive so you can divide"
```

#### Hint Ladder
```
Tier 1: "First, find the price indices you are NOT given (use the rows where both prices
are in the table). Then write the composite index formula with all 4 items."

Tier 2: "Composite = [I_1·(w_1) + I_2·p + I_3·q + I_4·(w_4)] / (w_1 + p + q + w_4) = Ī
Fill in the numbers you know. Keep p and q as letters."

Tier 3 (partially filled):
"[known_numerator + I_2·p + I_3·q] / (known_denom + p + q) = Ī
Cross-multiply: known_numerator + I_2·p + I_3·q = Ī·known_denom + Ī·p + Ī·q
Collect: (I_2 − Ī)p = Ī·known_denom − known_numerator − (I_3 − Ī)q"

Tier 4 (full static worked example — numbers from SPM 2022):
"I_P=130, I_Q=140, I_R=160, I_S=110; weightages 5, p, q, 3; Ī=132
[130(5) + 140p + 160q + 110(3)] / (5 + p + q + 3) = 132
650 + 140p + 160q + 330 = 132(8 + p + q)
980 + 140p + 160q = 1056 + 132p + 132q
8p + 28q = 76 → p = 19/2 − (7/2)q"
```

#### Common Wrongs
```
Error 1: Computes composite indices for items where both prices are given but forgets to
          compute the index for items where prices ARE in the table → leaves gaps in numerator
          → targets Step 1a
Error 2: Uses number of items (4) as denominator instead of sum of weightages → targets Step 1b
Error 3: Cross-multiplies incorrectly — distributes Ī only across p and q terms, not the
          known weightage terms → targets Step 2
Error 4: Collects terms correctly but divides by coefficient of p to get p on its own
          but forgets to divide ALL terms by that coefficient → targets Step 2
Error 5: Writes p = A + Bq instead of p = A − Bq (sign error when moving the q term) → targets Step 2
```

---

### Template: IDX-08 — Chain-Link Composite Indices + Profit Markup

**Harvestable marks:** 3 out of 3 (K1, K1, P1)
**Subpart:** (c) typically
**SPM format:** Given composite index for period A→B and uniform % price increase from B→C,
find cost price in year C, then find selling price with a given profit target

#### What it tests
- K1: Chain-link the two composite indices correctly: Ī(A→C) = Ī(A→B) × Ī(B→C) / 100
- K1: Apply chain-linked index to base year price to get cost price in year C
- P1: Apply profit percentage to cost price to get selling price

#### Structure

**Fixed:**
```
"The price of [product] in [year A] is RM[P_A]."
"The prices of all the ingredients have increased by [r]% from [year B] to [year C]."
"Find the selling price of [product] in [year C], if the company is targetting a profit of [profit]%."
```

**Variable:**
```
- Base year price P_A
- Composite index for year B based on year A (carries over from part b)
- Uniform percentage increase r% from year B to year C
- Profit target percentage
```

#### Variable Slots
```json
{
  "base_year_price_PA": {
    "type": "float",
    "range": [20.00, 100.00],
    "decimal_places": 2,
    "rule": "must produce clean 2dp chain index price"
  },
  "composite_index_B_over_A": {
    "type": "integer",
    "range": [120, 145],
    "note": "typically carried over from part (b)"
  },
  "pct_increase_B_to_C": {
    "type": "integer",
    "pick_from": [10, 15, 20, 25],
    "note": "uniform increase applied to all ingredients → Ī(B→C) = 100 + r"
  },
  "profit_target_pct": {
    "type": "integer",
    "pick_from": [10, 12, 15, 20, 25],
    "note": "added on top of cost price in year C"
  }
}
```

#### Constraints
```
1. Chain index Ī(A→C) = Ī(A→B) × (100 + r) / 100 must produce a clean decimal (≤ 2dp)
2. Cost price in year C = Ī(A→C) / 100 × P_A must round to exactly 2dp
3. Selling price = (100 + profit%) / 100 × cost_C must round to exactly 2dp
4. All intermediate results must be achievable on a standard calculator to 2dp
5. Year C must be after year B which must be after year A (chronological order)
6. The composite index in step 1 must come from part (b) of the same question — do not
   invent a separate composite index for this subpart
```

#### Solution Steps
```
Step 1 | K1
What student writes: Ī(A→C) = Ī(A→B) × Ī(B→C) / 100
                   = [composite_from_part_b] × (100 + r) / 100
Pattern cue: "a uniform r% increase for ALL ingredients means the composite index
              for that period is exactly (100 + r) — no need to re-calculate weights"
Concept cue: "chain rule: index A→C = (index A→B × index B→C) / 100"

Step 2 | K1
What student writes: cost_C / P_A × 100 = Ī(A→C)
                   → cost_C = Ī(A→C) × P_A / 100
Pattern cue: "same formula as price index — the composite index IS the price ratio × 100"

Step 3 | P1
What student writes: selling price = (100 + profit%) / 100 × cost_C
Pattern cue: "profit on top of cost — multiply cost by (1 + profit/100)"
Concept note: "15% profit means selling price = cost × 1.15 — do NOT add 15 to the price directly"
```

#### Hint Ladder
```
Tier 1: "All prices went up by [r]% from year B to year C. That means the composite index
for year C based on year B is exactly [100 + r]. Now use the chain rule to link it
back to year A."

Tier 2: "Chain index: Ī(A→C) = Ī(A→B) × [100 + r] / 100
         = [composite_B_over_A] × [100 + r] / 100 = ___"

Tier 3: "Ī(A→C) = [computed chain index].
Cost in year C: ([chain index] / 100) × RM[P_A] = RM___
Selling price: (115 / 100) × RM___ = RM___"

Tier 4 (full static worked example — SPM 2022 numbers):
"Composite 2021/2019 = 132. All prices +20% from 2021→2022 → Ī(2022/2021) = 120.
Chain: Ī(2022/2019) = 132 × 120 / 100 = 158.4
Cost 2022: (158.4 / 100) × RM40 = RM63.36
Selling price (15% profit): (115/100) × RM63.36 = RM72.86"
```

#### Common Wrongs
```
Error 1: Applies the 20% increase directly to the base year price instead of chain-linking indices
          (e.g., computes 132/100 × 40 × 1.20 — this happens to give the same answer but
          the method is conceptually wrong and will fail non-uniform increase variants) → targets Step 1
Error 2: Uses the composite index from part (b) directly as the index for year C vs year A
          without chain-linking (forgets to account for the additional B→C increase) → targets Step 1
Error 3: Finds cost price correctly but adds profit as a flat RM amount rather than a percentage
          (e.g., adds RM15 instead of multiplying by 1.15) → targets Step 3
Error 4: Computes selling price as cost × profit% (e.g., 63.36 × 0.15 = 9.50) instead of
          cost × (1 + profit%) → targets Step 3
Error 5: Rounds intermediate chain index to integer (158) and gets a slightly wrong final answer → targets Step 2
```

---

## Template Coverage Summary for This Question

| Subpart | Marks | Template used | New / Existing |
|---------|-------|---------------|---------------|
| (a)(i) | 2 | **IDX-03** (Step 3: find current price from index + base price) | Existing |
| (a)(ii) | 4 | **IDX-06** (find both prices from index + price difference) | **NEW** |
| (b) | 3 | **IDX-07** (express one unknown weightage in terms of another) | **NEW** |
| (c) | 3 | **IDX-08** (chain-link composite indices + profit markup) | **NEW** |

---

## Supervision Checklist for Variants

- [ ] (a)(i): z = (I × base_price) / 100 rounds to exactly 2dp
- [ ] (a)(ii): D × 100 is exactly divisible by (I − 100) so x is a clean 2dp value; y = x + D also 2dp
- [ ] (a)(ii): x is a plausible food ingredient price (RM3–RM30)
- [ ] (b): All 4 individual indices are computable integers or clean decimals from the table
- [ ] (b): The resulting expression p = A − Bq has simple fractional or integer coefficients
- [ ] (b): p remains positive for small positive integer values of q (check q = 1 and q = 2)
- [ ] (c): Chain index = Ī(A→B) × (100 + r) / 100 is a clean decimal (≤ 2dp)
- [ ] (c): Cost price in year C rounds to exactly 2dp
- [ ] (c): Selling price rounds to exactly 2dp
- [ ] All intermediate values achievable on a standard calculator without needing more than 2dp precision
