# Archive Report — F-02 Vista Presupuesto

**Change**: f-02
**Feature**: F-02 — Vista presupuesto
**PR**: #13
**Date**: 2026-05-07
**Status**: ✅ Archived

---

## Summary

Implemented a full budget view (`/presupuesto`) that aggregates trip costs across five categories (flights, transfers, insurance, lodging, activities) and allows toggling between 5 and 6 passengers to recalculate per-person and group totals in real time.

The implementation followed SDD through all phases (explore → propose → spec → design → tasks → apply → verify) and was delivered via three chained PRs (PR-1 data+nav, PR-2 shell+hero, PR-3 detail UI).

---

## Files Created

| File | Description |
|---|---|
| `src/content/budget-items/*.json` | 16 budget data files (flights, transfers, insurance, activities) |
| `src/lib/budget.ts` | Budget calculations: `categoryTotals`, `fmt`, `fmtRange` |
| `src/pages/presupuesto.astro` | Page shell with responsive CSS visibility toggle |
| `src/components/budget/BudgetView.tsx` | Root Preact island with `pax`/`viz` state |
| `src/components/budget/PaxToggle.tsx` | Segmented 5/6 passenger toggle |
| `src/components/budget/TotalHero.tsx` | Hero with per-pax total and group contramuestra |
| `src/components/budget/StackedBar.tsx` | Horizontal stacked bar with midpoint proportions |
| `src/components/budget/PercentTable.tsx` | Mono-font table with % bars per category |
| `src/components/budget/DestinationBreakdown.tsx` | Accommodation breakdown by destination with ranking badges |
| `src/components/budget/LineItemsSection.tsx` | Fixed + variable line items with placeholder/free/critical handling |

## Files Modified

| File | Description |
|---|---|
| `src/content.config.ts` | Added `budgetItems` Zod schema |
| `src/lib/types.ts` | Exported `BudgetItem` type |
| `src/lib/trip.ts` | Added `getBudgetItems()` helper |
| `src/layouts/BaseLayout.astro` | Extended `activeTab` union with `'presupuesto'` |
| `src/components/nav/TopNav.astro` | Added tab #05 · PRESUPUESTO |
| `src/components/nav/TabBar.astro` | Added tab #05 · USD |

---

## Verification Results

| Metric | Value |
|--------|-------|
| Tasks total | 20 |
| Tasks complete | 20 |
| Build | ✅ Passed |
| Type check | ✅ 0 errors, 0 warnings |
| Spec compliance | ✅ 10/10 scenarios |
| Issues critical | 0 |
| Issues warnings | 2 (non-blocking) |

**Verdict**: PASS WITH WARNINGS

---

## Follow-up Items

1. **`client:only` vs `client:visible`**: The spec required `client:visible` for SEO indexing of initial totals, but the design explicitly chose `client:only` to match the `/reservas` pattern. Intentional deviation; revisit if SEO becomes a priority.
2. **`free` + `placeholder` precedence**: `registro-fitz-roy` has both `free: true` and `range: null`. Current rendering shows placeholder text; spec should define precedence if this pattern repeats.
3. **Unused `destSlug` field**: Defined in schema and populated in some JSONs but not consumed by any component. Safe to remove or wire in a future feature.

---

## SDD Artifacts

| Phase | Observation ID | Topic Key |
|-------|---------------|-----------|
| Explore | #1724 | `sdd/f-02/explore` |
| Proposal | #1725 | `sdd/f-02/proposal` |
| Spec | #1729 | `sdd/f-02/spec` |
| Design | #1727 | `sdd/f-02/design` |
| Tasks | #1731 | `sdd/f-02/tasks` |
| Apply Progress | #1732 | `sdd/f-02/apply-progress` |
| Verify Report | #1733 | `sdd/f-02/verify-report` |
| Archive Report | (this) | `sdd/f-02/archive-report` |

---

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived.
Ready for the next change.
