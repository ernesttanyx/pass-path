# SPM 2024 — Question 15: Index Numbers
**Paper:** 3472/2 | **Topic:** Index Numbers | **Total marks:** 10

---

## Full Question Transcription

**15** Table 4 shows information for four ingredients used to produce a type of biscuit.

| Ingredient | Price in year (RM) — 2022 | Price in year (RM) — 2023 | Price index in 2023 with 2022 as base year | Weightage |
|:---:|:---:|:---:|:---:|:---:|
| A | *x* | 2.10 | 130 | *n* |
| B | 2.00 | 2.40 | *y* | *m* + *n* |
| C | 0.90 | 1.44 | 160 | *m*/3 |
| D | 1.20 | *z* | 150 | 2*n* |

*Table 4*

**(a)** Find the value of *x*, of *y* and of *z*. **[3 marks]**

**(b)** The composite index for the production cost of the biscuit in the year 2023 with 2022 as the base year is 135.

**(i)** Find the ratio of ingredient A to ingredient B used.

**(ii)** The production cost of 200 biscuits in the year 2022 is RM25. The price of each ingredient is expected to increase by 20.25% from the year 2023 to the year 2025. In the year 2025, the box used to fit 40 biscuits is expected to cost RM1.50 per unit.

In the year 2025, if RM45 is allocated to produce 200 biscuits including the purchase of the box, determine whether or not the allocation is enough. **[7 marks]**

---

## K/P Mark Identification (from marking scheme)

> Mark allocation: (a) 3 marks | (b)(i) 3 marks | (b)(ii) 4 marks = **10 total**

### Part (a) — 3 marks, all K

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Find *x* (base year price for A) | (2.10 / *x*) × 100 = 130 → *x* = 2.10 × 100 / 130 = **1.62** |
| 2 | **K1** | Find *y* (price index for B) | *y* = (2.40 / 2.00) × 100 = **120** |
| 3 | **K1** | Find *z* (current year price for D) | (*z* / 1.20) × 100 = 150 → *z* = 150 × 1.20 / 100 = **1.80** |

### Part (b)(i) — 3 marks

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Substitute all known indices and weightages into composite index formula | [130(*n*) + 120(*m*+*n*) + 160(*m*/3) + 150(2*n*)] / [*n* + (*m*+*n*) + *m*/3 + 2*n*] = 135 |
| 2 | **K1** | Solve to obtain *m* : *n* ratio | 10*n* = (20/3)*m* → *m*/*n* = 3/2 → **m : n = 3 : 2** |
| 3 | **P1** | State ratio A : B using weightages *n* and *m*+*n* | A : B = *n* : (*m*+*n*) = 2 : (3+2) = **2 : 5** |

### Part (b)(ii) — 4 marks

| Mark | Type | Step | Working shown |
|------|------|------|---------------|
| 1 | **K1** | Use composite index to find 2023 production cost | Ī₂₃/₂₂ = 135 → P₂₀₂₃/RM25 × 100 = 135 → **P₂₀₂₃ = RM33.75** |
| 2 | **K1** | Apply 20.25% increase to find 2025 production cost | Ī₂₅/₂₃ = 100 + 20.25 = 120.25 → P₂₀₂₅/RM33.75 × 100 = 120.25 → **P₂₀₂₅ = RM40.58** |
| 3 | **P1** | Add box cost and compute total | Boxes needed = 200 ÷ 40 = 5; Box cost = 5 × RM1.50 = RM7.50; **Total = RM40.58 + RM7.50 = RM48.08** |
| 4 | **P1** | State conclusion | RM48.08 > RM45 ∴ **The allocation is NOT enough.** |

---

## Template Mappings (CONTENT_TEMPLATE_REFERENCE.md format)

---

### Template: IDX-03 — Find Unknown Price / Index in Multi-Item Table

**Harvestable marks:** 3 out of 3 (all K)
**Subpart:** (a) typically
**SPM format:** 4-item table; some prices or indices are unknown variables

#### What it tests
- K1: Rearrange price index formula to find base year price (given index + current price)
- K1: Apply price index formula forward (given both prices, find index)
- K1: Rearrange price index formula to find current year price (given index + base price)

#### Structure

**Fixed (never changes between variants):**
```
"Table X shows information for N ingredients used to produce [product]."
"Find the value of x, of y and of z."
Answer format: x = [2dp], y = [integer or 2dp], z = [2dp]
```

**Variable (changes every variant):**
```
- Number of items (typically 4)
- Which items have unknown base price, unknown index, unknown current price
- The known price values and index values
- The product context (biscuit, cake, drink, etc.)
```

#### Variable Slots
```json
{
  "n_items": 4,
  "unknown_positions": {
    "x_type": "base_price",
    "y_type": "price_index",
    "z_type": "current_price"
  },
  "items": ["A", "B", "C", "D"],
  "known_base_prices": { "type": "float", "range": [0.50, 5.00], "decimal_places": 2 },
  "known_current_prices": { "type": "float", "range": [1.00, 8.00], "decimal_places": 2 },
  "known_indices": { "type": "integer", "range": [110, 170] },
  "base_year": 2022,
  "current_year": 2023
}
```

#### Constraints
```
1. x (base price) must yield a 2dp result when reverse-calculated
2. y (price index) must be a clean integer (e.g. 120, 125, 130) — SPM convention
3. z (current price) must yield a clean 2dp result
4. No individual price index should be exactly 100
5. Prices must be contextually plausible for food ingredients
```

#### Solution Steps
```
Step 1 | K1
What student writes: (current_price / x) × 100 = known_index → x = current_price × 100 / index
Pattern cue: "index given, current price given — base price goes on BOTTOM, solve for it"

Step 2 | K1
What student writes: y = (current_price / base_price) × 100
Pattern cue: "both prices given — standard formula, no rearranging needed"

Step 3 | K1
What student writes: (z / base_price) × 100 = known_index → z = index × base_price / 100
Pattern cue: "index given, base price given — rearrange to get current price"
```

#### Hint Ladder
```
Tier 1: "Price index formula: I = (current price / base price) × 100. Decide which value is missing and rearrange."
Tier 2: "For x: x is the base price. Rearrange to get x = (current price × 100) / index."
Tier 3: "x = (2.10 × 100) / 130 = ___. Fill in the calculation."
Tier 4: "x = (2.10 × 100) / 130 = 1.62. y = (2.40/2.00) × 100 = 120. z = (150 × 1.20)/100 = 1.80."
```

#### Common Wrongs
```
Error 1: Puts current price on bottom instead of base price (inverted formula) → targets Steps 1, 3
Error 2: Forgets ×100 in the formula → targets Step 2
Error 3: For z, multiplies base price by index without dividing by 100 → targets Step 3
Error 4: Rounds x to 1 decimal place (1.6) instead of 2dp → targets Step 1
```

---

### Template: IDX-04 — Find Weightage Ratio from Composite Index

**Harvestable marks:** 3 out of 3 (K1, K1, P1)
**Subpart:** (b)(i) typically
**SPM format:** All individual indices known; weightages expressed as algebraic expressions in m and n; composite index given; find ratio of two specific ingredients

#### What it tests
- K1: Correctly substitute all indices and algebraic weightages into composite formula and set equal to given composite
- K1: Simplify and solve to find m : n
- P1: Convert m : n into the correct ingredient ratio (A : B = weightage_A : weightage_B)

#### Structure

**Fixed:**
```
"The composite index for the production cost of [product] in [current year] with [base year] as base year is [value]."
"Find the ratio of ingredient A to ingredient B used."
```

**Variable:**
```
- The composite index value (135 in this question)
- The individual price indices (130, 120, 160, 150 in this question)
- The algebraic weightage expressions (n, m+n, m/3, 2n in this question)
- Which two ingredients' ratio is asked
```

#### Variable Slots
```json
{
  "composite_index": { "type": "integer", "range": [120, 145] },
  "individual_indices": {
    "count": 4,
    "type": "integer",
    "range": [110, 170],
    "rule": "must yield integer or clean decimal m:n solution"
  },
  "weightage_expressions": {
    "note": "expressed as linear combinations of m and n, e.g. n, m+n, m/3, 2n"
  },
  "target_ratio_items": ["A", "B"]
}
```

#### Constraints
```
1. The resulting m : n must be a simple integer ratio (e.g. 3:2, 2:1, 4:3)
2. The ratio A : B (using their respective weightage expressions evaluated at m:n) must simplify cleanly
3. The composite index equation must be solvable with standard algebra — no quadratics
4. Composite index must sit between 120 and 145 (SPM realistic range for biscuit/food cost)
```

#### Solution Steps
```
Step 1 | K1
What student writes: Substitute all 4 indices and their algebraic weightages into
  Composite = Σ(I_i × W_i) / ΣW_i = 135
Pattern cue: "write out all 4 terms on top, all 4 weightage expressions on bottom — then simplify"
Concept note: "keep m and n as letters, collect like terms"

Step 2 | K1
What student writes: Simplify both sides, collect m and n terms, find m/n or m:n
Pattern cue: "cross-multiply first to remove the fraction, then move all m terms to one side, n terms to other"

Step 3 | P1
What student writes: Substitute m:n back into the weightage expressions for A and B
Pattern cue: "A's weightage = n, B's weightage = m+n — use the ratio you just found"
Concept note: "if m:n = 3:2, let m=3 and n=2, then compute each weightage as a number"
```

#### Hint Ladder
```
Tier 1: "Write the composite index formula. Plug in all four price indices and their weightages (with m and n as letters). Set equal to 135."
Tier 2: "Numerator: 130n + 120(m+n) + 160(m/3) + 150(2n). Denominator: n + (m+n) + m/3 + 2n. Simplify each."
Tier 3: "After simplifying: numerator = 550n + (520/3)m, denominator = 4n + (4/3)m. Set ratio = 135 and solve."
Tier 4: "Full worked example: 550n + (520/3)m = 135(4n + (4/3)m) → 10n = (20/3)m → m:n = 3:2 → A:B = n:(m+n) = 2:5"
```

#### Common Wrongs
```
Error 1: Uses number of items (4) as denominator instead of sum of weightages → targets Step 1
Error 2: Drops the algebraic weightage for one item (treats it as a number) → targets Step 1
Error 3: Finds m:n correctly but then states A:B = m:n directly (ignores weightage expressions) → targets Step 3
Error 4: Cross-multiplication error when clearing the composite fraction → targets Step 2
```

---

### Template: IDX-05 — Multi-Year Cost Projection with Fixed Additional Cost

**Harvestable marks:** 4 out of 4 (K1, K1, P1, P1)
**Subpart:** (b)(ii) typically
**SPM format:** Given cost in base year + composite index → find cost in year 2 → apply % increase to year 3 → add fixed per-unit packaging cost → compare with allocation

#### What it tests
- K1: Use composite index to find production cost in intermediate year
- K1: Apply percentage increase to find production cost in target year
- P1: Compute packaging cost (units needed × cost per unit) and add to production cost
- P1: Compare total cost against allocation and state conclusion correctly

#### Structure

**Fixed:**
```
"The production cost of [n] [items] in [base year] is RM[X]."
"The price of each ingredient is expected to increase by [p]% from [year_2] to [year_3]."
"In [year_3], the box used to fit [k] [items] is expected to cost RM[b] per unit."
"In [year_3], if RM[A] is allocated to produce [n] [items] including the purchase of the box,
determine whether or not the allocation is enough."
```

**Variable:**
```
- Base year production cost, number of items (200 biscuits / RM25 in this question)
- Composite index value (135 — links to part b)
- Percentage increase from year_2 to year_3 (20.25%)
- Box capacity (40 biscuits), box cost per unit (RM1.50)
- Total allocation to compare (RM45)
```

#### Variable Slots
```json
{
  "n_items": { "type": "integer", "pick_from": [100, 200, 500] },
  "base_year_cost": { "type": "float", "range": [15.00, 50.00], "decimal_places": 2 },
  "composite_index_year2_over_year1": { "type": "integer", "range": [120, 145] },
  "pct_increase_year2_to_year3": {
    "type": "float", "range": [10.00, 30.00], "decimal_places": 2,
    "rule": "must yield clean 2dp final cost"
  },
  "box_capacity": { "type": "integer", "pick_from": [20, 25, 40, 50] },
  "box_unit_cost": { "type": "float", "range": [1.00, 3.00], "decimal_places": 2 },
  "allocation": {
    "type": "float",
    "rule": "set to be either slightly above or slightly below the true total cost",
    "note": "RM45 in this question; true cost is RM48.08 so allocation is NOT enough"
  }
}
```

#### Constraints
```
1. n_items must be exactly divisible by box_capacity (no partial boxes)
2. P_year3 (production cost without box) must round to exactly 2dp
3. Total cost (P_year3 + box_cost) must differ clearly from allocation (not equal — not ambiguous)
4. Conclusion must be unambiguous: allocation either clearly enough or clearly not enough
5. All intermediate values expressible to 2dp
```

#### Solution Steps
```
Step 1 | K1
What student writes: P_year2 / P_year1 × 100 = composite_index
  → P_year2 = composite_index × P_year1 / 100
Pattern cue: "the composite index IS the price ratio × 100 — use it exactly like a price index"
Concept note: "composite index links costs across years, same formula as individual price index"

Step 2 | K1
What student writes: Ī_year3/year2 = 100 + pct_increase
  → P_year3 / P_year2 × 100 = 120.25
  → P_year3 = 120.25 × P_year2 / 100
Pattern cue: "percentage increase → convert to index by adding 100"

Step 3 | P1
What student writes:
  Boxes needed = n_items ÷ box_capacity
  Box cost = boxes_needed × cost_per_box
  Total cost = P_year3 + box_cost
Pattern cue: "integer division for boxes — then multiply, then add to production cost"

Step 4 | P1
What student writes: Compare total cost vs allocation, state conclusion
Pattern cue: "write the comparison clearly: RM48.08 > RM45 → not enough"
Concept note: "must state the reason: total EXCEEDS allocation"
```

#### Hint Ladder
```
Tier 1: "What is the production cost in 2023? Use the composite index as a price index: P_2023 = (135/100) × RM25."
Tier 2: "20.25% increase means the price index from 2023 to 2025 is 120.25. Apply it: P_2025 = (120.25/100) × P_2023."
Tier 3: "P_2023 = RM33.75. P_2025 = (120.25/100) × 33.75 = RM40.58. Boxes: 200÷40 = 5 boxes × RM1.50 = RM7.50."
Tier 4: "Total = RM40.58 + RM7.50 = RM48.08. RM48.08 > RM45, so the allocation is NOT enough."
```

#### Common Wrongs
```
Error 1: Uses P_year1 directly in the year3 percentage increase (skips the year2 intermediate step) → targets Step 2
Error 2: Treats 20.25% as an index (uses 20.25 instead of 120.25) → targets Step 2
Error 3: Calculates total box cost as 1 × RM1.50 (ignores that multiple boxes are needed) → targets Step 3
Error 4: Adds box cost before applying the percentage increase → targets Steps 2 and 3
Error 5: States conclusion without explicit comparison ("RM48.08 > RM45") → targets Step 4
Error 6: Rounds P_2025 to RM40.57 or RM40.59 (rounding error in intermediate step) → targets Step 2
```

---

## No Graphs or Diagrams in This Question
This question is entirely table-based. No coordinate geometry or graph reading required.

---

## Supervision Checklist for This Question's Variants

- [ ] x rounds exactly to 2dp (check: 2.10 × 100 / index must be 2dp-clean)
- [ ] y is a clean integer price index
- [ ] z rounds exactly to 2dp
- [ ] m : n in (b)(i) is a simple integer ratio
- [ ] A : B ratio in (b)(i) uses the correct weightage expressions (not m and n raw)
- [ ] n_items is divisible by box_capacity (no partial boxes)
- [ ] Final total clearly exceeds or clearly falls below the allocation (not a tie)
- [ ] All intermediate values achievable with a standard calculator to 2dp
