# Tasks: F-02 Vista Presupuesto

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~850 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR-1 (data+nav) → PR-2 (shell+hero) → PR-3 (viz+breakdown) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Data layer + navigation wiring | PR-1 | Base: feature/f-02; 16 JSONs + schema + nav tabs |
| 2 | Page shell, island root, hero, pax toggle | PR-2 | Base: PR-1 branch; first visible page |
| 3 | Bar/table viz, destination breakdown, line items | PR-3 | Base: PR-2 branch; completes the view |

## Phase 1: Foundation

- [ ] 1.1 Add `budgetItems` schema to `src/content.config.ts` with Zod fields per spec
- [ ] 1.2 Export `BudgetItem` type in `src/lib/types.ts` from collection entry
- [ ] 1.3 Add `getBudgetItems()` to `src/lib/trip.ts` sorted by `cat` then `id`
- [ ] 1.4 Create `src/lib/budget.ts` with `categoryTotals`, `fmt`, `fmtRange` and `BudgetTotals` type
- [ ] 1.5 Create 16 JSON files in `src/content/budget-items/` (flights, transfers, insurance, activities)
- [ ] 1.6 Extend `activeTab` union to `'presupuesto'` in `src/layouts/BaseLayout.astro`
- [ ] 1.7 Add tab `05 · PRESUPUESTO` to `src/components/nav/TopNav.astro`
- [ ] 1.8 Add tab `05 · USD` to `src/components/nav/TabBar.astro`

## Phase 2: Shell & Hero

- [ ] 2.1 Create `src/pages/presupuesto.astro` loading destinations + budget-items, responsive CSS
- [ ] 2.2 Create `src/components/budget/BudgetView.tsx` island with `pax`/`viz` state and `useMemo` totals
- [ ] 2.3 Create `src/components/budget/PaxToggle.tsx` segmented 5/6 button with `aria-pressed`
- [ ] 2.4 Create `src/components/budget/TotalHero.tsx` showing per-pax range, group contramuestra, 4-category mini-grid

## Phase 3: Detail UI

- [ ] 3.1 Create `src/components/budget/StackedBar.tsx` using midpoint proportions, `bar` default
- [ ] 3.2 Create `src/components/budget/PercentTable.tsx` mono table with % bars, toggled from `viz`
- [ ] 3.3 Create `src/components/budget/DestinationBreakdown.tsx` with ranking badges (`!! MÁS CARO`, `↓ MÁS BARATO`)
- [ ] 3.4 Create `src/components/budget/LineItemsSection.tsx` rendering fixed + variable items, placeholders, free badges
- [ ] 3.5 Wire all sub-components into `BudgetView.tsx` with correct props

## Phase 4: Verification

- [ ] 4.1 Verify `/presupuesto` builds without errors
- [ ] 4.2 Verify pax toggle recalculates totals and bar proportions
- [ ] 4.3 Verify placeholders render "— · pendiente confirmar" and free items show "GRATIS"
- [ ] 4.4 Verify tab #05 active state in TopNav and TabBar
- [ ] 4.5 Verify focus-visible outline on all interactive elements
