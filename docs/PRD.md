# PRD — Web Viaje Patagonia 2026

*Documento de requisitos de producto · v0.1 · 2026-05-03*

---

## 1. Executive Summary

### Problem Statement

Un grupo de 5–6 amigos planifica un viaje de 16 noches por la Patagonia argentina y chilena (nov–dic 2026). La información hoy vive en un único Markdown extenso (`docs/Patagonia_2026.md`): difícil de navegar en mobile durante el viaje, sin visualización geográfica del recorrido, y sin forma estructurada de trackear qué hay comprado/reservado.

### Proposed Solution

Una web estática responsive con tres features principales: (1) **mapa interactivo** del recorrido con markers de destinos y rutas reales de traslado, (2) **itinerario** consultable con doble vista (por destino / día por día), (3) **checklist** de preparación con persistencia local. Single-user, sin backend, sin auth.

### Success Criteria

| KPI | Objetivo |
| :--- | :--- |
| Tiempo de carga inicial (LCP) | ≤ 2.0 s en 4G simulado |
| Lighthouse Performance | ≥ 90 (mobile) |
| Lighthouse Accessibility | = 100 |
| Itinerario consultable sin scroll del doc original | 100 % de info migrada |
| Checklist persiste estado entre sesiones | 100 % en mismo navegador |

---

## 2. User Experience & Functionality

### User Persona

**Sebastian** (organizador del viaje, 1 sola persona usa la web como autor/editor; el resto del grupo no es target).
- Planifica desde desktop (research, edición de itinerario, mapa).
- Consulta desde mobile durante el viaje (itinerario del día, datos de traslado, checklist final).
- Stack técnico cómodo: TypeScript, React, Astro.

### User Stories

#### F1 — Mapa interactivo

**US-1.1**: Como organizador, quiero ver en un mapa los 6 destinos del recorrido conectados con líneas reales de las rutas de traslado, para visualizar la lógica geográfica del viaje.

**Acceptance Criteria**:
- Mapa MapLibre GL renderiza centrado en Patagonia (bbox: aprox. lat -55 a -49, lon -75 a -68).
- 6 markers visibles: El Calafate, El Chaltén, Puerto Natales, Torres del Paine (sector Las Torres), Punta Arenas, Ushuaia.
- Cada marker tiene popup con: nombre, fechas, # de noches, link a la sección correspondiente del itinerario.
- Líneas (GeoJSON) que conectan los destinos siguiendo rutas reales:
  - Calafate ↔ Chaltén: RN40
  - Calafate → Puerto Natales: RN40 + RN9 vía paso Río Don Guillermo
  - Puerto Natales → Torres del Paine
  - Torres del Paine → Puerto Natales → Punta Arenas
  - Punta Arenas → Ushuaia: incluye tramo de ferry en Estrecho de Magallanes (estilizado distinto al asfalto)
- Zoom y pan funcionan en desktop (mouse + scroll) y mobile (pinch + drag).
- Estilo de tiles vector gratuito (OpenFreeMap o Protomaps) — sin token pago.

#### F2 — Itinerario

**US-2.1**: Como organizador, quiero alternar entre una vista por destino y una vista día por día, para consultar el viaje de la forma que más me sirve en cada momento.

**Acceptance Criteria**:
- Toggle visible (segmented control) que alterna entre vista **Destinos** y vista **Timeline**.
- **Vista Destinos**: 6 cards (uno por ciudad) con: foto/imagen representativa, fechas, # noches, resumen, link "Ver detalle".
  - Detalle por destino: actividades sugeridas, alojamiento (tipo + rango USD), traslado de salida.
- **Vista Timeline**: 17 días (21 nov → 8 dic) en línea vertical, cada día con: fecha, ubicación, actividad principal, traslado si aplica, alojamiento.
- Ambas vistas leen del **mismo content collection** (sin duplicación de data).
- En mobile, las cards/timeline son scrolleables verticalmente, sin overflow horizontal.

**US-2.2**: Como organizador, quiero que el itinerario refleje el "día crítico" (4 dic, PUQ→USH) con énfasis visual, porque tiene mayor riesgo logístico.

**Acceptance Criteria**:
- Días marcados como `critical: true` en el content collection se renderizan con badge/borde de alerta.
- Mínimo 1 día marcado como crítico (4 dic).

#### F3 — Checklist

**US-3.1**: Como organizador, quiero un checklist con 7 categorías colapsables y persistencia en localStorage, para trackear qué tengo listo sin perder el progreso entre sesiones.

**Acceptance Criteria**:
- 7 categorías colapsables (collapsed por default excepto la primera):
  1. Transporte
  2. Alojamiento
  3. Actividades
  4. Ropa
  5. Documentación
  6. Conectividad
  7. Utilidades
- Cada categoría contiene N items (definidos en content collection o JSON).
- Cada item tiene: label, checkbox, opcionalmente nota corta o link externo (ej. URL de reserva).
- Estado de cada checkbox persiste en `localStorage` bajo clave `travel-it:checklist:v1`.
- Indicador de progreso por categoría: `X / Y completados`.
- Indicador global: barra de progreso total + porcentaje.
- Botón "Reset" con confirmación que limpia el storage.

### Non-Goals (MVP)

- ❌ Multi-usuario / sincronización entre dispositivos.
- ❌ Autenticación de cualquier tipo.
- ❌ PWA / modo offline / service worker.
- ❌ Tracks GPX de treks dibujados sobre el mapa (potencial v1.1).
- ❌ Sistema de comentarios / colaboración entre amigos.
- ❌ Backend, base de datos, API propia.
- ❌ Conversor de moneda en vivo o pricing dinámico.
- ❌ Reservas integradas con operadores externos.
- ❌ Integración con apps de mapas externas (Google Maps deep links opcional, no MVP).
- ❌ i18n — solo español rioplatense.

---

## 3. Technical Specifications

### Architecture Overview

Aplicación Astro estática con islas React para interactividad. Sin servidor, sin DB. Toda la data del viaje vive en **content collections** tipados con Zod. El estado del checklist vive en localStorage gestionado por Zustand 5 con middleware `persist`.

```
┌─────────────────────────────────────────────────────┐
│  Astro 5 (SSG)                                      │
│  ├── src/content/                                   │
│  │   ├── destinations/  (MDX por destino)           │
│  │   ├── days/          (JSON o MDX por día)        │
│  │   └── checklist/     (JSON con items)            │
│  ├── src/pages/                                     │
│  │   ├── index.astro          → home + map         │
│  │   ├── itinerario.astro     → itinerario (C/D)   │
│  │   └── checklist.astro      → checklist          │
│  └── src/components/                                │
│      ├── Map.tsx              (React island)       │
│      ├── Itinerary.tsx        (React island)       │
│      └── Checklist.tsx        (React island)       │
└─────────────────────────────────────────────────────┘
                       │
                       ├── localStorage (checklist state)
                       └── OpenFreeMap / Protomaps (tiles)
```

### Stack

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| Framework | Astro | 5.x |
| UI islands | React | 19 |
| Styling | Tailwind CSS | 4.x |
| Lenguaje | TypeScript | strict mode |
| State management | Zustand | 5.x (con middleware `persist`) |
| Mapa | MapLibre GL JS | ^4 |
| Tiles | OpenFreeMap o Protomaps | gratuito, sin token |
| Validación schemas | Zod | 4.x |
| Content | Astro Content Collections | con loaders + Zod schemas |
| Build / deploy | TBD (Vercel o Netlify, free tier) | — |

### Data Model

```ts
// src/content/config.ts (esquema simplificado)
const destinationSchema = z.object({
  slug: z.string(),
  name: z.string(),
  country: z.enum(['Argentina', 'Chile']),
  coordinates: z.tuple([z.number(), z.number()]), // [lon, lat]
  startDate: z.string().date(),
  endDate: z.string().date(),
  nights: z.number().int().positive(),
  summary: z.string(),
  activities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    estimatedHours: z.number().optional(),
  })),
  accommodation: z.object({
    type: z.string(),
    pricePerPersonUSD: z.tuple([z.number(), z.number()]),
  }),
  departureTransfer: z.string(),
});

const daySchema = z.object({
  date: z.string().date(),
  destination: z.string(), // slug ref
  activities: z.array(z.string()),
  transfer: z.string().nullable(),
  critical: z.boolean().default(false),
  notes: z.string().optional(),
});

const checklistItemSchema = z.object({
  id: z.string(),
  category: z.enum([
    'transporte',
    'alojamiento',
    'actividades',
    'ropa',
    'documentacion',
    'conectividad',
    'utilidades',
  ]),
  label: z.string(),
  note: z.string().optional(),
  link: z.string().url().optional(),
});

const routeSegmentSchema = z.object({
  from: z.string(), // destination slug
  to: z.string(),
  mode: z.enum(['car', 'bus', 'ferry', 'plane', 'walk']),
  geometry: z.object({
    type: z.literal('LineString'),
    coordinates: z.array(z.tuple([z.number(), z.number()])),
  }),
});
```

### Integration Points

- **MapLibre GL**: cargar como island React, lazy-load del bundle (~200 KB gzip).
- **Tiles**: OpenFreeMap (`https://tiles.openfreemap.org/styles/liberty`) o Protomaps self-hosted PMTiles. Decisión final en design phase.
- **localStorage**: clave única `travel-it:checklist:v1`. Schema versionado para migración futura.
- **Content collections**: `astro:content` API, build-time validation con Zod.

### Security & Privacy

- Sin recolección de datos del usuario.
- Sin cookies, sin tracking, sin analytics (al menos en MVP).
- localStorage es local al navegador del usuario, no se transmite.
- HTTPS por default vía hosting (Vercel/Netlify).

### Responsive Breakpoints

| Breakpoint | Ancho | Uso |
| :--- | :--- | :--- |
| `mobile` | < 640 px | Navegación stack vertical, mapa altura fija, itinerario en cards apiladas |
| `tablet` | 640–1024 px | Layout de 2 columnas en checklist e itinerario |
| `desktop` | > 1024 px | Layout completo, mapa más grande, sidebar de filtros |

### Estética / Design System

**Dirección**: outdoor / aventura. Paleta tonos tierra y glaciar. Look "mapa de expedición".

| Token | Valor sugerido |
| :--- | :--- |
| `color-bg` | `#F5F1EA` (bone) |
| `color-fg` | `#1B2A2E` (deep slate) |
| `color-accent-glacier` | `#7AB2C9` (azul hielo) |
| `color-accent-moss` | `#5A7458` (verde musgo) |
| `color-accent-stone` | `#8A8378` (gris piedra) |
| `color-warning` | `#C9601A` (naranja crítico — días con riesgo) |
| `font-display` | Serif con carácter (e.g. Fraunces, Editorial Old) |
| `font-body` | Sans humanista (e.g. Inter, IBM Plex Sans) |

---

## 4. Risks & Roadmap

### Phased Rollout

#### MVP (v1.0)

- [ ] Setup Astro 5 + React 19 + Tailwind 4 + TS strict.
- [ ] Content collections para destinations, days, checklist items, route segments.
- [ ] Migración del contenido de `docs/Patagonia_2026.md` a content collections.
- [ ] F1 — Mapa con 6 markers + rutas reales de traslado (GeoJSON).
- [ ] F2 — Itinerario con vista destinos + vista timeline (toggle).
- [ ] F3 — Checklist con 7 categorías colapsables + persist.
- [ ] Responsive (mobile / tablet / desktop).
- [ ] Deploy a hosting estático.
- [ ] Lighthouse ≥ 90 mobile / a11y = 100.

#### v1.1 (post-MVP)

- Tracks GPX de treks (Fitz Roy, Base Las Torres, Laguna Esmeralda) como capa toggleable en el mapa.
- Vista "presupuesto" agregando los rangos de USD por destino y total.
- Imágenes optimizadas por destino (Astro `<Image />`).
- Print stylesheet para imprimir itinerario antes del viaje.

#### v2.0 (especulativo)

- Modo offline / PWA con cache de tiles y content.
- Multi-usuario con sync (requeriría backend — re-evaluar).
- Notas/diario de viaje agregadas durante el trip.

### Technical Risks

| Riesgo | Probabilidad | Mitigación |
| :--- | :--- | :--- |
| Tiles gratuitos (OpenFreeMap) caen o cambian terms | Baja | Fallback a Protomaps self-hosted PMTiles. |
| Bundle de MapLibre infla LCP | Media | Lazy-load del componente Map; cargar solo en home; preload tiles del bbox de Patagonia. |
| Schema de localStorage cambia y pisa estado existente | Media | Versionado de clave (`v1`, `v2`...) + función de migración. |
| GeoJSON de rutas reales muy pesado | Baja | Simplificar geometrías con `mapshaper` o `simplify-geojson`. |
| Content collections + Zod no escalan si crece mucho la data | Muy baja | El dataset es finito (1 viaje). Sin riesgo real. |

### Open Questions

- [ ] Hosting target: Vercel vs Netlify vs Cloudflare Pages — definir en design phase.
- [ ] Tiles: OpenFreeMap directo vs Protomaps self-hosted — depende de presupuesto de hosting.
- [ ] ¿Imágenes de cada destino se incluyen en MVP o se difieren a v1.1? (afecta scope).
- [ ] ¿Items concretos del checklist los defino yo desde el doc, o se llenan iterativamente? (no bloquea arquitectura).

---

## 5. Next Steps

1. **Aprobar PRD** (este documento).
2. **`/sdd-new web-patagonia-mvp`** → exploración + proposal formal SDD.
3. **Specs + design + tasks** → fase planning SDD.
4. **`/sdd-apply`** → implementación por fases (F1 → F2 → F3).
5. **Verify + archive**.

---

*Última actualización: 2026-05-03*
