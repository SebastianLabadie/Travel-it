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

---

# Implementación F-02 — PR-2 Shell & Hero

## Resumen

Slice PR-2 (Shell & Hero) de F-02 "Vista presupuesto" implementado y pusheado a `feature/f-02`. Primera página visible del presupuesto con isla Preact, toggle de pasajeros y hero de totales.

## Commits

1. `feat(budget): add presupuesto page shell`
2. `feat(budget): add BudgetView island with pax/viz state and useMemo totals`
3. `feat(budget): add PaxToggle and TotalHero components`

## Archivos creados

- `src/pages/presupuesto.astro` — página Astro que carga `destinations` + `budgetItems` y pasa a `BudgetView` con `client:only="preact"`. Incluye CSS responsive con `.bdg-mobile` / `.bdg-desktop`
- `src/components/budget/BudgetView.tsx` — isla raíz Preact con estado `pax` (5/6) y `viz` (`bar`/`table`). Totales calculados vía `useMemo` + `categoryTotals()`
- `src/components/budget/PaxToggle.tsx` — toggle segmentado 5/6 PAX con `aria-pressed`, estilos inline con CSS vars del proyecto
- `src/components/budget/TotalHero.tsx` — hero con total por persona grande, contramuestra de grupo, eyebrow `05 · PRESUPUESTO`, título, y mini-grid de 4 categorías (Vuelos, Traslados, Seguro, Actividades)

## Decisiones técnicas

- Se usó `client:only="preact"` en lugar de `client:visible` para replicar el patrón existente de `/reservas` y evitar riesgos de hydration mismatch con el CSS responsive
- El estado `viz` se declaró en `BudgetView` (con `_setViz` para evitar warning de unused) pero no se usa aún; se activará en PR-3 con `StackedBar` / `PercentTable`
- Los estilos visuales usan inline styles con `var(--color-*)` y `var(--font-*)` siguiendo la convención del proyecto (sin Tailwind utilities en componentes Preact)
- `TotalHero` recibe prop `layout: 'stacked' | 'side-by-side'` para diferenciar mobile/desktop sin depender de media queries dentro del componente

## Build Verification

- `astro build` pasa sin errores ✅
- Se genera `/presupuesto/index.html` ✅
- `git status` limpio en `feature/f-02` ✅

## Estado

- 12/20 tasks completados (Phase 1 + Phase 2 done)
- Próximo: PR-3 Detail UI (StackedBar, PercentTable, DestinationBreakdown, LineItemsSection)
