# Sesión actual

> Plantilla viva. Se actualiza durante la sesión, se mueve a `history.md` al cerrar.

## Feature

- ID: F-12
- Title: Sync itinerario v2 + timeline horaria + responsables por zona
- SDD change: —
- Inicio: 2026-09-12

## Plan

- WU-1 (data sync, esta sesión): sincronizar content collections (destinations, days, routes, bookings, budget-items, checklist-items), hard-codes de UI (nav, home, itinerario, mapa, presupuesto) y harness (feature_list, decisions, AGENTS, README) con `docs/Patagonia_2026_v2.md` + Compras_v2 + Equipaje_v2.
- WU-2 (pendiente): nueva página `/timeline` con horarios y transportes por día, y nueva página `/equipo` con responsables por zona (pipe, batman, varelinni, wire).

## Notas / decisiones tomadas durante la sesión

- Punta Arenas eliminado (destination, imagen, rutas, bookings, budget). Ushuaia pasa a `06-ushuaia.json` con `order: 5`.
- Día crítico pasa del 4 dic (vuelo PUQ→USH) al 3 dic (catamarán + 7 h de auto). La UI ya no hard-codea el slug crítico: home, itinerario y mapa lo derivan de `days[].critical`.
- Rutas con prefijo numérico (1..6). `getRoutes` ordena por id. El mapa animado avanza un cursor de rutas hasta llegar al próximo destino (El Calafate tiene dos salidas: 22 nov y 4 dic).
- El mapa recibe `criticalSlugs` desde `index.astro`; la field note se ancla al primer destino crítico (El Calafate).
- Checklist: ids nuevos (t10+, a10+, ac10+) para que no arrastren checks viejos de localStorage. Categoría nueva `camping` (`8-camping.json`).
- Presupuesto: pax default 4, toggle 4/5. Lodging = `stay.range × nights` (17 noches, Paine con range null por estar contratado).
- Validator de decisions ya aceptaba `resolved`; no hizo falta tocarlo.

## Bloqueos

(ninguno)

## Próximos pasos al reanudar

- WU-2: `/timeline` y `/equipo` (ver F-12 en feature_list.json).
- Cargar precio real de vuelos internacionales en `budget-items/vuelos-ida-vuelta.json` cuando esté.
