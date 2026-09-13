# Travel·it — Patagonia 2026

Sitio de viaje grupal para la Patagonia, noviembre–diciembre 2026.
Muestra la ruta completa en mapa interactivo, el itinerario de 18 días (17 noches, 4 personas, auto de alquiler del 22 nov al 3 dic), el checklist de preparación, las reservas y el presupuesto.

Source of truth del contenido: `docs/Patagonia_2026_v2.md` + `docs/Patagonia_2026_Compras_v2.md` + `docs/Patagonia_2026_Equipaje_v2.md`.

Construido con Astro 6 + Preact 10 + Leaflet 1.9.4. Sin backend. Datos en `src/content/`.

---

## Desarrollo

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # build estático a ./dist/
npm run preview  # preview del build antes de deployar
```

### Verificación de tipos

```bash
npx astro check  # TypeScript + validación de content collections (debe dar 0 errores)
```

---

## Estructura del proyecto

```
src/
├── content/               # Datos del viaje (Zod-validados en build)
│   ├── destinations/      # 6 archivos JSON — un destino por archivo (MVD + 5 bases)
│   ├── days/              # 19 archivos JSON — un día por archivo (ISO date; el 21 nov tiene dos)
│   ├── routes/            # 6 archivos JSON — segmentos de ruta, prefijo numérico = orden de dibujo
│   ├── checklist-items/   # 8 archivos JSON — categorías con items
│   ├── bookings/          # 20 archivos JSON — reservas con urgencia, estado y costo
│   └── budget-items/      # 21 archivos JSON — líneas de presupuesto por categoría
├── components/
│   ├── map/               # PatagoniaMap (isla Preact + Leaflet)
│   ├── itinerary/         # ItineraryView (isla Preact, doble vista)
│   ├── checklist/         # ChecklistView (isla Preact + Zustand)
│   ├── reservas/          # ReservasApp (isla Preact)
│   ├── budget/            # BudgetView (isla Preact)
│   ├── countdown/         # TripStatus (isla Preact)
│   └── nav/               # TopNav (desktop) + TabBar (mobile)
├── layouts/
│   └── BaseLayout.astro   # HTML base, fonts, skip-link, nav
├── lib/
│   ├── types.ts           # Tipos inferidos de las collections
│   └── trip.ts            # Helpers de consulta (getDestinations, getDays, etc.)
├── stores/
│   └── checklist.ts       # Zustand store con persist (localStorage)
└── styles/
    └── global.css         # @theme tokens + reset + focus rings + reduced-motion
```

---

## Editar el contenido del viaje

### Destinos

Editá `src/content/destinations/<N>-<slug>.json`. Campos: `slug`, `name`, `country`, `coords`, `startDate`, `endDate`, `nights`, `summary`, `activities`, `stay`, `out`.

### Días del itinerario

Editá `src/content/days/<YYYY-MM-DD>.json`. Campos: `date`, `dest`, `main`, `transfer`, `critical`, `note`.

### Items del checklist

Editá `src/content/checklist-items/<N>-<id>.json`. Cada archivo es una categoría con un array de `items` (id, label, note, link).

### Rutas del mapa

Editá `src/content/routes/<N>-<id>.json`. Campos: `id`, `from`, `to`, `mode` (`plane` se dibuja punteado, el resto sólido), `coords`, `curved`. El prefijo numérico define el orden de dibujo en la animación.

### Reservas

Editá `src/content/bookings/<id>.json`. Campos: `id`, `category` (flight | accommodation | transfer | activity | rental), `title`, `urgency` (alta-ya | alta-3-6m | media | baja), `status` (pendiente | reservado | pagado), `cost` ({ amount, currency, perPerson }), `deadline` (ISO), `link`, `notes`, `destination` (slug).

### Presupuesto

Editá `src/content/budget-items/<id>.json`. Campos: `id`, `cat` (flight | transfer | insurance | activity), `label`, `date`, `perPerson`, `range` ([min, max] USD o null), `critical`, `free`, `destSlug`. El alojamiento no se carga acá: se calcula como `stay.range × nights` de cada destino.

El build valida todos los archivos con Zod y falla ruidosamente si hay datos inválidos.

---

## Deploy

El proyecto usa `@astrojs/vercel` como adaptador SSG. El build genera archivos estáticos en `./dist/`.

```bash
npm run build   # genera dist/
# subir dist/ a Vercel, Netlify o Cloudflare Pages
```

---

## Creditos

- [Astro](https://astro.build) — framework SSG
- [Preact](https://preactjs.com) — islands de interactividad
- [Leaflet](https://leafletjs.com) — mapa interactivo
- [CARTO Voyager](https://carto.com/basemaps/) — tiles del mapa (sin token)
- [Zustand](https://zustand-demo.pmnd.rs) — estado del checklist
- [Zod](https://zod.dev) — validación de schemas en build
