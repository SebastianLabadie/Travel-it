# impl F-12 · WU-2 — `/timeline` + `/equipo`

Branch: `feature/f-12-v2-sync` · 5 commits sobre WU-1 · sin push, sin PR.

## Commits

1. `feat(content): add schedule and team collections for v2 plan`
2. `feat(timeline): add /timeline page with hourly movement plan`
3. `feat(team): add /equipo page with zone owners and booking ownership`
4. `feat(nav): add timeline and equipo tabs`
5. `docs: document schedule and team collections`

## Archivos

### Content / schema
- `src/content/schedule/2026-11-21.json` … `2026-12-08.json` (18 días, 81 slots) transcritos del brief; horas sin `~` vienen de los docs v2, con `~` son estimaciones. Fechas en el formato del brief (`1 dic`, sin cero a la izquierda; la colección `days` usa `01 dic`).
- `src/content/team/1-pipe.json`, `2-batman.json`, `3-varelinni.json`, `4-wire.json`. `notes` usado en batman ("4 noches en 3 estadías.") y varelinni ("1 noche en cama + 4 de camping…") para el detalle que no entraba en `zone.dates`.
- `src/content.config.ts`: `scheduleDaySchema` (+ `scheduleSlotSchema`), `teamMemberSchema`, `MEMBER_IDS` compartido, `bookings.owner` opcional. `warning` y `critical` con `.default(false)`.
- `src/content/bookings/*.json`: `owner` en 19 de 20. chalten → pipe (3); calafate + auto → batman (6); natales/paine → varelinni (6, incluye `camping-tdp` pagado); ushuaia → wire (4). `vuelos-ida-vuelta` sin owner (compra grupal ya pagada).
- `src/lib/types.ts`: `ScheduleDay`, `ScheduleDayWithDate`, `ScheduleSlot`, `SlotKind`, `TeamMember`, `MemberId`.
- `src/lib/trip.ts`: `getSchedule()` (ordenado por id, agrega `isoDate`), `getTeam()` (por `order`).

### `/timeline`
- `src/pages/timeline.astro`: carga `getSchedule()`, isla `client:visible`, CSS `:global` para `.tl-mobile` / `.tl-desktop` (flip a 1024px). En desktop `body → main → .tl-root` son flex columns para que la lista llene el viewport sin depender de la altura del TopNav (el repo usa 57 y 73 en distintas páginas).
- `src/components/timeline/constants.ts`: `KIND_DEFS` (label, glifo, token), `NIGHT_FILLS` / `NIGHT_CODES`, `nightsFromSchedule`, `computeStats`, `toDateTime`, `formatHours`.
- `src/components/timeline/SlotRow.tsx`: fila `92px 16px 1fr`; `<time dateTime>` solo cuando la hora es exacta; borde izquierdo 3px warning si `warning`.
- `src/components/timeline/DayHeader.tsx`: sticky, `DÍA NN · sáb · <time>21 nov</time>`, título display italic, "Dormimos:", chip `→ 3 h al volante`. Crítico: acento warning + `!! CRÍTICO` + fondo `color-mix(warning 10%)`. Hoy: acento glacier + `HOY`.
- `src/components/timeline/TimelineView.tsx`: header, franja de 17 noches (`<ol>` con label por celda, códigos CAL/CHA/NAT/TDP/USH), 4 mini stats (`<dl>`), leyenda de 10 kinds, índice de días (columna desktop / chips mobile, `<a href="#tl-{m|d}-{iso}">`) y lista `<ol>` de días con `<ul>` de slots. Hoy vía `computeTripState` (solo en `inflight`) + `localISODate`, auto-scroll con `scrollIntoView` respetando `prefers-reduced-motion`.

### `/equipo`
- `src/pages/equipo.astro`: `getTeam()` + `getBookings()`; `TeamView` renderizado estático (sin `client:*`, no hay estado).
- `src/components/team/TeamView.tsx`: header `07 · EQUIPO`, grilla 1 col / 2×2, fila de avance por responsable (`role="progressbar"`, `n/total`, barra moss) y footnote "Sin responsable (1)".
- `src/components/team/MemberCard.tsx`: nombre display 38px, zona + fechas + noches, bloques ALOJAMIENTO / ACTIVIDADES (checklist estático) / COMER, footer con `Fecha objetivo: 30 sep` y link a `/reservas`.
- `src/components/team/constants.ts`: `formatTargetDate`, `computeOwnerProgress`, `unassignedBookings`, `MEMBER_LABEL`.
- `src/components/reservas/OwnerChip.tsx` (nuevo); `BookingRow.tsx` muestra el chip junto al deadline en ambas densidades; `BookingDetailPanel.tsx` lo muestra con prefijo `Responsable:` junto a los badges.

### Navegación
- `TopNav.astro`, `TabBar.astro`, `BaseLayout.astro`: union `activeTab` con `timeline` | `equipo`; tabs 06/07.
- TopNav: `NN ·` en span propio, oculto hasta 1600px; meta oculto hasta 1440px; padding 8px 12px; `white-space: nowrap`. Verificado a 1024/1280/1440/1600.
- TabBar: labels mobile `HOME · TRAZA · LISTA · RESERVAS · USD · TIMELINE · EQUIPO`, `flex: 1 1 auto`, a < 400px sin fila de número y label 10px / 0.08em. Verificado legible a 360 y 390.
- `index.astro`: link `Ver timeline →` en la card "Próxima parada". `ItineraryView.tsx`: link `Horarios y transportes →` al lado del toggle Destinos/Timeline.

### Docs
- `README.md`: colecciones `schedule` y `team`, campo `owner`, páginas nuevas.
- `progress/current.md`: notas WU-2 y próximos pasos.

## Decisiones
- Stats computadas, no hard-codeadas: `12 días de auto` = ventana entre primer y último día con slot `car`; `~26 h` = suma de `driveHours` (26,2; el brief decía ~25); `3 vuelos` = días con vuelo (hay 5 tramos aéreos); `2 catamaranes` = slots `boat` con "catamar" en el título; `2 tramos` = slots con "mochila completa".
- Sin hex inline en código nuevo: fondos con `color-mix(in srgb, var(--token) N%, …)` (los componentes preexistentes siguen usando `#C9601A08`).
- Taxi y bus usan el token glacier (transporte), no estaba especificado.
- La union type de `activeTab` entró en el commit 2 (necesaria para que compile `timeline.astro`); los tabs propiamente en el commit 4.
- `getSchedule()` devuelve `isoDate` (como `getDaysWithDate`) para el highlight de hoy.

## Gates
- `./init.sh` → `[OK] Entorno listo` (astro check 0 errors, 0 warnings, 144 hints).
- `pnpm build` → `7 page(s) built`, `Complete!`.
- `dist/timeline/index.html`: 18 anclas por árbol (m/d), 162 filas de slot (81 × 2), 17 celdas de noche, `06 · TIMELINE`, stats `12 días | ~26 h | 3 vuelos | 2 tramos`.
- `dist/equipo/index.html`: 4 `<article>`, 4 progressbars (0/3, 0/6, 1/6, 0/4), sin `<astro-island>`.
- Screenshots con agent-browser sobre `pnpm preview` a 360/390/1280/1440/1600: timeline, equipo, reservas (chips WIRE/BATMAN/PIPE visibles), home (link Ver timeline).

## No hecho / a revisar
- `PaxToggle.tsx` conserva `borderRadius: 4` (preexistente, C3).
- Los tiles del mapa en preview muestran "API KEY REQUIRED" (CARTO); preexistente, no tocado.
- No hay filtro por responsable en `/reservas`; el link "Ver reservas de esta zona" apunta a `/reservas` sin filtrar.
- El índice desktop no hace scroll-spy (marca hoy y críticos, no el día visible).
- `.kiro/` sigue untracked.
