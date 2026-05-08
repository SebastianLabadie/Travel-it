# Historial de sesiones

Bitácora append-only. Cada sesión cerrada se vuelca acá con fecha, feature, resultado.

---

## 2026-05-07 — F-01 Reservas tracker con urgencia (SDD archive)

**Feature:** F-01 — Reservas tracker con urgencia
**SDD change:** f-01
**Resultado:** Implementación completa, verificación PASS WITH WARNINGS, archivado.

**Hecho:**
- Inicializado SDD para el proyecto (`sdd-init`).
- Lanzado `/sdd-new f-01` → exploration → proposal → spec → design → tasks.
- Aplicado PR 1 (data layer: schema, 16 seeds, types, loader, nav) vía `sdd-apply`.
- Aplicado PR 2 (UI layer: ReservasApp island + 10 componentes + page shell) vía `sdd-apply`.
- Verificado con `sdd-verify` → PASS WITH WARNINGS.
- Fixes post-verify aplicados:
  - `<a>` dentro de `<button>` reestructurado (inline details como sibling del button).
  - `aria-expanded` agregado a BookingRow para mobile accordion.
  - `aria-pressed` agregado a UrgencyFilter chips.
- `astro build` pasa con 0 errores, 4 páginas generadas.
- Archivado: reporte guardado en engram (`sdd/f-01/archive-report`) y `progress/archive_f-01.md`.

**Decisiones tomadas:**
- PR 1 + PR 2 implementados en misma branch (`main`), no PR separado.
- D-02 (5 vs 6 personas) sigue pendiente pero NO bloquea; diseño usa PAX=5 como default.
- Schema usa English keys (`flight`, `accommodation`, etc.) en vez de Spanish (`vuelos`, `alojamiento`) por consistencia con codebase existente.
- Cost shape `{amount, currency}` en vez de `{minUSD, maxUSD}` por simplificación; range info se pierde.

**Próximos pasos:**
- Elegir siguiente feature pendiente (F-02, F-03 o F-04 según prioridad).

---

## 2026-05-07 — Setup harness organizacional sobre SDD

**Feature:** integración de harness Engineering (betta-tech/ejemplo-harness-subagentes) sobre SDD existente.

**Hecho:**
- Creado `feature_list.json` con backlog post-MVP (10 features migradas de TASKS.md y discusión)
- Creado `decisions.json` con 6 decisiones pendientes migradas de PRD §4 y Patagonia_2026.md
- Creado `init.sh` con gates: node ≥22, pnpm, archivos del harness, validador, `astro check`
- Creado `scripts/validate-feature-list.mjs` para validación de schemas
- Creado `scripts/feature-list.schema.json` (JSON Schema draft-07)
- Creado `CHECKPOINTS.md` con criterios C1–C7 adaptados al stack (Astro, TS, design system)
- Creado `AGENTS.md` documentando flujo harness + SDD integrado
- Creado `progress/current.md` (plantilla) y `progress/history.md` (este archivo)
- Actualizado `package.json` con scripts `init` y `validate`
- Actualizado `docs/TASKS.md` con nota de histórico (backlog migrado)

**Decisiones tomadas:**
- Harness se integra sobre SDD, no lo reemplaza. SDD sigue siendo el motor de planning. Harness aporta feature_list.json, init.sh, CHECKPOINTS, progress/.
- TASKS.md queda como histórico read-only de PR-0..PR-7. Backlog post-MVP vive en feature_list.json.
- Decisiones del PRD migradas a decisions.json para ser consultables y resolvibles.

**Próximos pasos:**
- Resolver D-02 (5 vs 6 personas) antes de F-01 (reservas tracker)
- Elegir primera feature pendiente para arrancar (F-01, F-02 o F-03 según prioridad)
- Considerar resolver D-01 (backend yes/no) — gatekeeper de F-09 y F-10

---

## 2026-05-07 — Campo design + F-11 + schema v2

**Feature:** harness iteración. Tracking de estado de diseño por feature.

**Hecho:**
- Campo `design` en `feature_list.json` con `status: ready | pending | n/a` + `paths: string[]`
- Schema bump a v2, campo design requerido
- Validador chequea que paths existan en disco cuando `status: ready`
- Validador warna si `in_progress` con `design: pending`
- Output del validador suma counts: ready / pending / n/a
- Agregado **F-11 UI decisiones pendientes** al backlog (gap identificado al migrar decisions.json — datos sin UI)
- F-01, F-02, F-04, F-05 marcadas `design: ready` con paths a archivos en `design/`
- F-03 (PWA) y F-08 (imágenes) marcadas `design: n/a` (no requieren diseño nuevo)
- F-06, F-07, F-09, F-10, F-11 marcadas `design: pending`

**Decisiones:**
- `paths` siempre array (incluso single file) por consistencia
- Validación bloquea promoción a SDD si `design: ready` sin paths o con paths inexistentes

**Próximos pasos:**
- F-06 Plan A/B/C falta diseño (era parte del set de prompts pero no quedó archivo)
- Elegir primera feature lista para promover a SDD (F-01, F-02, F-04, o F-05)

---

## 2026-05-07 — F-08 Imágenes por destino

**Feature:** F-08 — Imágenes optimizadas por destino
**SDD change:** f-08 (implementación directa, ~50 líneas + 7 binarios)
**Resultado:** Mergeado.
**PR:** #16

**Hecho:**
- 7 fotos en `public/images/destinations/{slug}.jpg` desde Wikipedia pageimages API (1280px wide).
- Punta Arenas re-comprimido vía `sips` (PNG 3.9MB → JPEG 80q 314KB).
- `DestinationImage` Preact component — `<img>` con `object-fit: cover`, `loading="lazy"`, `decoding="async"`.
- Reemplazados 2 usos de `StripedPlaceholder` en `ItineraryView.tsx` (thumb 64×64 + hero 200×130).
- Reemplazada `.img-placeholder` div en `index.astro` (next-stop card mobile).
- Eliminada función `StripedPlaceholder` no usada.

**Decisiones tomadas:**
- `public/images/` en lugar de `src/assets/` — sin Astro `<Image />` build optimization, pero sirve directo y simplifica uso desde Preact.
- Naming convention basada en slug del destino — sin cambios al schema.
- Wikipedia pageimages API como fuente principal por licencia permisiva (CC BY-SA / PD).

**Próximos pasos:**
- Mejor curaduría de imágenes si se desea (Calafate con glaciar zoom-in, Chaltén con Fitz Roy, etc.).
- Considerar pre-procesar a múltiples tamaños cuando se haga F-03 (PWA caching).

---

## 2026-05-07 — F-04 Día actual + countdown

**Feature:** F-04 — Día actual + countdown
**SDD change:** f-04 (implementación directa, <200 líneas)
**Resultado:** Implementación completa, 0 errores, mergeado.
**PR:** #15

**Hecho:**
- `src/lib/tripState.ts` — `computeTripState()` pura, 3 fases (pre/inflight/post).
- `DayWithDate`, `TripDaySlim` en `types.ts`. `getDaysWithDate()`, `getTripDaysSlim()` en `trip.ts`.
- `TripStatus` island Preact (`client:only`) — countdown + tomorrow callout combinados, auto-refresh a medianoche.
- Keyframes `f04-pulse-num` / `f04-pulse-ring` en `global.css`.
- Home: TripStatus integrado en mobile y desktop sidebar.
- ItineraryView: acepta `DayWithDate[]`, badge "HOY" con pin glacier en timeline mobile + columna días desktop.

**Decisiones tomadas:**
- `client:only` para TripStatus (Date.now() no disponible en build time).
- `useEffect` para `todayISO` en ItineraryView (`client:visible` → evitar hydration mismatch).
- `isoDate` extraído del ID del collection entry, no del campo `date` display-only.
- Un solo island para countdown + tomorrow callout (un computeTripState compartido).

**Próximos pasos:**
- Elegir siguiente feature pendiente (F-03 PWA offline tiene prioridad high).

---

## 2026-05-07 — F-02 Vista presupuesto (SDD archive)

**Feature:** F-02 — Vista presupuesto
**SDD change:** f-02
**Resultado:** Implementación completa, verificación PASS WITH WARNINGS, archivado.
**PR:** #13

**Hecho:**
- SDD completo: explore → propose → spec → design → tasks → apply → verify → archive.
- Chained PRs: PR-1 (data+nav) → PR-2 (shell+hero) → PR-3 (viz+breakdown).
- Creada content collection `budget-items` con schema Zod y 16 archivos JSON.
- Creada página `/presupuesto` con isla Preact `BudgetView` (`client:only="preact"`).
- Componentes: `PaxToggle`, `TotalHero`, `StackedBar`, `PercentTable`, `DestinationBreakdown`, `LineItemsSection`, `VizToggle`.
- Utilidades `src/lib/budget.ts` con cálculos de categorías, formato de rangos y totales.
- Navegación extendida: tab #05 en `TopNav` y `TabBar`.
- `astro build` pasa con 0 errores, 5 páginas generadas.
- Verificación: 20/20 tareas completas, 10/10 escenarios con evidencia estructural, 0 issues críticos.

**Decisiones tomadas:**
- Chained PRs con feature-branch-chain por ~850 líneas estimadas.
- `client:only="preact"` en lugar de `client:visible` (spec pedía visible; design eligió only para coincidir con `/reservas`).
- Inline styles con CSS vars para consistencia con componentes existentes.
- Responsive vía CSS en `.astro` (`.bdg-mobile`/`.bdg-desktop`) evitando hydration mismatch.

**Warnings post-verify:**
- `client:only` vs `client:visible`: desviación intencional del spec.
- `registro-fitz-roy` tiene `free: true` + `range: null`; precedencia no definida en spec (renderiza placeholder).

**Próximos pasos:**
- Elegir siguiente feature pendiente (F-03 PWA offline tiene prioridad high).
