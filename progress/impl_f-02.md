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

---

# Implementación F-02 — PR-3 Detail UI

## Resumen

Slice PR-3 (Detail UI) de F-02 "Vista presupuesto" implementado y pusheado a `feature/f-02`. Completa la vista de presupuesto con visualizaciones (barra apilada y tabla de porcentajes), desglose de alojamiento por destino con badges de ranking, y listas de conceptos fijos y variables.

## Commits

1. `feat(budget): add StackedBar and PercentTable visualization components`
2. `feat(budget): add DestinationBreakdown and LineItemsSection components`
3. `feat(budget): wire all detail UI into BudgetView with viz toggle`

## Archivos creados

- `src/components/budget/StackedBar.tsx` — barra apilada horizontal con proporciones por punto medio de cada categoría. 5 segmentos con colores del proyecto (glacier, stone, moss, fg, warning). Leyenda con porcentajes
- `src/components/budget/PercentTable.tsx` — tabla mono con barras de % por categoría. Grid `120px 1fr 50px` en desktop, `100px 1fr 40px` en mobile
- `src/components/budget/DestinationBreakdown.tsx` — desglose de alojamiento por destino con noches, rango por persona, total grupo, mini barra proporcional. Badges `!! MÁS CARO` (warning bg 6%) y `↓ MÁS BARATO` (moss bg 6%)
- `src/components/budget/LineItemsSection.tsx` — lista genérica de ítems con soporte para placeholders (`— · pendiente confirmar`), badges `GRATIS` (con `—` en costos), y `!! CRÍTICO` (color warning). Muestra costo por persona y grupo en desktop

## Archivos modificados

- `src/components/budget/BudgetView.tsx` — 
  - Agregado `VizToggle` interno con `aria-pressed` para alternar entre `bar` y `table`
  - Integrados `StackedBar`, `PercentTable`, `DestinationBreakdown`, `LineItemsSection`
  - Layout desktop usa grid de 2 columnas para `DestinationBreakdown` + conceptos fijos
  - Filtrado de ítems fijos (`flight`/`transfer`/`insurance`) y variables (`activity`)

## Decisiones técnicas

- `VizToggle` se definió como componente local dentro de `BudgetView.tsx` (no archivo separado) porque es pequeño y no se reutiliza
- Los colores de categoría para la barra apilada se asignaron semánticamente: Vuelos=glacier, Traslados=stone, Seguro=moss, Alojamiento=fg, Actividades=warning
- El ranking de destinos (más caro / más barato) se calcula por punto medio del rango de alojamiento por persona
- En mobile los `LineItemsSection` usan grid `1fr auto` (solo label + por persona); en desktop `1fr 110px 130px 130px` (label + por persona + grupo + scope)

## Build Verification

- `astro build` pasa sin errores ✅
- Se genera `/presupuesto/index.html` ✅
- `git status` limpio en `feature/f-02` ✅
- Branch pusheado a origin ✅

## Estado

- 17/20 tasks completados (Phase 1 + Phase 2 + Phase 3 done)
- Próximo: Phase 4 Verification (build, pax toggle, placeholders, tab active state, focus-visible)
