# Tacly — Question Pattern Template Reference

This file is the master reference for how to define question templates.
One template = one question type. AI generates variants from it. Teacher approves variants.

---

## How to read this file

Each template has these sections:
- **What it tests** — the exact K/P marks being harvested
- **Structure** — fixed vs. variable parts of the question
- **Variable slots** — what numbers/values change per variant
- **Constraints** — rules that make a variant valid and SPM-realistic
- **Solution steps** — ordered, each labelled K or P with mark value
- **Hint ladder** — all 4 tiers pre-defined
- **Common wrongs** — known error patterns to detect

---

# TOPIC 1: Index Numbers

## Template: IDX-01 — Composite Index (3 items, weighted)

**Harvestable marks:** 3 out of 6
**Subpart:** (a)(i) typically
**SPM format:** Table with items, base year price, current year price, weightage

### What it tests
- K1: Write or apply price index formula for at least one item
- K1: Calculate all individual price indices correctly
- P1: Apply composite index formula correctly (correct denominator)

### Structure

**Fixed (never changes between variants):**
```
"Table X shows the prices and weightages of N items."
"Using {base_year} as the base year, calculate the composite index for {current_year}."
Answer format: composite index = [number to 2dp]
```

**Variable (changes every variant):**
```
- Item names (picked from pool)
- Base year prices
- Current year prices
- Weightages
- The years referenced
```

### Variable Slots
```json
{
  "n_items": 3,
  "item_names": {
    "pick_from": ["rice", "sugar", "flour", "cooking oil", "eggs", "chicken", "vegetables"],
    "count": 3
  },
  "base_year": {
    "pick_from": [2015, 2018, 2019, 2020]
  },
  "current_year": {
    "rule": "base_year + 2 to +5"
  },
  "price_base": {
    "type": "float",
    "range": [1.00, 25.00],
    "decimal_places": 2
  },
  "price_current": {
    "type": "float",
    "must_be": "greater than price_base",
    "decimal_places": 2
  },
  "weightage": {
    "type": "integer",
    "range": [1, 6],
    "rule": "not all equal across items"
  }
}
```

### Constraints (what makes a valid variant)
```
1. Each individual price index must round cleanly to 2 decimal places
2. Composite index result must land between 105.00 and 150.00
3. No individual price index should be exactly 100.00 (trivial — base = current)
4. Weightages must not all be equal (that makes denominator trivially = n × one weight)
5. Prices must be contextually plausible (rice ≥ RM1, cooking oil ≥ RM3, etc.)
```

### Solution Steps
```
Step 1 | K1
What student writes: I_A = (P_current / P_base) × 100
Pattern cue: "base year column goes on the BOTTOM of the fraction"
Concept note: none needed

Step 2 | K1
What student writes: compute index for all 3 items, show at least one explicitly
Pattern cue: "same formula, 3 times — copy the structure"
Concept note: none needed

Step 3 | P1
What student writes: Composite = Σ(I_i × W_i) / ΣW_i
Pattern cue: none
Concept note: "denominator = total of all weightages, NOT the number of items — this is the #1 wrong answer"
```

### Hint Ladder
```
Tier 1 (pattern cue):
"Look at the table. Find the column with the earlier year — that's your base year.
It goes on the BOTTOM of the fraction."

Tier 2 (formula skeleton):
"Price index = (current year price / base year price) × 100
Try item A first."

Tier 3 (filled formula, student plugs values):
"I_A = ( ___ / ___ ) × 100
Fill in item A's current year price on top, base year price on bottom."

Tier 4 (full walkthrough — static near-identical example):
"Given: Rice base = RM4.00, current = RM5.20, weight = 3
        Sugar base = RM2.50, current = RM3.00, weight = 2
I_rice = (5.20/4.00) × 100 = 130.00
I_sugar = (3.00/2.50) × 100 = 120.00
Composite = (130×3 + 120×2) / (3+2) = (390+240)/5 = 126.00"
```

### Common Wrongs
```
Error 1: Divides composite by n=3 instead of Σweights → targets Step 3
Error 2: Swaps base and current year (puts current on bottom) → targets Step 1
Error 3: Skips showing individual indices, jumps straight to composite → targets Step 2
Error 4: Uses unweighted average (130+120+115)/3 instead of weighted → targets Step 3
```

---

## Template: IDX-02 — Find Unknown Price Given Composite Index

**Harvestable marks:** 2 out of 6
**Subpart:** (a)(ii) typically
**SPM format:** Given composite index and all-but-one individual index, find the missing price

### What it tests
- K1: Substitute known values into composite index formula correctly
- K1: Solve for unknown individual index or price

### Structure
**Fixed:** "Given that the composite index is X, find the price of item C in year Y."
**Variable:** composite index value, which item is missing, the prices

### Variable Slots
```json
{
  "given_composite": { "type": "float", "range": [110.00, 145.00], "decimal_places": 2 },
  "known_indices": { "type": "float", "count": 2, "range": [105.00, 150.00] },
  "unknown_item": { "pick_from": ["A", "B", "C"] },
  "base_price_of_unknown": { "type": "float", "range": [2.00, 20.00] }
}
```

### Constraints
```
1. Solving for the unknown must yield a clean 2dp result
2. Unknown price must be contextually plausible
3. Unknown index must be between 100 and 160
```

### Solution Steps
```
Step 1 | K1
What student writes: substitute all known values into Composite = Σ(I_i × W_i) / ΣW_i
Pattern cue: "plug in everything you know, leave the unknown as x"

Step 2 | K1
What student writes: solve for x (the unknown index), then back-calculate price if needed
Concept note: "if they ask for price: price = (index / 100) × base price"
```

### Hint Ladder
```
Tier 1: "You know the composite index already. Write the composite formula and put in what you know."
Tier 2: "X × w_A + ? × w_B + X_C × w_C = composite × Σweights. Solve for the missing value."
Tier 3: "[formula with blanks matching the specific variant values]"
Tier 4: "[full static worked example]"
```

### Common Wrongs
```
Error 1: Forgets to multiply composite by Σweights before solving → targets Step 1
Error 2: Finds the index but forgets to convert back to price → targets Step 2
```

---

# TOPIC 2: Linear Programming

## Template: LP-01 — Define Variables + Write Inequalities

**Harvestable marks:** 3 out of 4
**Subpart:** (a) typically
**SPM format:** Word problem describing two quantities with constraints

### What it tests
- K1: Define variables correctly (let x = ..., let y = ...)
- K1: Write at least 2 inequalities correctly from the word problem
- P1: Include non-negativity constraints (x ≥ 0, y ≥ 0)

### Structure
**Fixed:** "A factory produces x units of A and y units of B per day.
The production is subject to the following constraints..."
**Variable:** the items, the constraint numbers, the objective function coefficients

### Variable Slots
```json
{
  "context": {
    "pick_from": [
      "factory producing two products",
      "school buying two types of items",
      "farmer planting two crops"
    ]
  },
  "var_x_label": { "type": "string", "examples": ["tables", "type A biscuits", "durian trees"] },
  "var_y_label": { "type": "string", "examples": ["chairs", "type B biscuits", "rambutan trees"] },
  "constraint_1_coeff_x": { "type": "integer", "range": [1, 5] },
  "constraint_1_coeff_y": { "type": "integer", "range": [1, 5] },
  "constraint_1_rhs": { "type": "integer", "range": [20, 100] },
  "constraint_2_coeff_x": { "type": "integer", "range": [1, 4] },
  "constraint_2_coeff_y": { "type": "integer", "range": [1, 4] },
  "constraint_2_rhs": { "type": "integer", "range": [10, 60] },
  "objective_coeff_x": { "type": "integer", "range": [2, 10] },
  "objective_coeff_y": { "type": "integer", "range": [2, 10] }
}
```

### Constraints (on variant generation)
```
1. The feasible region must be a bounded polygon (not open-ended)
2. The optimal point must occur at a vertex, not along an edge
3. Constraint coefficients must produce intersection points with integer or clean decimal coordinates
4. The two constraint lines must actually intersect within x ≥ 0, y ≥ 0
```

### Solution Steps
```
Step 1 | K1
What student writes: "Let x = [quantity A], let y = [quantity B]"
Pattern cue: "x is always the first thing mentioned. y is second."
Concept note: none

Step 2 | K1
What student writes: write all inequalities from the word problem
Pattern cue: "each 'cannot exceed / at least / no more than' = one inequality"
Concept note: "more than → > ; at least → ≥ ; does not exceed → ≤"

Step 3 | P1
What student writes: include x ≥ 0, y ≥ 0
Pattern cue: "always add these two lines — full marks depend on it"
Concept note: none
```

### Hint Ladder
```
Tier 1: "Read the first constraint. What two things are being compared? Translate it to x and y."
Tier 2: "Each constraint in the problem = one inequality. List them out one by one."
Tier 3: "Constraint 1 says [exact text]. That becomes: {coeff_x}x + {coeff_y}y ≤ {rhs}."
Tier 4: "[Full static worked example with near-identical numbers]"
```

### Common Wrongs
```
Error 1: Defines variables but writes equations (=) instead of inequalities → targets Step 2
Error 2: Forgets x ≥ 0, y ≥ 0 → targets Step 3
Error 3: Swaps x and y definition mid-solution → targets Step 1
```

---

## Template: LP-02 — Identify Feasible Region + Find Optimal Value

**Harvestable marks:** 1 out of 4 (this is the graph + shade + optimise subpart)
**Note:** This subpart requires drawing — platform presents the graph, student identifies vertex and computes P

### What it tests
- P1: Substitute vertex coordinates into objective function, identify maximum/minimum

### Structure
**Fixed:** "From the graph, find the maximum/minimum value of P = ax + by"
**Variable:** vertex coordinates (derived from LP-01 constraints), objective coefficients

### Solution Steps
```
Step 1 | P1
What student writes: substitute each vertex into P = ax + by, compare values
Pattern cue: "list all vertices. Try each one. Biggest = maximum."
Concept note: "optimal is ALWAYS at a vertex of the shaded region — never in the middle"
```

---

# TOPIC 3: Linear Law

## Template: LL-01 — Reduce Non-Linear to Linear Form

**Harvestable marks:** 2 out of 5
**Subpart:** (a) typically
**SPM format:** Given y = ax^n or y = ab^x, reduce to Y = mX + c form

### What it tests
- K1: Apply log or reciprocal correctly to linearise
- K1: Identify Y, X, m (gradient), c (y-intercept) in terms of original variables

### Structure
**Fixed:** "Express [non-linear equation] in the form Y = mX + c. State Y, X, m, and c."
**Variable:** the type of non-linear equation, the constants a, b, n

### Variable Slots
```json
{
  "equation_type": {
    "pick_from": ["y = ax^n", "y = ab^x", "y = a/x + b"]
  },
  "constant_a": { "type": "integer", "range": [2, 9] },
  "constant_n": { "type": "integer", "range": [2, 4] },
  "constant_b": { "type": "float", "range": [1.5, 5.0] }
}
```

### Constraints
```
1. Linearisation must produce a recognisable log form
2. The gradient m must be a simple expression (e.g., n, log a — not compound fractions)
3. For y = ax^n: take log both sides → log y = log a + n log x
4. For y = ab^x: take log both sides → log y = log a + x log b
```

### Solution Steps
```
Step 1 | K1
What student writes: apply log to both sides (or reciprocal for y = a/x + b)
Pattern cue: "if the unknown is in the POWER → take log. If it's a fraction → flip it."
Concept note: "log(ab) = log a + log b. log(x^n) = n log x. These two rules are all you need."

Step 2 | K1
What student writes: state Y = log y, X = log x, m = n, c = log a (for y = ax^n)
Pattern cue: "write it in the exact form Y = mX + c and label each part"
Concept note: none
```

### Hint Ladder
```
Tier 1: "Is the unknown in the power? Yes → take log of both sides."
Tier 2: "log y = log a + n log x. Now match this to Y = mX + c. What is Y? What is X?"
Tier 3: "Y = log y, X = log x, m = {n}, c = log {a}. Write it out exactly like this."
Tier 4: "[Full static example: y = 3x^2 → log y = log 3 + 2 log x → Y=log y, X=log x, m=2, c=log 3]"
```

### Common Wrongs
```
Error 1: Writes Y = y instead of Y = log y → targets Step 2
Error 2: Puts n as c and log a as m (swaps gradient and intercept) → targets Step 2
Error 3: Doesn't apply log to both sides correctly (e.g., log(ax^n) = a log x^n) → targets Step 1
```

---

## Template: LL-02 — Read Gradient and Y-Intercept from Graph + Find Constants

**Harvestable marks:** 3 out of 5
**Subpart:** (b) and (c) typically
**SPM format:** Given a straight-line graph of Y against X, read off values and calculate a, n (or a, b)

### What it tests
- K1: Read gradient correctly from graph (must show rise/run with clear coordinates)
- K1: Read y-intercept correctly (force 2dp)
- P1: Back-calculate original constants a and n from gradient and y-intercept

### Structure
**Fixed:** "The graph shows a straight line. Find the gradient, y-intercept, and hence calculate a and n."
**Variable:** the two coordinates used to calculate gradient, the y-intercept value, the equation type

### Variable Slots
```json
{
  "point_1": { "x": [1, 3], "y": [2.0, 6.0] },
  "point_2": { "x": [4, 7], "y": [5.0, 12.0] },
  "y_intercept": { "type": "float", "range": [0.20, 3.00], "decimal_places": 2 }
}
```

### Constraints
```
1. Gradient must be a positive value (SPM convention for these question types)
2. Both read-off points must be clearly on the grid (integer or 0.5 increments)
3. Back-calculated a must be achievable via 10^c (for log-type linearisation)
4. All intermediate values must be expressible to 2dp — FORCE 2dp throughout
```

### Solution Steps
```
Step 1 | K1
What student writes: m = (Y2 - Y1) / (X2 - X1) using two clear points from the graph
Pattern cue: "pick two points FAR APART on the line — wider = more accurate"
Concept note: "gradient = rise ÷ run. Rise = up, run = right."

Step 2 | K1
What student writes: read c from where line crosses Y-axis, write to 2dp
Pattern cue: "where does the line touch the vertical axis? That's c."
Concept note: none

Step 3 | P1
What student writes: convert back — if m = n then n = m; if c = log a then a = 10^c
Pattern cue: "use the labels you wrote in part (a) — m IS n, c IS log a"
Concept note: "to undo log: a = 10^c. Use calculator. Force 2dp."
```

### Hint Ladder
```
Tier 1: "Find two points on the line. Write their coordinates. Gradient = (Y2-Y1)/(X2-X1)."
Tier 2: "m = ({y2} - {y1}) / ({x2} - {x1}) = ___. Now find where the line crosses the Y-axis."
Tier 3: "m = {gradient}. Y-intercept = {c}. From part (a): m = n, so n = {gradient}. c = log a, so a = 10^{c}."
Tier 4: "[Full static worked example]"
```

### Common Wrongs
```
Error 1: Calculates gradient but doesn't round to 2dp → targets Step 1
Error 2: Reads x-intercept instead of y-intercept → targets Step 2
Error 3: Sets a = c directly instead of a = 10^c → targets Step 3
Error 4: Uses only one point to find gradient (meaningless) → targets Step 1
```

---

# How to Add a New Template (for Shawn / teacher)

When your teacher gives you a new question type, fill in this skeleton:

```
Template ID: [TOPIC]-[NUMBER]
Topic: [index_numbers / linear_programming / linear_law]
Subpart label: (a)(i) / (b) / etc.
Harvestable marks: X out of Y

What it tests:
- K1: [what step]
- P1: [what step]

Fixed structure:
[paste the question text, mark which parts never change]

Variable slots:
[list what numbers/values change, their ranges, any rules]

Constraints:
[what makes a variant valid — mathematical + contextual]

Solution steps:
[ordered list, each with: mark type, mark value, what student writes, any pattern cue or concept note]

Hint ladder:
Tier 1: [pattern cue]
Tier 2: [formula skeleton]
Tier 3: [filled formula with blanks]
Tier 4: [full static worked example]

Common wrongs:
[list errors you've seen in class, which step they target]
```

---

# Supervision Checklist (for each AI-generated batch)

Before approving a variant, check:
- [ ] Numbers are contextually plausible (prices, quantities make real-world sense)
- [ ] Answer is achievable with a standard calculator
- [ ] Intermediate steps round cleanly to 2dp
- [ ] The question looks like something SPM would actually ask
- [ ] No trivial cases (e.g., price index = exactly 100, gradient = 0)
