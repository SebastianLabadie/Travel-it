# Sesión actual

> Plantilla viva. Se actualiza durante la sesión, se mueve a `history.md` al cerrar.

## Feature

- ID: F-12
- Title: Sync itinerario v2 + timeline horaria + responsables por zona
- SDD change: —
- Inicio: 2026-09-12

## Plan

- WU-1 (data sync, esta sesión): sincronizar content collections (destinations, days, routes, bookings, budget-items, checklist-items), hard-codes de UI (nav, home, itinerario, mapa, presupuesto) y harness (feature_list, decisions, AGENTS, README) con `docs/Patagonia_2026_v2.md` + Compras_v2 + Equipaje_v2.
- WU-2 (hecho, esta sesión): nueva página `/timeline` con horarios y transportes por día, y nueva página `/equipo` con responsables por zona (pipe, batman, varelinni, wire). Reporte en `progress/impl_f-12-ui.md`.

## Notas / decisiones tomadas durante la sesión

- Punta Arenas eliminado (destination, imagen, rutas, bookings, budget). Ushuaia pasa a `06-ushuaia.json` con `order: 5`.
- Día crítico pasa del 4 dic (vuelo PUQ→USH) al 3 dic (catamarán + 7 h de auto). La UI ya no hard-codea el slug crítico: home, itinerario y mapa lo derivan de `days[].critical`.
- Rutas con prefijo numérico (1..6). `getRoutes` ordena por id. El mapa animado avanza un cursor de rutas hasta llegar al próximo destino (El Calafate tiene dos salidas: 22 nov y 4 dic).
- El mapa recibe `criticalSlugs` desde `index.astro`; la field note se ancla al primer destino crítico (El Calafate).
- Checklist: ids nuevos (t10+, a10+, ac10+) para que no arrastren checks viejos de localStorage. Categoría nueva `camping` (`8-camping.json`).
- Presupuesto: pax default 4, toggle 4/5. Lodging = `stay.range × nights` (17 noches, Paine con range null por estar contratado).
- Validator de decisions ya aceptaba `resolved`; no hizo falta tocarlo.

### WU-2 (`/timeline` + `/equipo`)

- Colecciones nuevas `schedule` (18 días, 81 slots) y `team` (4 responsables). Helpers `getSchedule()` (con `isoDate`) y `getTeam()` en `src/lib/trip.ts`.
- `bookings.owner` opcional (enum pipe/batman/varelinni/wire); seteado en 19 de 20 reservas. `vuelos-ida-vuelta` queda sin responsable (compra grupal ya pagada) y `/equipo` lo lista como "Sin responsable".
- `camping-tdp` (pagado) asignado a varelinni junto con el resto de Paine/Natales.
- Stats del timeline calculadas, no hard-codeadas: 12 días de auto (ventana entre el primer y último slot `car`), ~26 h al volante (suma de `driveHours` = 26,2), 3 vuelos (días con vuelo), 2 catamaranes, 2 tramos con mochila completa.
- Sin hex inline en componentes nuevos: los fondos de día crítico/hoy y la banda de noches usan `color-mix()` sobre tokens.
- `/equipo` se renderiza estático (sin `client:*`): no tiene estado, no hace falta JS.
- Nav con 7 tabs: TabBar mobile con `flex: auto`, labels cortos `TRAZA` (por "La traza.") y `LISTA`, y a < 400px se oculta la fila de números y el label baja a 10px. TopNav oculta el prefijo `NN ·` hasta 1600px y el meta `21·NOV → 08·DIC · 4 PAX` hasta 1440px (a 1440 con prefijo se superponía).

## Bloqueos

(ninguno)

## Próximos pasos al reanudar

- Revisar visualmente `/timeline` y `/equipo` en el dispositivo real; abrir PR de F-12 (5 + 5 commits en `feature/f-12-v2-sync`, probablemente `size:exception`).
- Reconsiderar labels mobile `TRAZA` / `LISTA` si al grupo no le cierran.
- Cargar precio real de vuelos internacionales en `budget-items/vuelos-ida-vuelta.json` cuando esté.
