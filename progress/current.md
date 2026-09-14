# Sesión actual

> Plantilla viva. Se actualiza durante la sesión, se mueve a `history.md` al cerrar.

## Feature

- ID: F-13
- Title: Reparto v2.1: Calafate 21–24, Chaltén → Natales directo
- SDD change: —
- Inicio: 2026-09-13

## Plan

- Un solo work unit, ruta directa (sin SDD): mover el bloque de El Calafate al 21–24 nov (Perito Moreno el 23), El Chaltén 24–28 nov, y el 28 nov ir directo de El Chaltén a Puerto Natales (~8 h) sin dormir en El Calafate. Retiro del auto sigue el 22 nov en FTE.
- Actualizar `days`, `schedule`, `destinations`, `bookings`, `budget-items`, `checklist-items`, `team`, `decisions.json` y los tres docs v2 (bump a 2.1).
- Reporte en `progress/impl_f-13.md`.

## Notas / decisiones tomadas durante la sesión

- Fuente: mensaje del grupo del 13 sep 2026. Los docs v2 siguen siendo source of truth y se bumpean a **v2.1** con una sola frase de cambio en el blockquote.
- 22 nov (dom): retiro del auto + tarde chill en Calafate, `driveHours: 0.5`. Nativa y Chopen cierran domingo → Don Pichón o La Zorra.
- 23 nov (lun): Perito Moreno (ex 27 nov), `driveHours: 2.7`. La Zorra cierra lunes → Nativa o Don Pichón.
- 24 nov (mar): Calafate → Chaltén (ex 22 nov sin el retiro del auto), `driveHours: 3`.
- 28 nov (sáb): Chaltén → Natales directo, `driveHours: 8`, slot 07:00–15:00 con detalle de RN40 vía La Leona sin entrar a Calafate + frontera Cerro Castillo. 3 O'Clock Talk queda "solo si llegan a tiempo".
- Total `driveHours` queda en 26,2 (salen 3 h Chaltén→Calafate y 5,5 h Calafate→Natales; entran 0,5 h el 22 y 8 h el 28; el Perito Moreno se mueve sin cambiar). El stat `~26 h` del timeline se calcula solo.
- Noches renumeradas 1/17 → 17/17, monotónicas, en 18 archivos de `schedule`.
- `bookings/alojamiento-calafate-bloque.json` eliminado; `alojamiento-calafate-llegada` absorbe las 3 noches (21–24). Checklist: item `a12` eliminado, `a10` relabel (mismo id para no perder checks).
- `routes/3-elc-pna.json` ya dibuja chalten → natales pasando por la zona de Calafate: no se toca.
- 3 dic sigue siendo el único día `critical`.

## Bloqueos

(ninguno)

## Próximos pasos al reanudar

- Abrir PR de F-13 (4 commits en `feature/f-13-reparto-v2-1`).
- Confirmar con el grupo horarios de cierre de Vértice y Unimarc el sáb 28 nov (llegada ~15:00).
- Actualizar `alojamiento-calafate-escala` si al final se reserva el mismo lugar que el 21–24.
