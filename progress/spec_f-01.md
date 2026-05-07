# Spec Summary — f-01 (Bookings Tracker)

**Change**: f-01
**Domains**: `bookings-tracker` (new), `site-navigation` (modified)
**Saved to**: Engram `sdd/f-01/spec`

---

## Specs Written

| Domain | Type | Requirements | Scenarios |
|---|---|---|---|
| site-navigation | MODIFIED | 1 | 2 |
| bookings-tracker | NEW | 4 | 6 |

### Coverage
- **Happy paths**: covered (list view, filter, detail panel, progress stats)
- **Edge cases**: covered (empty state, zero filter results, missing optional fields)
- **Error states**: covered (invalid Zod schema fails build; unmatched destinationSlug is validated)

---

## Key Decisions

1. **Single Preact island** (`client:only="preact"`) manages filter state and selected booking ID locally. No URL-persisted filters (out of scope per proposal).
2. **Desktop layout**: `1fr 480px` grid (list + detail panel). Mobile: single scrollable column with inline accordion detail.
3. **Zod schema** uses `z.enum` for `category`, `urgency`, and `status` to guarantee type safety. Optional fields (`deadline`, `cost`, `link`, `notes`, `destinationSlug`) are omitted from rendering when absent — no placeholder text.
4. **Seed data**: 16 JSON files derived from `docs/Patagonia_2026.md` "Qué reservar de antemano" table. All initially `status: pendiente`.
5. **Navigation**: fourth tab "Reservas" (04) added to both `TopNav.astro` (desktop) and `TabBar.astro` (mobile). `BaseLayout.astro` `activeTab` union extended.

---

## Deliverables Checklist

- [x] Functional requirements (view list, filter by urgency, view detail, responsive layout, progress stats)
- [x] Exact Zod schema for bookings collection
- [x] Props interface (`ReservasAppProps`) from Astro to Preact island
- [x] 6 scenarios (≥3 user scenarios + edge cases)
- [x] Edge cases: empty state, zero filter results, missing optional fields
- [x] Seed data specification with 16 entries mapped from `Patagonia_2026.md`

---

## Next Step

Ready for **sdd-design** (technical design document with architecture decisions and component breakdown).
