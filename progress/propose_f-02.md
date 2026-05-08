# Proposal: F-02 Vista Presupuesto

**Fecha**: 2026-05-07  
**SDD Phase**: propose  
**Cambio**: f-02

---

## Resumen Ejecutivo

Crear la página `/presupuesto` como calculadora interactiva de costos del viaje. Muestra total por persona y por grupo, desglose por categoría (vuelos, alojamiento, transfers, actividades, seguro), y ranking de destinos por costo de estadía. Toggle 5/6 pax recalcula todo en vivo.

## Decisiones Clave

| Decisión | Elegido | Razón |
|---|---|---|
| ¿Dónde viven los datos? | Content collection `budget-items` | Consistente con F-01 (`bookings`). Editable sin rebuild. |
| ¿Persistir pax? | No | No está en PRD. Es calculadora, no preferencia. |
| ¿Default viz? | StackedBar | Más fiel al estilo "mapa de expedición". Tabla vía toggle. |
| ¿Responsive? | CSS en `.astro` | Evita hydration mismatch. Patrón probado en 3 páginas previas. |
| ¿Sub-componentes o monolito? | Sub-componentes | Más mantenible. Root ~200 líneas + 5 puros. |

## Scope

**In**: `budget-items` collection, `/presupuesto` página, 6 componentes Preact, utilidades `budget.ts`, integración nav.

**Out**: localStorage pax, pricing dinámico, edición inline.

## Riesgo Principal

El estimate original de 200 líneas es **optimista**. El mockup tiene 1053 líneas de JSX puro; la traducción a Preact + CSS vars + responsive es ~600–800 líneas. **Mitigación**: entregar en chained PRs.

## Afectados

- **Crear**: `src/content/budget-items/*`, `src/pages/presupuesto.astro`, `src/components/budget/*` (6 archivos), `src/lib/budget.ts`
- **Modificar**: `src/content.config.ts`, `src/lib/trip.ts`, `src/lib/types.ts`, `src/layouts/BaseLayout.astro`, `src/components/nav/TopNav.astro`, `src/components/nav/TabBar.astro`

## Próximo Paso

`sdd-spec` → requisitos detallados por capability (`budget-view`, `budget-data`, `navigation`).
