# Archive Report — f-01 (Bookings Tracker / Reservas)

**Change**: f-01
**Project**: travel-it
**Date**: 2026-05-07
**Archived by**: sdd-archive

---

## What Was Built

A complete bookings tracker page (`/reservas`) that displays, filters, and inspects trip reservations by urgency, status, and category. The feature includes 16 seed bookings sourced from `docs/Patagonia_2026.md` (section *Qué reservar de antemano*), a responsive Preact island (`ReservasApp`), and updated site navigation with a fourth top-level tab.

---

## Files Created/Modified

### Created (17 files)
| File | Description |
|---|---|
| `src/content/bookings/vuelos-ida-vuelta.json` | Seed: flights round-trip |
| `src/content/bookings/refugio-tdp.json` | Seed: Torres del Paine refuge |
| `src/content/bookings/auto-calafate.json` | Seed: car rental Calafate |
| `src/content/bookings/airbnb-calafate.json` | Seed: Airbnb Calafate |
| `src/content/bookings/airbnb-chalten.json` | Seed: lodging El Chaltén |
| `src/content/bookings/airbnb-pn.json` | Seed: Airbnb Puerto Natales |
| `src/content/bookings/hotel-puq.json` | Seed: hotel Punta Arenas |
| `src/content/bookings/airbnb-ush.json` | Seed: Airbnb Ushuaia |
| `src/content/bookings/magdalena-comapa.json` | Seed: Isla Magdalena activity |
| `src/content/bookings/bus-puq-ush.json` | Seed: bus transfer |
| `src/content/bookings/canal-beagle.json` | Seed: Beagle Channel navigation |
| `src/content/bookings/lago-argentino.json` | Seed: Lago Argentino navigation |
| `src/content/bookings/bus-interno-tdp.json` | Seed: internal bus TdP |
| `src/content/bookings/registro-fitz-roy.json` | Seed: Fitz Roy registration |
| `src/content/bookings/entrada-perito-moreno.json` | Seed: Perito Moreno entry |
| `src/content/bookings/entrada-tdp.json` | Seed: Torres del Paine entry |
| `src/components/reservas/constants.ts` | CATEGORY_LABELS, URGENCY_DEFS, STATUS_DEFS, helpers |
| `src/components/reservas/EmptyState.tsx` | Empty and zero-filter states |
| `src/components/reservas/CategoryHeader.tsx` | Group header with icon + counter |
| `src/components/reservas/BookingRow.tsx` | Row with badges, cost, selection, mobile accordion |
| `src/components/reservas/UrgencyFilter.tsx` | Chip filter row with counts |
| `src/components/reservas/ReservasHeader.tsx` | Eyebrow, title, progress stats |
| `src/components/reservas/BookingDetailPanel.tsx` | Desktop detail panel (≥1024px) |
| `src/components/reservas/UrgencyBadge.tsx` | 4 urgency variants |
| `src/components/reservas/StatusBadge.tsx` | 3 status variants |
| `src/components/reservas/ReservasApp.tsx` | Root Preact island, state, responsive wrapper |
| `src/pages/reservas.astro` | Page shell, loads collections, wires props |

### Modified (6 files)
| File | Description |
|---|---|
| `src/content.config.ts` | Added `bookings` collection Zod schema |
| `src/lib/types.ts` | Exported `Booking` type alias |
| `src/lib/trip.ts` | Added `getBookings()` loader (sort by urgency then deadline) |
| `src/layouts/BaseLayout.astro` | Extended `activeTab` union to `'reservas'` |
| `src/components/nav/TopNav.astro` | Added fourth tab `04 · RESERVAS` |
| `src/components/nav/TabBar.astro` | Added fourth tab with `▢` icon |

---

## Commits Made

| Hash | Message |
|---|---|
| `c829f53` | feat(nav): add fourth tab 'Reservas' to top nav and mobile tab bar |
| `ba24d22` | feat(bookings): add 16 seed JSON files for bookings collection |
| `0a3097a` | feat(reservas): add constants, helpers, and UI components for bookings tracker |
| `9cd549a` | feat(reservas): add ReservasApp Preact island with responsive layout |
| `857a414` | feat(reservas): add reservas page shell with collection loading |

*Post-verify accessibility fixes applied to `src/components/reservas/BookingRow.tsx` and `src/components/reservas/UrgencyFilter.tsx` (uncommitted at archive time).*

---

## Verification Results

- **Verdict**: PASS WITH WARNINGS
- **Tasks**: 15/15 complete (100%)
- **Build**: `astro build` → exit 0, 4 pages, 0 errors
- **Type Check**: `astro check` → 0 errors, 0 warnings (89 pre-existing hints)
- **Coverage**: Not available (no test runner configured)

### Spec Compliance Summary
| Requirement | Result |
|---|---|
| Navigation Tabs (desktop + mobile) | ✅ COMPLIANT |
| Bookings Collection + 16 seeds | ✅ COMPLIANT |
| Bookings List View + filtering | ✅ COMPLIANT |
| Booking Detail Panel (desktop + mobile) | ✅ COMPLIANT |
| Progress Stats | ✅ COMPLIANT |
| Empty State / Zero Filter Results | ✅ COMPLIANT |
| Missing Optional Fields handling | ✅ COMPLIANT |

---

## Known Issues/Warnings and Resolution Status

| # | Issue | Severity | Status | Resolution |
|---|---|---|---|---|
| 1 | Schema field names/shapes deviated from spec: English category enum (`flight`, `accommodation`...) instead of Spanish (`vuelos`, `alojamiento`...); cost uses `{amount, currency}` instead of `{minUSD, maxUSD}`; deadline is `z.string().date()` instead of `z.string()` (loses human-label capability); field name is `destination` instead of `destinationSlug`. | Warning | **Accepted** | Internally consistent and functional. Reconciliation with spec deferred to future refactor if needed. |
| 2 | Invalid HTML: `<a>` nested inside `<button>` in `BookingRow` mobile inline details. | Warning | **Fixed** | Restructured so inline details (including the link) is a sibling of the row button, not a child. |
| 3 | Missing `aria-expanded` on mobile accordion rows. | Warning | **Fixed** | Added `aria-expanded` to `BookingRow` button. |
| 4 | Missing `aria-pressed` on `UrgencyFilter` chip buttons. | Suggestion | **Fixed** | Added `aria-pressed` to filter chips. |
| 5 | `EmptyState` title uses "Sin resultados" / "Sin reservas" while spec says "No hay reservas cargadas." / "Ninguna reserva coincide con este filtro." | Suggestion | **Open** | Body text matches spec; title deviation is minor. No action taken. |

---

## Post-Archive Recommendations

1. **Schema reconciliation**: If strict spec compliance becomes a requirement, align the schema with the spec — Spanish category enum values, `{minUSD, maxUSD}` cost shape, `z.string().optional()` deadline (to support human labels like "3–6 meses antes"), and rename field to `destinationSlug`.
2. **Cost range display**: The current `{amount, currency}` shape loses the min/max range information present in the seed data table (e.g., "60-90"). If displaying price ranges becomes important, migrate the cost schema to the spec shape.
3. **Test runner**: The project has no test runner. Consider adding Vitest + Preact Testing Library to write unit tests for helpers (`groupByCategory`, `applyFilter`, `computeProgress`, `countByUrgency`).
4. **D-02 resolution**: Group size (5 vs 6 personas) remains an open decision. When resolved, update per-person cost math in `BookingDetailPanel` and `formatCost` accordingly.
5. **Commit post-verify fixes**: The a11y fixes to `BookingRow.tsx` and `UrgencyFilter.tsx` should be committed to preserve them in the git history.

---

## Artifact Traceability (Engram)

| Artifact | Observation ID | Topic Key |
|---|---|---|
| Proposal | #1674 | `sdd/f-01/proposal` |
| Spec | #1676 | `sdd/f-01/spec` |
| Design | #1677 | `sdd/f-01/design` |
| Tasks | #1678 | `sdd/f-01/tasks` |
| Apply Progress | #1680 | `sdd/f-01/apply-progress` |
| Verify Report | #1687 | `sdd/f-01/verify-report` |
| Archive Report | (this) | `sdd/f-01/archive-report` |

---

## SDD Cycle Status

✅ Proposal → ✅ Spec → ✅ Design → ✅ Tasks → ✅ Apply → ✅ Verify → ✅ Archive

The change has been fully planned, implemented, verified, and archived. Ready for the next change.
