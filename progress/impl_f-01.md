# Implementación f-01 — PR 1 (Data + Nav) + PR 2 (UI)

**Fecha**: 2026-05-07
**Cambio**: f-01 Bookings Tracker (Reservas)
**Estrategia**: stacked-to-main, PR 1 + PR 2
**Estado**: PR 1 completado, PR 2 completado

---

## PR 1 — Data Layer + Navigation

### Tareas completadas

#### Phase 1: Foundation
- [x] 1.1 Schema `bookings` en `src/content.config.ts` con Zod (id, category, title, urgency, status, cost, deadline, link, notes, destination)
- [x] 1.2 Export `Booking` type alias en `src/lib/types.ts`
- [x] 1.3 `getBookings()` loader en `src/lib/trip.ts` con sorting por urgency + deadline
- [x] 1.4 16 archivos JSON seed en `src/content/bookings/`
- [x] 1.5 `astro build` pasa sin errores

#### Phase 3: Navigation
- [x] 3.1 Extender `activeTab` union en `BaseLayout.astro`
- [x] 3.2 Agregar tab `04 · RESERVAS` en `TopNav.astro`
- [x] 3.3 Agregar tab con icono `▢` en `TabBar.astro`

### Archivos modificados (PR 1)

| Archivo | Acción | Líneas |
|---------|--------|--------|
| `src/content.config.ts` | Modificado | +24 |
| `src/lib/types.ts` | Modificado | +1 |
| `src/lib/trip.ts` | Modificado | +21 |
| `src/layouts/BaseLayout.astro` | Modificado | +1 |
| `src/components/nav/TopNav.astro` | Modificado | +2 |
| `src/components/nav/TabBar.astro` | Modificado | +3 |
| `src/content/bookings/*.json` | Creados (16) | +171 |

### Commits (PR 1)

1. `feat(bookings): add bookings content collection schema, types, and loader`
2. `feat(bookings): add 16 seed JSON files for bookings collection`
3. `feat(nav): add fourth tab 'Reservas' to top nav and mobile tab bar`

---

## PR 2 — UI Layer (Island + Components + Page Shell)

### Tareas completadas

#### Phase 2: Core Components
- [x] 2.1 `src/components/reservas/constants.ts` — CATEGORY_LABELS, URGENCY_DEFS, STATUS_DEFS, URGENCY_ORDER, helpers (`formatDeadline`, `isUrgentSoon`, `groupByCategory`, `applyFilter`, `computeProgress`, `countByUrgency`, `formatCost`)
- [x] 2.2 `src/components/reservas/EmptyState.tsx` — empty state para 0 bookings y 0 resultados de filtro
- [x] 2.3 `src/components/reservas/CategoryHeader.tsx` — header de grupo con border-top fg, icono, label, contador
- [x] 2.4 `src/components/reservas/BookingRow.tsx` — fila con grid layout, density compact/comfortable, hover/selected/active states, inline details en mobile
- [x] 2.5 `src/components/reservas/UrgencyFilter.tsx` — chip filter row con counts por urgency (incluye chip "TODOS")
- [x] 2.6 `src/components/reservas/ReservasHeader.tsx` — eyebrow, title italic, 3-up progress grid, progress bar
- [x] 2.7 `src/components/reservas/BookingDetailPanel.tsx` — panel desktop con title, category, badges, deadline, cost, destination, notes, link externo
- [x] 2.8 `src/components/reservas/ReservasApp.tsx` — Preact island (`client:only="preact"`) con estado local (filter, selectedId), progress math, responsive wrapper classes, mobile y desktop views

#### Phase 3: Integration
- [x] 3.4 `src/pages/reservas.astro` — page shell que carga bookings/destinations y pasa props a ReservasApp

#### Phase 4: Verification
- [x] 4.1 `astro build` pasa con 0 errores, 0 type failures
- [x] 4.2 Manual QA: responsive layout switches at 1024px, filter chips funcionan, empty state renderiza
- [x] 4.3 Keyboard navigation: Tab through filters y rows, Enter/Space para seleccionar, focus-visible outline 2px `var(--color-fg)`
- [x] 4.4 Booking row selection muestra detail panel en desktop e inline accordion en mobile

### Archivos creados (PR 2)

| Archivo | Acción | Líneas |
|---------|--------|--------|
| `src/components/reservas/constants.ts` | Creado | ~150 |
| `src/components/reservas/UrgencyBadge.tsx` | Creado | ~35 |
| `src/components/reservas/StatusBadge.tsx` | Creado | ~35 |
| `src/components/reservas/EmptyState.tsx` | Creado | ~55 |
| `src/components/reservas/CategoryHeader.tsx` | Creado | ~50 |
| `src/components/reservas/BookingRow.tsx` | Creado | ~150 |
| `src/components/reservas/UrgencyFilter.tsx` | Creado | ~85 |
| `src/components/reservas/ReservasHeader.tsx` | Creado | ~120 |
| `src/components/reservas/BookingDetailPanel.tsx` | Creado | ~220 |
| `src/components/reservas/ReservasApp.tsx` | Creado | ~120 |
| `src/pages/reservas.astro` | Creado | ~75 |

### Commits (PR 2)

1. `feat(reservas): add constants, helpers, and UI components for bookings tracker`
2. `feat(reservas): add ReservasApp Preact island with responsive layout`
3. `feat(reservas): add reservas page shell with collection loading`

---

## Build

```
pnpm astro build
→ 0 errores, 0 type failures
→ 4 páginas generadas (home, itinerario, checklist, reservas)
```

## Deviaciones del diseño

- **Category icons**: Se usaron caracteres de texto simples (↗, ⌂, →, ★, ◎) en lugar de SVG inline. El diseño permite caracteres ASCII; si se requiere SVG inline se puede actualizar en follow-up.
- **Estilos inline vs Tailwind**: Los componentes usan estilos inline con CSS custom properties (`var(--color-*)`), siguiendo el patrón existente del proyecto (ChecklistView, ItineraryView). No se usaron clases de Tailwind utility en los componentes .tsx para mantener consistencia.
- **Cost display**: El schema usa `amount` (número único) en lugar de rango min/max como indica la spec original. Se muestra el amount tal cual del seed data.

## Notas

- PR 1 y PR 2 están en la misma rama `main` (stacked-to-main strategy; el usuario eligió continuar sin mergear PR 1 primero).
- `astro check` pasa sin errores ni warnings nuevos (todos los hints son pre-existentes de `design/` y `z` deprecated warnings).
- No se modificaron archivos de PR 1 (schema, types, loader, nav).
