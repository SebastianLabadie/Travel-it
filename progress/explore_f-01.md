## Exploration: F-01 Reservas Tracker

### Current State
The project is Astro 6.2.1 (static output, Preact islands) with Tailwind CSS 4.2.4. Content collections power `destinations`, `days`, `routes`, and `checklist-items`. Schemas are defined centrally in `src/content.config.ts` (Astro v5 pattern) using Zod, and data lives as JSON files under `src/content/`. Types are surfaced via `CollectionEntry<...>['data']` in `src/lib/types.ts`. There is **no existing `bookings` collection**.

Navigation is handled by `BaseLayout.astro`, which injects `TopNav.astro` (desktop) and `TabBar.astro` (mobile). Both components are hardcoded to three tabs (`home`, `itinerario`, `checklist`) with typed props. The design system is fully tokenized in `src/styles/global.css` (Tailwind `@theme`) and documented in `design/DESIGN.md`.

### Affected Areas
- `src/content.config.ts` — add `bookings` collection schema.
- `src/content/bookings/*.json` — seed data from `docs/Patagonia_2026.md` §"Qué reservar de antemano".
- `src/lib/types.ts` — export `Booking` type.
- `src/lib/trip.ts` — add `getBookings()` loader.
- `src/layouts/BaseLayout.astro` — extend `activeTab` union to `'reservas'`.
- `src/components/nav/TopNav.astro` — add fourth tab.
- `src/components/nav/TabBar.astro` — add fourth tab.
- `src/pages/reservas.astro` — new page shell.
- `src/components/reservas/` — new directory for Preact island + UI components.

### Approaches
1. **Single Preact Island (Recommended)**
   - Wrap the entire interactive surface (header, filters, list, detail panel) in one `client:only="preact"` island.
   - Props: `bookings`, `destinations`.
   - **Pros**: trivial state management (filter + selection), directly maps to `design/reservas.jsx` component tree, minimal boundary complexity.
   - **Cons**: zero SSR for list (mitigated by tiny dataset, <20 items).
   - **Effort**: Low.

2. **Astro SSR List + Preact Islands for Filters/Detail**
   - Astro renders the list server-side; isolated islands handle filter chips and detail panel.
   - **Pros**: list visible immediately without JS.
   - **Cons**: hard to re-render the list on filter change across Astro/Preact boundaries; would need URL params or global state for marginal gain.
   - **Effort**: Medium.

### Proposed Zod Schema (bookings collection)
```ts
const bookingSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['flight', 'accommodation', 'transfer', 'activity', 'rental']),
  urgency: z.enum(['alta-ya', 'alta-3-6m', 'media', 'baja']),
  status: z.enum(['pendiente', 'reservado', 'pagado']),
  cost: z.object({
    amount: z.number().positive(),
    currency: z.enum(['USD', 'ARS', 'CLP', 'UYU']),
    perPerson: z.boolean().default(false),
  }),
  deadline: z.string().date().optional(),   // ISO yyyy-mm-dd
  link: z.string().url().optional(),
  notes: z.string().optional(),
  destination: z.string().optional(),         // slug referencing destinations
});
```

### Component Architecture
| Component | Tech | Notes |
|---|---|---|
| `ReservasApp` | Preact island (`client:only`) | Root container; holds filter + selectedId state. |
| `ReservasHeader` | Preact | Eyebrow, title, 3-up progress grid, progress bar. |
| `UrgencyFilter` | Preact | Chip row; selected = fg bg, inactive = rule border. |
| `CategoryHeader` | Preact | `border-top: 1px solid fg`, icon + mono label, item counter. |
| `BookingRow` | Preact | `grid` layout; density = compact/comfortable. Hover/selected/active states. |
| `UrgencyBadge` | Preact | 4 variants per DESIGN.md §5.11. |
| `StatusBadge` | Preact | 3 variants per DESIGN.md §5.12. |
| `BookingDetailPanel` | Preact | Desktop right panel; empty state + detail view with cost/deadline/link/notes. |
| `EmptyState` | Preact | Used when bookings array is empty or filter yields zero results. |

### Responsive Strategy
Follow the existing project pattern (`index.astro`):
- **Mobile (< 1024px)**: single scrollable column. `TabBar` visible (fixed bottom 64px). `BookingRow` uses `density="compact"` (`1fr auto` grid). Top padding on `main` cleared by `TabBar`.
- **Desktop (≥ 1024px)**: `TopNav` visible. Page layout uses `grid` `1fr 480px` (list + detail panel). `BookingRow` uses `density="comfortable"` (`120px 1fr auto auto auto` grid). `TabBar` hidden.
- Breakpoint at `1024px` aligns with existing `BaseLayout` and `TabBar` media queries.

### Risks / Blockers
- **D-02 (5 vs 6 personas)**: `decisions.json` explicitly marks this as blocking F-01. Cost math in the mockup hardcodes `PAX = 5`. The UI should not embed group size in the schema, but the progress display needs a clear source of truth.
- **Cross-cutting nav changes**: Adding the fourth tab touches `BaseLayout`, `TopNav`, and `TabBar`, affecting every existing page. Types must be updated consistently.
- **No test runner**: strict TDD is disabled. All edge cases (empty state, zero-filter, selected row) require manual QA.
- **Design files gitignored**: `design/` is ignored; mockups are local-only. Implementation must rely on the written specs in `DESIGN.md` §11.

### Ready for Proposal
Yes. Scope is well-defined: content collection + seed data + page + components + nav updates. The design mockup (`design/reservas.jsx`) is exhaustive and ready to port.
