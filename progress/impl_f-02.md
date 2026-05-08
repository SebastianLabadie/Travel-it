# Implementación F-02 — PR-1 Foundation

## Resumen

Slice PR-1 (Foundation) de F-02 "Vista presupuesto" implementado y pusheado a `feature/f-02`.

## Commits

1. `feat(budget): add budget-items content collection schema`
2. `feat(budget): export BudgetItem type and add getBudgetItems() loader`
3. `feat(budget): add budget calculation utilities and types`
4. `feat(budget): add budget items JSON data files (flights, transfers, insurance, activities)`
5. `feat(nav): add presupuesto tab to TopNav, TabBar and BaseLayout`

## Archivos creados

- `src/lib/budget.ts` — utilidades de cálculo (`categoryTotals`, `fmt`, `fmtRange`)
- `src/content/budget-items/*.json` (16 archivos) — datos de presupuesto

## Archivos modificados

- `src/content.config.ts` — schema `budgetItemSchema` + colección `budget-items`
- `src/lib/types.ts` — export `BudgetItem`
- `src/lib/trip.ts` — `getBudgetItems()`
- `src/layouts/BaseLayout.astro` — `activeTab` incluye `'presupuesto'`
- `src/components/nav/TopNav.astro` — tab `05 · PRESUPUESTO`
- `src/components/nav/TabBar.astro` — tab `05 · USD`

## Estado

- `git status` limpio en `feature/f-02`
- Branch pusheado a origin
- 8/20 tasks completados (Phase 1 done)
- Próximo: PR-2 Shell & Hero
