# Travel·it — Patagonia 2026

Sitio de viaje grupal para la Patagonia, noviembre–diciembre 2026.
Muestra la ruta completa en mapa interactivo, el itinerario de 18 días (17 noches, 4 personas, auto de alquiler del 22 nov al 3 dic), el checklist de preparación, las reservas, el presupuesto, el timeline hora por hora (`/timeline`) y los responsables por zona (`/equipo`).

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
│   ├── bookings/          # 20 archivos JSON — reservas con urgencia, estado, costo y responsable
│   ├── budget-items/      # 21 archivos JSON — líneas de presupuesto por categoría
│   ├── schedule/          # 18 archivos JSON — plan hora por hora, un día por archivo (ISO date)
│   └── team/              # 4 archivos JSON — un responsable por zona
├── components/
│   ├── map/               # PatagoniaMap (isla Preact + Leaflet)
│   ├── itinerary/         # ItineraryView (isla Preact, doble vista)
│   ├── checklist/         # ChecklistView (isla Preact + Zustand)
│   ├── reservas/          # ReservasApp (isla Preact)
│   ├── timeline/          # TimelineView (isla Preact) — /timeline
│   ├── team/              # TeamView (render estático) — /equipo
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

Editá `src/content/bookings/<id>.json`. Campos: `id`, `category` (flight | accommodation | transfer | activity | rental), `title`, `urgency` (alta-ya | alta-3-6m | media | baja), `status` (pendiente | reservado | pagado), `cost` ({ amount, currency, perPerson }), `deadline` (ISO), `link`, `notes`, `destination` (slug), `owner` (pipe | batman | varelinni | wire, opcional). El `owner` se muestra como chip en `/reservas` y alimenta el avance por responsable en `/equipo`.

### Timeline hora por hora (`/timeline`)

Editá `src/content/schedule/<YYYY-MM-DD>.json` (un archivo por día, el nombre es la fecha ISO y define el orden). Campos: `date` ("21 nov"), `weekday` ("sáb"), `title`, `from` / `to` (slugs de destino; iguales si no hay traslado), `sleep` ("Airbnb El Calafate · noche 1/17"), `driveHours` (opcional), `critical` (opcional), `slots[]`.

Cada slot: `time` ("09:45", `"~12:00"` si es estimado, `""` si no tiene hora), `end` (opcional), `kind` (flight | car | boat | taxi | bus | walk | activity | food | lodging | note), `title`, `detail` (opcional), `warning` (opcional, resalta la fila con el token warning).

Las cifras de la franja superior (días de auto, horas al volante, vuelos, catamaranes, tramos con mochila completa) y la banda de 17 noches se calculan a partir de estos archivos.

### Equipo (`/equipo`)

Editá `src/content/team/<N>-<id>.json`. Campos: `id` (pipe | batman | varelinni | wire), `name`, `order`, `zone` ({ slug, label, dates, nights }), `lodging` ({ brief, budget, requirements[] }), `activities[]`, `food[]`, `deadline` (ISO), `notes` (opcional). La asignación inicial es provisional: para cambiarla alcanza con editar estos archivos y el campo `owner` de las reservas.

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
