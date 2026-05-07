# Design: Bookings Tracker (Reservas)

## Technical Approach

Add a `/reservas` page powered by a single Preact island (`ReservasApp`) that receives `bookings` and `destinations` as props from Astro. The island renders both mobile and desktop views; CSS controls visibility at the `1024px` breakpoint to avoid hydration mismatch. State is local to the island (`useState` for filter and selected ID) — no Zustand needed because this state is isolated to one page and does not require cross-page persistence.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Island hydration | `client:only="preact"` | `client:visible` | Reservas is the entry point; it must be interactive immediately (filter clicks, row selection). |
| State management | Local `useState` | Zustand store | Filter and selection are page-local and ephemeral; no cross-page sync or persistence required. |
| Responsive strategy | Island renders both views; CSS hides one | Two separate islands | Avoids duplicate props and hydration mismatch. Follows existing `ItineraryView` / `ChecklistView` pattern. |
| Detail panel | Rendered eagerly, content switches | Lazy-load with dynamic import | Dataset is <20 items; panel markup is lightweight. Eager rendering keeps focus management simple. |
| Data source | Content collection `bookings` | Inline JSON in page | Consistent with `destinations`, `days`, etc. Enables validation and seeding from `docs/Patagonia_2026.md`. |

## Data Flow

```
Astro page (reservas.astro)
  ├─ getBookings() / getDestinations()
  └─ passes props ──→ ReservasApp (Preact island)
        ├─ useState(filter, selectedId)
        ├─ computeProgress(bookings)
        ├─ groupByCategory(filtered)
        ├─ Mobile view ──→ ReservasHeader + UrgencyFilter + CategoryHeader[] + BookingRow[]
        └─ Desktop view ─→ ReservasHeader + UrgencyFilter + CategoryHeader[] + BookingRow[] + BookingDetailPanel
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/content.config.ts` | Modify | Add `bookings` collection schema (Zod). |
| `src/content/bookings/*.json` | Create | Seed data per `docs/Patagonia_2026.md` (flights, accommodation, transfers, activities, rentals). |
| `src/lib/types.ts` | Modify | Export `Booking` type alias. |
| `src/lib/trip.ts` | Modify | Add `getBookings()` loader. |
| `src/layouts/BaseLayout.astro` | Modify | Extend `activeTab` union to include `'reservas'`. |
| `src/components/nav/TopNav.astro` | Modify | Add fourth tab `04 · RESERVAS` → `/reservas`. |
| `src/components/nav/TabBar.astro` | Modify | Add fourth tab with icon `▢`. |
| `src/pages/reservas.astro` | Create | Page shell: loads collections, wires props to island. |
| `src/components/reservas/ReservasApp.tsx` | Create | Root island: state, filtering, progress math, responsive wrapper classes. |
| `src/components/reservas/ReservasHeader.tsx` | Create | Eyebrow, display title, progress grid, progress bar. |
| `src/components/reservas/UrgencyFilter.tsx` | Create | Chip filter row with counts. |
| `src/components/reservas/BookingRow.tsx` | Create | Fila con categoría, título, urgency badge, cost, status badge, link arrow. |
| `src/components/reservas/CategoryHeader.tsx` | Create | Sección de grupo con borde-top fg y contador. |
| `src/components/reservas/BookingDetailPanel.tsx` | Create | Panel desktop con detalle, deadline, costo grupo, notas, acciones. |
| `src/components/reservas/EmptyState.tsx` | Create | Estado vacío con copy y CTA placeholder. |
| `src/components/reservas/constants.ts` | Create | `CATEGORY_LABELS`, `URGENCY_DEFS`, `STATUS_DEFS`, `URGENCY_ORDER`, helpers. |

## Interfaces / Contracts

```typescript
// Derived from content collection
export type Booking = CollectionEntry<'bookings'>['data'];

// Island props
interface ReservasAppProps {
  bookings: Booking[];
  destinations: Destination[];
}

// Booking schema (Zod)
const bookingSchema = z.object({
  id: z.string(),
  category: z.enum(['flight', 'accommodation', 'transfer', 'activity', 'rental']),
  title: z.string(),
  urgency: z.enum(['alta-ya', 'alta-3-6m', 'media', 'baja']),
  status: z.enum(['pendiente', 'reservado', 'pagado']),
  cost: z.object({ amount: z.number(), currency: z.string(), perPerson: z.boolean() }),
  deadline: z.string().nullable(),   // ISO date or null
  link: z.string().url().nullable(),
  notes: z.string().optional(),
  destination: z.string().nullable(), // destination slug ref
});
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Helpers (`groupByCategory`, `applyFilter`, `computeProgress`) | Manual verification during dev; no test runner. |
| Integration | Content collection loads without Zod validation errors | `astro build` must pass. |
| Visual / a11y | Responsive layout, keyboard navigation, filter counts, empty state | Manual QA checklist per `CHECKPOINTS.md`. |

## Migration / Rollout

No migration required. This is a new page. Rollback: delete new files and revert the three-tab nav changes in `TopNav.astro`, `TabBar.astro`, and `BaseLayout.astro`.

## Open Questions

- None.
