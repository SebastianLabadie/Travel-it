# Sesión actual

> Plantilla viva. Se actualiza durante la sesión, se mueve a `history.md` al cerrar.

## Feature

- ID: F-04
- Title: Día actual + countdown
- SDD change: f-04 (implementación directa, <200 líneas)
- Inicio: 2026-05-07

## Plan

- [x] Branch: feature/f-04-countdown
- [ ] src/lib/types.ts — añadir DayWithDate, TripDaySlim
- [ ] src/lib/tripState.ts — computeTripState (pure client-side)
- [ ] src/lib/trip.ts — getDaysWithDate(), getTripDaysSlim()
- [ ] src/styles/global.css — keyframes f04-pulse
- [ ] src/components/countdown/TripStatus.tsx — island client:only
- [ ] src/pages/index.astro — integrar TripStatus
- [ ] src/components/itinerary/ItineraryView.tsx — DayWithDate + HOY badge
- [ ] src/pages/itinerario.astro — getDaysWithDate()

## Notas / decisiones tomadas durante la sesión

- Implementación directa (no SDD formal) por ser < 200 líneas estimadas
- client:only para TripStatus (depende de Date.now()), useEffect para TodayBadge en ItineraryView (es client:visible → evitar hydration mismatch)
- TripStatus renderiza countdown + tomorrow callout como un único island (un solo computeTripState)
- DayWithDate = Day & { isoDate: string } — campo calculado desde el ID del entry, no del JSON

## Bloqueos

—

## Próximos pasos al reanudar

—
