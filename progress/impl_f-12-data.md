# impl F-12 · WU-1 — data sync v2

Branch: `feature/f-12-v2-sync` · 5 commits · sin push, sin PR.

## Commits

1. `feat(content): sync destinations, days and routes with itinerary v2`
2. `feat(content): rebuild bookings and budget items for v2 plan`
3. `feat(content): update checklist for rental car and TDP camping`
4. `refactor(ui): derive critical day from data and update v2 copy`
5. `chore(harness): add F-12, resolve v2 decisions, update docs`

## Archivos tocados

### Content
- `src/content/destinations/`: `01-mvd`, `02-calafate`, `03-chalten`, `04-natales`, `05-paine` reescritos; `06-punta.json` eliminado; `07-ushuaia.json` → `06-ushuaia.json` (`order: 5`). Total noches = 17.
- `public/images/destinations/punta.jpg` eliminado.
- `src/content/days/`: 19 archivos reescritos (mismos nombres). Solo `2026-12-03.json` es `critical: true`.
- `src/content/routes/`: 6 eliminados, 6 nuevos con prefijo numérico (`1-mvd-fte` … `6-fte-ush`); tramos terrestres con `mode: "car"`.
- `src/content/bookings/`: 19 eliminados, 20 nuevos (2 `pagado`: vuelos internacionales y camping Vértice).
- `src/content/budget-items/`: 16 eliminados, 21 nuevos.
- `src/content/checklist-items/`: 7 reescritos (ids nuevos en transporte/alojamiento/actividades) + `8-camping.json` nuevo.
- `src/content.config.ts`: `'camping'` agregado al enum de categorías.

### Código
- `src/components/nav/TopNav.astro`: `4 PAX`.
- `src/pages/index.astro`: copy v2 (Seis bases · 17 noches · 4 amigos, ~7.000 km, BASES · 06); noches y cantidad de bases derivados de `destinations`; señal de día crítico derivada de `tripDays[].critical` con label `dd MES` (hoy "03 DIC"); pasa `criticalSlugs` al mapa.
- `src/components/itinerary/ItineraryView.tsx`: los dos `new Set(['punta'])` reemplazados por el set de `dest` de los días críticos.
- `src/components/map/pin-styles.ts`: field note v2 (03 DIC · PAINE GRANDE → PUDETO → FTE) y comentario del pin crítico.
- `src/components/map/PatagoniaMap.tsx`: prop nueva `criticalSlugs`; pin crítico y anclaje de la field note derivados de esa prop (la note queda anclada a El Calafate, primer destino crítico en orden de ruta). En modo animado las rutas se consumen con un cursor en orden de archivo hasta llegar al destino siguiente, en vez de `routes.find(from === slug)` (que con El Calafate repetido dejaba sin dibujar `6-fte-ush`). `car` renderiza sólido, igual que los ex-buses. aria-label del mapa con `destinations.length`.
- `src/lib/trip.ts`: `getRoutes` ordena por id (orden de archivo); doc comments actualizados.
- `src/components/budget/BudgetView.tsx` + `PaxToggle.tsx`: pax default 4, toggle 4/5.

### Harness y docs
- `feature_list.json`: F-12 `in_progress`; F-06 reescrita al día crítico 3 dic; F-05 sin "Base Las Torres".
- `decisions.json`: D-02, D-03, D-04, D-05 `resolved`; D-07..D-10 nuevas. El validador ya aceptaba `resolved`, no se tocó.
- `AGENTS.md`: fila de source of truth apunta a los tres docs v2.
- `docs/Patagonia_2026.md`: blockquote "Superseded" al inicio.
- `docs/Patagonia_2026_v2.md`, `docs/Patagonia_2026_Compras_v2.md`, `docs/Patagonia_2026_Equipaje_v2.md`: agregados al repo (estaban untracked).
- `README.md`: conteos de colecciones, documentación de `bookings` y `budget-items`, 17 noches / 4 personas / auto de alquiler.
- `progress/current.md`: F-12 + plan WU-1 / WU-2 + notas.

## No hecho / a revisar
- `PaxToggle.tsx` conserva un `borderRadius: 4` preexistente (no es de este WU; contradice C3).
- `.kiro/` sigue untracked; no se tocó.
- Precio real de los vuelos internacionales: placeholder `[500, 500]` en `budget-items/vuelos-ida-vuelta.json`.
- WU-2 (`/timeline`, `/equipo`) pendiente.

## Gates
- `rg -n "punta|Magdalena|PUQ|SCL|LATAM|Bus Sur|5 PAX|5 amigos|16 noches|Siete" src README.md` → sin resultados.
- `./init.sh` → `[OK] Entorno listo` (12 features, 1 in_progress; 10 decisions; astro check 0 errors, 0 warnings, 105 hints).
- `pnpm build` → `5 page(s) built`, `Complete!`.
- `dist/index.html` contiene `4 PAX`, `BASES · 06`, `INCLUYE DÍA CRÍTICO · 03 DIC`, `Seis bases · 17 noches · 4 amigos`; sin "Punta Arenas"/"Magdalena".
