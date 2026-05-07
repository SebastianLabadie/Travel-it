# Exploration: F-05 Tracks GPX de treks

## Current State

The map is implemented as a **Preact island** (`client:only="preact"`) using **Leaflet 1.9.4** with **CARTO Voyager** tiles. It renders destination markers (numbered divIcons with popups) and route polylines (solid for land/ferry/car, dashed for plane) with an animated reveal sequence on the home page. The map has two modes: animated (default) and static. There is no existing trek/track layer, no toggle UI, and no legend.

Content collections are defined in `src/content.config.ts` using Zod schemas and Astro's glob loader. Five collections exist: `destinations`, `days`, `routes`, `checklist-items`, `bookings`. There is **no treks/tracks collection**.

Styling uses **Tailwind CSS v4** with custom CSS properties in `src/styles/global.css`, plus scoped `<style>` blocks in `.astro` files and inline styles in `.tsx` components.

Design files (`design/f05-tracks.jsx` and `design/f05-mocks.jsx`) contain a complete treatment including synthetic track data, toggle buttons, trek start/end pins, popups with stats, and mobile/desktop mockups.

## Affected Areas

- `src/content.config.ts` — add new `treks` collection schema
- `src/lib/types.ts` — add `Trek` type
- `src/lib/trip.ts` — add `getTreks()` helper
- `src/components/map/PatagoniaMap.tsx` — major refactor to support trek layers, toggles, and popups
- `src/components/map/pin-styles.ts` — add trek-specific CSS and popup HTML builders
- `src/pages/index.astro` — potentially adjust layout to accommodate new map chrome
- `src/content/treks/` — new directory for trek JSON data (3 files)
- `design/f05-tracks.jsx` — source of truth for track data and visual treatment

## Approaches

### 1. Extend PatagoniaMap with internal trek state
Keep the existing single-map-component architecture. Add `treks` prop, internal layer state for toggles, and render trek polylines + pins inside the same effect. Reuse existing cleanup pattern.
- **Pros**: Minimal architectural change; consistent with current patterns; single file to test
- **Cons**: PatagoniaMap is already 490 lines; adding treks will push it past 700; mixed concerns
- **Effort**: Medium

### 2. Extract map into sub-components (layer managers)
Split PatagoniaMap into: `MapContainer`, `TransferLayer`, `TrekLayer`, `MapControls`. Each layer manages its own Leaflet lifecycle. MapContainer orchestrates.
- **Pros**: Better separation of concerns; reusable layers; easier to test
- **Cons**: More files; Leaflet refs and cleanup become more complex; risk of ref mismatch
- **Effort**: High

### 3. Add trek data as a new content collection, minimal map changes
Create `src/content/treks/*.json` with schema matching the design file. Extend PatagoniaMap with a `treks` prop and a toggle UI, but keep most of the rendering logic inline.
- **Pros**: Content-driven (consistent with existing patterns); data validated at build time; easy to add more treks later
- **Cons**: Still grows PatagoniaMap; no reusable toggle/legend components yet
- **Effort**: Medium

## Recommendation

**Approach 3** — new content collection + extend PatagoniaMap. This is the sweet spot:
- It follows the existing content-collection pattern (destinations, routes, days, bookings)
- It keeps data in JSON where non-devs can edit it
- It avoids a heavy refactor of the map component while still being maintainable
- The design files already provide the exact data shape and visual treatment

If PatagoniaMap grows too large during implementation, extract the toggle/legend UI into a separate `MapToggles.tsx` component, but keep layer rendering inside the main map effect to avoid Leaflet ref complexity.

## Risks

- **Leaflet className on polylines**: Leaflet's `L.polyline` `className` option is not universally supported across all SVG renderers. The design uses `className: 'f05-trek-line'` for hover transitions. We may need to use `setStyle` on mouseover/mouseout instead of CSS transitions.
- **Map re-mount on toggle**: The current map uses `animKey` to force full re-mount for replay. Adding frequent toggle changes could cause flicker if not handled carefully.
- **Coordinate precision**: The design uses synthetic jittered paths. For real GPX import later, we'd need a parser (e.g., `@tmcw/togeojson`). The current JSON-array approach is fine for MVP.
- **No test infrastructure**: There are no tests for the map component. Any refactor is high-risk without visual regression tests.

## Ready for Proposal

**Yes.** The codebase is well-understood. We know exactly what exists and what needs to be built:
1. New `treks` content collection (schema + 3 JSON files)
2. Extend `PatagoniaMap.tsx` with trek layer rendering + toggle UI
3. Add trek CSS to `pin-styles.ts`
4. Wire up in `src/pages/index.astro` (or a new `/mapa` page if desired)

The orchestrator should create the SDD change (`f-05`) and proceed to proposal.
