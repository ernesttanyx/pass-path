# Change Log — 2026-05-08 (Session B)

## Session summary
Continued from Session A. Fixed text color regression, added visual fraction renderer for hints, and updated hint generation prompts.

---

## 1. Fixed invisible text on white/cream backgrounds

StepCard.tsx — 4 labels in the white scrollable body were `text-white/60` (invisible):
- "Soalan" label → `text-black/40`
- "Petunjuk X" hint label → `text-black/50`
- "Pilih cara yang betul:" → `text-black/40`
- "Tunjuk cara kira:" → `text-black/40`

Dashboard.tsx:
- "Minggu ini" label → `text-black/40`
- TopicCard `/{total}` → `text-black/40`

---

## 2. HintBody renderer for visual fractions

New `HintBody` component in `StepCard.tsx`:
- Detects `ATAS: X` / `BAWAH: Y` lines → renders as stacked `Frac` component
- Detects inline `A / B` → renders as stacked `Frac`
- Used in hint display: `<HintBody text={hint.body_bm/en} />`

---

## 3. generate-hints.ts prompt rewrite

All 4 tier prompts updated:
- Fraction rule: ALWAYS use `ATAS: X\nBAWAH: Y`, NEVER use `/`
- Simpler BM language for F-grade students
- Concrete numeric examples in tiers 3+4

**Action required — re-run hints:**
```
npx tsx scripts/generate-hints.ts
```

---

## Files changed
- `src/components/practice/StepCard.tsx`
- `src/pages/Dashboard.tsx`
- `scripts/generate-hints.ts`
- `CHANGE_LOG_2026_05_08_B.md` (this file)
