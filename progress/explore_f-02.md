# Exploración: F-02 Vista Presupuesto

## Fecha
2026-05-07

## Feature
F-02 — Budget view. Suma USD/persona × noches + actividades estimadas. Total + breakdown por destino.

---

## 1. Archivos examinados y sus roles

| Archivo | Rol |
|---|---|
| `src/content.config.ts` | Schemas Zod para todas las content collections. `destinations` ya tiene `stay.range: [min, max]` y `nights`. |
| `src/lib/trip.ts` | Helpers `getCollection()` — `getDestinations()`, `getDays()`, `getBookings()`, etc. Ninguno para presupuesto todavía. |
| `src/lib/types.ts` | Tipos derivados de `CollectionEntry<>`. `Destination['stay']` tiene `range: [number, number]`. |
| `src/layouts/BaseLayout.astro` | Layout raíz. `activeTab` está tipado como `'home' \| 'itinerario' \| 'checklist' \| 'reservas'` — hay que extenderlo. |
| `src/components/nav/TopNav.astro` | Navegación desktop. Array de 4 tabs hardcodeado — hay que agregar `presupuesto` como #05. |
| `src/components/nav/TabBar.astro` | Navegación mobile bottom. Mismo array de 4 tabs — hay que agregar `presupuesto`. |
| `src/pages/index.astro` | Home. Patrón: carga datos en frontmatter, pasa a isla Preact. |
| `src/pages/itinerario.astro` | Itinerario. Patrón idéntico: `BaseLayout` + `ItineraryView` island. |
| `src/pages/checklist.astro` | Checklist. Patrón idéntico: `BaseLayout` + `ChecklistView` island. |
| `src/pages/reservas.astro` | Reservas (F-01). Patrón idéntico + CSS responsive en `<style>` para mobile/desktop. |
| `src/components/itinerary/ItineraryView.tsx` | Isla Preact con dual-view (mobile/desktop). Usa `useState`, `localStorage`, CSS vars. 924 líneas. |
| `src/components/reservas/ReservasApp.tsx` | Isla Preact con filtros, selección, panel de detalle. 120 líneas + sub-componentes. |
| `src/components/checklist/ChecklistView.tsx` | Isla Preact con Zustand store para persistencia. |
| `src/styles/global.css` | Tokens CSS: colors, fonts, spacing, shadows. Tailwind 4 `@theme`. |
| `design/DESIGN.md` | Sistema de diseño completo. Reglas duras: bordes rectos, sin emoji, tres tipografías. |
| `design/presupuesto.jsx` | Mockup detallado (1053 líneas). Incluye todos los componentes de UI, cálculos, y datos hardcodeados. |
| `docs/PRD.md` | Menciona "Vista presupuesto" en v1.1 backlog (línea 274). No requisitos detallados más allá del feature list. |

---

## 2. Hallazgos clave sobre data flow

### 2.1 Datos de alojamiento YA EXISTEN
Cada `destination` tiene:
```json
"stay": { "type": "Cabaña / Airbnb", "range": [55, 80] }
"nights": 3
```
Esto cubre el cálculo de alojamiento: `range[0] * nights` → `range[1] * nights` por destino.

### 2.2 Datos de vuelos, buses, actividades, seguro NO EXISTEN
El mockup (`design/presupuesto.jsx`) tiene dos arrays hardcodeados:
- `FIXED_COSTS` — 7 ítems (vuelos, buses, seguro)
- `VARIABLE_COSTS` — 9 ítems (actividades opcionales)

Ninguno de estos está en content collections. Hay que decidir dónde vivirán.

### 2.3 Patrón de carga de datos
Todas las páginas siguen el mismo patrón:
1. Frontmatter Astro: `const data = await getSomething()`
2. Pasa a isla Preact como props
3. La isla maneja estado interactivo (`useState`)
4. CSS en la página `.astro` controla visibilidad mobile/desktop

### 2.4 Patrón de navegación
- `TopNav.astro` y `TabBar.astro` comparten el mismo array de tabs.
- `BaseLayout.astro` recibe `activeTab` y lo propaga a ambos.
- Agregar una nueva página requiere tocar **4 archivos**: `BaseLayout` (tipo), `TopNav` (array), `TabBar` (array), y crear la página.

---

## 3. Enfoque recomendado

### 3.1 ¿Dónde viven los datos del presupuesto?

| Opción | Pros | Cons | Recomendación |
|---|---|---|---|
| **A. Nuevo content collection `budget-items`** | Consistente con F-01 (bookings). Zod validation. Editable sin tocar código. | Overhead de 15 archivos JSON pequeños. | **PREFERIDA** |
| **B. Array TypeScript inline en el componente** | Simple, cero overhead. Mockup ya lo hace así. | Datos mezclados con presentación. Editar requiere rebuild. | Viable pero rompe patrón |
| **C. Reusar collection `bookings`** | Datos parcialmente solapados (vuelos, alojamientos). | No todos los costos son reservas (ej: buses estimados, actividades gratuitas). Schema distinto. | NO — semántica diferente |

**Decisión: Opción A** — crear content collection `budget-items` con schema:
```ts
{
  id: z.string(),
  category: z.enum(['flight', 'transfer', 'insurance', 'activity']),
  label: z.string(),
  date: z.string().optional(),        // "21 nov" o "pre-viaje"
  destSlug: z.string().optional(),    // para actividades vinculadas a destino
  perPerson: z.boolean().default(true),
  range: z.tuple([z.number(), z.number()]).optional(), // null = placeholder
  free: z.boolean().default(false),
  critical: z.boolean().default(false),
}
```

Esto permite:
- Filtrar por categoría (`flight`, `transfer`, etc.) para los breakdowns.
- Placeholders sin `range` (renderizan "— · pendiente confirmar").
- Vincular actividades a destinos vía `destSlug`.
- Marcar ítems críticos (vuelo PUQ→USH) y gratuitos (Laguna de los Tres).

### 3.2 Arquitectura de la página

Siguiendo el patrón establecido:

```
src/pages/presupuesto.astro          ← carga destinations + budget-items
src/components/budget/BudgetView.tsx  ← isla Preact (client:visible)
src/components/budget/TotalHero.tsx   ← sub-componente
src/components/budget/StackedBar.tsx  ← sub-componente
src/components/budget/PercentTable.tsx
src/components/budget/DestBreakdown.tsx
src/components/budget/LineItemsSection.tsx
src/components/budget/PaxToggle.tsx
```

**Alternativa**: un solo `BudgetView.tsx` grande (como ItineraryView, 924 líneas). Pero el patrón de F-01 (ReservasApp con sub-componentes) es más mantenible.

**Recomendación**: un root island `BudgetView.tsx` (~200 líneas) + 4-5 sub-componentes puros (~50-150 líneas cada uno). Total estimado: 600-800 líneas. El mockup tiene 1053 líneas de JSX puro; adaptarlo a CSS vars + Preact es trabajo sustancial.

### 3.3 Estado interactivo

- **Pax toggle**: `useState(5)` — 5 o 6 pax. Recalcula totales en vivo. No requiere persistencia (no está en PRD).
- **Viz toggle**: `useState<'bar' | 'table'>('bar')` — switch entre StackedBar y PercentTable.
- **Totales**: `useMemo(() => computeTotals(pax, destinations, budgetItems), [pax])`.

### 3.4 Funciones de utilidad

Crear `src/lib/budget.ts`:
```ts
export function destStayTotal(dest: Destination): [number, number] {
  const [min, max] = dest.stay.range;
  return [min * dest.nights, max * dest.nights];
}

export function sumRanges(items: BudgetItem[], pax: number): [number, number] { ... }
export function categoryTotals(pax, destinations, budgetItems): BudgetTotals { ... }
export function fmt(n: number): string { ... }
export function fmtRange([a, b]: [number, number]): string { ... }
```

### 3.5 Responsive

Igual que las demás páginas:
- Mobile: stack vertical, padding 20px, TabBar inferior.
- Desktop: layout más denso, padding 32px, grid 2-columnas para destinos/í­tems fijos.
- CSS de visibilidad en `presupuesto.astro` (no en el componente) para evitar hydration mismatch.

---

## 4. Archivos a crear / modificar

### Crear
- `src/content/budget-items/` — 15-16 archivos JSON
- `src/content/budget-items/_schema.ts` — o directamente en `content.config.ts`
- `src/pages/presupuesto.astro`
- `src/components/budget/BudgetView.tsx`
- `src/components/budget/TotalHero.tsx`
- `src/components/budget/StackedBar.tsx`
- `src/components/budget/PercentTable.tsx`
- `src/components/budget/DestBreakdown.tsx`
- `src/components/budget/LineItemsSection.tsx`
- `src/components/budget/PaxToggle.tsx`
- `src/lib/budget.ts`

### Modificar
- `src/content.config.ts` — agregar schema `budget-items`
- `src/lib/trip.ts` — agregar `getBudgetItems()`
- `src/lib/types.ts` — agregar `BudgetItem` type
- `src/layouts/BaseLayout.astro` — extender `activeTab` union con `'presupuesto'`
- `src/components/nav/TopNav.astro` — agregar tab #05
- `src/components/nav/TabBar.astro` — agregar tab #05

---

## 5. Riesgos y bloqueadores

| Riesgo | Severidad | Mitigación |
|---|---|---|
| **Estimate de 200 líneas es optimista** | Medio | El mockup tiene 1053 líneas. Adaptar a Preact + CSS vars + responsive es ~600-800 líneas. Recomendar **chained PRs** o aceptar que el estimate original era solo para la página shell. |
| **Cambio cross-cutting en navegación** | Bajo | Tocar BaseLayout + TopNav + TabBar es mecánico pero obligatorio. Un error de tipos rompe el build. |
| **Datos de costos son estimaciones** | Bajo | El PRD dice "sin pricing dinámico". Los rangos son estáticos. Placeholders sin `range` manejan incertidumbre. |
| **No hay utilidades de formato compartidas** | Bajo | Crear `src/lib/budget.ts` con `fmt`, `fmtRange`. Otras vistas (ItineraryView) ya formatean inline. |
| **Diseño mockup usa inline styles, no CSS vars** | Medio | El mockup fue escrito antes del sistema de tokens. Hay que traducir todos los `P_THEME.*` a `var(--color-*)`. |
| **Feature F-04 (countdown) también agrega tab** | Bajo | Si F-04 se implementa después, habrá que re-numerar tabs. Pero cada feature maneja su propio cambio de nav. |

---

## 6. Decisiones pendientes

1. **¿Crear content collection `budget-items` o hardcodear arrays?**
   - Recomendación: content collection. Mantiene consistencia con `bookings` (F-01) y permite editar datos sin tocar código.

2. **¿Dónde pone el límite entre `bookings` y `budget-items`?**
   - `bookings` = cosas que hay que reservar/comprar con estado de tracking (pendiente/reservado/pagado).
   - `budget-items` = cosas que cuestan plata, estén reservadas o no. Solapa parcialmente con bookings pero es una vista distinta.

3. **¿Persistir el toggle de pax en localStorage?**
   - No está en PRD. Recomendación: no persistir. Es un calculator, no una preferencia de usuario.

4. **¿StackedBar o PercentTable como default?**
   - Mockup recomienda StackedBar ("más fiel al estilo mapa de expedición"). Tabla disponible vía toggle.

---

## 7. Conclusión

La implementación es **directa y no tiene bloqueadores técnicos**. El stack ya soporta todo lo necesario:
- Astro content collections para datos
- Preact islands para interactividad
- CSS vars para theming
- Patrón mobile/desktop dual-view probado en 3 páginas previas

El trabajo principal es:
1. Crear la content collection y migrar los datos del mockup
2. Traducir el mockup de inline styles a CSS vars + Preact
3. Agregar la nueva página a la navegación

**Próximo paso recomendado**: `sdd-propose` → `sdd-spec` → `sdd-design` → `sdd-tasks`.
