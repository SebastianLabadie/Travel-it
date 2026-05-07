# Tasks: Bookings Tracker (Reservas) — F-01

Fecha: 2026-05-07
Change: f-01
Origen: spec + design desde engram

---

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~650–750 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (data + nav) → PR 2 (UI island + components) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending (esperar decisión del usuario) |

**Guard lines (obligatorias para automatización downstream):**

```
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High
```

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Schema, seed data, types, loader, nav updates | PR 1 | Base: main; ~350 lines; valida con `astro build` |
| 2 | Page shell, Preact island, UI components, constants | PR 2 | Base: PR 1 branch; ~350 lines; manual QA incluido |

---

## Phase 1: Foundation

- [ ] 1.1 Add `bookings` collection to `src/content.config.ts` con Zod schema (id, category, title, urgency, status, deadline, cost, link, notes, destinationSlug).
- [ ] 1.2 Export `Booking` type alias en `src/lib/types.ts` desde `CollectionEntry<'bookings'>['data']`.
- [ ] 1.3 Agregar `getBookings()` loader en `src/lib/trip.ts`.
- [ ] 1.4 Crear 16 archivos JSON seed en `src/content/bookings/` según tabla del spec.
- [ ] 1.5 Correr `pnpm astro check` y `pnpm build` para verificar schema + seeds sin errores.

## Phase 2: Core Implementation

- [ ] 2.1 Crear `src/components/reservas/constants.ts` con labels, defs, helpers (`groupByCategory`, `applyFilter`, `computeProgress`).
- [ ] 2.2 Crear `src/components/reservas/EmptyState.tsx` para estados vacíos.
- [ ] 2.3 Crear `src/components/reservas/CategoryHeader.tsx` con título de grupo y contador.
- [ ] 2.4 Crear `src/components/reservas/BookingRow.tsx` con título, badges, costo, y estilo de selección.
- [ ] 2.5 Crear `src/components/reservas/UrgencyFilter.tsx` como fila de chips con conteos.
- [ ] 2.6 Crear `src/components/reservas/ReservasHeader.tsx` con eyebrow, título y barra de progreso.
- [ ] 2.7 Crear `src/components/reservas/BookingDetailPanel.tsx` para desktop (≥1024px).
- [ ] 2.8 Crear `src/components/reservas/ReservasApp.tsx` (island Preact, `client:only="preact"`) con estado, filtros, vistas responsive.

## Phase 3: Integration & Navigation

- [ ] 3.1 Extender `activeTab` union en `src/layouts/BaseLayout.astro` para incluir `'reservas'`.
- [ ] 3.2 Agregar cuarta pestaña `04 · RESERVAS` en `src/components/nav/TopNav.astro`.
- [ ] 3.3 Agregar cuarta pestaña con icono `▢` en `src/components/nav/TabBar.astro`.
- [ ] 3.4 Crear `src/pages/reservas.astro` como page shell que carga colecciones y pasa props al island.

## Phase 4: Verification

- [ ] 4.1 Correr `astro build` y confirmar 0 errores, 0 fallas de tipos.
- [ ] 4.2 Manual QA: layout responsive, chips de filtro actualizan conteos, empty state cuando filtro da 0.
- [ ] 4.3 Manual QA: navegación por teclado (Tab, Enter/Space), outline `focus-visible` 2px `var(--color-fg)`.
- [ ] 4.4 Manual QA: selección de fila muestra detail panel en desktop y acordeón inline en mobile.
- [ ] 4.5 Verificar que `feature_list.json` F-01 tenga `sdd_change: "f-01"` y esté listo para review.

---

## Totales

| Phase | Tasks | Focus |
|-------|-------|-------|
| Phase 1 | 5 | Foundation (schema, seed, types, loader) |
| Phase 2 | 8 | Core Implementation (UI components + island) |
| Phase 3 | 4 | Integration & Navigation |
| Phase 4 | 5 | Verification (build + manual QA) |
| **Total** | **22** | |

## Próximo paso

Esperar decisión del usuario sobre estrategia de chained PRs antes de lanzar `sdd-apply`.
