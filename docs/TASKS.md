# TASKS — Web Viaje Patagonia 2026

*Plan de implementación · v0.1 · 2026-05-04*

## Estado de PRs

| PR | Slice | Branch | Estado |
| :--- | :--- | :--- | :--- |
| [#1](https://github.com/SebastianLabadie/Travel-it/pull/1) | PR-0 docs | `feat/pr-0-docs` | 🟡 abierto |
| [#2](https://github.com/SebastianLabadie/Travel-it/pull/2) | PR-1 bootstrap | `feat/pr-1-bootstrap` | 🟡 abierto |
| [#3](https://github.com/SebastianLabadie/Travel-it/pull/3) | PR-2 data layer | `feat/pr-2-data-layer` | 🟡 abierto |
| TBD | PR-3 mapa | `feat/pr-3-map` | 🟡 abierto (size:exception) |
| — | PR-4 itinerario | `feat/pr-4-itinerary` | ⚪ pendiente |
| — | PR-5 checklist | `feat/pr-5-checklist` | ⚪ pendiente |
| — | PR-6 polish + deploy | `feat/pr-6-polish` | ⚪ pendiente |

> **Cambios sobre PRD v0.1**: el diseño en `design/DESIGN.md` define **Leaflet 1.9.4 + CARTO Voyager** (raster tiles, sin token) en vez de MapLibre. Se adopta Leaflet para no rehacer la animación de trazado ya prototipada en `design/map-real.jsx`.

## Fuentes de verdad

| Artefacto | Ubicación | Rol |
| :--- | :--- | :--- |
| PRD | `docs/PRD.md` | Requisitos funcionales y no-funcionales |
| Design system | `design/DESIGN.md` | Tokens, componentes, layouts canónicos |
| Datos del viaje | `design/data.js` | Destinos, días, rutas, checklist (a portear a content collections) |
| Mapa prototipo | `design/map-real.jsx` | Lógica de Leaflet + animación rAF |
| Mobile prototipo | `design/variant-a.jsx` | Pantallas 390×780 — Home / Itin / Check |
| Desktop prototipo | `design/desktop-a.jsx` | Pantallas 1280×820 — Home / Itin / Check |

---

## Fase 0 — Bootstrap del proyecto · ✅ PR-1 (#2)

- [x] **0.1** Verificar Astro 6 + `@astrojs/preact` ya instalados (`package.json`). OK.
- [x] **0.2** Instalar deps faltantes:
  - `@tailwindcss/vite@^4`
  - `tailwindcss@^4`
  - `zustand@^5`
  - `zod@^4`
  - `leaflet@^1.9.4`
  - `@types/leaflet`
  - `@astrojs/vercel` (adapter para deploy)
  - Eliminar `@google/design.md` (no se usa).
- [x] **0.3** Configurar `astro.config.mjs`:
  - integrations: `preact({ compat: true })` (habilita `preact/compat` para libs que esperan React, ej. Zustand).
  - vite plugins: `tailwindcss()`.
  - adapter: `vercel()`.
- [x] **0.4** Configurar `tsconfig.json` extendiendo `astro/tsconfigs/strict` + `noUncheckedIndexedAccess: true`. Compiler `jsx: "preserve"`, `jsxImportSource: "preact"`.
- [x] **0.5** Cargar fonts en `<head>`: Fraunces, Newsreader, Inter, JetBrains Mono (Google Fonts con preconnect + display=swap).
- [x] **0.6** Definir tokens del design system como CSS custom properties en `src/styles/global.css`:
  - Colores: `--color-bg`, `--color-bg-alt`, `--color-paper`, `--color-fg`, `--color-stone`, `--color-rule`, `--color-glacier`, `--color-moss`, `--color-warning`.
  - Fuentes: `--font-display`, `--font-body`, `--font-mono`.
  - Espaciado, radius, shadow, breakpoints según `DESIGN.md`.
- [x] **0.7** Configurar `tailwind.config` (o `@theme` directive en CSS) extendiendo con los tokens. Mantener bordes rectos por default (sin `rounded-*`).
- [x] **0.8** Aplicar `box-sizing: border-box` global y reset mínimo.

---

## Fase 1 — Data layer · ✅ PR-2 (#3)

- [x] **1.1** Crear `src/content.config.ts` con collections + loaders:
  - `destinations` — collection JSON.
  - `days` — collection JSON.
  - `routes` — collection JSON (incluye `coords` GeoJSON-like).
  - `checklist` — collection JSON con categorías + items.
- [x] **1.2** Definir schemas Zod 4 estrictos para cada collection. Ejemplo:
  ```ts
  const destinationSchema = z.object({
    slug: z.string(),
    name: z.string(),
    country: z.enum(['AR', 'CL']),
    coords: z.tuple([z.number(), z.number()]), // [lon, lat]
    startDate: z.string(),
    endDate: z.string(),
    nights: z.number().int().positive(),
    summary: z.string(),
    activities: z.array(z.object({
      title: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      hours: z.number().positive(),
    })),
    stay: z.object({
      type: z.string(),
      range: z.tuple([z.number(), z.number()]),
    }),
    out: z.string(),
  });
  ```
- [x] **1.3** Migrar `design/data.js` → archivos JSON dentro de `src/content/{destinations,days,routes,checklist}/*.json`.
- [x] **1.4** Crear `src/lib/types.ts` exportando los tipos inferidos de Zod (`z.infer<typeof destinationSchema>`).
- [x] **1.5** Crear `src/lib/trip.ts` con helpers de query: `getDestinations()`, `getDays()`, `getRoutes()`, `getChecklist()`, `getCriticalDays()`. Todos devuelven datos tipados validados en build.

---

## Fase 2 — Componente `<PatagoniaMap>` (Leaflet island) · ✅ PR-3

- [x] **2.1** Crear `src/components/map/PatagoniaMap.tsx` como Preact island con `client:only="preact"`. (Spec AC-F1-14 enmendada: `client:visible` → `client:only` por DOM-imperatividad de Leaflet.)
- [x] **2.2** Importar Leaflet 1.9.4 vía `import 'leaflet'` + import de `leaflet/dist/leaflet.css`. NO cargar por CDN.
- [x] **2.3** Setup map: zoomControl/attributionControl/scrollWheelZoom/keyboard `false`, fitBounds Patagonia con padding 10×10, CARTO Voyager tiles `subdomains: 'abcd'`, `maxZoom: 12`, `minZoom: 4`.
- [x] **2.4** Pin numerado custom (`L.divIcon`) 24×24 paper + border 1.5px fg, número mono 10px 600, label italic display 13px, crítico (Ushuaia) bg warning + pulse 1.6s.
- [x] **2.5** Polylines: terrestre/bus fg solid weight 3; vuelo warning dashed `6 5` weight 2.5.
- [x] **2.6** Field note día crítico (`L.divIcon`) 200×~90, paper, border 1px warning, shadow lg, rotate(-2deg), línea guía dasharray al pin, tag/title/body en mono/display/inter.
- [x] **2.7** Prop `staticMode: boolean`. `true` instantáneo + dragging/tap off. `false` animación + replay + step indicator.
- [x] **2.8** Prop `autoplay: boolean` (default true).
- [x] **2.9** Animación: markers fade-in 280ms, polyline rAF interpolada 850ms, field note fade 380ms al llegar a Ushuaia, step indicator (`Etapa 0N / 06`) abajo-izq, replay abajo-der. Respeta `prefers-reduced-motion`.
- [x] **2.10** Cleanup en `useEffect` return (`map.remove()` + remover layers).
- [x] **2.11** Compass rose decorativo (deferred a PR-6 polish — opcional).
- [x] **2.12** CSS scoped en `pin-styles.ts` con `.ptg-pin`, `.ptg-pin-num`, `.ptg-pin-crit`, `.ptg-pin-label`, `.ptg-note*`, `.ptg-popup`, `@keyframes ptgPulse`.
- [x] **2.13 (extra)** Pin popups (AC-F1-04): nombre + fechas + nights + link `/itinerario#slug`.
- [x] **2.14 (extra)** `<noscript>` fallback en index.astro con lista de 6 destinos.
- [x] **2.15 (extra)** Home page wiring — mobile (390 col) + desktop (`1fr 360px`).

**PR-3 quality gates: astro check ✅ (0 errors) · build ✅ (1.23s) · 16/17 AC-F1 PASS · 1 PARTIAL (keyboard map nav, deferred PR-6).**
**PR-3 size: 1 235 líneas (3.6× sobre budget de 400). Abrir como `size:exception` — mapa = unidad atómica.**

---

## Fase 3 — Layout y navegación

- [ ] **3.1** Crear `src/layouts/BaseLayout.astro` con:
  - `<head>` meta + fonts + viewport.
  - Slot principal.
  - Skip-link de a11y.
- [ ] **3.2** Crear `src/components/nav/TopNav.tsx` (desktop, ≥1024px):
  - Brand izquierda: "Travel·it" italic display 22px + eyebrow mono "PATAGONIA · 2026".
  - Tabs centro: Mapa / Itinerario / Checklist (mono 11px uppercase 0.16em). Activa: bg `fg`, text `paper`, padding 8×16, sin radius.
  - Meta derecha: mono 10px stone "21·NOV → 08·DIC · 5 PAX".
  - Border-bottom 1px rule.
- [ ] **3.3** Crear `src/components/nav/TabBar.tsx` (mobile, <1024px):
  - Fixed bottom, paper bg, border-top 1px rule, height 64px.
  - 3 items: Mapa (◇) / Itinerario (☰) / Checklist (✓).
  - Activo: text `fg`, indicator 2px arriba.
  - Tipografía mono 11px uppercase 0.16em.
- [ ] **3.4** Hook `useActiveTab()` o detección por `Astro.url.pathname` para marcar tab activa.
- [ ] **3.5** Layout responsivo: `TopNav` y `TabBar` se renderizan condicionalmente con CSS media queries (no responsivo de uno solo). Ambos en `BaseLayout`.

---

## Fase 4 — Pantalla Home (`/`)

- [ ] **4.1** Crear `src/pages/index.astro`.
- [ ] **4.2** Mobile (390×780):
  - Top bar: `EXPEDICIÓN · 2026` izq + `v0.1` der.
  - Hero text:
    - Eyebrow mono warning `21 NOV — 08 DIC`.
    - H1 display 46px line-height 0.92: `Patagonia, de cabo a cabo.` (segunda mitad italic moss).
    - Subtítulo stone 12px: `Seis bases · 16 noches · 5 amigos.`
  - `<PatagoniaMap height={320} />`.
  - Stats row: 16 noches / 6 destinos / ~3.200 km (3 cols con border-right).
  - Card "Próxima parada" con placeholder rayado + datos primer destino.
  - CTA `Ver itinerario completo →` (bg `fg`, text `paper`, mono 10px).
- [ ] **4.3** Desktop (1280×820):
  - Grid `1fr 360px`.
  - Mapa hero full-bleed izquierda (`<PatagoniaMap height={H-73} />`).
  - Hero overlay flotante absolute top:32 left:32 max-width:380, paper bg, shadow xl, padding 20×24.
    - Eyebrow mono warning `EXPEDICIÓN · 16 NOCHES`.
    - H1 display 52px: `Patagonia, de cabo a cabo.`
    - Body stone 13px line-height 1.5.
  - Sidebar derecha: header "BASES · 06" + lista de 6 destinos con número/nombre/país/fechas/summary. Background `${warning}08` para el destino crítico (Ushuaia) + signal `!! INCLUYE DÍA CRÍTICO`.

---

## Fase 5 — Pantalla Itinerario (`/itinerario`)

- [ ] **5.1** Crear `src/pages/itinerario.astro`.
- [ ] **5.2** Crear `src/components/itinerary/ItineraryView.tsx` (Preact island con `client:load` para manejar el toggle):
  - Toggle "Destinos / Timeline" (segmented control, sin radius, border 1px fg).
  - Estado local con `useState`. Persistir preferencia en localStorage opcional (`travel-it:itin-view:v1`).
- [ ] **5.3** Mobile vista Destinos:
  - Lista vertical de 6 cards.
  - Cada card: número mono + nombre italic 24px + país mono + placeholder rayado 64×64 + fechas + summary + chips de actividades (mono 9px en border 1px rule).
- [ ] **5.4** Mobile vista Timeline:
  - Línea vertical 1px rule.
  - 19 días con: fecha mono · pin (12×12 fg o warning si crítico) · destino italic + main + transfer (mono "↗ {transfer}") + nota crítica si aplica (paper bg, border-left 2px warning, mono 9px).
- [ ] **5.5** Desktop:
  - Grid `320px 1fr 380px` — sidebar bases / detalle del destino seleccionado / lista de días.
  - Sidebar: lista clickeable de 6 destinos. Item seleccionado: bg `paper` + border-left 3px fg.
  - Detalle: nombre 44px display + summary + tabla de actividades con difficulty badge.
  - Días: timeline vertical igual que mobile pero con más respiro.
- [ ] **5.6** Componente `<DifficultyBadge>` con 3 variantes:
  - `easy`: border `rule`, text `stone`.
  - `medium`: border + text `moss`.
  - `hard`: border + text `warning`.
  - Mono 9px uppercase 0.1em, padding 3×8.
- [ ] **5.7** Día crítico — los 3 signals juntos:
  - 1 elemento color `warning` (border-left, badge, accent).
  - Prefijo `!! CRÍTICO` o `!! INCLUYE DÍA CRÍTICO` mono uppercase.
  - Background sutil `${warning}08` o `${warning}10`.

---

## Fase 6 — Pantalla Checklist (`/checklist`)

- [ ] **6.1** Crear `src/pages/checklist.astro`.
- [ ] **6.2** Crear store Zustand 5 con middleware `persist`:
  - `src/stores/checklist.ts`.
  - State: `Record<string, boolean>` (id de item → checked).
  - Key localStorage: `travel-it:checklist:v1`.
  - Actions: `toggle(id)`, `reset()`.
  - Versión schema en clave por si cambia data.
- [ ] **6.3** Crear `src/components/checklist/ChecklistView.tsx` Preact island:
  - Header: eyebrow mono `03 · CHECKLIST` + título display 36px (mobile) / 38px (desktop) `La preparación.`
  - Progress bar: número grande display 32–42px + `%` + ratio mono `done/total`. Bar height 4px, fill `moss`.
  - Mobile: 7 categorías colapsables apiladas (acordeón).
  - Desktop: grid `repeat(2, 1fr)` gap `24px 48px`, todas las categorías abiertas.
- [ ] **6.4** Componente `<Category>` con header clickeable (mobile colapsa, desktop fijo):
  - Número mono + nombre italic + ratio `done/total` (mono, color `moss` si completo) + chevron.
  - Animación de chevron con `transform: rotate(180deg)` cuando abierto.
- [ ] **6.5** Componente `<ChecklistItem>`:
  - Checkbox custom 16×16 border 1.5px fg, sin radius. Checked → bg `fg`, ✓ paper.
  - Label body 13px. Checked → line-through + opacity 0.5.
  - Note opcional mono 10px stone.
  - Border-bottom 1px dashed rule.
- [ ] **6.6** Botón Reset con confirmación nativa (`window.confirm`) que limpia el store + localStorage.

---

## Fase 7 — Responsive, a11y, perf

- [ ] **7.1** Implementar breakpoints en CSS:
  - `mobile`: < 640 px.
  - `tablet`: 640–1024 px.
  - `desktop`: ≥ 1024 px.
- [ ] **7.2** Tipografía fluida: hero `36px` (mobile) → `52px` (desktop). Usar `clamp()` o media queries.
- [ ] **7.3** A11y:
  - Skip-link al `<main>` en `BaseLayout`.
  - `aria-label` en TabBar items.
  - `aria-current="page"` en tab activa.
  - Checkbox custom: input `<input type="checkbox">` real, oculto pero focuseable; label asocia con `htmlFor`.
  - `aria-expanded` en categorías colapsables.
  - Focus rings visibles (no `outline: none`).
  - Contraste WCAG AA verificado en `stone` sobre `bg` (probable que falle en algunos casos — re-evaluar contraste o usar `fg` para texto importante).
- [ ] **7.4** Lazy-load del bundle de Leaflet:
  - `<PatagoniaMap client:visible>` en lugar de `client:load` cuando sea posible.
  - O dynamic import `import('leaflet')` dentro del componente.
- [ ] **7.5** Optimizar fonts:
  - `font-display: swap`.
  - Subset `latin` solo.
  - Preload de Fraunces 400 italic (la principal del hero).
- [ ] **7.6** Lighthouse mobile target:
  - Performance ≥ 90.
  - Accessibility = 100.
  - Best Practices ≥ 95.
- [ ] **7.7** Test manual en mobile real (iPhone Safari + Android Chrome) y desktop (Chrome + Firefox).

---

## Fase 8 — Deploy y cierre

- [ ] **8.1** Decidir hosting: Vercel (recomendado por integración Astro + edge functions futuras) vs Netlify vs Cloudflare Pages.
- [ ] **8.2** Configurar `astro.config.mjs` con adapter si aplica (para SSG puro no hace falta).
- [ ] **8.3** `npm run build` local — verificar que no hay errores de tipos ni de validación Zod.
- [ ] **8.4** Deploy preview a hosting elegido.
- [ ] **8.5** Verificar mapa carga en producción (CARTO Voyager vía CDN externa). Fallback documentado en PRD.
- [ ] **8.6** Lighthouse en URL productiva.
- [ ] **8.7** Crear `README.md` del proyecto:
  - Cómo correr `dev`, `build`, `preview`.
  - Estructura de carpetas.
  - Cómo editar el itinerario (content collections).
  - Cómo agregar/quitar items del checklist.
- [ ] **8.8** Tag `v1.0.0`.

---

## Backlog post-MVP (v1.1+)

- [ ] Tracks GPX de treks (Fitz Roy, Base Las Torres, Laguna Esmeralda) como capa toggleable.
- [ ] Vista de presupuesto agregando rangos USD por destino.
- [ ] Imágenes optimizadas reales por destino con `<Image />` de Astro.
- [ ] Print stylesheet del itinerario.
- [ ] Mode offline / PWA con cache de tiles + service worker.
- [ ] Compartir checklist con grupo (requiere backend — re-evaluar).
- [ ] Anotaciones / diario durante el viaje (localStorage o Supabase).

---

## Convenciones de implementación

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). NO `Co-Authored-By` ni atribución a AI.
- **Branches**: una por fase mayor (ej. `feat/fase-2-map`). Merge a `main` por PR.
- **PRs**: ≤ 400 líneas cambiadas (regla del proyecto). Si una fase excede, partir en chained PRs.
- **TypeScript**: strict mode siempre. Sin `any`. Sin `as` salvo cast obvio (ej. `as const`).
- **Comentarios**: solo cuando el WHY no es obvio. Sin docstrings multi-línea.
- **Tailwind**: usar tokens del design system. NO valores hex inline en componentes — todo via CSS vars o classes.
- **Sin emojis** en UI ni en código (DESIGN.md §8). Caracteres ASCII para íconos: `↗ ↳ ✓ ▢ ↻ !! ◇ ☰`.
- **Sin rounded corners** salvo pins del mapa.

---

*Última actualización: 2026-05-04*
