# Proposal: F-01 Reservas Tracker

**Change**: `f-01`
**Status**: Proposal created
**Date**: 2026-05-07

## Intent
Add a bookings tracker (`/reservas`) so travelers can view, filter, and inspect reservations by urgency, status, and category, with visible costs and deadlines.

## Scope
- **In**: `bookings` content collection + seed data, `/reservas` page, Preact island + UI components, fourth nav tab.
- **Out**: In-app editing, URL-persisted filters, dynamic cost math tied to group size (D-02), backend integration.

## Approach
Single Preact island (`client:only="preact"`) on `/reservas`, receiving `bookings` and `destinations` as Astro props. Local state for urgency filter and selected booking. Desktop: `1fr 480px` grid (list + detail). Mobile: single column, compact density.

## Affected Files
| File | Impact |
|---|---|
| `src/content.config.ts` | Add `bookings` schema |
| `src/content/bookings/*.json` | New seed data |
| `src/lib/types.ts` | Export `Booking` type |
| `src/lib/trip.ts` | Add `getBookings()` loader |
| `src/layouts/BaseLayout.astro` | Extend `activeTab` union |
| `src/components/nav/TopNav.astro` | Add fourth tab |
| `src/components/nav/TabBar.astro` | Add fourth tab |
| `src/pages/reservas.astro` | New page shell |
| `src/components/reservas/` | New island + components |

## Risks
- D-02 unresolved (low impact: default PAX=5 in UI).
- Cross-cutting nav changes touch all pages.
- No test runner; manual QA required.

## Rollback
Revert commit or delete new files and restore 3-tab nav.

## Success Criteria
- `/reservas` renders filterable booking list from content collection.
- Navigation shows 4 tabs across viewports.
- Responsive layout matches DESIGN.md tokens.
- Seed data loads without validation errors.

---
**Next step**: `sdd-spec`
