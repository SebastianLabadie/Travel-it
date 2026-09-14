# impl F-13 — Reparto v2.1: Calafate 21–24, Chaltén → Natales directo

Branch: `feature/f-13-reparto-v2-1` (sobre F-12 mergeada, PR #17) · 4 commits · sin push, sin PR.

## Commits

1. `feat(content): move Calafate block to 21–24 nov and drive Chaltén → Natales direct`
2. `feat(content): realign bookings, budget, checklist and team to v2.1 split`
3. `docs: bump trip docs to v2.1 night split`
4. `chore(harness): close F-12 and open F-13`

## Cambio

Decisión del grupo (13 sep 2026): no dormir en El Calafate el 21 para volver el 26–28. Nuevo reparto (17 noches): Calafate 21–24 (3) · Chaltén 24–28 (4) · Natales 28–29 (1, directo desde Chaltén) · TDP 29 nov–3 dic (4) · Calafate 3–4 dic (1) · Ushuaia 4–8 dic (4). Retiro del auto sigue el 22 nov en FTE. El 3 dic sigue siendo el único día `critical`.

## Archivos

### Content (commit 1)
- `src/content/days/2026-11-22.json` … `2026-11-28.json`: 22 retiro del auto + tarde chill en Calafate; 23 Perito Moreno (ex 27); 24 RN40 a Chaltén (ex 22 sin el retiro); 25/26/27 = ex 23/24/25; 28 "El Chaltén → Puerto Natales directo · compras TDP, sacos y gas".
- `src/content/schedule/2026-11-22.json` … `2026-11-28.json`: mismos movimientos. `driveHours`: 22 → 0.5, 23 → 2.7, 24 → 3, 28 → 8. Slot 28 nov 07:00–15:00 "El Chaltén → Puerto Natales · ~8 h (485 km)" con detalle RN40 vía La Leona sin entrar a El Calafate + frontera Cerro Castillo. 3 O'Clock Talk "solo si llegan a tiempo"; sacos "confirmar horario de cierre". 27 nov: warning "Tanque lleno para la salida directa de mañana a Puerto Natales". 22 nov cena: Don Pichón o La Zorra (domingo cierran Nativa y Chopen); 23 nov: Nativa o Don Pichón (lunes cierra La Zorra).
- Noches `n/17` renumeradas: Calafate 1–3, Chaltén 4–7, Natales 8; 9–17 sin cambios. Verificado monotónico en los 18 archivos.
- `src/content/destinations/02-calafate.json` (summary "dos estadías", out "24 nov · vuelo 4 dic"), `03-chalten.json` (24–28 nov, out "Auto directo a Puerto Natales · ~8 h · 28 nov"), `04-natales.json` (summary con llegada ~15:00).
- `routes/3-elc-pna.json` no se toca: ya dibuja chalten → natales pasando por la zona de Calafate.

### Content (commit 2)
- `bookings/alojamiento-calafate-bloque.json` eliminado. `alojamiento-calafate-llegada` → "llegada + Perito Moreno (21–24 nov · 3 noches)" con notes nuevas. `alojamiento-chalten` 24–28. `minitrekking-perito-moreno` y `entrada-pn-los-glaciares` → 23 nov. `registro-centro-visitantes-chalten` → 24 nov. `alojamiento-natales` (check-in ~15:30) y `sacos-dormir-tdp` (confirmar cierre) con nota de llegada directa.
- `budget-items`: minitrekking y entrada PN "23 nov"; laguna-nimez "22 nov"; taxis-fte "(21 nov, 22 nov, 3 dic, 4 dic)".
- `checklist-items/2-alojamiento.json`: `a10` relabel "Calafate · 21–24 nov (3 noches)" (mismo id), `a11` 24–28, `a12` eliminado. `3-actividades.json`: "23 nov · sin traslado".
- `team/1-pipe.json` (24–28, trek 26, flexible 27), `2-batman.json` (dates "21–24 nov · 3 dic", "en 2 estadías", estacionamiento 21–24, minitrekking 23, "Tarde del 22 (domingo: Nativa y Chopen cierran)"), `3-varelinni.json` (+ "Confirmar horarios de cierre de Vértice y Unimarc el sáb 28").
- `decisions.json`: D-08 "Trek del 26 nov en Chaltén" (+ contexto), D-05 resolution "trek del 26 nov".

### Docs (commit 3)
- `docs/Patagonia_2026_v2.md`, `Compras_v2.md`, `Equipaje_v2.md`: blockquote a **Versión 2.1 · septiembre 2026** con la frase del ajuste. v2: Reparto de noches, Calendario 22–28, Rutas y tiempos (Perito Moreno 23, Calafate→Chaltén 24, Chaltén→Natales ~8 hs; salen las filas del 26 y del Calafate→Natales), sección El Calafate "2 estadías, 4 noches" (Noches 1-3 con 22 chill + 23 minitrekking + salida 24), cierres de restaurantes por día, El Chaltén 24–28 con salida 07:00 directo, Puerto Natales (llegada ~15:00, talk solo si llegan, confirmar horarios), Qué reservar, Pendientes (trek del 26 + horarios Vértice/Unimarc). Compras: misma tabla (fila "bloque principal" eliminada, fila llegada absorbe 3 noches), bullet de transporte nuevo, día flexible 27, nota de compras. Equipaje: treks 25/27/26 en Contexto.
- `docs/Patagonia_2026.md` (v1 histórica) no se toca. `README.md` no menciona el reparto viejo: sin cambios.

### Harness (commit 4)
- `feature_list.json`: F-12 `done` (pr 17); F-13 `in_progress` (depends_on F-12, estimate 250).
- `progress/history.md`: entrada F-12 agregada al final (append-only). `progress/current.md` reseteado y completado para F-13.

## Decisiones
- Total `driveHours` se mantiene en 26,2 (el tramo directo de 8 h reemplaza 3 + 5,5; el 0,5 del taxi/retiro compensa). El stat `~26 h` del timeline no cambia.
- `laguna-nimez` en presupuesto pasa a "22 nov" (tarde chill del domingo); el resto de actividades de Calafate al 23.
- Ids de checklist conservados (`a10`, `a11`) para no perder checks en localStorage; solo se elimina `a12`.

## Gates
- `./init.sh` → `[OK] Entorno listo` (13 features, 1 in_progress; 10 decisions; astro check 0 errors, 0 warnings, 144 hints).
- `pnpm build` → `7 page(s) built`, `Complete!`.
- `rg -n "26–28|22–26|bloque principal" src docs README.md --glob '!docs/Patagonia_2026.md'` → sin resultados.
- `dist/timeline/index.html`: noches 1/17–3/17 "Airbnb El Calafate", 4/17–7/17 "Cabaña El Chaltén", 8/17 "Airbnb Puerto Natales"; contiene "Puerto Natales directo", "485 km", "sin entrar a El Calafate", "solo si llegan a tiempo"; sin "El Chaltén → El Calafate" ni "El Calafate → Puerto Natales". Stats: `12 días de auto · ~26 h al volante · 3 vuelos + 2 catamaranes · 2 tramos con mochila completa`.

## No hecho / a revisar
- `alojamiento-calafate-escala.json` (3–4 dic) sin cambios; si se reserva el mismo lugar que el 21–24, unificar notas.
- Horarios de cierre de Vértice y Unimarc el sáb 28 quedan como pendiente en docs, team y bookings.
- `.kiro/` sigue untracked; no se tocó.
